# Autentikasi

Login, registrasi, dan sesi di Wiki UMK ditangani [Better Auth](https://www.better-auth.com/). Berkas ini menjelaskan cara menyetel, menjalankan, dan menguji autentikasi.

## Komponen

| Berkas | Peran |
|---|---|
| `src/lib/auth.ts` | Instance `betterAuth`, Prisma adapter, metode email/password |
| `src/lib/auth-client.ts` | Klien browser (`authClient`) untuk `signUp` / `signIn` / `signOut` / `useSession` |
| `src/app/api/auth/[...all]/route.ts` | Route handler `GET`/`POST` untuk semua endpoint `/api/auth/*` |
| `prisma/schema.prisma` | Model `User`, `Session`, `Account`, `Verification` |
| `prisma/migrations/` | Migration yang membuat tabel di atas |
| `prisma/seed.mjs` | Seed akun pengembangan, dijalankan lewat `pnpm seed` |

Password disimpan sebagai hash di tabel `account` (kolom `password`); sesi disimpan di tabel `session`. Klien tidak pernah menerima password.

## Environment variables

Butuh tiga variabel di `.env` (templatnya di `.env.example`):

```env
DATABASE_URL="postgresql://postgres:PASSWORD_LOKAL@localhost:5432/wikiumk"
BETTER_AUTH_SECRET=
BETTER_AUTH_URL="http://localhost:3000"
```

- `DATABASE_URL` — koneksi PostgreSQL lokal, detail di [rancangan-database.md](rancangan-database.md).
- `BETTER_AUTH_SECRET` — minimal 32 karakter acak untuk enkripsi dan hash. Buat sendiri tiap mesin:

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
  ```

- `BETTER_AUTH_URL` — base URL aplikasi, selalu cocokkan dengan alamat yang dibuka di browser.

## Menyiapkan dari kosong

```bash
cp .env.example .env      # isi password PostgreSQL dan BETTER_AUTH_SECRET
pnpm install
pnpm exec prisma migrate dev   # buat tabel autentikasi
pnpm exec prisma generate      # buat client Prisma
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

`src/generated/prisma` di-`gitignore`, jadi wajib di-generate ulang setelah mengubah `prisma/schema.prisma`. Sesudah itu **restart `pnpm dev`** — watcher mengabaikan berkas ter-gitignore, sehingga dev server tetap memakai client lama dan semua `/api/auth/*` akan gagal dengan `Prisma schema mismatch`.

## Alur pengguna

1. **Daftar** — halaman `/register` memanggil `authClient.signUp.email({ name, email, password })`. Password minimal 8 karakter. Sesudah sukses, sesi dibuat otomatis dan pengguna diarahkan ke `/`.
2. **Masuk** — halaman `/login` memanggil `authClient.signIn.email({ email, password })`.
3. **Sesi** — `authClient.useSession()` di `Navbar` menampilkan nama pengguna bila sudah masuk, atau tombol `Masuk` bila belum.
4. **Keluar** — tombol `Keluar` memanggil `authClient.signOut()` lalu mengarahkan ke `/login`.

Endpoint `/api/auth/*` dikelola Better Auth; empat di antaranya (`sign-up/email`, `sign-in/email`, `sign-out`, `get-session`) tercantum di `public/openapi.yaml`. Sisanya tidak didokumentasikan. Sebagian endpoint yang mengubah sesi (misalnya `sign-out`) menolak request tanpa header `Origin` yang cocok dengan `BETTER_AUTH_URL` (403, pengecekan CSRF). Browser mengirimkannya otomatis; saat menguji lewat `curl`, sertakan `-H "Origin: http://localhost:3000"`.

## Menguji

Lewat browser:

1. Buka `/register`, isi nama, email, password (minimal 8 karakter), dan ulangi password.
2. Sesudah daftar, `Navbar` menampilkan nama dan tombol `Keluar`.
3. Keluar, lalu masuk lagi lewat `/login` dengan email dan password yang sama.

Lewat API:

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"name":"Uji","email":"uji@dev.com","password":"password123"}'
```

Ganti `uji@dev.com` untuk akun lain; email harus unik.

## Akun pengembangan

`prisma/seed.mjs` membuat dua akun supaya login bisa langsung dicoba tanpa daftar manual:

| Email | Password |
|---|---|
| `admin@dev.com` | `admin123` |
| `student@dev.com` | `student123` |

```bash
pnpm seed
```

Seed ini idempoten: akun yang sudah ada tidak disentuh, dan hash password dibuat dengan `better-auth/crypto` — fungsi yang sama yang dipakai Better Auth saat sign-in. Sesudah menulis, skrip membaca hash itu kembali dari database dan menguji ulang; kalau password berubah, seed menyelaraskannya.

Jalankan setelah `prisma migrate` dan `prisma generate`. Password disimpan sebagai hash sehingga tidak bisa dibaca kembali — lupa password berarti menjalankan seed ini lagi.

## Peran (belum diaktifkan)

Saat ini semua akun berperan sama: belum ada field `role` dan halaman `/admin` belum diproteksi. Rancangan peran (`MAHASISWA`/`ADMIN`) ada di [rancangan-database.md](rancangan-database.md).

Menambahkannya berarti: tambah field `role` ke model `User` di `prisma/schema.prisma`, jalankan `pnpm exec prisma migrate dev`, lalu guard rute `/admin`.

## Berkas terkait

- [rancangan-database.md](rancangan-database.md) — rancangan tabel domain (pengguna, artikel, kategori)
- [struktur-folder.md](struktur-folder.md) — penjelasan tiap folder
- [DOCUMENTING.md](DOCUMENTING.md) — aturan menulis dokumentasi
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — alur branch & review
