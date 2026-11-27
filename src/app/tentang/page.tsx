import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { articles, categories } from "@/lib/data";

export default function TentangPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 pt-12 pb-24 lg:px-[120px]">
        <h1 className="text-[24px] font-bold leading-[29px]">Tentang Wiki UMK</h1>
        <p className="mt-3 text-[13px] leading-4 text-muted">
          Platform arsip pengetahuan dan informasi akademik mahasiswa Universitas Muria Kudus.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="liquid-glass rounded-[14px] p-6">
              <h2 className="text-[15px] font-bold leading-[18px] text-ink">
                Apa itu Wiki UMK?
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-muted">
                Wiki UMK adalah pusat dokumentasi dan informasi kampus yang dirancang untuk
                memudahkan mahasiswa Universitas Muria Kudus menemukan pengumuman akademik,
                jadwal penting, informasi beasiswa, panduan tugas akhir, serta agenda kegiatan
                organisasi kemahasiswaan dalam satu tempat yang rapi dan mudah dicari.
              </p>
            </section>

            <section className="liquid-glass rounded-[14px] p-6">
              <h2 className="text-[15px] font-bold leading-[18px] text-ink">
                Ruang Lingkup Informasi
              </h2>
              <ul className="mt-3 space-y-2.5 text-[13px] leading-5 text-muted">
                <li>
                  <span className="font-medium text-ink">Akademik:</span> kalender akademik,
                  jadwal UTS/UAS, beasiswa, KKN, dan panduan penulisan ilmiah.
                </li>
                <li>
                  <span className="font-medium text-ink">Organisasi:</span> kegiatan UKM,
                  lomba mahasiswa, seminar, dan pelatihan kepemimpinan.
                </li>
                <li>
                  <span className="font-medium text-ink">Lainnya:</span> pengumuman fasilitas
                  kampus, perpustakaan digital, dan informasi umum mahasiswa.
                </li>
              </ul>
            </section>

            <section className="liquid-glass rounded-[14px] p-6">
              <h2 className="text-[15px] font-bold leading-[18px] text-ink">
                Pengelolaan Konten
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-muted">
                Seluruh artikel ditulis dalam format Markdown agar struktur panduan, daftar
                ketentuan, dan tautan rujukan tetap konsisten serta nyaman dibaca di perangkat
                desktop maupun seluler.
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="liquid-glass rounded-[14px] p-6">
              <h2 className="text-[15px] font-bold leading-[18px] text-ink">
                Ringkasan Arsip
              </h2>
              <dl className="mt-4 space-y-3 text-[13px]">
                <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
                  <dt className="text-muted">Total Artikel</dt>
                  <dd className="font-medium text-ink">{articles.length}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
                  <dt className="text-muted">Kategori Aktif</dt>
                  <dd className="font-medium text-ink">{categories.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Institusi</dt>
                  <dd className="font-medium text-ink">UMK</dd>
                </div>
              </dl>
            </section>

            <section className="liquid-glass rounded-[14px] p-6">
              <h2 className="text-[15px] font-bold leading-[18px] text-ink">
                Tautan Cepat
              </h2>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href="/beranda"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-dark px-4 text-[13px] text-paper transition-opacity hover:opacity-90"
                >
                  Jelajahi Artikel
                </Link>
                <Link
                  href="/kategori"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-chrome px-4 text-[13px] text-ink transition-colors hover:bg-fill"
                >
                  Lihat Semua Kategori
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-paper px-4 text-[13px] text-ink transition-colors hover:bg-chrome"
                >
                  Masuk Akun
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
