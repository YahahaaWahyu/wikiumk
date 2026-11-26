import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import AdminDeleteButton from "@/app/admin/AdminDeleteButton";
import { searchArticles, categories } from "@/lib/data";

// searchParams menentukan isi tabel, jadi route ini wajib dirender per-request.
export const instant = false;

type Params = { [key: string]: string | string[] | undefined };

const selectClass = "h-10 rounded-md border border-line bg-paper px-3 text-[13px]";
const rowButtonClass =
  "inline-flex h-8 items-center justify-center rounded-md px-3 text-[13px]";

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function Admin({ searchParams }: { searchParams: Promise<Params> }) {
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
    return qs ? `/admin?${qs}` : "/admin";
  };

  return (
    <>
      <Navbar variant="admin" />
      <main className="px-4 pt-12 pb-16 lg:px-[120px]">
        <h1 className="text-[24px] font-bold leading-[29px]">Kelola artikel</h1>
        <p className="mt-3 text-[13px] leading-4 text-muted">
          Tambah, ubah, dan hapus artikel wiki.
        </p>

        <form method="get" action="/admin" className="mt-5 flex items-center gap-[13px]">
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={100}
            aria-label="Cari artikel"
            placeholder="Cari artikel..."
            className={`${selectClass} w-full max-w-[320px]`}
          />
          <select
            name="category"
            defaultValue={selectedCategory}
            aria-label="Saring kategori"
            className={`${selectClass} w-[160px]`}
          >
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <Link
            href="/admin/artikel/baru"
            className="ml-auto inline-flex h-10 min-w-[140px] items-center justify-center rounded-md bg-dark px-6 text-[13px] text-paper"
          >
            Artikel baru
          </Link>
        </form>

        {data.length === 0 ? (
          <p className="mt-[18px] text-[13px] text-muted">Tidak ada hasil.</p>
        ) : (
          <table className="mt-[18px] w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr className="bg-chrome">
                <th className="w-[536px] border-b border-line px-4 text-left font-normal">
                  Judul
                </th>
                <th className="w-[154px] border-b border-line px-4 text-left font-normal">
                  Kategori
                </th>
                <th className="w-[200px] border-b border-line px-4 text-left font-normal">
                  Penulis
                </th>
                <th className="w-[135px] border-b border-line px-4 text-left font-normal">
                  Dibuat
                </th>
                <th className="w-[175px] border-b border-line px-4 text-left font-normal">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((article) => (
                <tr key={article.slug} className="border-b border-line">
                  <td className="h-[56px] px-4 align-middle">
                    <Link href={`/artikel/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </td>
                  <td className="h-[56px] px-4 align-middle text-muted">
                    {article.category.name}
                  </td>
                  <td className="h-[56px] px-4 align-middle text-muted">{article.author.name}</td>
                  <td className="h-[56px] px-4 align-middle text-muted">
                    {shortDate(article.createdAt)}
                  </td>
                  <td className="h-[56px] px-4 align-middle">
                    <span className="flex items-center gap-[6px]">
                      <Link
                        href={`/admin/artikel/${article.slug}/ubah`}
                        className={`${rowButtonClass} border border-line bg-chrome`}
                      >
                        Ubah
                      </Link>
                      <AdminDeleteButton slug={article.slug} title={article.title} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-10">
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
