import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { mdxComponents } from "@/components/mdx";
import { articles, findArticle, formatDate } from "@/lib/data";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const wasUpdated = article.updatedAt !== article.createdAt;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[800px] px-4 pt-12 lg:px-0">
        <nav aria-label="Breadcrumb" className="text-[13px] leading-4 text-muted">
          <Link href="/" className="hover:underline">
            Beranda
          </Link>
          {" / "}
          <Link href={`/?category=${article.category.slug}`} className="hover:underline">
            {article.category.name}
          </Link>
          {" / "}
          <span>{article.title}</span>
        </nav>

        <h1 className="mt-3 text-[24px] font-bold leading-[29px] lg:text-[32px] lg:leading-[39px]">
          {article.title}
        </h1>

        <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] leading-4 text-muted">
          <span>{article.author.name}</span>
          <span>- {formatDate(article.createdAt)}</span>
          <span>- {article.readCount} dibaca</span>
        </p>

        <span className="mt-4 inline-block rounded-[10px] bg-chrome px-[10px] py-[3px] text-[11px] leading-[14px] text-muted">
          {article.category.name}
        </span>

        <hr className="mt-6 border-line" />

        {/* break-words: warisan overflow-wrap supaya token panjang tanpa spasi
            (tautan, id, kata uji) patah di kolom, bukan menembus keluar. */}
        <div className="mt-[34px] text-[15px] leading-[26px] break-words">
          <MDXRemote
            source={article.content}
            components={mdxComponents}
            options={{
              blockJS: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypePrettyCode,
                    {
                      theme: "github-light",
                      keepBackground: false,
                      // Fallback bahasa agar fence tanpa bahasa ikut diproses menjadi
                      // <figure>; tanpa ini plugin melewatkannya (if (!lang) return) dan
                      // kodenya jatuh ke gaya inline code. Bentuk objek dipakai agar
                      // inline code tetap memakai default (""), bukan "plaintext".
                      defaultLang: { block: "plaintext" },
                    },
                  ],
                  rehypeKatex,
                ],
              },
            }}
          />
        </div>

        {wasUpdated && (
          <p className="mt-10 text-[11px] leading-[13px] text-muted">
            Diperbarui {formatDate(article.updatedAt)}
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
