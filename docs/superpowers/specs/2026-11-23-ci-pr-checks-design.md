# Desain: check CI untuk pull request

Tanggal: 2026-11-23

## Masalah

PR #1 punya `pnpm lint` merah (2 error `react/no-unescaped-entities` di
`src/components/DeleteDialog.tsx:32`), tetapi repo tidak punya `.github/`,
sehingga `statusCheckRollup` kosong dan tidak ada satu pun check yang menahan merge.

## Tujuan

- Setiap pull request dan setiap push ke `main` menjalankan `pnpm lint` lalu `pnpm build`.
- Salah satu gagal → check merah.

## Bukan tujuan

- Tidak ada framework test baru. Proyek ini memang tidak memakai test framework.
- Tidak ada preview deploy.
- Tidak ada script cek kontrak (greyscale, jumlah figure, dan sebagainya).
- Tidak ada PostgreSQL di CI.
- Tidak ada dependensi baru di luar set yang sudah di-pin.

## Kendala yang ditemukan saat membaca proyek

| Kendala | Konsekuensi |
|---|---|
| `/src/generated/prisma` masuk `.gitignore` | CI wajib menjalankan `prisma generate` sebelum `next build` |
| `tsconfig.json` `include: "**/*.ts"` | `src/lib/prisma.ts` ikut di-type-check, jadi generate memang dibutuhkan |
| Belum ada halaman yang memakai `prisma` | `DATABASE_URL` tidak dibaca saat build; CI tidak butuh database |
| `packageManager: "pnpm@12.21.0"` | pnpm dipasang lewat `pnpm/action-setup@v6`, yang membaca `packageManager` |
| `eslint.config.mjs` sudah ada | `pnpm lint` langsung jalan tanpa konfigurasi tambahan |

## Pendekatan yang dipertimbangkan

| | A. Gate minimum | B. A + cek kontrak | C. B + preview deploy |
|---|---|---|---|
| Isi | lint + build | A + script assert aturan desain | B + URL live per PR |
| File baru | 1 | 2 | 3–4 |
| Tangkap lint merah | ya | ya | ya |
| Tangkap `text-red-600` | tidak | ya | ya |
| Biaya rawat | hampir nol | sedang (angka ikut berubah) | tinggi (akun + secrets) |

**Dipilih: A.** Alasannya A menutup celah yang benar-benar terjadi tanpa menambah hal yang
harus dirawat. B menyusul sebagai PR terpisah karena pertanyaannya (apakah angka figure boleh
di-hardcode) belum terjawab. C ditahan karena preview deploy adalah nilai tambah, bukan
kebutuhan, dan dialah yang paling sering bikin PR gagal karena alasan di luar kode.

## Keputusan

- Satu file baru di luar `docs/superpowers/`: `.github/workflows/ci.yml`. Nol file yang diubah.
- Trigger: `pull_request` (semua basis) dan `push` ke `main`.
- `concurrency` membatalkan run lama per ref.
- Node dipin ke `26`, versi yang terbukti build di mesin ini.
- `pnpm/action-setup@v6` tanpa parameter `version`: action membaca `packageManager`.
  Corepack tidak dipakai karena tidak dibundel di Node 26.
- `pnpm install --frozen-lockfile`: lockfile tidak sinkron dianggap gagal.
- `pnpm exec prisma generate` sebagai langkah workflow, bukan perubahan script `build`.
  Perpindahan ke `package.json` hanya diperlukan kalau ada pipeline kedua (misalnya Vercel).
- Urutan: install → generate → lint → build. Lint didahulukan karena lebih cepat.

## Yang sengaja tidak ada

- **Cache pnpm.** Hemat sekitar 40 detik, tapi menambah satu titik gagal yang harus didebug
  pada run pertama. Tambahkan kalau durasi run melebihi sekitar 5 menit.
- **`.nvmrc`.** Versi Node cukup dipin di satu tempat, yaitu workflow.

## Batasan yang perlu diketahui

Check ini hanya memblokir merge kalau branch protection diatur di GitHub, di luar file repo.
Tanpa pengaturan itu check tetap berjalan dan tetap menampilkan merah, tetapi tidak menjadi
pagar.

## Cara memverifikasi

1. Cabang baru dari `main`, tambahkan `ci.yml`, dorong, buka pull request.
2. Lihat check berjalan dan berwarna hijau pada PR tersebut.
3. Dorong satu commit yang sengaja merusak lint untuk membuktikan jalur merah, lalu buang
   lewat commit terpisah. Squash-merge menghapus bekasnya.
4. `pnpm lint` dan `pnpm build` lokal tetap lulus karena tidak ada file yang berubah selain
   workflow.
