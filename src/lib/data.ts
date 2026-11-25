// Bentuk objek mengikuti public/openapi.yaml v0.4.0. Berkas ini hanya
// menyalakan halaman sampai endpoint asli ada; ganti isinya dengan fetch.

export type Role = "STUDENT" | "ADMIN";

export interface CategoryRef {
  slug: string;
  name: string;
}

export interface Category extends CategoryRef {
  articleCount: number;
}

export interface Author {
  name: string;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  summary: string;
  category: CategoryRef;
  author: Author;
  createdAt: string;
}

export interface ArticleDetail extends ArticleSummary {
  content: string;
  readCount: number;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// K-4: jumlah artikel per halaman tetap 10, jadi kontrol halaman tidak dibuat.
export const PER_PAGE = 10;

export const categories: Category[] = [
  { slug: "akademik", name: "Akademik", articleCount: 13 },
  { slug: "organisasi", name: "Organisasi", articleCount: 6 },
  { slug: "lainnya", name: "Lainnya", articleCount: 4 },
];

const sampleContent = `## Latar belakang

Pengumuman ini berlaku untuk seluruh mahasiswa Universitas Muria Kudus pada semester berjalan. Mahasiswa diminta membaca ketentuan di bawah ini sebelum mengirimkan berkas.

## Ketentuan

- Berkas dikumpulkan melalui fakultas masing-masing paling lambat batas waktu yang ditentukan.
- Format berkas mengikuti pedoman penulisan universitas.
- Pertanyaan dapat disampaikan kepada panitia melalui kontak resmi.

Mahasiswa yang tidak memenuhi ketentuan akan diproses pada periode berikutnya.`;

const ujiContent = `Halaman ini menguji semua yang bisa muncul di blog. Kalau ada bagian yang tampak aneh, itu bahan perbaikan pipeline, bukan salah tulis.

## Teks Inline

Paragraf biasa dengan **bold**, *italic*, ***bold dan italic***, ~~strikethrough~~, dan \`inline code\`.

Inline code berisi karakter aneh: \`\` \`backtick\` \`\`, \`$HOME\`, \`{kurung kurawal}\`, \`<tag>\`, dan \`a | b\`.

Link [internal](/about) dan [eksternal](https://example.com). Link dengan judul: [contoh](https://example.com "Judul link").

Autolink telanjang: https://example.com dan email halo@example.com.

Baris pertama dengan hard break\
baris kedua setelah hard break.

HTML entity: &amp; &copy; &nbsp;selesai.

Emoji dan unicode: 🚀 café naïve 日本語.

Escape: \*bukan italic\*, \_bukan italic\_, \[bukan link\]. Referensi catatan kaki pertama.[^1]

## Heading

# Heading Satu di Body

## Heading Dua

### Heading Tiga

#### Heading Empat

##### Heading Lima

###### Heading Enam

## Heading dengan \`Inline Code\`

## Heading dengan [Link](/about) dan *Emphasis*

## Heading dengan tanda tanya? Dan koma, titik.

## Emoji 🚀 dan unicode café

## Heading dengan math $a^2 + b^2 = c^2$

## Heading yang sengaja dibuat sangat panjang sekali supaya terlihat bagaimana teks membungkus di dalam kolom artikel yang lebarnya tujuh ratus piksel ini

## Duplicate Heading

## Duplicate Heading

### Heading setelah duplicate tanpa paragraf

## List

- Item pertama
- Item kedua dengan \`inline code\`
- Item ketiga dengan [link](/blog)

1. Langkah satu
2. Langkah dua
3. Langkah tiga

- Level satu
  - Level dua
    - Level tiga
      - Level empat

1. Ordered satu
   1. Ordered dua
      1. Ordered tiga

1. Campuran
   - anak unordered
     1. cucu ordered
2. Item kedua

- Item longgar pertama

- Item longgar kedua

- Item longgar ketiga

- Item dengan kode:

  \`\`\`ts
  const x = 1;
  \`\`\`

- Item dengan dua paragraf.

  Paragraf kedua di dalam item yang sama.

- [x] Tugas selesai
- [ ] Tugas belum
  - [x] Anak tugas selesai
  - [ ] Anak tugas belum

## Blok

> Kutipan biasa.

> > Kutipan bersarang.

> Kutipan dengan list:
>
> - satu
> - dua

---

<div className="border border-border-hairline p-4 my-6">
  Blok JSX dengan elemen div.
</div>

<details>

<summary>Detail yang bisa dibuka</summary>

Isi di dalam details.

</details>

*Fig 1. Pola caption memakai paragraf italic.*

## Tabel

| Kolom A | Kolom B |
|---|---|
| Isi A | Isi B |

| Kiri | Tengah | Kanan |
|:---|:---:|---:|
| satu | dua | tiga |
| \`kode\` | [link](/about) | |

| Satu | Dua | Tiga | Empat | Lima | Enam | Tujuh |
|---|---|---|---|---|---|---|
| sel panjang sekali yang harusnya membuat tabel ini butuh scroll horizontal di layar kecil | b | c | d | e | f | g |

| Hanya Header | Kolom Kedua |
|---|---|

| Math A | Math B |
|---|---|
| $x^2$ | $y^2$ |

## Kode

\`\`\`php
<?php
echo "halo";
\`\`\`

\`\`\`ts
const harga = "$5";
const total = 10;
\`\`\`

\`\`\`bash
echo "$HOME"
\`\`\`

\`\`\`json
{ "a": 1, "b": [2, 3] }
\`\`\`

\`\`\`
Fence tanpa bahasa.
\`\`\`

\`\`\`ts title="contoh.ts"
const berjudul = true;
\`\`\`

\`\`\`ts {1,3}
const satu = 1;
const dua = 2;
const tiga = 3;
\`\`\`

\`\`\`ts
const barisPanjang = "ini baris yang sengaja dibuat sangat panjang sekali supaya kita bisa melihat apakah blok kode melakukan scroll di dalam kotaknya sendiri tanpa membuat seluruh halaman ikut melebar ke samping";
\`\`\`

\`\`\`
\`\`\`

Kode dengan karakter khusus: \`<div>\`, \`a & b\`, \`x > y\`.

## Math

Inline math $E = mc^2$ dan $O(n \log n)$.

$$
T(n) = 2T\left(\frac{n}{2}\right) + O(n)
$$

$$
\begin{aligned}
(a + b)^2 &= a^2 + 2ab + b^2 \\
(a - b)^2 &= a^2 - 2ab + b^2
\end{aligned}
$$

Math dengan perbandingan $x < y$ dan $a \& b$.

Harga $5 dan $10 tidak boleh menjadi math. Math di catatan kaki juga diuji.[^math]

$$
\sum_{i=1}^{n} \frac{x_i^2}{\sigma_i^2} + \prod_{j=1}^{m} \left(1 + \frac{y_j}{\tau_j}\right) + \int_{0}^{\infty} e^{-t^2}\,dt = \frac{\sqrt{\pi}}{2} + \cdots
$$

## Gambar

![Gambar markdown](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop)

<BlogImage
  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
  alt="BlogImage dengan dimensi"
  width="1200"
  height="800"
/>

<BlogImage
  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
  alt="BlogImage dengan prop ekspresi"
  width={1200}
  height={800}
/>

<BlogImage
  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
  width="1200"
  height="800"
/>

<a href="https://example.com">
  <BlogImage
    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
    alt="Gambar di dalam link"
    width="1200"
    height="800"
  />
</a>

![Gambar rusak](https://example.com/tidak-ada.jpg)

## Mermaid

\`\`\`mermaid
flowchart LR
    A[Markdown] --> B[remark]
    B --> C[rehype]
    C --> D[HTML]
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant S as Server
    U->>S: Request
    S-->>U: Response
\`\`\`

\`\`\`mermaid
flowchart LR
    A[Label yang sangat panjang sekali untuk menguji pembungkusan teks di dalam kotak diagram] --> B[Label lain yang juga panjang]
\`\`\`

\`\`\`mermaid
flowchart LR
    A[Start] -->
\`\`\`

## MDX dan JSX

Inline JSX: <span className="font-mono text-primary">teks span</span>.

JSX dengan prop string sudah diuji di bagian gambar. Prop ekspresi \`width={1200}\` juga sudah.

{/* komentar jsx */}

Komentar HTML \`<!-- komentar -->\` tidak didukung MDX. Menulisnya sebagai teks biasa akan menggagalkan build, jadi di sini hanya dicatat.

## Stress dan Edge

Kata tanpa spasi: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.

Paragraf panjang: ini paragraf yang sengaja dipanjangkan untuk melihat ritme baris, jarak antar paragraf, dan perilaku pembungkusan teks pada kolom sempit. Kalimatnya diulang beberapa kali dengan variasi supaya tidak persis sama. Membaca paragraf panjang di layar kecil menguji lebar baris, tinggi baris, dan margin bawah. Kalau salah satu nilai itu meleset, mata akan cepat lelah. Panjang yang nyaman biasanya enam puluh sampai delapan puluh karakter per baris. Di layar lebar, kolom artikel tujuh ratus piksel sudah mendekati batas itu. Di layar ponsel, teks harus tetap terbaca tanpa scroll horizontal. Paragraf ini juga menguji apakah ada kata yang terpotong aneh atau spasi yang hilang. Kalimat demi kalimat ditambahkan sampai beberapa baris penuh. Tidak ada maksud lain selain mengisi ruang. Kalau semuanya benar, paragraf ini terlihat seperti tulisan biasa. Kalau ada yang salah, akan terlihat sebagai jarak yang janggal atau baris yang terlalu rapat. Itu tandanya token tipografi perlu dicek.




Tiga baris kosong di atas paragraf ini.

Baris dengan trailing spaces di belakang.  
Baris kedua setelah dua spasi.

## Penutup

Halaman ini selesai. Semua fitur di atas harus tampil tanpa error di console.

[^1]: Footnote pertama.

[^math]: Rumus di catatan kaki: $e^{i\pi} + 1 = 0$.
`;

const expandSummary = (title: string, summary: string) =>
  `${summary}\n\nPengumuman resmi ini dapat ditanyakan kepada fakultas masing-masing. Detail jadwal dan persyaratan lengkap mengikuti ketentuan ${title.toLowerCase()} yang berlaku saat ini.`;

export const articles: ArticleDetail[] = [
  {
    slug: "beasiswa-ppm-2026",
    title: "Beasiswa PPM 2026 Dibuka",
    summary: "Pendaftaran beasiswa PPM tahun 2026 dibuka mulai Januari.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2026-01-12T00:00:00.000Z",
    content: sampleContent,
    readCount: 121,
    updatedAt: "2026-01-14T00:00:00.000Z",
  },
  {
    slug: "jadwal-uas-semester-ganjil",
    title: "Jadwal UAS Semester Ganjil",
    summary: "Jadwal ujian akhir semester ganjil sudah dapat diunduh.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2026-01-10T00:00:00.000Z",
    content: expandSummary(
      "Jadwal UAS Semester Ganjil",
      "Jadwal ujian akhir semester ganjil sudah dapat diunduh melalui portal akademik.",
    ),
    readCount: 98,
    updatedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    slug: "pendaftaran-kkn-gelombang-2",
    title: "Pendaftaran KKN Gelombang 2",
    summary: "Pendaftaran kuliah kerja nyata gelombang kedua dibuka.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2026-01-08T00:00:00.000Z",
    content: expandSummary(
      "Pendaftaran KKN Gelombang 2",
      "Pendaftaran kuliah kerja nyata gelombang kedua dibuka bagi mahasiswa yang belum mengikuti gelombang pertama.",
    ),
    readCount: 76,
    updatedAt: "2026-01-08T00:00:00.000Z",
  },
  {
    slug: "seminar-nasional-teknologi",
    title: "Seminar Nasional Teknologi",
    summary: "Seminar nasional bertema teknologi terbuka untuk umum.",
    category: { slug: "organisasi", name: "Organisasi" },
    author: { name: "Admin" },
    createdAt: "2026-01-05T00:00:00.000Z",
    content: expandSummary(
      "Seminar Nasional Teknologi",
      "Seminar nasional bertema teknologi terbuka untuk mahasiswa dan dosen.",
    ),
    readCount: 64,
    updatedAt: "2026-01-05T00:00:00.000Z",
  },
  {
    slug: "pengumuman-libur-akhir-tahun",
    title: "Pengumuman Libur Akhir Tahun",
    summary: "Kegiatan akademik diliburkan selama akhir tahun.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2026-01-02T00:00:00.000Z",
    content: expandSummary(
      "Pengumuman Libur Akhir Tahun",
      "Kegiatan akademik diliburkan selama akhir tahun dan berjalan normal kembali pada awal semester.",
    ),
    readCount: 52,
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    slug: "lomba-karya-tulis-mahasiswa",
    title: "Lomba Karya Tulis Mahasiswa",
    summary: "Lomba karya tulis mahasiswa tingkat universitas dibuka.",
    category: { slug: "organisasi", name: "Organisasi" },
    author: { name: "Admin" },
    createdAt: "2025-12-28T00:00:00.000Z",
    content: expandSummary(
      "Lomba Karya Tulis Mahasiswa",
      "Lomba karya tulis mahasiswa tingkat universitas dibuka dengan tiga bidang karya.",
    ),
    readCount: 31,
    updatedAt: "2025-12-28T00:00:00.000Z",
  },
  {
    slug: "perubahan-kurikulum-semester-genap",
    title: "Perubahan Kurikulum Semester Genap",
    summary: "Beberapa mata kuliah mengalami perubahan bobot sks.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-12-22T00:00:00.000Z",
    content: expandSummary(
      "Perubahan Kurikulum Semester Genap",
      "Beberapa mata kuliah mengalami perubahan bobot sks pada semester genap.",
    ),
    readCount: 47,
    updatedAt: "2025-12-22T00:00:00.000Z",
  },
  {
    slug: "bimbingan-skripsi-angkatan-2023",
    title: "Bimbingan Skripsi Angkatan 2023",
    summary: "Jadwal bimbingan skripsi angkatan 2023 diumumkan.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-12-18T00:00:00.000Z",
    content: expandSummary(
      "Bimbingan Skripsi Angkatan 2023",
      "Jadwal bimbingan skripsi angkatan 2023 diumumkan untuk seluruh program studi.",
    ),
    readCount: 88,
    updatedAt: "2025-12-18T00:00:00.000Z",
  },
  {
    slug: "pemilihan-presiden-mahasiswa",
    title: "Pemilihan Presiden Mahasiswa",
    summary: "Pendaftaran pasangan calon presiden mahasiswa dibuka.",
    category: { slug: "organisasi", name: "Organisasi" },
    author: { name: "Admin" },
    createdAt: "2025-12-15T00:00:00.000Z",
    content: expandSummary(
      "Pemilihan Presiden Mahasiswa",
      "Pendaftaran pasangan calon presiden mahasiswa dibuka selama satu minggu.",
    ),
    readCount: 112,
    updatedAt: "2025-12-15T00:00:00.000Z",
  },
  {
    slug: "workshop-penulisan-jurnal",
    title: "Workshop Penulisan Jurnal",
    summary: "Workshop penulisan jurnal ilmiah untuk mahasiswa tingkat akhir.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-12-11T00:00:00.000Z",
    content: expandSummary(
      "Workshop Penulisan Jurnal",
      "Workshop penulisan jurnal ilmiah untuk mahasiswa tingkat akhir diselenggarakan dua hari.",
    ),
    readCount: 43,
    updatedAt: "2025-12-11T00:00:00.000Z",
  },
  {
    slug: "beasiswa-bantuan-ukt",
    title: "Beasiswa Bantuan UKT",
    summary: "Pendaftaran bantuan biaya kuliah tahap dua dibuka.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-12-08T00:00:00.000Z",
    content: expandSummary(
      "Beasiswa Bantuan UKT",
      "Pendaftaran bantuan biaya kuliah tahap dua dibuka bagi mahasiswa terdampak.",
    ),
    readCount: 134,
    updatedAt: "2025-12-08T00:00:00.000Z",
  },
  {
    slug: "agenda-wisuda-periode-1",
    title: "Agenda Wisuda Periode I",
    summary: "Pelaksanaan wisuda periode pertama dijadwalkan Maret.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-12-04T00:00:00.000Z",
    content: expandSummary(
      "Agenda Wisuda Periode I",
      "Pelaksanaan wisuda periode pertama dijadwalkan pada Maret mendatang.",
    ),
    readCount: 96,
    updatedAt: "2025-12-04T00:00:00.000Z",
  },
  {
    slug: "turnamen-futsal-antar-fakultas",
    title: "Turnamen Futsal Antar Fakultas",
    summary: "Turnamen futsal antar fakultas memasuki babak penyisihan.",
    category: { slug: "organisasi", name: "Organisasi" },
    author: { name: "Admin" },
    createdAt: "2025-11-30T00:00:00.000Z",
    content: expandSummary(
      "Turnamen Futsal Antar Fakultas",
      "Turnamen futsal antar fakultas memasuki babak penyisihan grup.",
    ),
    readCount: 57,
    updatedAt: "2025-11-30T00:00:00.000Z",
  },
  {
    slug: "pelatihan-kepemimpinan-mahasiswa",
    title: "Pelatihan Kepemimpinan Mahasiswa",
    summary: "Pelatihan kepemimpinan untuk pengurus organisasi mahasiswa.",
    category: { slug: "organisasi", name: "Organisasi" },
    author: { name: "Admin" },
    createdAt: "2025-11-26T00:00:00.000Z",
    content: expandSummary(
      "Pelatihan Kepemimpinan Mahasiswa",
      "Pelatihan kepemimpinan untuk pengurus organisasi mahasiswa berlangsung tiga hari.",
    ),
    readCount: 39,
    updatedAt: "2025-11-26T00:00:00.000Z",
  },
  {
    slug: "pengumuman-pendaftaran-laboratorium",
    title: "Pengumuman Pendaftaran Laboratorium",
    summary: "Pendaftaran asisten laboratorium semester genap dibuka.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-11-21T00:00:00.000Z",
    content: expandSummary(
      "Pengumuman Pendaftaran Laboratorium",
      "Pendaftaran asisten laboratorium semester genap dibuka bagi mahasiswa tingkat akhir.",
    ),
    readCount: 44,
    updatedAt: "2025-11-21T00:00:00.000Z",
  },
  {
    slug: "kegiatan-bakti-sosial-desa",
    title: "Kegiatan Bakti Sosial Desa",
    summary: "Bakti sosial mahasiswa dilaksanakan di desa binaan.",
    category: { slug: "lainnya", name: "Lainnya" },
    author: { name: "Admin" },
    createdAt: "2025-11-17T00:00:00.000Z",
    content: expandSummary(
      "Kegiatan Bakti Sosial Desa",
      "Bakti sosial mahasiswa dilaksanakan di desa binaan Universitas Muria Kudus.",
    ),
    readCount: 28,
    updatedAt: "2025-11-17T00:00:00.000Z",
  },
  {
    slug: "jadwal-praktikum-semester-genap",
    title: "Jadwal Praktikum Semester Genap",
    summary: "Jadwal praktikum tiap program studi sudah dirilis.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-11-13T00:00:00.000Z",
    content: expandSummary(
      "Jadwal Praktikum Semester Genap",
      "Jadwal praktikum tiap program studi sudah dirilis dan dapat dilihat di portal.",
    ),
    readCount: 61,
    updatedAt: "2025-11-13T00:00:00.000Z",
  },
  {
    slug: "kompetisi-debat-bahasa-indonesia",
    title: "Kompetisi Debat Bahasa Indonesia",
    summary: "Kompetisi debat antar fakultas memasuki tahap final.",
    category: { slug: "organisasi", name: "Organisasi" },
    author: { name: "Admin" },
    createdAt: "2025-11-09T00:00:00.000Z",
    content: expandSummary(
      "Kompetisi Debat Bahasa Indonesia",
      "Kompetisi debat antar fakultas memasuki tahap final pekan depan.",
    ),
    readCount: 35,
    updatedAt: "2025-11-09T00:00:00.000Z",
  },
  {
    slug: "panduan-penulisan-proposal-tugas-akhir",
    title: "Panduan Penulisan Proposal Tugas Akhir",
    summary: "Panduan terbaru penulisan proposal tugas akhir diterbitkan.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-11-05T00:00:00.000Z",
    content: expandSummary(
      "Panduan Penulisan Proposal Tugas Akhir",
      "Panduan terbaru penulisan proposal tugas akhir diterbitkan oleh direktorat kemahasiswaan.",
    ),
    readCount: 72,
    updatedAt: "2025-11-05T00:00:00.000Z",
  },
  {
    slug: "pameran-karya-seni-mahasiswa",
    title: "Pameran Karya Seni Mahasiswa",
    summary: "Pameran karya seni mahasiswa digelar selama satu pekan.",
    category: { slug: "lainnya", name: "Lainnya" },
    author: { name: "Admin" },
    createdAt: "2025-10-31T00:00:00.000Z",
    content: expandSummary(
      "Pameran Karya Seni Mahasiswa",
      "Pameran karya seni mahasiswa digelar selama satu pekan di gedung serbaguna.",
    ),
    readCount: 26,
    updatedAt: "2025-10-31T00:00:00.000Z",
  },
  {
    slug: "pengumuman-perpustakaan-digital",
    title: "Pengumuman Perpustakaan Digital",
    summary: "Akses perpustakaan digital kini dapat digunakan dari rumah.",
    category: { slug: "lainnya", name: "Lainnya" },
    author: { name: "Admin" },
    createdAt: "2025-10-27T00:00:00.000Z",
    content: expandSummary(
      "Pengumuman Perpustakaan Digital",
      "Akses perpustakaan digital kini dapat digunakan dari rumah menggunakan akun kampus.",
    ),
    readCount: 54,
    updatedAt: "2025-10-27T00:00:00.000Z",
  },
  {
    slug: "kalender-akademik-2026",
    title: "Kalender Akademik 2026",
    summary: "Kalender akademik tahun 2026 resmi diterbitkan.",
    category: { slug: "akademik", name: "Akademik" },
    author: { name: "Admin" },
    createdAt: "2025-10-22T00:00:00.000Z",
    content: expandSummary(
      "Kalender Akademik 2026",
      "Kalender akademik tahun 2026 resmi diterbitkan memuat libur dan jadwal perkuliahan.",
    ),
    readCount: 143,
    updatedAt: "2025-10-22T00:00:00.000Z",
  },
  {
    slug: "uji-markdown",
    title: "Uji Markdown",
    summary: "Uji menyeluruh pipeline markdown, dari teks inline hingga tabel dan diagram.",
    category: { slug: "lainnya", name: "Lainnya" },
    author: { name: "Admin" },
    createdAt: "2025-10-15T00:00:00.000Z",
    content: ujiContent,
    readCount: 42,
    updatedAt: "2025-10-15T00:00:00.000Z",
  },
];

export const user = {
  id: "1",
  name: "Admin",
  email: "admin@umk.ac.id",
  role: "ADMIN" as Role,
};

export function searchArticles(q?: string, category?: string, page = 1) {
  const term = (q ?? "").trim().toLowerCase();
  const matches = articles.filter((a) => {
    const categoryOk = !category || a.category.slug === category;
    const termOk =
      !term ||
      a.title.toLowerCase().includes(term) ||
      a.summary.toLowerCase().includes(term);
    return categoryOk && termOk;
  });

  const total = matches.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  return {
    data: matches.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    pagination: {
      page: currentPage,
      perPage: PER_PAGE,
      total,
      totalPages,
    } satisfies Pagination,
  };
}

export function findArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
