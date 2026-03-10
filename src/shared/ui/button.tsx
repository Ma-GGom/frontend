import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({ children, className = "", disabled, loading = false, ...props }: ButtonProps) {
  return (
    <button
      className={`flex h-12 items-center justify-center rounded-xl bg-indigo-500 px-6 text-base font-semibold text-white shadow-[0_10px_22px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-400 hover:shadow-[0_12px_26px_rgba(99,102,241,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-200 disabled:shadow-none disabled:text-white ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "처리 중..." : children}
    </button>
  );
}
