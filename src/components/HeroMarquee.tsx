import Link from "next/link";
import { articles, formatDate } from "@/lib/data";

function MarqueeCard({ article }: { article: (typeof articles)[number] }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="block w-[270px] shrink-0 rounded-xl border border-white/15 bg-zinc-900/85 p-4 text-left backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-zinc-800/90"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-zinc-200">
          {article.category.name}
        </span>
        <span className="text-[11px] text-zinc-400">{article.readCount} dibaca</span>
      </div>
      <h3 className="mt-2.5 line-clamp-2 text-[14px] font-semibold leading-snug text-white">
        {article.title}
      </h3>
      <p className="mt-2 text-[11px] text-zinc-400">
        {article.author.name} · {formatDate(article.createdAt)}
      </p>
    </Link>
  );
}

export default function HeroMarquee() {
  const col1 = articles.slice(0, 6);
  const col2 = articles.slice(6, 12);
  const col3 = articles.slice(12, 18);
  const col4 = articles.slice(18, 24);

  const columns = [
    { items: col1, direction: "animate-marquee-up" },
    { items: col2, direction: "animate-marquee-down" },
    { items: col3, direction: "animate-marquee-up" },
    { items: col4, direction: "animate-marquee-down" },
  ];

  return (
    <section className="relative overflow-hidden border-b border-line bg-zinc-950 text-white">
      {/* Tilted infinite marquee background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-75"
      >
        <div className="flex -rotate-12 scale-110 gap-4">
          {columns.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <div className={`flex flex-col gap-4 ${col.direction}`}>
                {[...col.items, ...col.items].map((article, i) => (
                  <MarqueeCard key={`${article.slug}-${i}`} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlay agar teks hero terbaca jelas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/35"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/60"
      />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-4 py-14 lg:px-[120px] lg:py-20">
        <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-200 uppercase backdrop-blur-sm">
          Wiki UMK · Arsip Pengetahuan
        </span>

        <h1 className="mt-4 max-w-xl text-[32px] font-bold leading-tight tracking-tight text-white sm:text-[44px]">
          watashinowexperimento
        </h1>

        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-zinc-300">
          Kumpulan artikel terbaru, panduan akademik, dan informasi kegiatan mahasiswa Universitas Muria Kudus.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="/beranda"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-[13px] font-semibold text-zinc-950 transition-opacity hover:opacity-90"
          >
            Jelajahi Artikel
          </a>
          <Link
            href="/artikel/beasiswa-ppm-2026"
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/25 bg-white/10 px-5 text-[13px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Artikel Terbaru →
          </Link>
        </div>
      </div>
    </section>
  );
}
