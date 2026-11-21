# Wiki UMK

Platform informasi akademik dan forum diskusi mahasiswa Universitas Muria Kudus.

Dibangun dengan [Next.js](https://nextjs.org) 16 (App Router), React 19, Tailwind CSS 4, dan pnpm.

## Prasyarat

- Node.js 20 atau lebih baru
- pnpm (jalankan `corepack enable`, atau `npm install -g pnpm`)

## Menjalankan Proyek

```bash
git clone https://github.com/USERNAME/wikiumk.git
cd wikiumk
pnpm install
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain:

```bash
pnpm lint   # periksa kode dengan ESLint
pnpm build  # build produksi, wajib hijau sebelum merge
```

## Struktur Folder

```
wikiumk/
├── app/            # Halaman & route (App Router)
├── public/         # Aset statis
├── components/     # Komponen UI bersama (menyusul)
├── lib/            # Utilitas & koneksi database (menyusul)
├── prisma/         # Skema database (menyusul)
├── docs/           # Dokumentasi (ERD, dsb.)
├── CONTRIBUTING.md # Aturan branch, merge, dan review
└── README.md
```

## Alur Kerja Git

Ringkasan — detail lengkap ada di [CONTRIBUTING.md](CONTRIBUTING.md):

1. Ambil perubahan terbaru: `git pull origin master`
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`
3. Kerjakan, commit, lalu push: `git push origin fitur/nama-fitur`
4. Buka Pull Request, tunggu review minimal 1 orang, baru merge ke `master`

## Environment Variables

Belum ada. Akan ditambahkan bersamaan dengan setup database (Task 2), dan hanya `.env.example` yang di-commit.

## Deploy

Belum dikonfigurasi. Akan didokumentasikan pada Task 3.
