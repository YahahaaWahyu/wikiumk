import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import CategoryChip from "@/components/CategoryChip";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import Reveal from "@/components/Reveal";
import Ribbon3DBackground from "@/components/Ribbon3DBackground";
import ScrollMotionBlur from "@/components/ScrollMotionBlur";
import { articles, searchArticles, categories } from "@/lib/data";

// searchParams menentukan isi halaman, jadi route ini wajib dirender per-request.
export const instant = false;

type Params = { [key: string]: string | string[] | undefined };

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  akademik:
    "Jadwal perkuliahan, ujian, kalender akademik, beasiswa, KKN, serta panduan skripsi dan tugas akhir.",
  organisasi:
    "Informasi kegiatan UKM, BEM, himpunan mahasiswa, lomba, seminar, dan pelatihan kepemimpinan.",
  lainnya:
    "Pengumuman fasilitas kampus, perpustakaan digital, karya seni mahasiswa, dan info umum lainnya.",
};

export default async function Beranda({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const selectedCategory = typeof sp.category === "string" ? sp.category : "";
  const rawPage = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 1 ? rawPage : 1;

  const { data, pagination } = searchArticles(q, selectedCategory, page, 21);

  const buildLink = (target: number, categorySlug?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categorySlug) params.set("category", categorySlug);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/beranda?${qs}` : "/beranda";
  };

  return (
    <>
      <Navbar />
      <main className="relative px-4 pb-24 lg:px-[120px]">
        {/* Panel tengah lebih lebar dari konten (margin 88px vs konten 120px) dengan fill lebih tipis dari Navbar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-2 right-2 z-0 border-x border-line/40 bg-paper/45 backdrop-blur-sm lg:left-[88px] lg:right-[88px]"
        />

        {/* Bagian 1: Artikel Wiki — background 3D Twisted Ribbon */}
        <section className="relative -mx-4 overflow-x-clip px-4 pt-12 pb-16 lg:-mx-[120px] lg:px-[120px]">
          <Ribbon3DBackground />
          <ScrollMotionBlur>
          <div className="relative z-10">
            <Reveal>
              <h1 className="text-[24px] font-bold leading-[29px]">Artikel Wiki</h1>
              <p className="mt-3 text-[13px] leading-4 text-muted">
                Informasi akademik dan kegiatan mahasiswa Universitas Muria Kudus.
              </p>
            </Reveal>

            <div className="mt-7 flex flex-wrap gap-3">
              <CategoryChip href={buildLink(1)} active={!selectedCategory}>
                Semua
              </CategoryChip>
              {categories.map((c) => (
                <CategoryChip
                  key={c.slug}
                  href={buildLink(1, c.slug)}
                  active={selectedCategory === c.slug}
                >
                  {c.name} {c.articleCount}
                </CategoryChip>
              ))}
            </div>

            {data.length === 0 ? (
              <p className="mt-[60px] text-[13px] text-muted">Tidak ada hasil.</p>
            ) : (
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((article, idx) => (
                  <Reveal key={article.slug} delayMs={(idx % 3) * 75}>
                    <ArticleCard article={article} />
                  </Reveal>
                ))}
              </div>
            )}

            <div className="mt-20">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                buildHref={(n) => buildLink(n, selectedCategory || undefined)}
              />
            </div>
          </div>
          </ScrollMotionBlur>
        </section>

        {/* Bagian 2: Kategori — background partikel titik */}
        <section
          id="kategori"
          className="relative isolate -mx-4 mt-8 scroll-mt-24 overflow-hidden border-t border-line/60 px-4 pt-16 pb-20 lg:-mx-[120px] lg:px-[120px]"
        >
          <ParticleBackground />
          <ScrollMotionBlur>
          <div className="relative z-10">
            <Reveal>
              <h2 className="text-[24px] font-bold leading-[29px]">Kategori Artikel</h2>
              <p className="mt-3 text-[13px] leading-4 text-muted">
                Telusuri informasi akademik dan kegiatan mahasiswa Universitas Muria Kudus berdasarkan topik.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, idx) => {
                const latest = articles
                  .filter((a) => a.category.slug === c.slug)
                  .slice(0, 3);

                return (
                  <Reveal key={c.slug} delayMs={idx * 90}>
                    <article
                      className="liquid-glass flex h-full flex-col justify-between rounded-[14px] p-6 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[18px] font-bold leading-[22px] text-ink">
                        {c.name}
                      </h3>
                      <span className="rounded-md border border-line bg-chrome px-2.5 py-0.5 text-[12px] text-muted">
                        {c.articleCount} artikel
                      </span>
                    </div>

                    <p className="mt-3 text-[13px] leading-5 text-muted">
                      {CATEGORY_DESCRIPTIONS[c.slug] ??
                        `Kumpulan artikel dalam kategori ${c.name}.`}
                    </p>

                    {latest.length > 0 && (
                      <div className="mt-5 border-t border-line/60 pt-4">
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
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
          </ScrollMotionBlur>
        </section>

        {/* Bagian 3: Tentang Wiki UMK — background partikel titik */}
        <section
          id="tentang"
          className="relative isolate -mx-4 mt-8 scroll-mt-24 overflow-hidden border-t border-line/60 px-4 pt-16 pb-12 lg:-mx-[120px] lg:px-[120px]"
        >
          <ParticleBackground />
          <ScrollMotionBlur>
          <div className="relative z-10">
            <Reveal>
              <h2 className="text-[24px] font-bold leading-[29px]">Tentang Wiki UMK</h2>
              <p className="mt-3 text-[13px] leading-4 text-muted">
                Platform arsip pengetahuan dan informasi akademik mahasiswa Universitas Muria Kudus.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Reveal delayMs={60}>
                  <div className="liquid-glass rounded-[14px] p-6">
                  <h3 className="text-[15px] font-bold leading-[18px] text-ink">
                    Apa itu Wiki UMK?
                  </h3>
                  <p className="mt-3 text-[13px] leading-6 text-muted">
                    Wiki UMK adalah pusat dokumentasi dan informasi kampus yang dirancang untuk
                    memudahkan mahasiswa Universitas Muria Kudus menemukan pengumuman akademik,
                    jadwal penting, informasi beasiswa, panduan tugas akhir, serta agenda kegiatan
                    organisasi kemahasiswaan dalam satu tempat yang rapi dan mudah dicari.
                  </p>
                  </div>
                </Reveal>

                <Reveal delayMs={140}>
                  <div className="liquid-glass rounded-[14px] p-6">
                  <h3 className="text-[15px] font-bold leading-[18px] text-ink">
                    Ruang Lingkup Informasi
                  </h3>
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
                  </div>
                </Reveal>

                <Reveal delayMs={220}>
                  <div className="liquid-glass rounded-[14px] p-6">
                  <h3 className="text-[15px] font-bold leading-[18px] text-ink">
                    Pengelolaan Konten
                  </h3>
                  <p className="mt-3 text-[13px] leading-6 text-muted">
                    Seluruh artikel ditulis dalam format Markdown agar struktur panduan, daftar
                    ketentuan, dan tautan rujukan tetap konsisten serta nyaman dibaca di perangkat
                    desktop maupun seluler.
                  </p>
                  </div>
                </Reveal>
              </div>

              <aside className="space-y-6">
                <Reveal delayMs={100}>
                  <div className="liquid-glass rounded-[14px] p-6">
                  <h3 className="text-[15px] font-bold leading-[18px] text-ink">
                    Ringkasan Arsip
                  </h3>
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
                  </div>
                </Reveal>

                <Reveal delayMs={180}>
                  <div className="liquid-glass rounded-[14px] p-6">
                  <h3 className="text-[15px] font-bold leading-[18px] text-ink">
                    Tautan Cepat
                  </h3>
                  <div className="mt-4 flex flex-col gap-2.5">
                    <Link
                      href="/beranda"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-dark px-4 text-[13px] text-paper transition-opacity hover:opacity-90"
                    >
                      Semua Artikel
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-chrome px-4 text-[13px] text-ink transition-colors hover:bg-fill"
                    >
                      Masuk Akun
                    </Link>
                  </div>
                  </div>
                </Reveal>
              </aside>
            </div>
          </div>
          </ScrollMotionBlur>
        </section>
      </main>
      <Footer />
    </>
  );
}
