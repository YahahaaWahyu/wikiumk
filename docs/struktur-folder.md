# Struktur Folder

Isi repo Wiki UMK dan tempat menaruh berkas baru. Next.js hanya menganggap `src/app` sebagai route; folder lain bebas dipakai untuk kode pendukung.

## Gambaran

```
wikiumk/
├── src/
│   ├── app/            # Route, layout, dan aset per halaman
│   ├── components/     # Komponen UI yang dipakai lebih dari satu route
│   └── lib/            # Utilitas, koneksi database, pemanggilan API
├── public/             # Berkas statis yang disajikan apa adanya
├── prisma/             # Skema dan migrasi database
├── docs/               # Dokumentasi proyek
└── (berkas konfigurasi)
```

## Keterangan tiap folder

| Path | Isi | Contoh |
|---|---|---|
| `src/app/` | Route App Router. Nama folder menentukan URL. | `src/app/page.tsx` untuk `/`, `src/app/forum/page.tsx` untuk `/forum` |
| `src/app/*/` | `layout.tsx`, `loading.tsx`, `error.tsx` untuk satu segmen route | `src/app/forum/loading.tsx` |
| `src/components/` | Komponen React yang dipakai lintas halaman | `src/components/Navbar.tsx` |
| `src/lib/` | Kode tanpa JSX: klien Prisma, format tanggal, validasi | `src/lib/prisma.ts` |
| `public/` | Gambar, ikon, dan berkas unduhan. Nama berkas langsung jadi URL | `public/logo.svg` dibuka di `/logo.svg` |
| `prisma/` | `schema.prisma` dan folder `migrations/`. Tetap di root, bukan di `src` | `prisma/schema.prisma` |
| `docs/` | Dokumentasi tim: ERD, struktur folder, catatan keputusan | `docs/struktur-folder.md` |

Berkas konfigurasi tetap di root: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `package.json`. Jangan dipindah ke `src`.

## Aturan singkat

- Route baru berarti folder baru di `src/app/`, bukan berkas baru di `src/components/`.
- Komponen yang hanya dipakai satu route boleh ditaruh di sebelah `page.tsx` route itu.
- Impor antar folder memakai alias `@/`, misalnya `import Navbar from "@/components/Navbar"`. Alias ini menunjuk ke `src/`, jadi jangan menulis `@/src/...`.
- Folder `src/app` tidak boleh berisi kode yang bukan route, kecuali komponen dan utilitas khusus segmen tersebut.

## Menambah folder baru

Buat folder di `src/` bila isinya kode aplikasi. Tambahkan barisnya ke tabel di atas dan ke pohon folder, supaya orang berikutnya tidak menebak.
