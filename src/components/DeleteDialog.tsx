"use client";

interface DeleteDialogProps {
  articleTitle: string;
  status: "idle" | "deleting" | "error";
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({
  articleTitle,
  status,
  onCancel,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
    >
      <div className="w-full max-w-[400px] rounded-[10px] border border-line bg-paper p-6 shadow-lg">
        <h2
          id="delete-dialog-title"
          className="text-[15px] font-bold leading-[18px]"
        >
          Hapus artikel ini?
        </h2>
        <p className="mt-2 text-[13px] leading-4 text-muted">
          Artikel{" "}
          <span className="font-medium text-ink">"{articleTitle}"</span>{" "}
          akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.
        </p>

        {status === "error" && (
          <p className="mt-3 rounded-md border border-line bg-chrome px-3 py-2 text-[13px] text-muted">
            Gagal menghapus artikel. Silakan coba lagi.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-[10px]">
          <button
            onClick={onCancel}
            disabled={status === "deleting"}
            className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-chrome px-5 text-[13px] text-ink hover:bg-fill disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={status === "deleting"}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-dark px-5 text-[13px] text-paper hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {status === "deleting" && (
              <svg
                className="animate-spin h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="30 10"
                  opacity="0.4"
                />
                <path
                  d="M12 2a10 10 0 019.9 11"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {status === "error" ? "Coba lagi" : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
