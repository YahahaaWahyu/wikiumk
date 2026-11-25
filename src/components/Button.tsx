import Link from "next/link";

export default function Button({
  href,
  variant = "primary",
  width,
  type = "button",
  children,
}: {
  href?: string;
  variant?: "primary" | "secondary";
  width?: number;
  type?: "button" | "submit";
  children: React.ReactNode;
}) {
  const classes = [
    "inline-flex h-10 items-center justify-center rounded-md px-6 text-[13px]",
    variant === "primary" ? "bg-dark text-paper" : "border border-line bg-chrome text-ink",
  ].join(" ");

  const style = width ? { width } : undefined;

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} style={style}>
      {children}
    </button>
  );
}
