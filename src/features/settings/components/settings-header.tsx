"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { SettingsAuthModal } from "@/features/home/components/settings-auth-modal";
import { getAuthTokenFromCookie, getEmailFromAccessToken } from "@/shared/lib/storage";

interface AccessTokenPayload {
  role?: unknown;
  roles?: unknown;
  authorities?: unknown;
}

function decodeAccessTokenPayload(token: string | null): AccessTokenPayload | null {
  if (!token) {
    return null;
  }

  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) {
      return null;
    }

    const normalizedPayload = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    return JSON.parse(atob(paddedPayload)) as AccessTokenPayload;
  } catch {
    return null;
  }
}

function collectRoleValues(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function hasAdminRole(payload: AccessTokenPayload | null): boolean {
  if (!payload) {
    return false;
  }

  const roles = [
    ...collectRoleValues(payload.role),
    ...collectRoleValues(payload.roles),
    ...collectRoleValues(payload.authorities),
  ].map((role) => role.trim().toUpperCase());

  return roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");
}

export function SettingsHeader() {
  const router = useRouter();
  const authEmail = useAuthStore((state) => state.email);
  const setAuthEmail = useAuthStore((state) => state.setEmail);
  const clearAuthSession = useAuthStore((state) => state.clearSession);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const cookieToken = useMemo(() => getAuthTokenFromCookie(), []);
  const tokenEmail = useMemo(() => getEmailFromAccessToken(cookieToken), [cookieToken]);
  const tokenPayload = useMemo(() => decodeAccessTokenPayload(cookieToken), [cookieToken]);
  const email = authEmail || tokenEmail;
  const isAdminAccount = useMemo(() => hasAdminRole(tokenPayload), [tokenPayload]);

  useEffect(() => {
    if (!authEmail && tokenEmail) {
      setAuthEmail(tokenEmail);
    }
  }, [authEmail, setAuthEmail, tokenEmail]);

  useEffect(() => {
    if (cookieToken && !tokenEmail) {
      clearAuthSession();
      router.replace("/");
    }
  }, [clearAuthSession, cookieToken, router, tokenEmail]);

  const handleBack = () => {
    router.push("/");
  };

  return (
    <header className="mb-1 pb-1 sm:mb-2 sm:pb-2">
      <div className="mb-2 flex items-center justify-between">
        <button
          aria-label="뒤로가기"
          className="inline-flex h-9 items-center px-0 text-xl font-bold leading-none text-gray-600 transition-colors hover:text-indigo-600"
          type="button"
          onClick={handleBack}
        >
          ⟵
        </button>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">현재 이메일</p>
            <button
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 underline underline-offset-2 transition-colors hover:text-indigo-500"
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <svg
                aria-hidden
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M13.2 6.1A5.2 5.2 0 0 0 4.4 3.7L3 5.1M2.8 9.9a5.2 5.2 0 0 0 8.8 2.4L13 10.9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 2.9v2.3h2.3M13 13.1v-2.3h-2.3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
              <span>이메일 변경</span>
            </button>
          </div>
          <p className={`max-w-[240px] truncate text-lg font-semibold ${email ? "text-gray-700" : "text-gray-500"}`}>
            {email || "unknown"}
          </p>
        </div>
      </div>

      <div className="mt-0.5">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">설정</h1>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          {isAdminAccount && (
            <Link
              className="text-xs font-semibold text-gray-600 underline underline-offset-2 transition-colors hover:text-indigo-600"
              href="/admin"
            >
              관리자 페이지
            </Link>
          )}
          <button
            className="inline-flex h-9 w-auto shrink-0 items-center justify-center rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(99,102,241,0.25)] transition-colors hover:bg-indigo-400"
            form="settings-form"
            type="submit"
          >
            저장
          </button>
        </div>
      </div>
      {isAuthModalOpen && (
        <SettingsAuthModal
          currentEmail={email || undefined}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      )}
    </header>
  );
}
