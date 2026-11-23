# Rancangan Database Sprint 1

Rancangan struktur database Wiki UMK untuk Sprint 1 dan cara mengkonfigurasikannya. Berkas ini merujuk pada keputusan tim di Task 2 (SCRUM-38): pengguna dengan peran, artikel, dan kategori.

Status: **rancangan disepakati, implementasi schema menyusul.** Sprint 1 baru menyiapkan koneksi (PostgreSQL + Prisma).

## Pilihan teknologi

| Komponen | Pilihan | Alasan |
|---|---|---|
| Database | PostgreSQL 16+ (lokal) | Sesuai rencana tim, standar industri |
| GUI pengelola | pgAdmin 4 | Ikut terpasang saat install PostgreSQL, mirip phpMyAdmin |
| ORM | Prisma | Type-safe, migrasi terdokumentasi, integrasi Next.js |
| Koneksi | `DATABASE_URL` di `.env` | Rahasia tidak masuk repository |

## Konfigurasi

### 1. Instalasi (sekali per anggota)

1. Unduh installer PostgreSQL untuk Windows: <https://www.postgresql.org/download/windows>
2. Saat wizard, pastikan **pgAdmin 4** tercentang, port `5432`, ingat password superuser `postgres`
3. Buka pgAdmin → klik kanan **Databases → Create → Database** → nama: `wikiumk`

### 2. Environment variables

`.env` (lokal, **tidak** di-commit — sudah masuk `.gitignore`):

```env
DATABASE_URL="postgresql://postgres:PASSWORD_LOKAL@localhost:5432/wikiumk"
```

`.env.example` (di-commit, hanya placeholder):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/wikiumk"
```

Cara memulai dari kosong:

```bash
cp .env.example .env   # lalu isi password lokal di .env
```

### 3. Prisma

```bash
pnpm add @prisma/client
pnpm add -D prisma
npx prisma init        # membuat prisma/schema.prisma dan .env.example
```

Perintah yang dipakai berulang:

```bash
npx prisma migrate dev   # terapkan perubahan schema ke database lokal
npx prisma studio        # buka GUI data di browser (mirip pgAdmin, untuk QA)
npx prisma generate      # regenerate client setelah schema berubah
```

### 4. Koneksi di aplikasi

`src/lib/db.ts` — PrismaClient singleton (hindari hot-reload membuat banyak koneksi):

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### 5. Verifikasi koneksi

```bash
npx prisma db execute --stdin <<< "SELECT 1;"
```

Atau lewat pgAdmin: buka **Query Tool** pada database `wikiumk`, jalankan `SELECT 1;`.

## ERD Sprint 1

```mermaid
erDiagram
    USER ||--o{ ARTIKEL : tulis
    KATEGORI ||--o{ ARTIKEL : kelompokkan

    USER {
        uuid id PK
        string nama
        string email UK
        string password_hash
        enum peran "MAHASISWA | ADMIN"
        enum status "AKTIF | DIBLOKIR"
        string blokir_alasan
        datetime blokir_pada
        datetime dibuat_pada
    }
    KATEGORI {
        uuid id PK
        string slug UK
        string nama
        string deskripsi
    }
    ARTIKEL {
        uuid id PK
        string slug UK
        string judul
        string ringkasan
        string isi
        uuid penulis_id FK
        uuid kategori_id FK
        int jumlah_dibaca
        datetime dibuat_pada
        datetime diubah_pada
    }
```

## Rincian tabel

### `users` — pengguna dengan peran (F1)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `nama` | text | wajib |
| `email` | text unique | login |
| `password_hash` | text | bcrypt, tidak pernah dikirim ke klien |
| `peran` | enum | `MAHASISWA`, `ADMIN` |
| `status` | enum | `AKTIF`, `DIBLOKIR` (status blokir) |
| `blokir_alasan` | text null | diisi admin |
| `blokir_pada` | timestamp null | |
| `dibuat_pada` | timestamp default now | |

### `kategori` — kategori artikel wiki (F2)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | dipakai di URL `/artikel?kategori=` |
| `nama` | text | tampilan |
| `deskripsi` | text null | |

### `artikel` — artikel wiki (F2, F3)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | dipakai di URL `/artikel/[slug]` |
| `judul` | text | |
| `ringkasan` | text | daftar & pencarian |
| `isi` | text | konten artikel |
| `penulis_id` | uuid FK → users | |
| `kategori_id` | uuid FK → kategori | |
| `jumlah_dibaca` | int default 0 | |
| `dibuat_pada` / `diubah_pada` | timestamp | |

## Aturan data

- Semua tabel memakai `uuid` sebagai primary key.
- Password hanya disimpan sebagai hash (bcrypt cost ≥ 12).
- `users.status = DIBLOKIR` memblokir akses, akun tetap ada.
- Hapus konten oleh admin bersifat permanen (tanpa soft delete).

## Langkah berikutnya

1. Install PostgreSQL + pgAdmin, buat database `wikiumk` (bagian konfigurasi di atas)
2. Buat `prisma/schema.prisma` berisi tabel sprint 1 (`users`, `kategori`, `artikel`)
3. `npx prisma migrate dev` + seed kategori & akun admin
4. Uji `lib/db.ts` dari endpoint `/api/health`

Tabel forum (postingan, komentar, laporan) dirancang pada sprint berikutnya dan tidak termasuk di berkas ini.

## Berkas terkait

- [DOCUMENTING.md](DOCUMENTING.md) — aturan menulis dokumentasi
- [struktur-folder.md](struktur-folder.md) — penjelasan tiap folder
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — alur branch & review
