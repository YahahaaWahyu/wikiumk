"use client";

import Link from "next/link";
import Field, { inputClass } from "@/components/Field";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Register() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 justify-center px-4 py-12 sm:py-[98px]">
        <div className="w-full max-w-[420px] rounded-[10px] border border-line bg-paper p-6">
          <h1 className="text-[18px] font-bold leading-[22px]">Daftar akun</h1>
          <p className="mt-[9px] text-[13px] leading-4 text-muted">
            Buat akun untuk mengikuti kegiatan mahasiswa.
          </p>

          {/* Pilihan statis: form hanya ditampilkan, tidak ada backend yang dipanggil. */}
          <form className="mt-7" onSubmit={(e) => e.preventDefault()}>
            <Field htmlFor="name" label="Nama" counter={<span className="text-[13px] text-muted">1-100</span>}>
              <input
                id="name"
                name="name"
                autoComplete="name"
                maxLength={100}
                placeholder="Nama lengkap"
                className={inputClass}
              />
            </Field>

            <div className="mt-[22px]">
              <Field htmlFor="email" label="Email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder="nama@std.umk.ac.id"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-[22px]">
              <Field
                htmlFor="password"
                label="Password"
                counter={<span className="text-[13px] text-muted">8-72 karakter</span>}
              >
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  placeholder="********"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-[22px]">
              <Field htmlFor="confirmPassword" label="Ulangi password">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="********"
                  className={inputClass}
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-[27px] h-10 w-full rounded-md bg-dark text-[13px] text-paper"
            >
              Daftar
            </button>
          </form>

          <p className="mt-[25px] text-center text-[13px] leading-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="underline-offset-2 hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
