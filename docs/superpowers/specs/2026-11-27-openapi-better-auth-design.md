# Desain: selaraskan OpenAPI dengan Better Auth

Tanggal: 2026-11-27

## Masalah

`public/openapi.yaml` menjanjikan empat endpoint auth (`/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`) yang tidak pernah ada. Yang benar-benar dilayani adalah Better Auth di cabang `fitur/better-auth`, yaitu `/api/auth/*`. Spec juga memakai cookie `session` dan menampilkan `role: STUDENT`, padahal Better Auth memakai cookie sendiri dan belum ada field peran.

## Tujuan

- Spec mencerminkan endpoint auth yang benar-benar dilayani.
- Bentuk request, respons, dan error sesuai implementasi berjalan.

## Bukan tujuan

- Tidak menambah atau mengurangi endpoint aplikasi.
- Tidak mengubah kode aplikasi sama sekali.
- Tidak menyentuh `/health`, `/categories`, dan `/articles` — itu di luar permintaan.

## Kendala

- Better Auth hanya ada di `fitur/better-auth`, masih tertinggal 3 commit dari `main`. Edit harus dilakukan di cabang itu setelah menarik `main`, supaya kode dan dokumentasi merge bersamaan.
- `docs/autentikasi.md` tidak mencantumkan nama cookie maupun bentuk respons. Keduanya harus diambil dari implementasi berjalan, bukan dari ingatan.
- `pnpm build` memuat `openapi.yaml` sebagai aset statis, jadi kesalahan YAML akan ketahuan di CI.

## Pendekatan yang dipertimbangkan

| | A. Tulis ulang bagian auth | B. A + tandai endpoint lain | C. Plugin `openAPI` Better Auth |
|---|---|---|---|
| Isi | Ganti 4 path dan scheme cookie | A + penanda "belum diimplementasi" | Biarkan Better Auth menghasilkan spec |
| File berubah | 1 | 1 | kode + endpoint runtime |
| Menambah kode aplikasi | tidak | tidak | ya |
| Spec jujur soal endpoint lain | tidak | ya | sebagian |

**Dipilih: A.** Permintaannya memang menyangkut auth, satu file, tanpa menambah kode aplikasi. B boleh menyusul kalau tim mau seluruh spec jujur. C menambah runtime hanya untuk menggantikan dokumen yang bisa ditulis tangan.

## Keputusan

- Empat path `/auth/*` diganti `/api/auth/sign-up/email`, `/api/auth/sign-in/email`, `/api/auth/sign-out`, `/api/auth/get-session`.
- `securitySchemes.cookieAuth` menunjuk cookie yang dipakai Better Auth.
- Contoh `role: STUDENT` dihapus — field itu memang belum ada.
- Bentuk error mengikuti format Better Auth, bukan `success`/`message`.
- `operationId` tetap dipertahankan agar tidak merusak referensi yang sudah ada.

## Yang tersisa untuk pelaksana

1. Tarik `main` ke `fitur/better-auth`.
2. Verifikasi nama cookie dan bentuk respons dari implementasi berjalan (jalankan aplikasi atau baca sumber Better Auth), jangan dari asumsi.
3. Ubah `public/openapi.yaml`.
4. Pastikan `pnpm lint` dan `pnpm build` lulus, lalu buka PR dari cabang itu.
