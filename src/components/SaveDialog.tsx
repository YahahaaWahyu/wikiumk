"use client";

// Konfirmasi simpan — struktur dan kelas sama dengan DeleteDialog
// (origin/uiux-sprint1) supaya kedua konfirmasi tampil seragam.
interface SaveDialogProps {
  articleTitle: string;
  isEdit: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SaveDialog({
  articleTitle,
  isEdit,
  onCancel,
  onConfirm,
}: SaveDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
    >
      <div className="w-full max-w-[400px] rounded-[10px] border border-line bg-paper p-6 shadow-lg">
        <h2
          id="save-dialog-title"
          className="text-[15px] font-bold leading-[18px]"
        >
          {isEdit ? "Simpan perubahan artikel ini?" : "Simpan artikel ini?"}
        </h2>
        <p className="mt-2 text-[13px] leading-4 text-muted">
          {isEdit ? "Perubahan pada artikel " : "Artikel "}
          <span className="font-medium text-ink">
            “{articleTitle.trim() || "Tanpa judul"}”
          </span>{" "}
          akan disimpan.
        </p>

        <div className="mt-6 flex justify-end gap-[10px]">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-chrome px-5 text-[13px] text-ink hover:bg-fill transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-dark px-5 text-[13px] text-paper hover:opacity-90 transition-opacity"
          >
            {isEdit ? "Simpan perubahan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
