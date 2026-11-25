import type { ElementType, ReactNode } from "react";

// Renderer markdown minimal untuk isi artikel contoh. Cakupannya sengaja
// sebatas yang dipakai src/lib/data.ts: judul, daftar, paragraf, tebal, miring,
// dan tautan. Bila nanti dipakai markdown penuh, ganti berkas ini saja.
export function renderMarkdown(source: string): ReactNode[] {
  const blocks = source.trim().split(/\n{2,}/);
  const out: ReactNode[] = [];

  blocks.forEach((block, i) => {
    const lines = block.split("\n");

    if (/^#{1,6} /.test(lines[0])) {
      const level = lines[0].match(/^#{1,6}/)![0].length;
      const text = lines[0].replace(/^#{1,6} /, "");
      const Tag = `h${Math.min(level + 1, 6)}` as ElementType;
      out.push(<Tag key={i}>{text}</Tag>);
      return;
    }

    if (lines.every((line) => /^[-*] /.test(line))) {
      out.push(
        <ul key={i}>
          {lines.map((line, j) => (
            <li key={j}>{inlineText(line.replace(/^[-*] /, ""))}</li>
          ))}
        </ul>,
      );
      return;
    }

    out.push(<p key={i}>{inlineText(block)}</p>);
  });

  return out;
}

function inlineText(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]}>
          {linkMatch[1]}
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
}
