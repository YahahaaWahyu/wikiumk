import Link from "next/link";
import type { ArticleSummary } from "@/lib/data";
import { formatDate } from "@/lib/data";

export default function ArticleCard({
  article,
}: {
  article: ArticleSummary & { readCount?: number };
}) {
  return (
    <article className="flex flex-col">
      <span className="w-fit rounded-[10px] bg-chrome px-[10px] py-[3px] text-[11px] leading-[14px] text-muted">
        {article.category.name}
      </span>

      <h2 className="mt-3 text-[15px] font-bold leading-[18px]">
        <Link href={`/artikel/${article.slug}`} className="hover:underline">
          {article.title}
        </Link>
      </h2>

      <p className="mt-[30px] line-clamp-3 text-[13px] leading-4 text-muted">
        {article.summary}
      </p>

      <p className="mt-[27px] flex items-baseline justify-between text-[11px] leading-[13px] text-muted">
        <span>
          {article.author.name} - {formatDate(article.createdAt)}
        </span>
        {typeof article.readCount === "number" && <span>{article.readCount} dibaca</span>}
      </p>
    </article>
  );
}
