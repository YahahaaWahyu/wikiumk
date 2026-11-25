import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFoundPage({ message }: { message: string }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p aria-hidden className="text-[32px] font-bold leading-none text-fill">
          404
        </p>
        <h1 className="mt-6 text-[24px] font-bold">{message}</h1>
        <Link
          href="/"
          className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-dark px-6 text-[13px] text-paper"
        >
          Ke beranda
        </Link>
      </main>
      <Footer />
    </>
  );
}
