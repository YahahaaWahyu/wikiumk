import Link from "next/link";

export default function CategoryChip({
  href,
  active = false,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={[
        "inline-flex h-7 items-center rounded-full px-[14px] text-[13px]",
        active ? "bg-dark text-paper" : "border border-line bg-chrome text-ink",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
