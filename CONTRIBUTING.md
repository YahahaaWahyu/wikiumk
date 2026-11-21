# Kontribusi & Alur Kerja Tim

Aturan branch, merge, dan review kode untuk tim Wiki UMK.

## Branch

| Branch | Fungsi | Siapa yang boleh merge |
|---|---|---|
| `master` | Versi stabil, selalu dalam keadaan build hijau | Melalui Pull Request + review |
| `fitur/nama-fitur` | Pengerjaan fitur baru (mis. `fitur/login`) | — |
| `fix/nama-bug` | Perbaikan bug (mis. `fix/nav-hp`) | — |

Aturan:

- Selalu mulai dari `master` terbaru: `git pull origin master` lalu `git checkout -b fitur/...`
- Jangan langsung commit ke `master`
- Satu branch untuk satu topik pekerjaan

## Commit

Gunakan gaya [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: tambah halaman login
fix: navigasi tidak tampil di layar HP
docs: tulis cara menjalankan proyek di README
refactor: pindahkan komponen header ke components/
```

## Pull Request & Review

1. Push branch ke GitHub: `git push origin fitur/nama-fitur`
2. Buka PR ke `master`, isi judul dan deskripsi singkat
3. PR **wajib**:
   - Minimal **1 review** dari anggota tim lain
   - `pnpm lint` tidak error
   - `pnpm build` berhasil
4. Setelah di-approve, barulah merge (squash atau merge bebas, sepakati satu saja di tim)
5. Hapus branch setelah merge

## Menjalankan Proyek Lokal

Lihat [README.md](README.md).

## Peran

| Anggota | Peran |
|---|---|
| Wahyu Fakhril Akbar | Backend (repository, database, deploy) |
| (isi anggota lain) | Frontend / lainnya |
