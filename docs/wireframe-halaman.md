# Wireframe Halaman Sprint 1

Daftar halaman dan state yang perlu digambar desainer sebelum FE mulai. Sumbernya `public/openapi.yaml` versi 0.4.0 dan isi Sprint 1 (SCRUM-7 sampai 14, 31, 37 sampai 42). Halaman yang API-nya belum ada tidak masuk dokumen ini.

Total: 8 halaman, 1 dialog, 12 komponen bersama.

Status 24 November 2026: `docs/wireframe/wikiumk-wireframe.figcraft` berisi 36 bingkai di 3 halaman. Bingkai yang sudah ada didaftar di [Isi berkas wireframe](#isi-berkas-wireframe). State yang disebut di bawah tetapi tidak ada di daftar itu belum digambar.

## Peta endpoint ke halaman

| Endpoint | Dipakai di |
|---|---|
| `GET /auth/me` | Navbar, semua halaman |
| `POST /auth/login` | `/login` |
| `POST /auth/register` | `/register` |
| `POST /auth/logout` | Navbar |
| `GET /categories` | `/`, `/admin/artikel/baru`, `/admin/artikel/[slug]/ubah` |
| `GET /articles` | `/` dan `/admin` |
| `GET /articles/{slug}` | `/artikel/[slug]`, `/admin/artikel/[slug]/ubah` |
| `POST /articles` | `/admin/artikel/baru` |
| `PUT /articles/{slug}` | `/admin/artikel/[slug]/ubah` |
| `DELETE /articles/{slug}` | `/admin`, dialog konfirmasi hapus |
| `POST /articles/{slug}/read` | `/artikel/[slug]` |
| `GET /health` | tidak dipakai UI |

## Halaman publik

### 1. Beranda `/`

Endpoint: `GET /categories` dan `GET /articles`.

Isi:

| Bagian | Data yang tampil |
|---|---|
| Kolom cari | kata kunci, dikirim sebagai `q`, maks 100 karakter |
| Chip kategori | `name` dan `articleCount` dari `/categories`, ditambah chip "Semua" |
| Kartu artikel | `title`, `summary`, `category.name`, `author.name`, `createdAt` |
| Paginasi | `page`, `totalPages`, `total` |

State yang perlu digambar:

1. **Memuat.** Skeleton berbentuk kartu, bukan layar kosong. Chip kategori punya skeleton sendiri karena `/categories` dimuat terpisah.
2. **Ada hasil.** Daftar kartu terisi, paginasi tampil hanya bila `totalPages > 1`.
3. **Kosong karena belum ada artikel.** `total = 0` dan tidak ada filter aktif. Pesan "Belum ada artikel", tombol "Buat artikel" hanya muncul untuk admin.
4. **Kosong karena filter tidak cocok.** `total = 0` tetapi `q` atau `category` aktif. Pesan "Tidak ada hasil", tombol "Hapus filter" atau "Hapus pencarian".
5. **Sedang mencari.** Kolom cari terisi, daftar menampilkan "Mencari…" dengan debounce, bukan memuat ulang tiap ketikan.
6. **`/articles` gagal (500).** Banner "Gagal memuat artikel" dan tombol "Coba lagi". Navbar dan footer tetap tampil.
7. **`/categories` gagal (500).** Chip kategori disembunyikan, daftar artikel tetap jalan. Jangan sampai satu endpoint gagal mematikan seluruh halaman.
8. **Parameter tidak valid (400).** Terjadi kalau `page` di bawah 1 atau `perPage` di atas 50. Tampilkan pesan singkat dan kembalikan ke halaman 1.

Catatan: `q`, `category`, dan `page` disimpan di query string supaya tautan bisa dibagikan dan tombol back berfungsi. Di HP, chip kategori digeser mendatar karena tidak muat dalam satu layar.

### 2. Detail artikel `/artikel/[slug]`

Endpoint: `GET /articles/{slug}`, lalu `POST /articles/{slug}/read` setelah isi tampil.

Isi: breadcrumb, judul, kategori, nama penulis, `createdAt`, `readCount`, isi markdown, dan `updatedAt` bila berbeda dari `createdAt`.

State yang perlu digambar:

1. **Memuat.** Skeleton judul dan paragraf.
2. **Tampil.** Isi artikel sudah dirender dari markdown.
3. **Angka baca naik.** `readCount` tampil 120 dari GET, lalu berubah jadi 121 setelah POST selesai. Gambar sebagai perubahan halus, bukan angka yang melompat tanpa sebab.
4. **Artikel tidak ditemukan (404).** Halaman "Artikel tidak ditemukan" dengan tombol ke beranda.
5. **Server gagal (500).** Tombol "Coba lagi".
6. **Admin melihat tombol tambahan.** Tombol "Ubah" dan "Hapus" hanya untuk `role: ADMIN`. Keputusan K-2 menaruh tombol ini di `/admin` saja, jadi state ini baru dipakai kalau keputusan itu diubah.

Catatan: `POST /read` dipanggil sekali per kunjungan, bukan per render ulang, supaya angka tidak naik berkali-kali saat halaman di-refresh React.

### 3. Login `/login`

Endpoint: `POST /auth/login`.

Isi: email, password, tombol "Masuk", tautan "Belum punya akun? Daftar".

State: normal, sedang mengirim (tombol nonaktif bertuliskan "Memproses…"), 401 "Email atau password salah", 400 validasi format email, 500 "Terjadi kesalahan pada server".

Catatan: skema login tidak memasang panjang minimum pada password, jadi validasi di FE cukup format email dan kolom terisi. Pengguna yang sudah login langsung dialihkan, form tidak ditampilkan.

### 4. Daftar akun `/register`

Endpoint: `POST /auth/register`.

Isi: nama (1 sampai 100 karakter), email (maks 254), password (8 sampai 72 karakter, ada petunjuk panjangnya), konfirmasi password (hanya divalidasi di FE, tidak dikirim).

State: normal, sedang mengirim, 400 dengan error per field, **409 "Email sudah terdaftar"** disertai tautan ke `/login`, 500.

Catatan: respons 201 mengembalikan data pengguna tetapi tidak menyetel cookie sesi. Pemakai belum login setelah mendaftar. Keputusan K-1 mengarahkan ke `/login`.

### 5. Halaman tidak ditemukan

Route apa pun yang tidak dikenali.

Isi: ilustrasi atau ikon, kalimat "Halaman tidak ditemukan", tombol ke beranda.

Catatan: 404 untuk route asing dan 404 untuk artikel yang tidak ada sebaiknya memakai komponen yang sama dengan dua kalimat berbeda.

## Halaman admin

Semua halaman di bagian ini punya tiga varian wajib: **401** (sesi habis, dialog ke `/login`), **403** (akun bukan admin, halaman penolakan dengan tombol ke beranda), dan **500**.

### 6. Daftar artikel `/admin`

Endpoint: `GET /articles` (endpoint yang sama dengan beranda), `DELETE /articles/{slug}`.

Isi tabel: judul, kategori, penulis, tanggal dibuat, kolom aksi berisi "Ubah" dan "Hapus". Tombol "Artikel baru" di atas tabel. Paginasi sama dengan beranda.

State:

1. Memuat, isi, kosong ("Belum ada artikel" dan tombol "Buat artikel pertama"), gagal 500.
2. **Dialog konfirmasi hapus.** Menyebut judul artikel, tombol "Batal" dan "Hapus". Lihat butir 9.
3. **Hasil hapus.** Sukses (baris hilang, toast "Artikel dihapus"), 404 (artikel sudah dihapus orang lain, beri tahu lalu muat ulang daftar), 403, 401, 500.

Catatan: `GET /articles` mengembalikan `ArticleSummary` yang tidak memuat `readCount` maupun `updatedAt`. Menampilkan dua kolom itu butuh satu permintaan detail per baris. Keputusan K-7 membuang kedua kolom. Judul di tabel adalah tautan ke halaman detail, sedangkan tombol "Ubah" dan "Hapus" muncul di setiap baris.

### 7. Buat artikel `/admin/artikel/baru`

Endpoint: `POST /articles`, dibantu `GET /categories` untuk pilihan kategori.

Isi form:

| Field | Aturan |
|---|---|
| Judul | wajib, maks 200 karakter, tampilkan penghitung |
| Kategori | wajib, pilihan dari `/categories` (dikirim sebagai slug) |
| Ringkasan | opsional, maks 300 karakter, penghitung |
| Isi | wajib, markdown, minimal 1 karakter |

State: normal, sedang menyimpan, 400 dengan error per field di bawah masing-masing kolom plus ringkasan di atas form, 401, 403, 500. Tombol "Batal" meminta konfirmasi bila sudah ada ketikan.

Catatan: `ArticleInput` tidak punya field `slug`. Slug dibuat server dari judul, jadi form tidak perlu kolom slug. Di bawah kolom isi ada satu baris bantuan sintaks markdown: judul, tebal, daftar, dan tautan.

### 8. Ubah artikel `/admin/artikel/[slug]/ubah`

Endpoint: `GET /articles/{slug}` untuk mengisi form, lalu `PUT /articles/{slug}`.

Bentuk sama dengan halaman buat, dengan tambahan label "Mengubah artikel lama" dan info `updatedAt`.

State tambahan: **404 saat memuat** (artikel sudah dihapus, beda dari 404 saat menyimpan), dan konfirmasi bila ada perubahan yang belum disimpan.

Catatan: slug tidak bisa diubah lewat API. Tampilkan slug sebagai teks statis supaya admin tahu URL artikel tidak ikut berubah saat judul diganti.

### 9. Dialog konfirmasi hapus

Satu komponen, dipakai di `/admin` dan di detail artikel bila K-2 diubah.

Isi: kalimat "Hapus artikel ini?", judul artikel, tombol "Batal" dan "Hapus". State: menunggu, sedang menghapus, gagal dengan tombol "Coba lagi".

## Komponen bersama

Cukup satu wireframe per komponen, dipakai di semua halaman.

| Komponen | Berkas | Catatan |
|---|---|---|
| Navbar | `Navbar / desktop`, `Navbar / admin`, `Navbar / HP` | tiga varian sesi: belum login, `STUDENT`, `ADMIN` (tambah tautan "Kelola artikel") |
| Footer | `Footer` | statis, tanpa API. Versi HP masih salinan, bukan instance |
| Kartu artikel | `Kartu artikel` | judul, ringkasan, kategori, penulis, tanggal |
| Chip kategori | `Chip kategori` | nama dan jumlah artikel |
| Paginasi | `Paginasi` | nomor halaman, tombol sebelumnya dan berikutnya nonaktif di ujung |
| Skeleton | `Kartu skeleton` | bentuk mengikuti isi yang ditunggu |
| Banner error | `Banner gagal` | pesan dan tombol "Coba lagi" |
| Pesan error per field | di dalam `/admin/artikel/baru (400: error per field)` | di bawah kolom, singkat |
| Dialog sesi berakhir | `Sesi berakhir (401)` | muncul saat 401 di halaman admin, tombol ke `/login` |
| Tombol memproses | **belum** | nonaktif dan berputar saat menunggu |
| Toast | `Toast` | baru "Artikel dihapus", belum "Artikel dibuat" dan "Berhasil keluar" |
| Dialog konfirmasi hapus | `Dialog konfirmasi hapus` | dipakai sebagai instance di `/admin (dialog hapus)` |

Navbar, Footer, dan Dialog konfirmasi hapus adalah komponen FigCraft. Ubah di halaman `03 Komponen`, semua instance ikut berubah.

Navbar perlu satu state lagi: `GET /auth/me` sedang dimuat. Jangan tampilkan tombol "Masuk" lalu berubah jadi nama pengguna, karena itu terlihat seperti kedipan.

## Isi berkas wireframe

Per 24 November 2026, `docs/wireframe/wikiumk-wireframe.figcraft` berisi 36 bingkai di 3 halaman.

| Halaman | Bingkai |
|---|---|
| `01 Publik` | `/ (desktop)`, `/ (kosong: belum ada artikel)`, `/ (kosong: filter tidak cocok)`, `/ (memuat)`, `/ (gagal 500)`, `/artikel/[slug] (desktop)`, `/artikel/[slug] (404)`, `/login (desktop)`, `/login (401: email atau password salah)`, `/register (desktop)`, `/register (409: email sudah terdaftar)`, `404 halaman`, `/ (HP)`, `/artikel/[slug] (HP)`, `/login (HP)` |
| `02 Admin` | `/admin (desktop)`, `/admin (kosong)`, `/admin (memuat)`, `/admin (dialog hapus)`, `/admin (403: bukan admin)`, `/admin/artikel/baru (desktop)`, `/admin/artikel/baru (400: error per field)`, `/admin/artikel/[slug]/ubah (desktop)`, `Sesi berakhir (401)` |
| `03 Komponen` | `Navbar / desktop`, `Navbar / admin`, `Navbar / HP`, `Footer`, `Kartu artikel`, `Kartu skeleton`, `Chip kategori`, `Banner gagal`, `Paginasi`, `Toast`, `Dialog konfirmasi hapus`, `Tombol` |

State yang tercantum di bagian halaman tetapi tidak muncul di tabel ini belum digambar. Daftar itu tetap jadi daftar kerja.

## Keputusan yang sudah diambil

| No | Keputusan | Alasan |
|---|---|---|
| K-1 | Setelah daftar akun, arahkan ke `/login` | Respons 201 tidak menyetel cookie, jadi pengguna memang belum login |
| K-2 | Tombol "Ubah" dan "Hapus" hanya di `/admin` | Satu tempat untuk aksi berbahaya, halaman publik tetap bersih |
| K-3 | Admin memakai pencarian dan filter yang sama dengan beranda | Endpoint sama, tidak perlu komponen baru |
| K-4 | Jumlah artikel per halaman tetap 10 | `perPage` bisa diubah lewat URL, tapi kontrol tambahan tidak diminta siapa pun |
| K-5 | Editor isi berupa textarea markdown | Tanpa dependensi baru, sesuai isi API yang menerima markdown |
| K-6 | Setelah simpan, kembali ke `/admin` dengan toast | Admin biasanya menyunting beberapa artikel berturut-turut |
| K-7 | Tabel admin tanpa kolom jumlah baca dan tanggal diperbarui | `ArticleSummary` tidak memuatnya, butuh N+1 permintaan |
| K-8 | Slug ditampilkan statis di form ubah | `ArticleInput` tidak punya field slug, URL tidak ikut berubah |

## Di luar cakupan

Forum, komentar, laporan konten, moderasi, dan pengelolaan kategori belum punya endpoint di Sprint 1. Jangan digambar dulu karena bentuknya akan berubah setelah alurnya jelas.

`GET /health` tidak perlu wireframe.

## Urutan pengerjaan

1. Navbar, footer, kartu artikel, chip kategori, paginasi. Semua halaman bergantung pada ini.
2. Beranda dan detail artikel, termasuk state kosong dan gagal.
3. Login dan daftar akun.
4. Daftar admin, buat, ubah, dialog hapus.

Versi HP wajib untuk beranda, detail artikel, dan login. Halaman admin cukup desktop karena jarang dibuka dari HP.
