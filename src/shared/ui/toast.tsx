"use client";

import { useEffect, useState } from "react";

type ToastVariant = "error" | "success" | "info";

interface ToastProps {
  message: string;
  onClose: () => void;
  variant?: ToastVariant;
}

const TOAST_TONE: Record<
  ToastVariant,
  { icon: string; iconClass: string; iconBg: string; container: string }
> = {
  error: {
    icon: "!",
    iconClass: "text-rose-700",
    iconBg: "bg-rose-100",
    container: "border-rose-200 bg-rose-50 text-rose-700",
  },
  success: {
    icon: "✓",
    iconClass: "text-emerald-700",
    iconBg: "bg-emerald-100",
    container: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  info: {
    icon: "i",
    iconClass: "text-indigo-700",
    iconBg: "bg-indigo-100",
    container: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
};

export function Toast({ message, onClose, variant = "error" }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const tone = TOAST_TONE[variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      aria-live="polite"
      role="status"
      className={`fixed inset-x-0 top-6 z-50 flex justify-center px-3 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className={`flex w-full max-w-[28rem] items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-[0_8px_24px_rgba(99,102,241,0.18)] ${tone.container}`}>
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold leading-none ${tone.iconBg} ${tone.iconClass}`}>
          {tone.icon}
        </span>
        <p className="min-w-0 flex-1 break-keep text-left font-medium leading-5">{message}</p>
      </div>
    </div>
  );
}
