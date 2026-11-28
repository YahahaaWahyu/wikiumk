import type { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

type SerializeOptions = NonNullable<Parameters<typeof serialize>[1]>;

// Satu sumber kebenaran pipeline MDX: halaman artikel dan pratinjau editor
// memakai berkas ini supaya tampilan pratinjau selalu identik dengan artikel
// yang dipublish. Pindahkan perubahan pipeline ke sini saja.
export const mdxOptions: SerializeOptions = {
  blockJS: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-light",
          keepBackground: false,
          // Fallback bahasa agar fence tanpa bahasa ikut diproses menjadi
          // <figure>; tanpa ini plugin melewatkannya (if (!lang) return) dan
          // kodenya jatuh ke gaya inline code. Bentuk objek dipakai agar
          // inline code tetap memakai default (""), bukan "plaintext".
          defaultLang: { block: "plaintext" },
        },
      ],
      rehypeKatex,
    ],
  },
};
