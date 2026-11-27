import Link from "next/link";
import CategoryChip from "@/components/CategoryChip";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { articles, categories } from "@/lib/data";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  akademik:
    "Jadwal perkuliahan, ujian, kalender akademik, beasiswa, KKN, serta panduan skripsi dan tugas akhir.",
  organisasi:
    "Informasi kegiatan UKM, BEM, himpunan mahasiswa, lomba, seminar, dan pelatihan kepemimpinan.",
  lainnya:
    "Pengumuman fasilitas kampus, perpustakaan digital, karya seni mahasiswa, dan info umum lainnya.",
};

export default function KategoriPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 pt-12 pb-24 lg:px-[120px]">
        <h1 className="text-[24px] font-bold leading-[29px]">Kategori Artikel</h1>
        <p className="mt-3 text-[13px] leading-4 text-muted">
          Telusuri informasi akademik dan kegiatan mahasiswa Universitas Muria Kudus berdasarkan topik.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <CategoryChip href="/beranda" active={false}>
            Semua {articles.length}
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c.slug} href={`/beranda?category=${c.slug}`}>
              {c.name} {c.articleCount}
            </CategoryChip>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const latest = articles
              .filter((a) => a.category.slug === c.slug)
              .slice(0, 3);

            return (
              <section
                key={c.slug}
                className="liquid-glass flex flex-col justify-between rounded-[14px] p-6 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[18px] font-bold leading-[22px] text-ink">
                      {c.name}
                    </h2>
                    <span className="rounded-md border border-line bg-chrome px-2.5 py-0.5 text-[12px] text-muted">
                      {c.articleCount} artikel
                    </span>
                  </div>

                  <p className="mt-3 text-[13px] leading-5 text-muted">
                    {CATEGORY_DESCRIPTIONS[c.slug] ??
                      `Kumpulan artikel dalam kategori ${c.name}.`}
                  </p>

                  {latest.length > 0 && (
                    <div className="mt-5 border-t border-line pt-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                        Terbaru di {c.name}
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {latest.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/artikel/${item.slug}`}
                              className="line-clamp-1 text-[13px] text-ink hover:underline"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Link
                  href={`/beranda?category=${c.slug}`}
                  className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-md bg-dark px-4 text-[13px] text-paper transition-opacity hover:opacity-90"
                >
                  Lihat artikel {c.name}
                </Link>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
