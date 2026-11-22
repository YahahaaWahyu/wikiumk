# Panduan Dokumentasi

Aturan menulis dan merawat dokumentasi Wiki UMK. Ikuti setiap kali menambah fitur, mengubah alur, atau memperbaiki bug yang mengubah cara pakai.

## Lokasi dokumentasi

| Lokasi | Isi |
|---|---|
| `README.md` | Gambaran proyek, prasyarat, cara menjalankan |
| `CONTRIBUTING.md` | Aturan branch, commit, pull request, dan review |
| `docs/` | Dokumen mendalam: ERD, arsitektur, keputusan teknis |
| Komentar kode | Alasan di balik kode, satu baris, hanya bila kode tidak bisa menjelaskannya |

Satu topik satu berkas. Aturan branch tidak ditaruh di README, cara instalasi tidak ditaruh di dokumen arsitektur.

## Bahasa

Dokumentasi dan komentar kode memakai bahasa Indonesia. Nama variabel, fungsi, tipe, dan istilah di dalam kode tetap bahasa Inggris mengikuti konvensi Next.js.

Teks yang dibaca pengguna (label tombol, pesan galat, isi halaman) juga bahasa Indonesia.

## Aturan menulis

- Mulai dari hal yang dicari pembaca, bukan dari sejarah fitur.
- Kalimat pendek, satu paragraf satu gagasan.
- Langkah ditulis sebagai daftar bernomor, lengkap dengan perintah yang bisa disalin.
- Tautkan berkas lain dengan path relatif, misalnya `[CONTRIBUTING.md](../CONTRIBUTING.md)`.
- Jangan menempel tangkapan layar berisi teks. Salin teksnya.
- Sebut nama berkas dan fungsi persis seperti di kode.

## Nama berkas

Berkas di `docs/` memakai huruf kecil dan tanda hubung, misalnya `erd.md`, `arsitektur.md`, `keputusan-database.md`. Nama berkas yang sudah ada tetap dipakai.

## Menjaga dokumentasi tetap benar

Perbarui dokumen di pull request yang sama dengan perubahan kodenya. Pull request yang mengubah perilaku tanpa memperbarui dokumen dianggap belum selesai, dan reviewer boleh meminta perbaikan.

Dokumen yang sudah tidak sesuai lebih berbahaya daripada tidak ada dokumen. Perbarui atau hapus, jangan dibiarkan.
