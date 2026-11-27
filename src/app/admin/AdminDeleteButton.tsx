"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/DeleteDialog";
import Toast from "@/components/Toast";

export default function AdminDeleteButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");
  const [toast, setToast] = useState<string | null>(null);

  const handleConfirm = async () => {
    setStatus("deleting");
    try {
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error(String(res.status));
      setOpen(false);
      setStatus("idle");
      setToast("Artikel dihapus.");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setStatus("idle"); }}
        className="inline-flex h-8 items-center justify-center rounded-md px-3 text-[13px] bg-dark text-paper hover:opacity-90 transition-opacity"
      >
        Hapus
      </button>

      {open && (
        <DeleteDialog
          articleTitle={title}
          status={status}
          onCancel={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}
    </>
  );
}
