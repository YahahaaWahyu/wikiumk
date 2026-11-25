import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Peta elemen MDX untuk halaman artikel. Seluruh gaya prosa tinggal di sini,
 * supaya halaman artikel tidak lagi membawa arbitrary variant Tailwind.
 *
 * Hanya token greyscale @theme yang boleh dipakai: paper, line, ink, muted,
 * chrome, fill, dark. Nama dari porto seperti "primary" atau "surface" bukan
 * token wikiumk dan akan jadi kelas mati.
 */

function Anchor({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Code({ children, ...rest }: ComponentProps<"code">) {
  // rehype-pretty-code menandai blok kode dengan data-language/data-theme;
  // inline code tidak punya penanda itu, jadi hanya ia yang digaya.
  const isBlock = "data-language" in rest || "data-theme" in rest;
  if (isBlock) return <code {...rest}>{children}</code>;
  return (
    <code
      {...rest}
      className="rounded border border-line bg-chrome px-[5px] py-px font-mono text-[13px]"
    >
      {children}
    </code>
  );
}

/** Tabel dibungkus div agar lebar tujuh kolom tidak merusak halaman di layar kecil. */
function Table({ children, ...rest }: ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto">
      <table {...rest} className="w-full border-collapse text-[14px]">
        {children}
      </table>
    </div>
  );
}

export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 {...props} className="mt-8 text-[20px] font-bold leading-[27px]" />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 {...props} className="mt-7 text-[18px] font-bold leading-[24px]" />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 {...props} className="mt-6 text-[15px] font-bold leading-[22px]" />
  ),
  h4: (props: ComponentProps<"h4">) => (
    <h4 {...props} className="mt-5 text-[14px] font-bold leading-[20px]" />
  ),
  h5: (props: ComponentProps<"h5">) => (
    <h5 {...props} className="mt-4 text-[13px] font-bold leading-[19px]" />
  ),
  h6: (props: ComponentProps<"h6">) => (
    <h6 {...props} className="mt-4 text-[12px] font-bold leading-[17px] text-muted" />
  ),
  p: (props: ComponentProps<"p">) => <p {...props} className="my-4" />,
  a: Anchor,
  ul: (props: ComponentProps<"ul">) => (
    <ul {...props} className="my-4 list-disc pl-5" />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol {...props} className="my-4 list-decimal pl-5" />
  ),
  // Task list dari remark-gfm sudah membawa checkbox; bullet ganda harus hilang.
  li: (props: ComponentProps<"li">) => (
    <li {...props} className="mt-1 [&:has(input[type=checkbox])]:list-none" />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote {...props} className="my-6 border-l-2 border-line pl-4 text-muted" />
  ),
  hr: (props: ComponentProps<"hr">) => <hr {...props} className="my-8 border-line" />,
  table: Table,
  th: (props: ComponentProps<"th">) => (
    <th
      {...props}
      className="border border-line bg-chrome px-3 py-2 text-left font-bold"
    />
  ),
  td: (props: ComponentProps<"td">) => (
    <td {...props} className="border border-line px-3 py-2" />
  ),
  code: Code,
};
