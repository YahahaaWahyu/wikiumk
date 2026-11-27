import Link from "next/link";
import type { ArticleSummary } from "@/lib/data";
import { formatDate } from "@/lib/data";

export default function ArticleCard({
  article,
}: {
  article: ArticleSummary & { readCount?: number };
}) {
  return (
    <article className="liquid-glass flex flex-col rounded-[14px] p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <span className="w-fit rounded-[10px] border border-line/60 bg-chrome/70 px-[10px] py-[3px] text-[11px] leading-[14px] text-muted">
        {article.category.name}
      </span>

      <h2 className="mt-3 text-[15px] font-bold leading-[18px]">
        <Link href={`/artikel/${article.slug}`} className="hover:underline">
          {article.title}
        </Link>
      </h2>

      <p className="mt-4 flex-1 line-clamp-3 text-[13px] leading-5 text-muted">
        {article.summary}
      </p>

      <p className="mt-6 flex items-baseline justify-between border-t border-line/50 pt-3 text-[11px] leading-[13px] text-muted">
        <span>
          {article.author.name} - {formatDate(article.createdAt)}
        </span>
        {typeof article.readCount === "number" && <span>{article.readCount} dibaca</span>}
      </p>
    </article>
  );
}
