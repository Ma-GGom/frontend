"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthActions } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { isValidEmail, isValidVerificationCode } from "@/shared/lib/validators";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Toast } from "@/shared/ui/toast";

interface SettingsAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentEmail?: string;
}

const CODE_EXPIRE_SECONDS = 180;

function formatCountdown(seconds: number): string {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

export function SettingsAuthModal({ onClose, onSuccess, currentEmail }: SettingsAuthModalProps) {
  const setSavedEmail = useAuthStore((state) => state.setEmail);
  const { sendCode, verifyCode, loading, error } = useAuthActions();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [dismissedApiError, setDismissedApiError] = useState<string | null>(null);

  const mergedMessage = localMessage;
  const apiErrorToast = error && error !== dismissedApiError ? error : null;
  const isCodeExpired = isCodeSent && remainingSeconds <= 0;
  const trimmedEmail = useMemo(() => email.trim(), [email]);
  const normalizedCurrentEmail = useMemo(() => currentEmail?.trim().toLowerCase() ?? "", [currentEmail]);
  const normalizedInputEmail = useMemo(() => trimmedEmail.toLowerCase(), [trimmedEmail]);

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

  const resetVerificationInputs = () => {
    setCode("");
    setIsCodeSent(false);
    setRemainingSeconds(0);
  };

  const handleSendCode = async () => {
    setLocalError(null);
    setLocalMessage(null);
    setDismissedApiError(null);

    if (!isValidEmail(trimmedEmail)) {
      setLocalError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (normalizedCurrentEmail && normalizedCurrentEmail === normalizedInputEmail) {
      setLocalError("현재 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.");
      return;
    }

    const success = await sendCode(trimmedEmail, "SETTINGS");
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
    setDismissedApiError(null);

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
    if (result?.access_token) {
      setSavedEmail(trimmedEmail);
      setLocalMessage("인증이 완료됐어요.");
      onSuccess();
      onClose();
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
      role="dialog"
    >
      <div
        className="w-full max-w-[380px] rounded-2xl border border-indigo-100 bg-white/95 p-4 shadow-[0_22px_50px_rgba(55,48,163,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-gray-800">이메일 인증</h2>
          <button
            aria-label="닫기"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">설정 페이지 진입 전에 이메일 인증이 필요해요.</p>

          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSendCode();
            }}
          >
            <div className="space-y-1">
              <Input
                id="settings-auth-email"
                autoComplete="email"
                disabled={loading}
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(event) => {
                  const nextEmail = event.target.value;
                  setEmail(nextEmail);
                  setLocalError(null);
                  setLocalMessage(null);
                  if (isCodeSent) {
                    resetVerificationInputs();
                  }
                }}
              />
            </div>

            <Button
              className="h-10 w-full rounded-lg text-sm"
              disabled={loading}
              loading={loading}
              type="submit"
            >
              {isCodeSent ? "인증번호 재전송" : "인증번호 발송"}
            </Button>
          </form>

          {isCodeSent && (
            <form
              className="space-y-2"
              onSubmit={(event) => {
                event.preventDefault();
                void handleVerifyCode();
              }}
            >
              <div className="flex items-center gap-2">
                <Input
                  autoComplete="one-time-code"
                  disabled={loading}
                  inputMode="numeric"
                  maxLength={6}
                  pattern="\d{6}"
                  placeholder="인증번호 6자리"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                    setLocalError(null);
                    setDismissedApiError(null);
                  }}
                />
                <span className={`w-12 text-right text-sm font-semibold ${isCodeExpired ? "text-rose-600" : "text-indigo-500"}`}>
                  {formatCountdown(remainingSeconds)}
                </span>
              </div>
              <Button
                className="h-10 w-full rounded-lg text-sm"
                disabled={loading}
                loading={loading}
                type="submit"
              >
                인증 확인
              </Button>
            </form>
          )}

          {mergedMessage && <p className="text-sm text-emerald-700">{mergedMessage}</p>}
          {localError && <p className="text-sm text-red-600">{localError}</p>}
        </div>
      </div>
      {apiErrorToast && (
        <Toast
          message={apiErrorToast}
          variant="error"
          onClose={() => setDismissedApiError(apiErrorToast)}
        />
      )}
    </div>
  );
}
