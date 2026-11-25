import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleForm from "@/components/ArticleForm";
import { articles, findArticle } from "@/lib/data";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function EditArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Navbar variant="admin" />
      <main className="px-4 pt-12 pb-10 lg:px-[120px]">
        <div className="max-w-[800px]">
          <ArticleForm mode="edit" article={article} />
        </div>
      </main>
      <Footer />
    </>
  );
}
