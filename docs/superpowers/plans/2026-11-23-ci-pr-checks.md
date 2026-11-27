# Rencana Implementasi: Check CI untuk Pull Request

> **Untuk pekerja agentic:** SUB-SKILL WAJIB: pakai `superpowers:subagent-driven-development` (disarankan) atau `superpowers:executing-plans` untuk mengerjakan rencana ini task per task. Langkah memakai sintaks checkbox (`- [ ]`) untuk pelacakan.

**Goal:** Setiap pull request dan setiap push ke `main` menjalankan `pnpm lint` lalu `pnpm build`, dan menampilkan check merah bila ada yang gagal.

**Architecture:** Satu workflow GitHub Actions dengan satu job. Tidak ada file yang diubah selain file workflow itu sendiri. Prisma client yang di-gitignore dibangun ulang di dalam CI sebelum build.

**Tech Stack:** GitHub Actions, Node.js 26, pnpm 12.21.0, Prisma 7, Next.js 16, ESLint 9.

**Spec:** `docs/superpowers/specs/2026-11-23-ci-pr-checks-design.md`

## Global Constraints

- Tidak ada dependensi baru di luar set yang sudah di-pin. `package.json` tidak diubah.
- Tidak ada framework test baru. Verifikasi memakai `pnpm lint` dan `pnpm build`.
- Node dipin ke `26`.
- pnpm dipin lewat `packageManager: "pnpm@12.21.0"` di `package.json`.
- Cabang kerja dibuat dari `main`, bukan dari `uiux-sprint1`.
- Satu file baru saja: `.github/workflows/ci.yml`.
- Tidak ada PostgreSQL, `DATABASE_URL`, atau `.env` di CI. Tidak ada langkah untuk itu.
- Tidak ada cache pnpm.
- Tidak memakai corepack: corepack tidak dibundel di Node 26, jadi `corepack enable` akan gagal.

## Review Focus

Lima hal yang paling mungkin menggagalkan run pertama, dan di mana kegagalannya terlihat.

1. **Node `26` tidak tersedia di `actions/setup-node`.** Kegagalan muncul di langkah kedua, sebelum install, dan seluruh job merah tanpa log build sama sekali. Diamankan oleh Task 1 langkah 5: check harus hijau.
2. **`pnpm/action-setup` tidak membaca `packageManager`.** Kegagalan muncul sebagai `pnpm: command not found` di langkah install. Diamankan oleh Task 1 langkah 5: check harus hijau.
3. **`prisma generate` gagal** karena Prisma 7 CLI memperlakukan `prisma/schema.prisma` tanpa `prisma.config.ts`. Kegagalan muncul di langkah generate atau sebagai error resolve `@/generated/prisma/client` di langkah build. Diamankan oleh Task 1 langkah 5: check harus hijau.
4. **Workflow tidak terpicu sama sekali.** Ini kegagalan paling berbahaya karena tidak menghasilkan error — PR hanya tampil tanpa check. Diamankan oleh Task 1 langkah 5 dengan syarat negatif: PR **harus** menampilkan check `lint-and-build`; ketiadaan check dianggap gagal.
5. **Check hijau tetapi tidak memblokir merge.** Branch protection diatur di GitHub, di luar file repo. Diamankan oleh Task 1 langkah 6 sebagai langkah manual yang harus dikonfirmasi.

---

### Task 1: Workflow check CI dengan jalur hijau

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `package.json` (`packageManager: "pnpm@12.21.0"`, `scripts.lint`, `scripts.build`), `prisma/schema.prisma`, `tsconfig.json` (`include: "**/*.ts"`).
- Produces: check GitHub bernama `lint-and-build` pada setiap pull request dan push ke `main`. Task 2 bergantung pada check ini untuk membuktikan jalur merah.

- [ ] **Step 1: Buat cabang dari `main`**

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
git checkout -b ci/pull-request-checks
```

Expected: cabang `ci/pull-request-checks` berbasis `origin/main`.

- [ ] **Step 2: Tulis `.github/workflows/ci.yml`**

Isi file, persis:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - name: Pasang pnpm
        uses: pnpm/action-setup@v6

      - name: Pasang Node
        uses: actions/setup-node@v7
        with:
          node-version: 26

      - name: Install dependensi
        run: pnpm install --frozen-lockfile

      - name: Bangun ulang Prisma client
        run: pnpm exec prisma generate

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
```

Tidak ada `version:` pada `pnpm/action-setup` — versinya dibaca dari `packageManager`.

- [ ] **Step 3: Verifikasi baseline lokal masih lulus**

Run: `pnpm lint` lalu `pnpm build`
Expected: keduanya exit 0. Ini memastikan satu-satunya perubahan adalah file workflow.

- [ ] **Step 4: Commit, dorong, buka pull request**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: tambah check lint dan build untuk pull request"
git push -u origin ci/pull-request-checks
gh pr create --repo YahahaaWahyu/wikiumk --base main --title "ci: check lint dan build untuk pull request" --body "Menambahkan GitHub Actions agar setiap PR menjalankan pnpm lint dan pnpm build."
```

Expected: PR terbuka ke `main`.

- [ ] **Step 5: Pastikan check berjalan dan hijau**

Run: `gh pr checks <nomor> --repo YahahaaWahyu/wikiumk --watch`
Expected: check `lint-and-build` muncul dan berstatus pass.

Syarat negatif: bila **tidak ada** check sama sekali, langkah ini gagal (lihat Review Focus butir 4) — periksa kembali nama file dan isi bagian `on:`.

Bila gagal, baca log langkah yang merah dan catat penyebabnya sebelum memperbaiki.

- [ ] **Step 6: Konfirmasi branch protection secara manual**

Buka **Settings → Branches** di GitHub, tambahkan aturan untuk `main` dengan **Require status checks to pass** lalu pilih `lint-and-build`.

Expected: PR tidak bisa di-merge selama check merah.

Langkah ini di luar file repo, jadi tidak bisa diverifikasi dari baris perintah. Konfirmasi secara manual.

- [ ] **Step 7: Commit dokumen desain dan rencana**

```bash
git add docs/superpowers/specs/2026-11-23-ci-pr-checks-design.md docs/superpowers/plans/2026-11-23-ci-pr-checks.md
git commit -m "docs: tambah desain dan rencana check CI"
git push
```

Expected: kedua dokumen ikut dalam PR yang sama.

---

### Task 2: Buktikan jalur merah

**Files:**
- Create lalu hapus: `src/components/CiLintProbe.tsx`

**Interfaces:**
- Consumes: check `lint-and-build` yang sudah hijau dari Task 1.
- Produces: bukti tertulis (ID run) bahwa check berubah merah ketika `pnpm lint` gagal.

- [ ] **Step 1: Tulis probe yang melanggar lint yang sama dengan PR #1**

Buat `src/components/CiLintProbe.tsx`:

```tsx
export function CiLintProbe() {
  return <p>probe "unescaped"</p>;
}
```

Tanda kutip lurus di dalam JSX memicu `react/no-unescaped-entities`, aturan yang sama yang gagal di PR #1.

- [ ] **Step 2: Commit dan dorong**

```bash
git add src/components/CiLintProbe.tsx
git commit -m "ci: uji jalur merah (akan dibuang)"
git push
```

- [ ] **Step 3: Pastikan check merah di langkah Lint**

Run: `gh pr checks <nomor> --repo YahahaaWahyu/wikiumk --watch`
Expected: `lint-and-build` berstatus fail, dan log langkah **Lint** menyebut `react/no-unescaped-entities`.

Bila check tetap hijau, aturan itu tidak terpicu — ganti probe-nya dan ulangi Step 1 sampai check benar-benar merah. Jalur merah belum terbukti sampai ini terjadi.

- [ ] **Step 4: Buang probe dan dorong ulang**

```bash
git rm src/components/CiLintProbe.tsx
git commit -m "ci: buang probe uji jalur merah"
git push
```

- [ ] **Step 5: Pastikan check kembali hijau**

Run: `gh pr checks <nomor> --repo YahahaaWahyu/wikiumk --watch`
Expected: `lint-and-build` berstatus pass.

- [ ] **Step 6: Catat buktinya**

Tulis ID run jalur merah di deskripsi PR, contoh: `Jalur merah terbukti pada run <id> (langkah Lint gagal di react/no-unescaped-entities).`

Expected: reviewer bisa membuka run itu tanpa bertanya.

---

## Setelah selesai

Merge PR ke `main` dengan squash. Cabang `ci/pull-request-checks` boleh dihapus.
