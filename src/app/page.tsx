import ArticleCard from "@/components/ArticleCard";
import CategoryChip from "@/components/CategoryChip";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { searchArticles, categories } from "@/lib/data";

// searchParams menentukan isi halaman, jadi route ini wajib dirender per-request.
export const instant = false;

type Params = { [key: string]: string | string[] | undefined };

export default async function Home({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const selectedCategory = typeof sp.category === "string" ? sp.category : "";
  const rawPage = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 1 ? rawPage : 1;

  const { data, pagination } = searchArticles(q, selectedCategory, page);

  const buildLink = (target: number, categorySlug?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categorySlug) params.set("category", categorySlug);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <>
      <Navbar />
      <main className="px-4 pt-12 lg:px-[120px]">
        <h1 className="text-[24px] font-bold leading-[29px]">Artikel Wiki</h1>
        <p className="mt-3 text-[13px] leading-4 text-muted">
          Informasi akademik dan kegiatan mahasiswa Universitas Muria Kudus.
        </p>

        <form method="get" action="/" className="mt-[30px]">
          <div className="relative w-full max-w-[400px]">
            <input
              type="search"
              name="q"
              defaultValue={q}
              maxLength={100}
              aria-label="Cari artikel"
              placeholder="Cari artikel..."
              className="h-10 w-full rounded-md border border-line bg-paper pl-[14px] pr-[100px] text-[13px] placeholder:text-muted"
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 h-7 w-20 rounded-md bg-dark text-[13px] text-paper"
            >
              Cari
            </button>
          </div>
        </form>

        <div id="kategori" className="mt-7 flex flex-wrap gap-3">
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
          <div className="mt-10 grid grid-cols-1 gap-x-[78px] gap-y-8 sm:mt-[60px] sm:gap-y-[72px] md:grid-cols-2 lg:grid-cols-3">
            {data.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        <div className="mt-24 pb-24">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            buildHref={(n) => buildLink(n, selectedCategory || undefined)}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
