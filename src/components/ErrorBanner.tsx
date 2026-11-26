interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorBanner({
  message = "Terjadi kesalahan. Silakan coba lagi.",
  onRetry,
}: ErrorBannerProps) {
  return (
    <div className="rounded-md border border-line bg-chrome px-4 py-5 text-[13px]">
      <p className="text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex h-8 items-center justify-center rounded-md border border-line bg-paper px-4 text-[13px] hover:bg-fill transition-colors"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
