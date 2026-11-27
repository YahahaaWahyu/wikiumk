import { ButtonHTMLAttributes } from "react";

interface SpinnerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary";
}

export default function SpinnerButton({
  loading,
  loadingText = "Memproses…",
  variant = "primary",
  children,
  className = "",
  disabled,
  ...props
}: SpinnerButtonProps) {
  const base =
    "inline-flex h-10 items-center justify-center gap-2 rounded-md px-6 text-[13px] transition-opacity disabled:cursor-not-allowed disabled:opacity-60";

  const variants: Record<string, string> = {
    primary: "bg-dark text-paper hover:opacity-90",
    secondary: "border border-line bg-chrome text-ink hover:bg-fill",
  };

  return (
    <button
      disabled={loading || disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
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
            opacity="0.3"
          />
          <path
            d="M12 2a10 10 0 019.9 11"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {loading ? loadingText : children}
    </button>
  );
}

