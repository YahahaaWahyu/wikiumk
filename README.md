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
├── src/
│   ├── app/        # Halaman & route (App Router)
│   ├── components/ # Komponen UI bersama (menyusul)
│   └── lib/        # Utilitas & koneksi database (menyusul)
├── public/         # Aset statis
├── prisma/         # Skema database (menyusul)
├── docs/           # Dokumentasi (ERD, struktur folder, dsb.)
├── CONTRIBUTING.md # Aturan branch, merge, dan review
└── README.md
```

Penjelasan tiap folder ada di [docs/struktur-folder.md](docs/struktur-folder.md).

## Alur Kerja Git

Detail lengkap ada di [CONTRIBUTING.md](CONTRIBUTING.md). Ringkasannya:

1. Ambil perubahan terbaru: `git pull origin main`
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`
3. Kerjakan, commit, lalu push: `git push origin fitur/nama-fitur`
4. Buka Pull Request, tunggu review minimal 1 orang, baru merge ke `main`

## Environment Variables

Belum ada. Akan ditambahkan bersamaan dengan setup database (Task 2), dan hanya `.env.example` yang di-commit.

## Deploy

Belum dikonfigurasi. Akan didokumentasikan pada Task 3.
