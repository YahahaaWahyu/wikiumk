"use client";

import Link from "next/link";
import { useState } from "react";
import EditorMarkdown from "@/components/EditorMarkdown";
import Field, { inputClass } from "@/components/Field";
import SaveDialog from "@/components/SaveDialog";
import { categories, formatDate, type ArticleDetail } from "@/lib/data";

const buttonClass =
  "inline-flex h-10 min-w-[140px] items-center justify-center rounded-md px-6 text-[13px]";

export default function ArticleForm({
  mode,
  article,
}: {
  mode: "new" | "edit";
  article?: ArticleDetail;
}) {
  const isEdit = mode === "edit";
  const [title, setTitle] = useState(article?.title ?? "");
  const [summary, setSummary] = useState(article?.summary ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [dialog, setDialog] = useState(false);

  return (
    <>
      <h1 className="text-[24px] font-bold leading-[29px]">
        {isEdit ? "Ubah artikel" : "Buat artikel baru"}
      </h1>

      <nav aria-label="Breadcrumb" className="mt-[9px] text-[13px] leading-4 text-muted">
        <Link href="/admin" className="hover:underline">
          Kelola artikel
        </Link>
        {" / "}
        <span>{isEdit ? "Ubah artikel" : "Artikel baru"}</span>
      </nav>

      {isEdit && (
        <span className="mt-[10px] inline-block rounded-full border border-line bg-chrome px-4 py-[3px] text-[13px] leading-4 text-muted">
          Mengubah artikel yang sudah ada
        </span>
      )}

      {/* Pilihan statis: form hanya ditampilkan, tidak ada backend yang dipanggil. */}
      <form
        className={isEdit ? "mt-[30px]" : "mt-8"}
        onSubmit={(e) => {
          e.preventDefault();
          setDialog(true);
        }}
      >
        <Field
          htmlFor="title"
          label="Judul"
          counter={<span className="text-[13px] text-muted">{title.length}/200</span>}
        >
          <input
            id="title"
            name="title"
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul artikel"
            className={inputClass}
          />
        </Field>

        <div className="mt-7">
          <Field htmlFor="category" label="Kategori">
            <select
              id="category"
              name="category"
              defaultValue={article?.category.slug ?? ""}
              className={`${inputClass} max-w-[360px]`}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          {isEdit && article && (
            <p className="mt-2 text-[11px] leading-[13px] text-muted">
              slug: {article.slug} (tidak bisa diubah)
            </p>
          )}
        </div>

        <div className="mt-7">
          <Field
            htmlFor="summary"
            label="Ringkasan"
            counter={<span className="text-[13px] text-muted">{summary.length}/300</span>}
          >
            <textarea
              id="summary"
              name="summary"
              maxLength={300}
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ringkasan singkat artikel"
              className={`${inputClass} h-[90px] resize-none py-3`}
            />
          </Field>
        </div>

        <div className="mt-7">
          <Field htmlFor="content" label="Isi artikel">
            <EditorMarkdown
              id="content"
              placeholder="Tulis isi artikel dalam markdown..."
              value={content}
              onChange={setContent}
            />
          </Field>
        </div>

        {isEdit && article && (
          <p className="mt-6 text-[11px] leading-[13px] text-muted">
            Terakhir diperbarui {formatDate(article.updatedAt)}
          </p>
        )}

        <div className="mt-10 flex justify-end gap-[14px]">
          <Link
            href="/admin"
            className={`${buttonClass} border border-line bg-chrome text-ink`}
          >
            Batal
          </Link>
          <button type="submit" className={`${buttonClass} bg-dark text-paper`}>
            {isEdit ? "Simpan perubahan" : "Simpan"}
          </button>
        </div>
      </form>

      {/* Di luar <form> agar tombol dialog tidak pernah ikut submit form. */}
      {dialog && (
        <SaveDialog
          articleTitle={title}
          isEdit={isEdit}
          onCancel={() => setDialog(false)}
          // Backend penyimpanan belum ada — setelah konfirmasi dialog hanya
          // menutup; isi form tetap utuh.
          onConfirm={() => setDialog(false)}
        />
      )}
    </>
  );
}
