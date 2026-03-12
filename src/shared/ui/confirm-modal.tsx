"use client";

import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
      role="dialog"
    >
      <div
        className="w-full max-w-[350px] rounded-2xl border border-indigo-100 bg-white/95 p-4 shadow-[0_22px_50px_rgba(55,48,163,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-extrabold tracking-tight text-gray-800">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
            disabled={loading}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg bg-rose-600 px-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(225,29,72,0.24)] transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-200"
            disabled={loading}
            type="button"
            onClick={onConfirm}
          >
            {loading ? "처리 중..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
