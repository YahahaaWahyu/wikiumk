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
  { slug: "lainnya", name: "Lainnya", articleCount: 3 },
];

const sampleContent = `## Latar belakang

Pengumuman ini berlaku untuk seluruh mahasiswa Universitas Muria Kudus pada semester berjalan. Mahasiswa diminta membaca ketentuan di bawah ini sebelum mengirimkan berkas.

## Ketentuan

- Berkas dikumpulkan melalui fakultas masing-masing paling lambat batas waktu yang ditentukan.
- Format berkas mengikuti pedoman penulisan universitas.
- Pertanyaan dapat disampaikan kepada panitia melalui kontak resmi.

Mahasiswa yang tidak memenuhi ketentuan akan diproses pada periode berikutnya.`;

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
