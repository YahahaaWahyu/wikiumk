import Link from "next/link";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/#kategori", label: "Kategori" },
  { href: "/#tentang", label: "Tentang" },
];

export default function Footer() {
  return (
    <footer
      id="tentang"
      className="mt-auto border-t border-line bg-chrome px-4 py-[34px] pb-[17px] lg:px-[120px]"
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <p className="text-[15px] font-bold">Wiki UMK</p>
          <p className="mt-[9px] text-[13px] text-muted">
            Platform informasi akademik mahasiswa Universitas Muria Kudus.
          </p>
          <p className="mt-[33px] text-[11px] text-muted">2026 Wiki UMK</p>
        </div>

        <nav className="flex flex-col gap-[13px] text-[13px] lg:w-[360px]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="w-fit">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
