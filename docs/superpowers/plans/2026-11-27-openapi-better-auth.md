# Penyelarasan OpenAPI dengan Better Auth — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `public/openapi.yaml` menyajikan endpoint auth yang benar-benar dilayani Better Auth.

**Architecture:** Satu file berubah: `public/openapi.yaml`. Empat path `/auth/*` diganti empat path `/api/auth/*`, `components.securitySchemes.cookieAuth` menunjuk cookie Better Auth, dan contoh `role` dihapus karena field itu memang belum ada di schema. Nama cookie serta bentuk respons diambil dari sumber Better Auth yang terpasang, bukan dari ingatan.

**Tech Stack:** OpenAPI 3.1, YAML, Better Auth, Next.js 16.

**Spec:** `docs/superpowers/specs/2026-11-27-openapi-better-auth-design.md`

## Global Constraints

- Tidak ada framework test baru. Verifikasi memakai `pnpm lint` dan `pnpm build`.
- Tidak menambah dependency. `package.json` tidak diubah.
- Tidak mengubah kode aplikasi. Satu file aset yang berubah: `public/openapi.yaml`.
- Teks dokumentasi dalam bahasa Indonesia; nama file, `operationId`, dan nama field tetap Inggris.
- Kerja di cabang `fitur/better-auth`, bukan langsung di `main`.
- Nama cookie dan bentuk respons wajib dibaca dari sumber Better Auth terpasang. Dilarang menulisnya dari ingatan.

## Review Focus

Lima hal yang paling mungkin merusak hasil, dan pemeriksaan yang menahannya.

1. **YAML rusak tetap lolos.** `next.build` hanya menyalin berkas dari `public/` — ia tidak memvalidasi YAML, jadi `pnpm build` hijau pun bukan bukti. Dahanankan oleh Task 1 langkah 5: parse wajib sukses sebelum langkah lain dianggap benar.
2. **Nama cookie ditulis dari ingatan.** Better Auth memakai cookie sendiri; salah nama membuat pembaca spec mengirim cookie yang tidak dikenali server. Dahanankan oleh Task 1 langkah 3 dan 6: nilai dibaca dari sumber, lalu di-assert sama dengan isi spec.
3. **Bentuk respons atau format error salah.** Spec sekarang memakai `UserResponse` dan `success`/`message`, yang bukan milik Better Auth. Dahanankan oleh Task 1 langkah 4 untuk mencatatnya dari sumber, dan langkah 5 untuk meng-assert field `sign-in` benar-benar ada di spec.
4. **`$ref` menggantung.** Menghapus atau mengganti schema tanpa membersihkan referensi membuat Swagger UI gagal render. Dahanankan oleh Task 1 langkah 5: setiap `$ref` wajib resolve.
5. **Endpoint non-auth ikut berubah.** `/health`, `/categories`, dan `/articles` di luar lingkup. Dahanankan oleh Task 1 langkah 5: isi path non-auth dan `components` selain `securitySchemes` wajib identik dengan `main`.

---

### Task 1: Selaraskan `public/openapi.yaml` dengan Better Auth

**Files:**
- Modify: `public/openapi.yaml` — empat path auth (± baris 54–201) dan `components.securitySchemes.cookieAuth` (± baris 401–406)
- Commit: `docs/superpowers/specs/2026-11-27-openapi-better-auth-design.md`

**Interfaces:**
- Consumes: cabang `fitur/better-auth` yang berisi `src/lib/auth.ts`, `prisma/schema.prisma`, dan dependensi `better-auth`.
- Produces: `public/openapi.yaml` dengan path `/api/auth/sign-up/email`, `/api/auth/sign-in/email`, `/api/auth/sign-out`, `/api/auth/get-session`, serta `cookieAuth` yang menunjuk cookie Better Auth.

- [ ] **Step 1: Siapkan cabang**

```bash
git fetch origin
git checkout fitur/better-auth
git merge --no-edit main
pnpm install
```

Expected: merge bersih, `node_modules/better-auth` ada.

- [ ] **Step 2: Baca nama cookie dari sumber Better Auth**

Cari deklarasi cookie sesi di `node_modules/better-auth/dist/**` (biasanya `better-auth.session_token`). Catat namanya persis, termasuk awalan jika ada.

Expected: satu nama cookie tercatat.

- [ ] **Step 3: Baca bentuk respons keempat endpoint**

Dari sumber Better Auth yang sama, catat nilai yang dikembalikan `sign-up/email`, `sign-in/email`, `sign-out`, dan `get-session` — nama field, apakah ada `token`, apakah `sign-out` mengembalikan isi. **Catat terpisah nama field tingkat atas respons `sign-in/email`**, karena itu yang di-assert di langkah 5.

Expected: empat bentuk respons tercatat, plus daftar field `sign-in`.

- [ ] **Step 4: Baca format error Better Auth**

Catat bentuk body error (field `code`, `message`, `status`, atau sejenisnya) dan status yang dikirim untuk kredensial salah serta email terduplikasi.

Expected: satu format error tercatat.

- [ ] **Step 5: Jalankan pemeriksaan dasar sebelum mengubah apa pun**

Simpan skrip berikut sebagai `check.py` sementara di root, jalankan, lalu hapus setelah selesai. Ia harus **gagal** di sini — itu bukti merah.

```python
import json, re, subprocess, sys, yaml

cur = open("public/openapi.yaml", encoding="utf-8").read()
base = subprocess.run(
    ["git", "show", "main:public/openapi.yaml"],
    capture_output=True, text=True, encoding="utf-8",
).stdout

doc = yaml.safe_load(cur)
old_doc = yaml.safe_load(base)

old = {"/auth/register", "/auth/login", "/auth/logout", "/auth/me"}
new = {"/api/auth/sign-up/email", "/api/auth/sign-in/email",
       "/api/auth/sign-out", "/api/auth/get-session"}

errs = []
if old & set(doc["paths"]):
    errs.append(f"path lama masih ada: {sorted(old & set(doc['paths']))}")
if new - set(doc["paths"]):
    errs.append(f"path baru belum ada: {sorted(new - set(doc['paths']))}")

auth_paths = old | new
old_non = {k: v for k, v in old_doc["paths"].items() if k not in auth_paths}
new_non = {k: v for k, v in doc["paths"].items() if k not in auth_paths}
if old_non != new_non:
    errs.append("endpoint non-auth berubah")

for side in old_doc:
    if side not in ("paths", "components") and old_doc.get(side) != doc.get(side):
        errs.append(f"bagian {side} berubah")

old_comp = {k: v for k, v in old_doc.get("components", {}).items() if k != "securitySchemes"}
new_comp = {k: v for k, v in doc.get("components", {}).items() if k != "securitySchemes"}
if old_comp != new_comp:
    errs.append("components selain securitySchemes berubah")

for ref in set(re.findall(r'"(#/[^"]+)"', cur)):
    node = doc
    for part in ref.lstrip("#/").split("/"):
        if not isinstance(node, dict) or part not in node:
            errs.append(f"$ref menggantung: {ref}")
            break
        node = node[part]

for p in new:
    item = doc["paths"].get(p, {})
    codes = [str(c) for m in item.values() if isinstance(m, dict)
             for c in m.get("responses", {})]
    if not any(c.startswith("2") for c in codes):
        errs.append(f"{p}: respons 2xx belum ditulis")

# Dicari di seluruh dokumen karena respons bisa dirujuk lewat $ref.
all_json = json.dumps(doc)
for f in (sys.argv[2].split() if len(sys.argv) > 2 else []):
    if f'"{f}"' not in all_json:
        errs.append(f"field sign-in '{f}' tidak ada di spec")

cookie = doc["components"]["securitySchemes"]["cookieAuth"]["name"]
if cookie != sys.argv[1]:
    errs.append(f"cookie '{cookie}' != sumber Better Auth '{sys.argv[1]}'")

print("\n".join(errs) if errs else "OK")
sys.exit(1 if errs else 0)
```

Run: `python check.py "<nama cookie dari langkah 2>" "<field sign-in dari langkah 3>"`
Expected: **FAIL** dengan `path lama masih ada` dan `path baru belum ada`.

- [ ] **Step 6: Tulis ulang bagian auth di `public/openapi.yaml`**

Ganti empat path `/auth/*` dengan keempat path `/api/auth/*` memakai bentuk respons langkah 3 dan format error langkah 4. Ubah `components.securitySchemes.cookieAuth.name` ke nilai langkah 2.

Sisanya dipertahankan: `operationId` (`register`, `login`, `logout`, `getMe`) tetap dipakai agar referensi tidak patah, `tags: [Auth]` tetap, dan contoh `role: STUDENT` dihapus dari `UserResponse` karena field itu belum ada.

- [ ] **Step 7: Jalankan pemeriksaan lagi, kali ini harus hijau**

Run: `python check.py "<nama cookie dari langkah 2>" "<field sign-in dari langkah 3>"`
Expected: `OK`, exit 0.

- [ ] **Step 8: Jalankan lint dan build**

```bash
pnpm lint
pnpm build
```

Expected: keduanya exit 0. Bila lint gagal, perbaiki YAML-nya, bukan aturannya.

- [ ] **Step 9: Commit**

```bash
git add public/openapi.yaml docs/superpowers/specs/2026-11-27-openapi-better-auth-design.md
git commit -m "docs: selaraskan OpenAPI dengan endpoint Better Auth"
```

- [ ] **Step 10: Dorong dan buka pull request**

```bash
git push origin fitur/better-auth
gh pr create --repo YahahaaWahyu/wikiumk --base main --head fitur/better-auth \
  --title "feat: Better Auth untuk register, login, logout, dan sesi" \
  --body "Menambahkan Better Auth beserta penyelarasan OpenAPI. Cabang ini juga berisi kerjaan autentikasi yang belum pernah lewat CI."
```

Expected: PR terbuka, check `lint-and-build` berjalan.

- [ ] **Step 11: Tunggu check hijau**

Run: `gh pr checks <nomor> --repo YahahaaWahyu/wikiumk --watch`
Expected: `lint-and-build` berstatus pass. Bila gagal, baca langkah yang merah sebelum memperbaiki.

---

## Setelah selesai

Jangan merge. Serahkan PR ke pemilik repo untuk direview.
