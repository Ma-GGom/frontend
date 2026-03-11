"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { useSettingsStore } from "@/features/settings/store";

export function SettingsHeader() {
  const router = useRouter();
  const authEmail = useAuthStore((state) => state.email);
  const formEmail = useSettingsStore((state) => state.form.email);
  const email = formEmail || authEmail;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <header className="mb-3 border-b border-indigo-100 pb-3 sm:mb-4 sm:pb-4">
      <div className="mb-2 flex items-center justify-between">
        <button
          aria-label="뒤로가기"
          className="inline-flex h-9 items-center px-0 text-xl font-bold leading-none text-gray-600 transition-colors hover:text-indigo-600"
          type="button"
          onClick={handleBack}
        >
          ⟵
        </button>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-1.5">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">현재 이메일</p>
          <p className={`max-w-[240px] truncate text-lg font-semibold ${email ? "text-gray-700" : "text-gray-500"}`}>
            {email || "unknown"}
          </p>
        </div>
      </div>

      <div className="mt-0.5 flex items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">설정</h1>
        <button
          className="inline-flex h-9 w-auto shrink-0 items-center justify-center rounded-lg bg-indigo-500 px-4 -mb-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(99,102,241,0.25)] transition-colors hover:bg-indigo-400"
          form="settings-form"
          type="submit"
        >
          저장
        </button>
      </div>
    </header>
  );
}
