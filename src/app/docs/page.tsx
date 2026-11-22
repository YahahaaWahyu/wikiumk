"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    SwaggerUIBundle?: (opts: Record<string, unknown>) => unknown;
  }
}

export default function DocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

    const load = async () => {
      if (!document.querySelector("link[data-swagger-ui-css]")) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.integrity =
          "sha384-++DMKo1369T5pxDNqojF1F91bYxYiT1N7b1M15a7oCzEodfljztKlApQoH6eQSKI";
        css.crossOrigin = "anonymous";
        css.href = "https://unpkg.com/swagger-ui-dist@5.28.1/swagger-ui.css";
        css.setAttribute("data-swagger-ui-css", "");
        document.head.appendChild(css);
      }

      if (!window.SwaggerUIBundle) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.integrity =
            "sha384-V0LcGJnXivolzjbV55cqaZg4XvvI1Z8RFYZchJFl9ZHgQV1ek+/g0LS3jjN/1Azs";
          script.crossOrigin = "anonymous";
          script.src =
            "https://unpkg.com/swagger-ui-dist@5.28.1/swagger-ui-bundle.js";
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Gagal memuat Swagger UI"));
          document.body.appendChild(script);
        });
      }

      window.SwaggerUIBundle?.({
        url: "/openapi.yaml",
        dom_id: "#swagger-ui",
        deepLinking: true,
        tryItOutEnabled: true,
        docExpansion: "list",
        filter: true,
      });
    };

    load().catch((err) => {
      if (containerRef.current) {
        containerRef.current.innerHTML =
          '<p style="padding:2rem;font-family:sans-serif">Gagal memuat Swagger UI. Pastikan koneksi internet tersedia (CDN unpkg).</p>';
      }
      console.error(err);
    });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-2 border-b border-zinc-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            Wiki UMK — API Documentation
          </h1>
          <p className="text-sm text-zinc-500">
            OpenAPI 3.1 · Sprint 1 (health, auth, kategori, artikel)
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <a
            href="/openapi.yaml"
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noreferrer"
          >
            openapi.yaml
          </a>
          <Link
            href="/"
            className="text-zinc-600 underline hover:text-zinc-900"
          >
            ← Beranda
          </Link>
        </div>
      </header>
      <div id="swagger-ui" ref={containerRef} />
    </main>
  );
}
