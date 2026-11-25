import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleForm from "@/components/ArticleForm";

export const metadata = { title: "Buat artikel baru | Wiki UMK" };

export default function NewArticle() {
  return (
    <>
      <Navbar variant="admin" />
      <main className="px-4 pt-12 pb-10 lg:px-[120px]">
        <div className="max-w-[800px]">
          <ArticleForm mode="new" />
        </div>
      </main>
      <Footer />
    </>
  );
}
