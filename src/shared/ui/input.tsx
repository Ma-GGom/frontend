import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 outline-none placeholder:text-gray-400 transition-all focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-200 ${className}`}
      {...props}
    />
  );
}
