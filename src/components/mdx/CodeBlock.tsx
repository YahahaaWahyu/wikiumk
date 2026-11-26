"use client";

import { useEffect, useState, type ReactNode } from "react";

const ICON = {
  copy: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
};

/**
 * Blok kode dengan tombol salin.
 *
 * Grayscale dipasang karena shiki memakai tema berwarna (`github-light`), sementara
 * wireframe hanya mengenal abu-abu — tanpa filter ini highlight akan jadi satu-satunya
 * warna di halaman.
 */
export function CodeBlock({
  children,
  rawText,
}: {
  children: ReactNode;
  rawText: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="relative my-6 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:border [&_pre]:border-line [&_pre]:bg-chrome [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-[20px] [&_pre]:grayscale">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(rawText.trimEnd()).then(() => setCopied(true));
        }}
        aria-label={copied ? "Kode tersalin" : "Salin kode"}
        className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded border border-line bg-paper px-2 py-1 text-[11px] leading-4 text-muted hover:bg-chrome"
      >
        {copied ? ICON.check : ICON.copy}
      </button>
      {children}
    </div>
  );
}
