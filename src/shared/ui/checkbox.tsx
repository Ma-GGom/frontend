import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  const isDisabled = Boolean(props.disabled);
  const isChecked = Boolean(props.checked ?? props.defaultChecked);

  return (
    <label
      className={`inline-flex select-none items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors ${
        isChecked ? "border-indigo-400" : "border-gray-200"
      } ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/60"
      } ${className}`}
    >
      <input
        className="peer sr-only"
        type="checkbox"
        {...props}
      />
      <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white transition-colors peer-checked:border-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-200">
        <svg
          aria-hidden
          className={`h-3.5 w-3.5 text-indigo-500 transition-all ${isChecked ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
          fill="none"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
        </svg>
      </span>
      <span className="leading-none">{label}</span>
    </label>
  );
}
