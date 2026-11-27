"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Field, { inputClass } from "@/components/Field";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    setPending(true);
    const { error } = await authClient.signIn.email({ email, password });
    setPending(false);
    if (error) {
      setError(error.message ?? "Email atau password salah.");
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 justify-center px-4 py-[98px]">
        <div className="w-full max-w-[420px] rounded-[10px] border border-line bg-paper p-6">
          <h1 className="text-[18px] font-bold leading-[22px]">Masuk</h1>
          <p className="mt-[9px] text-[13px] leading-4 text-muted">
            Gunakan akun yang sudah terdaftar.
          </p>

          <form className="mt-7" onSubmit={onSubmit}>
            <Field htmlFor="email" label="Email">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
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
              {pending ? "Masuk..." : "Masuk"}
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
