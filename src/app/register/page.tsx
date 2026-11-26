"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Field, { inputClass } from "@/components/Field";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Password dan ulangan password tidak sama.");
      return;
    }

    setPending(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setPending(false);
    if (error) {
      setError(error.message ?? "Pendaftaran gagal. Coba lagi.");
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 justify-center px-4 py-[98px]">
        <div className="w-full max-w-[420px] rounded-[10px] border border-line bg-paper p-6">
          <h1 className="text-[18px] font-bold leading-[22px]">Daftar akun</h1>
          <p className="mt-[9px] text-[13px] leading-4 text-muted">
            Buat akun untuk mengikuti kegiatan mahasiswa.
          </p>

          <form className="mt-7" onSubmit={onSubmit}>
            <Field htmlFor="name" label="Nama" counter={<span className="text-[13px] text-muted">1-100</span>}>
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
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
                  required
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
                  required
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
                  required
                  placeholder="********"
                  className={inputClass}
                />
              </Field>
            </div>

            {error && (
              <p className="mt-4 text-[13px] leading-4 text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-[27px] h-10 w-full rounded-md bg-dark text-[13px] text-paper disabled:opacity-60"
            >
              {pending ? "Mendaftar..." : "Daftar"}
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
