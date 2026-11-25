import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Halaman" className="flex items-center justify-center gap-2">
      <PageLink
        enabled={page > 1}
        href={page > 1 ? buildHref(shiftPage(page, -1)) : undefined}
        label="Halaman sebelumnya"
      >
        ‹
      </PageLink>

      {numbers.map((n) => (
        <PageLink
          key={n}
          enabled
          href={buildHref(n)}
          label={`Halaman ${n}`}
          current={n === page}
        >
          {n}
        </PageLink>
      ))}

      <PageLink
        enabled={page < totalPages}
        href={page < totalPages ? buildHref(shiftPage(page, 1)) : undefined}
        label="Halaman berikutnya"
      >
        ›
      </PageLink>
    </nav>
  );
}

function shiftPage(page: number, delta: number) {
  return Math.max(1, page + delta);
}

function PageLink({
  href,
  enabled,
  current,
  label,
  children,
}: {
  href?: string;
  enabled: boolean;
  current?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const classes = [
    "flex h-8 w-8 items-center justify-center rounded-md border text-[13px]",
    current
      ? "border-dark bg-dark text-paper"
      : enabled
        ? "border-line bg-paper text-ink"
        : "border-line bg-paper text-fill",
  ].join(" ");

  if (!enabled || !href) {
    return (
      <span aria-disabled="true" className={classes}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} aria-current={current ? "page" : undefined} className={classes}>
      {children}
    </Link>
  );
}
