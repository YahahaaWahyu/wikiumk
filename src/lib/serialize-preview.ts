"use server";

import { serialize } from "next-mdx-remote/serialize";
import { mdxOptions } from "@/lib/mdx-options";

// Compile MDX di server agar shiki dan compiler tidak masuk bundle client;
// hasilnya di-render <MDXRemote> milik next-mdx-remote di sisi client.
export async function serializePreview(content: string) {
  return serialize(content, mdxOptions);
}
