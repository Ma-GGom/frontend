"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthActions } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { isValidEmail, isValidVerificationCode } from "@/shared/lib/validators";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface SettingsAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CODE_EXPIRE_SECONDS = 180;

function formatCountdown(seconds: number): string {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

export function SettingsAuthModal({ onClose, onSuccess }: SettingsAuthModalProps) {
  const savedEmail = useAuthStore((state) => state.email);
  const setSavedEmail = useAuthStore((state) => state.setEmail);
  const { sendCode, verifyCode, loading, error, message } = useAuthActions();

  const [email, setEmail] = useState(savedEmail);
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const mergedError = localError ?? error;
  const mergedMessage = localMessage ?? message;
  const isCodeExpired = isCodeSent && remainingSeconds <= 0;
  const trimmedEmail = useMemo(() => email.trim(), [email]);

  useEffect(() => {
    if (!isCodeSent || isCodeExpired) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isCodeExpired, isCodeSent, remainingSeconds]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSendCode = async () => {
    setLocalError(null);
    setLocalMessage(null);

    if (!isValidEmail(trimmedEmail)) {
      setLocalError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    const success = await sendCode(trimmedEmail);
    if (success) {
      setSavedEmail(trimmedEmail);
      setIsCodeSent(true);
      setRemainingSeconds(CODE_EXPIRE_SECONDS);
      setCode("");
      setLocalMessage("인증번호를 전송했어요. 3분 안에 입력해주세요.");
    }
  };

  const handleVerifyCode = async () => {
    setLocalError(null);
    setLocalMessage(null);

    if (!isCodeSent) {
      setLocalError("먼저 인증번호를 발송해주세요.");
      return;
    }

    if (isCodeExpired) {
      setLocalError("인증 시간이 만료됐어요. 재전송 후 다시 시도해주세요.");
      return;
    }

    if (!isValidVerificationCode(code)) {
      setLocalError("인증번호 6자리를 입력해주세요.");
      return;
    }

    const result = await verifyCode(trimmedEmail, code);
    if (result?.success) {
      setSavedEmail(trimmedEmail);
      onSuccess();
      onClose();
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-indigo-100 bg-white/95 p-5 shadow-[0_22px_50px_rgba(55,48,163,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-gray-800">설정 진입 인증</h2>
          <button
            aria-label="닫기"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="settings-auth-email">
              이메일
            </label>
            <Input
              id="settings-auth-email"
              autoComplete="email"
              disabled={loading}
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <Button
            className="h-10 w-full rounded-lg text-sm"
            disabled={loading}
            loading={loading}
            type="button"
            onClick={handleSendCode}
          >
            {isCodeSent ? "인증번호 재전송" : "인증번호 발송"}
          </Button>

          {isCodeSent && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  autoComplete="one-time-code"
                  disabled={loading}
                  inputMode="numeric"
                  maxLength={6}
                  pattern="\d{6}"
                  placeholder="인증번호 6자리"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <span className={`w-12 text-right text-sm font-semibold ${isCodeExpired ? "text-rose-600" : "text-indigo-500"}`}>
                  {formatCountdown(remainingSeconds)}
                </span>
              </div>
              <Button
                className="h-10 w-full rounded-lg text-sm"
                disabled={loading}
                loading={loading}
                type="button"
                onClick={handleVerifyCode}
              >
                인증 확인
              </Button>
            </div>
          )}

          {mergedMessage && <p className="text-sm text-emerald-700">{mergedMessage}</p>}
          {mergedError && <p className="text-sm text-red-600">{mergedError}</p>}
        </div>
      </div>
    </div>
  );
}
