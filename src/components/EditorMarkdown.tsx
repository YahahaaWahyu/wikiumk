import { useEffect, useState } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serializePreview } from "@/lib/serialize-preview";
import { mdxComponents } from "@/components/mdx";
import "katex/dist/katex.min.css";

const toolbarButton =
  "flex h-7 w-9 items-center justify-center rounded-md border border-line bg-paper text-[13px]";

type PreviewState =
  | { status: "loading" }
  | { status: "ok"; result: MDXRemoteSerializeResult }
  | { status: "error"; message: string };

export default function EditorMarkdown({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [tab, setTab] = useState<"tulis" | "pratinjau">("tulis");
  const [preview, setPreview] = useState<PreviewState>({ status: "loading" });
  const kosong = !value.trim();

  // Preview di-refresh di belakang layar saat mengetik (debounce 500ms) supaya
  // tab Pratinjau langsung menampilkan hasil terbaru tanpa jeda compile.
  // setState hanya di dalam callback async — aturan react-hooks melarang
  // panggilan sinkron di badan effect.
  useEffect(() => {
    if (kosong) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setPreview({ status: "loading" });
      serializePreview(value)
        .then((result) => {
          if (!cancelled) setPreview({ status: "ok", result });
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setPreview({
              status: "error",
              message: err instanceof Error ? err.message : String(err),
            });
          }
        });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, kosong]);

  return (
    <div className="w-full max-w-[800px] overflow-hidden rounded-md border border-line">
      <div className="flex h-8 items-stretch bg-chrome text-[13px]">
        <button
          type="button"
          onClick={() => setTab("tulis")}
          aria-pressed={tab === "tulis"}
          className={
            tab === "tulis"
              ? "flex items-center rounded-t-md bg-paper px-5"
              : "flex items-center px-5 text-muted"
          }
        >
          Tulis
        </button>
        <button
          type="button"
          onClick={() => setTab("pratinjau")}
          aria-pressed={tab === "pratinjau"}
          className={
            tab === "pratinjau"
              ? "flex items-center rounded-t-md bg-paper px-5"
              : "flex items-center px-5 text-muted"
          }
        >
          Pratinjau
        </button>
      </div>

      <div className="flex h-10 items-center gap-1 border-b border-line px-3">
        <span className={toolbarButton}>H</span>
        <span className={toolbarButton}>B</span>
        <span className={toolbarButton}>I</span>
        <span className={toolbarButton}>&quot;</span>
        <span className={toolbarButton}>&lt;&gt;</span>
        <span className="flex h-7 w-16 items-center justify-center rounded-md border border-line bg-paper text-[13px]">
          Tautan
        </span>

        <span className="mx-3 h-4 w-px bg-line" aria-hidden />

        <span className={toolbarButton}>1.</span>
        <span className={toolbarButton}>•</span>
        <span className={toolbarButton}>&#10003;</span>

        <span className={`${toolbarButton} ml-auto`} aria-hidden>
          &#8630;
        </span>
        <span className={toolbarButton} aria-hidden>
          &#8631;
        </span>
      </div>

      {tab === "tulis" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block h-[214px] w-full resize-none px-3 py-3 text-[13px] leading-5 placeholder:text-muted focus:outline-none"
        />
      ) : (
        <div className="h-[214px] overflow-y-auto px-3 py-3">
          {kosong ? (
            <p className="text-[13px] leading-5 text-muted">
              Belum ada isi untuk dipratinjau.
            </p>
          ) : preview.status === "loading" ? (
            <p className="text-[13px] leading-5 text-muted">Memuat pratinjau…</p>
          ) : preview.status === "error" ? (
            <p className="text-[13px] leading-5 text-muted">
              Pratinjau gagal dimuat: {preview.message}
            </p>
          ) : preview.status === "ok" ? (
            <div className="text-[15px] leading-[26px] break-words">
              <MDXRemote {...preview.result} components={mdxComponents} />
            </div>
          ) : null}
        </div>
      )}

      <div className="flex h-8 items-center bg-chrome px-3 text-[13px] text-muted">
        Markdown didukung
      </div>
    </div>
  );
}
