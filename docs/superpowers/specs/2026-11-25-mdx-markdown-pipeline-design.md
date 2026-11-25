# Design: Pipeline MDX untuk Artikel Wiki UMK

Tanggal: 2026-11-25
Status: menunggu persetujuan
Revisi: 2 — menambahkan hasil builder check

## Intent

Artikel di Wiki UMK disimpan sebagai markdown, tetapi renderer buatan sendiri
(`src/lib/markdown.tsx`) hanya mengurai heading, paragraf, list, bold, italic,
dan link. Konten yang lebih kaya — tabel, footnote, code block, kutipan
bersarang, math, diagram — akan tampil mentah atau salah.

Repo referensi `dxnz-id/porto` sudah punya pipeline MDX yang teruji lewat
`src/content/blog/markdown-test.mdx`. Kita port pipeline-nya ke wikiumk.

Kenapa sekarang: Sprint 1 menutup dengan renderer yang hanya cukup untuk isi
artikel contoh. Backend akan menerima markdown bebas dari penulis, jadi
renderer-nya harus sanggup sebelum artikel asli masuk.

## Goals

- Artikel bisa memuat: GFM (tabel, footnote, task list, strikethrough, autolink),
  heading ber-id, code block dengan highlight, math inline dan blok, diagram
  mermaid.
- `markdown-test.mdx` jadi artikel uji; semua bagiannya tampil tanpa error.
- Tampilan tetap abu-abu persis wireframe — highlight monokrom.
- Konten tetap berupa string di `src/lib/data.ts`, tidak dipindah ke file `.mdx`.

## Non-goals

- Frontmatter / metadata dibaca dari file MDX. Metadata tetap di `data.ts`.
- Table of contents, share section, prev/next navigation (fitur porto, tidak
  ada di wireframe).
- Tab `Pratinjau` di `EditorMarkdown` jadi renderer sungguhan. Wireframe
  menggambarnya sebagai gambar; menghidupkannya pekerjaan terpisah.
- Icon library (`lucide-react`) dan library clipboard eksternal.
- Menangani konten rusak dari backend masa depan. Lihat "Kegagalan build".

## Anti-goals

- Tidak ada warna di luar token `@theme` greyscale yang sudah ada.
- Tidak ada dark mode.
- Tidak menambah dependency di luar daftar sembilan di bawah.
- Tidak memindahkan konten artikel keluar dari `data.ts`.

## Constraints

- Next 16.4.6, React 19.3.0, Tailwind 4.3.3, pnpm 12, Node v26.13.0.
  (Node lolos syarat `mermaid` yang menuntut `>=22.12.0`.)
- `cacheComponents` aktif. Route yang baca `searchParams` sudah
  `export const instant = false`. Render MDX terjadi di server component dan
  tidak mengubah itu.
- Route dan URL tetap Indonesia; identifier dan nama berkas bahasa Inggris;
  komentar bahasa Indonesia.
- Branch kerja: `feat/wireframe-sprint-1` (lanjutan dari commit `9057952`).

## Approaches

**Dipilih: port pipeline dari porto, konten tetap string.**

`MDXRemote` dari `next-mdx-remote/rsc` menerima string, jadi `data.ts` tidak
berubah bentuk dan `generateStaticParams` / `searchArticles` tetap jalan.

Alternatif yang ditolak:

1. **Perluas parser markdown sendiri.** Tanpa dependency baru, tetapi
   footnote, math, dan code fence adalah masalah tingkat parser, bukan bisa
   ditambah dengan regex. Ini penyebab renderer sekarang berhenti di link.
2. **Pindah konten ke file `.mdx` lalu baca dari disk, persis porto.** Paling
   identik dengan referensi, tetapi memindahkan 22 artikel keluar dari
   `data.ts` yang menjadi kontrak data statis Sprint 1, dan mengubah
   `generateStaticParams` serta `searchArticles`. Tidak ada gunanya sekarang.
3. **`@next/mdx` untuk file `.mdx` di route.** Dirancang untuk konten yang
   jadi bagian route, bukan untuk merender string saat runtime.
4. **`@mdx-js/mdx` murni tanpa `next-mdx-remote`.** Menulis ulang `serialize`
   dan `new Function(...)` yang sama, dengan `@mdx-js/mdx` tetap jadi
   dependensi. Lebih banyak kode untuk hasil yang sama.

## Decisions

### Dependency — sembilan, dipin ke versi yang terbukti

Jangan `pnpm add <paket>` versi mentah. Mermaid terbaru (12.3.0) menuntut
`katex@^0.18.0` sementara `rehype-katex` memakai `katex@^0.16.47`, sehingga
dua salinan katex akan terpasang. Porto membuktikan pipeline-nya dengan
kombinasi versi ini:

| Paket | Versi |
|---|---|
| `next-mdx-remote` | `^6.0.0` |
| `remark-gfm` | `^4.0.1` |
| `remark-math` | `^6.0.0` |
| `rehype-katex` | `^7.0.1` |
| `rehype-pretty-code` | `^0.14.5` |
| `rehype-slug` | `^6.0.0` |
| `shiki` | `^4.5.0` |
| `katex` | `^0.16.47` |
| `mermaid` | `^12.2.0` |

`lucide-react` dan helper clipboard milik porto **tidak** dipakai. Alasannya
di bawah.

### next-mdx-remote sudah diarsipkan — tetap dipakai

Paket ini ditandai *"archived and is no longer supported"* sejak 18 November
2026, tujuh hari sebelum desain ini ditulis. Keputusan saya: **tetap dipakai.**

Alasannya arsitektur, bukan kelalaian. Sembilan paket pipeline — remark,
rehype, shiki, katex, mermaid — semuanya aktif dan tidak bergantung pada
status paket ini. Yang diarsipkan hanya lapisan perekat sekitar 50 baris yang
mengubah string menjadi komponen. Kalau lapisan itu rusak di masa depan,
menukar host tidak menyentuh pipeline maupun ketiga komponen baru.

Catatan keamanan yang menyertainya: `MDXRemote` meng-`eval` source
terkompilasi lewat `new Function(...)`. Aman selama konten tepercaya, dan
memang begitu — konten ada di `data.ts` yang kita tulis sendiri.

### `blockJS: false`

`serialize` dari `next-mdx-remote@6.0.0` berdefault `blockJS = true`, yang
menyisipkan plugin `removeJavaScriptExpressions` dan memotong diam-diam:

- properti berbentuk ekspresi, sehingga `<BlogImage width={1200}/>` kehilangan
  `width`-nya — kasus "JSX dengan properti" pada file uji lulus verifikasi
  tanpa benar-benar menguji apa pun;
- teks apa pun yang mengandung `{...}` di dalam prosa.

**Keputusan saya: `blockJS: false`.**

Mematikannya tidak membuka kotak Pandora: `blockDangerousJS` berdefault
`true` dan tetap aktif, sehingga `eval`, `Function`, dan `process` tetap
diblokir.

Lebih jauh, `blockJS: false` mengubah kegagalan dari **diam-diam** menjadi
**nyaring** — ekspresi yang tidak valid akan melempar galat kompilasi, bukan
menghapus teks konten tanpa suara. Untuk situs konten, itu pertukaran yang
benar.

Konten tetap tepercaya karena berasal dari `data.ts`. Kalau kelak backend
menyuplai markdown dari penulis luar, keputusan ini perlu ditinjau ulang
bersamaan dengan "Kegagalan build".

### Berkas baru

| Berkas | Isi |
|---|---|
| `src/components/mdx/index.tsx` | Peta `mdxComponents`. Semua kelas memakai token `@theme` wikiumk: `border-line`, `bg-paper`, `bg-chrome`, `text-ink`, `text-muted`, `bg-dark`, `text-paper`. |
| `src/components/mdx/CodeBlock.tsx` | Client component. Membungkus `<figure>` dari rehype-pretty-code, menyisipkan tombol salin. |
| `src/components/mdx/Mermaid.tsx` | Client component. Dynamic `import("mermaid")`, `theme: "neutral"`. |

### Berkas berubah

| Berkas | Perubahan |
|---|---|
| `src/lib/markdown.tsx` | **Dihapus.** Satu-satunya pemakai adalah halaman detail. Penghapusan ini juga membetulkan penyimpangan `docs/struktur-folder.md` yang menyebut `src/lib` untuk kode tanpa JSX. |
| `src/app/artikel/[slug]/page.tsx` | `renderMarkdown(...)` diganti `<MDXRemote source={...} components={mdxComponents} options={...}/>`; impor `katex/dist/katex.min.css`; arbitrary variant `[&_h2]`, `[&_h3]`, `[&_li]`, `[&_ul]` dihapus karena styling pindah ke `mdxComponents`. |
| `src/lib/data.ts` | Artikel uji ditambahkan (lihat "Artikel uji"). `articleCount` kategori `lainnya` naik 3 → 4. |
| `docs/wireframe-halaman.md` | Dua catatan jadi basi dan perlu diperbarui (lihat "Dokumen yang perlu disesuaikan"). |
| `next.config.ts` | **Tidak berubah.** `transpilePackages: ['next-mdx-remote']` tidak ditambahkan — README paket menyebutnya perlu untuk Turbopack, tetapi porto membuild bersih tanpa itu pada Next major yang sama. Kalau build wikiumk gagal karena transpilasi, tambahkan satu baris itu lalu perbarui tabel ini. |

### Konfigurasi plugin — mengikuti porto

```jsx
<MDXRemote
  source={article.content}
  components={mdxComponents}
  options={{
    blockJS: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
        rehypeKatex,
      ],
    },
  }}
/>
```

### Highlight tetap abu-abu

Wireframe dikunci abu-abu persis, sedangkan theme shiki mana pun membawa warna.

Cara: pakai `github-light` karena kontras luminansinya tinggi, lalu terapkan
`filter: grayscale(1)` pada elemen `<pre>`. Satu deklarasi CSS, menjamin
keputusan wireframe terpenuhi apa pun theme-nya nanti.

Komentar di kode menjelaskan alasan pemilihan ini, bukan hanya apa yang
dilakukan.

Mermaid memakai `theme: "neutral"` — porto sudah memakai ini, dan hasilnya
sudah mendekati greyscale.

### Mermaid: render saja, tanpa modal perbesar

porto's `Mermaid.tsx` berukuran 16KB dan memuat modal perbesar dengan zoom,
pan, d-pad, pinch zoom, focus trap, serta 11 ikon `lucide-react`.

**Panggilan saya:** potong itu semua. Yang dibawa hanya jalur render —
dynamic import, `theme: "neutral"`, `suppressErrorRendering`, kotak loading,
kotak galat, dan tombol salin.

Alasan: itu fitur produk porto untuk blog portofolio, bukan bagian dari
pemrosesan markdown; ia menambah `lucide-react` di luar daftar sembilan yang
sudah disebutkan; dan wireframe Sprint 1 tidak menggambarkannya.

Tombol salin memakai `navigator.clipboard.writeText` langsung, tanpa helper
terpisah. Ikon salin dan centang berupa SVG inline.

Kalau perbesar diagram dibutuhkan, tambahkan kemudian tanpa mengubah
arsitektur.

### Heading naik satu tingkat — perubahan yang disengaja

Renderer lama menaikkan heading satu tingkat (`##` → `<h3>`) karena artikel
sudah punya `<h1>` judul. MDX memakai semantik markdown standar, jadi `##`
kini menjadi `<h2>`.

Ini perbaikan, bukan regresi: `##` di bawah judul halaman memang seharusnya
`h2`. Konsekuensinya, `## Latar belakang` di isi artikel contoh tampil satu
tingkat lebih besar dari sebelumnya. Tidak ada isi artikel yang perlu diubah.

### Kegagalan build — memang dibiarkan gagal

Dengan MDX, satu artikel yang tidak bisa dikompilasi akan menggagalkan
`pnpm build` untuk seluruh 23 artikel. Renderer lama tidak mungkin gagal.

**Keputusan saya: biarkan build gagal dengan jelas.**

Alasannya: konten yang gagal berasal dari `data.ts`, yaitu berkas yang kita
tulis dan tinjau sendiri. Galat kompilasi saat build justru menangkap masalah
tepat di tempat yang benar — sebelum halaman apa pun terbit.

Ini berbeda dengan masa depan di mana backend menyuplai markdown. Konten
seperti itu dikompilasi saat runtime, sehingga kegagalan hanya menimpa satu
artikel, bukan seluruh build. Jalur penanganannya pekerjaan terpisah dan
diakui sebagai non-goal di sini.

### Artikel uji

`markdown-test.mdx` disalin menjadi artikel ke-23 di `data.ts`:

- `slug: "uji-markdown"`, kategori `lainnya`, tanggal dan `readCount` diisi
  wajar agar tampil normal di daftar.
- Baris `import TidakDipakai from "./tidak-ada";` **dibuang.** Plugin
  `removeImportsExportsPlugin` memang sudah memotongnya secara otomatis
  (`useDynamicImport` default `false`), tetapi membuangnya di sumber membuat
  konten uji bersih dan niatnya jelas.
- Impor `<BlogImage>` dari porto diganti komponen `BlogImage` sederhana yang
  kita tulis, karena wikiumk tidak punya komponen itu.
- **Kelas JSX di dalam konten ikut diganti.** File uji porto memuat
  `<div className="border border-border-hairline p-4 my-6">` — kelas itu tidak
  ada di `@theme` wikiumk dan akan jadi kelas mati, sehingga demo tampil di
  luar sistem. Diganti menjadi token wikiumk (`border border-line p-4 my-6`)
  agar pengujian JSX tetap berjalan sekaligus tetap abu-abu.

Konsekuensi yang disengaja: daftar beranda dan tabel admin menampilkan 23
artikel, dan chip kategori `Lainnya` menampilkan 4. Ini demo data statis.

## Dokumen yang perlu disesuaikan

1. `docs/wireframe-halaman.md` K-5 beralasan *"Tanpa dependensi baru"*.
   Keputusannya (editor tetap textarea) masih berlaku, tetapi alasannya tidak
   lagi. Alasan diganti agar tidak menyesatkan.
2. `docs/wireframe-halaman.md` baris tab `Pratinjau` berbunyi *"render markdown
   butuh dependensi yang belum ada"*. Dependensinya kini ada, jadi catatannya
   perlu diluruskan. Menghidupkan tab pratinjau tetap di luar lingkup.

## Verifikasi

1. `pnpm lint` bersih.
2. `pnpm build` sukses, dan jumlah prerender route naik dari **53 ke 54**
   (artikel uji). Angka 53 dihitung dari `.next/prerender-manifest.json`; angka
   pada baris "Generating static pages" menghitung berbeda dan tidak dipakai
   sebagai tolok ukur.
3. `/artikel/uji-markdown` memuat semua bagian: inline formatting, heading
   berulang, list bersarang dan task list, kutipan, tabel rata kiri-tengah-kanan,
   code fence dengan dan tanpa bahasa, math inline dan blok, gambar, mermaid.
4. Code block tampil abu-abu, tanpa warna.
5. Properti JSX terbukti tidak dipotong — `<BlogImage>` tampil pada lebar yang
   ditentukan. Ini yang membedakan `blockJS: false` dari default.
6. `/artikel/beasiswa-ppm-2026` tetap benar — heading `##` kini `h2`, list dan
   paragraf utuh.
7. `/?category=lainnya` menampilkan 4 kartu; beranda menampilkan 10 kartu
   halaman pertama.
8. Route lain tidak berubah: `/admin`, `/login`, `/register`, 404.

## Risiko

- **Ukuran bundel.** Mermaid dan shiki menambah berat unduhan. Mermaid dimuat
  dinamis hanya saat ada blok diagram, sehingga halaman tanpa diagram tidak
  terbebani.
- **Waktu build.** Syntax highlighting dijalankan saat build per kode block.
  Tidak ada tanda ini akan bermasalah pada skala 23 artikel.
- **Paket yang diarsipkan.** `next-mdx-remote` tidak akan menerima perbaikan.
  Jalur keluarnya terbuka: menukar host tidak menyentuh pipeline.
- **Konten lama.** Tidak ada yang diubah, tetapi tingkat heading berubah
  sebagaimana dijelaskan di atas.

## Yang tersisa untuk builder

- Menulis ketiga file komponen dan memasang dependency dengan versi terpin.
- Memutuskan penempatan kelas detail per elemen di `mdxComponents` agar
  ritmenya cocok dengan token wireframe yang ada.
- Menyesuaikan dua catatan di `docs/wireframe-halaman.md`.
