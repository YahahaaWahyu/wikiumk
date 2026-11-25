"use client";

import Link from "next/link";
import { useState } from "react";

const GUEST_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/#kategori", label: "Kategori" },
  { href: "/#tentang", label: "Tentang" },
];

const ADMIN_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/admin", label: "Kelola artikel" },
];

const searchClass =
  "h-8 w-full rounded-md border border-line bg-paper px-4 text-[13px] placeholder:text-muted";

export default function Navbar({ variant = "guest" }: { variant?: "guest" | "admin" }) {
  const [open, setOpen] = useState(false);
  const links = variant === "admin" ? ADMIN_LINKS : GUEST_LINKS;
  const action = variant === "admin" ? "/admin" : "/";

  return (
    <header className="shrink-0 border-b border-line bg-paper">
      <div className="flex h-16 items-center px-4 lg:px-[120px]">
        <Link href="/" className="flex items-center gap-3 lg:w-[300px] lg:shrink-0">
          <span className="h-7 w-7 shrink-0 rounded-md bg-dark" aria-hidden />
          <span className="text-[15px] font-bold">Wiki UMK</span>
        </Link>

        <nav className="ml-12 hidden items-center gap-12 text-[13px] lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        {variant === "admin" ? (
          <div className="ml-auto hidden items-center lg:flex">
            <form method="get" action={action} className="w-[300px]">
              <input name="q" aria-label="Cari artikel" placeholder="Cari artikel..." className={searchClass} />
            </form>
            <div className="ml-[63px] flex items-center gap-[13px]">
              <span className="h-8 w-8 rounded-md bg-fill" aria-hidden />
              <span className="text-[13px]">Admin</span>
            </div>
            <button
              type="button"
              className="ml-[28px] h-8 w-16 rounded-md border border-line bg-chrome text-[13px]"
            >
              Keluar
            </button>
          </div>
        ) : (
          <div className="ml-auto hidden items-center lg:flex">
            <form method="get" action={action} className="w-[360px]">
              <input name="q" aria-label="Cari artikel" placeholder="Cari artikel..." className={searchClass} />
            </form>
            <Link
              href="/login"
              className="ml-[84px] flex h-8 w-24 items-center justify-center rounded-md bg-dark text-[13px] text-paper"
            >
              Masuk
            </Link>
          </div>
        )}

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((o) => !o)}
          className="ml-auto flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md border border-line lg:hidden"
        >
          <span className="h-px w-4 bg-ink" />
          <span className="h-px w-4 bg-ink" />
          <span className="h-px w-4 bg-ink" />
        </button>
      </div>

      {open && (
        <div className="border-t border-line px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-4 text-[13px]">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {variant !== "admin" && (
              <Link href="/login" onClick={() => setOpen(false)}>
                Masuk
              </Link>
            )}
          </nav>
          <form method="get" action={action} className="mt-4">
            <input
              name="q"
              aria-label="Cari artikel"
              placeholder="Cari artikel..."
              className={`${searchClass} h-10`}
            />
          </form>
        </div>
      )}
    </header>
  );
}
