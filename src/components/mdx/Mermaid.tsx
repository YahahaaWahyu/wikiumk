"use client";

import { useEffect, useId, useState } from "react";

/**
 * Diagram mermaid. Hanya jalur render: tanpa modal perbesar, zoom, pan, atau
 * focus trap — fitur produk blog portofolio yang tidak ada di wireframe dan
 * akan menambah dependency di luar daftar sembilan paket.
 *
 * `theme: "neutral"` menjaga diagram tetap greyscale; `suppressErrorRendering`
 * mencegah mermaid menulis ke DOM sendiri sehingga kegagalan bisa ditangkap
 * sebagai keadaan galat biasa.
 */
export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reactId = useId();
  const id = `mmd-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ theme: "neutral", suppressErrorRendering: true });
        const result = await mermaid.render(id, chart);
        if (!cancelled) setSvg(result.svg);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-6 border border-line bg-chrome px-4 py-4 text-[13px] leading-[20px] text-muted">
        <p className="font-bold text-ink">Diagram gagal dimuat.</p>
        <p className="mt-1 break-words">{error}</p>
      </div>
    );
  }

  if (svg === null) {
    return (
      <div className="my-6 border border-line bg-chrome px-4 py-6 text-center text-[13px] leading-[20px] text-muted">
        Memuat diagram…
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
