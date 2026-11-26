import Link from "next/link";

export default function SessionExpiredDialog() {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
    >
      <div className="w-full max-w-[380px] rounded-[10px] border border-line bg-paper p-6 shadow-lg text-center">
        <p
          aria-hidden
          className="text-[32px] font-bold leading-none text-fill"
        >
          401
        </p>
        <h2
          id="session-dialog-title"
          className="mt-4 text-[18px] font-bold leading-[22px]"
        >
          Sesi berakhir
        </h2>
        <p className="mt-2 text-[13px] leading-4 text-muted">
          Sesi login Anda telah habis. Silakan masuk kembali untuk melanjutkan.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-dark text-[13px] text-paper hover:opacity-90 transition-opacity"
        >
          Masuk kembali
        </Link>
      </div>
    </div>
  );
}
