"use client";

import Link from "next/link";
import Field, { inputClass } from "@/components/Field";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Login() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 justify-center px-4 py-12 sm:py-[98px]">
        <div className="w-full max-w-[420px] rounded-[10px] border border-line bg-paper p-6">
          <h1 className="text-[18px] font-bold leading-[22px]">Masuk</h1>
          <p className="mt-[9px] text-[13px] leading-4 text-muted">
            Gunakan akun yang sudah terdaftar.
          </p>

          {/* Pilihan statis: form hanya ditampilkan, tidak ada backend yang dipanggil. */}
          <form className="mt-7" onSubmit={(e) => e.preventDefault()}>
            <Field htmlFor="email" label="Email">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@std.umk.ac.id"
                className={inputClass}
              />
            </Field>

            <div className="mt-[22px]">
              <Field htmlFor="password" label="Password">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                  className={inputClass}
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-[27px] h-10 w-full rounded-md bg-dark text-[13px] text-paper"
            >
              Masuk
            </button>
          </form>

          <p className="mt-[25px] text-center text-[13px] leading-4">
            Belum punya akun?{" "}
            <Link href="/register" className="underline-offset-2 hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
