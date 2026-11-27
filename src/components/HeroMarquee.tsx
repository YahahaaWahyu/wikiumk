"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { articles, formatDate } from "@/lib/data";

/** Ambil N artikel mulai dari offset, cycling kalau kurang */
function makeCol(offset: number, count: number) {
  return Array.from({ length: count }, (_, i) => articles[(offset + i) % articles.length]);
}

function MarqueeCard({
  article,
  cardId,
  active,
}: {
  article: (typeof articles)[number];
  cardId: string;
  active: boolean;
}) {
  return (
    // mb-4 bagian dari "unit" card — spacing KONSISTEN di seam loop → no jump
    <div className="mb-4">
      <Link
        href={`/artikel/${article.slug}`}
        data-card-id={cardId}
        className={`relative block w-[240px] overflow-hidden rounded-xl p-[2.5px] text-left transition-[transform,box-shadow] duration-200 ease-out
                   ${
                     active
                       ? "z-20 -translate-y-1 scale-[1.04] bg-zinc-300 shadow-[0_10px_28px_rgba(59,130,246,0.25)] dark:bg-white/20 dark:shadow-[0_10px_28px_rgba(255,255,255,0.18)]"
                       : "bg-zinc-300/80 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:bg-white/15 dark:shadow-none"
                   }`}
      >
        {/* Animasi cahaya muter di border saat kartu lagi nge-pop */}
        {active && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 block h-[400px] w-[400px]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, #3b82f6 45deg, var(--beam-color) 80deg, transparent 130deg, transparent 180deg, #3b82f6 225deg, var(--beam-color) 260deg, transparent 310deg)",
              animation: "border-spin 1.8s linear infinite",
            }}
          />
        )}

        <div
          className={`relative rounded-[9.5px] p-4 transition-colors duration-200
                     ${
                       active
                         ? "bg-white dark:bg-zinc-800"
                         : "bg-white dark:bg-zinc-900"
                     }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium
                             bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
              {article.category.name}
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{article.readCount} dibaca</span>
          </div>
          <h3 className="mt-2.5 line-clamp-2 text-[14px] font-semibold leading-snug text-zinc-900 dark:text-white">
            {article.title}
          </h3>
          <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            {article.author.name} · {formatDate(article.createdAt)}
          </p>
        </div>
      </Link>
    </div>
  );
}

// 15 item per kolom; karena posisi top-aligned (-top-[300px]), 1 set (~1900px) selalu nutup layar penuh
const COLS = [
  { items: makeCol(0, 15), duration: "50s", reverse: false },
  { items: makeCol(8, 15), duration: "62s", reverse: true },
  { items: makeCol(3, 15), duration: "55s", reverse: false },
  { items: makeCol(11, 15), duration: "58s", reverse: true },
  { items: makeCol(6, 15), duration: "52s", reverse: false },
  { items: makeCol(14, 15), duration: "65s", reverse: true },
];

export default function HeroMarquee() {
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const [tracking, setTracking] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!tracking) return;
    let rafId = 0;
    let lastId: string | null = null;

    // Hit-test tiap frame supaya saat kursor diam, kartu yang lewat di bawahnya ikut nge-pop
    const tick = () => {
      const pos = mousePos.current;
      if (pos) {
        const el = document.elementFromPoint(pos.x, pos.y);
        const card = el?.closest<HTMLElement>("[data-card-id]");
        const nextId = card?.dataset.cardId ?? null;
        if (nextId !== lastId) {
          lastId = nextId;
          setActiveId(nextId);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [tracking]);

  return (
    <section
      onMouseMove={(e) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
        if (!tracking) setTracking(true);
      }}
      onMouseLeave={() => {
        mousePos.current = null;
        setTracking(false);
        setActiveId(null);
      }}
      className="relative h-screen overflow-hidden bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-white"
    >
      {/* Tilted infinite marquee — 6 kolom, interaktif: nge-pop ngikutin kursor (walau diam) dan bisa diklik */}
      <div className="absolute inset-x-0 -top-[300px] bottom-0 flex items-start justify-center overflow-visible">
        <div className="flex gap-3" style={{ transform: "rotate(-12deg) scale(1.2)", transformOrigin: "center top" }}>
          {COLS.map((col, idx) => {
            const doubled = [...col.items, ...col.items];
            const isColActive = activeId?.startsWith(`col${idx}-`) ?? false;
            return (
              <div key={idx} className={`relative flex flex-col ${isColActive ? "z-30" : ""}`}>
                <div
                  className="flex flex-col will-change-transform"
                  style={{
                    animation: `${col.reverse ? "marquee-down" : "marquee-up"} ${col.duration} linear infinite`,
                  }}
                >
                  {doubled.map((article, i) => {
                    const cardId = `col${idx}-${i}`;
                    return (
                      <MarqueeCard
                        key={cardId}
                        cardId={cardId}
                        article={article}
                        active={activeId === cardId}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradient overlay — pointer-events-none supaya kartu di belakangnya tetap bisa di-hover & diklik */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-100 via-zinc-100/75 to-transparent dark:from-zinc-950 dark:via-zinc-950/85 dark:to-zinc-950/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-100/90 via-transparent to-zinc-100/35 dark:from-zinc-950 dark:via-transparent dark:to-zinc-950/60"
      />

      {/* Hero Content — pointer-events-none di container, pointer-events-auto di blok teks supaya area lain tembus ke kartu */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-6 pb-16 lg:px-[120px] lg:pb-24">
        <div className="pointer-events-auto w-fit">
          <span className="inline-block w-fit rounded-full border border-zinc-300 bg-zinc-200/80 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-600 uppercase
                           dark:border-white/20 dark:bg-white/10 dark:text-zinc-200">
            Wiki UMK · Arsip Pengetahuan
          </span>

          <h1 className="mt-4 max-w-xl text-[40px] font-bold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-[56px]">
            Wiki UMK
          </h1>

          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
            Kumpulan artikel terbaru, panduan akademik, dan informasi kegiatan mahasiswa Universitas Muria Kudus.
          </p>

          <div className="mt-8">
            <Link
              href="/beranda"
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-7 text-[14px] font-semibold text-white transition-opacity hover:opacity-80
                         dark:bg-white dark:text-zinc-950"
            >
              Jelajahi Artikel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
