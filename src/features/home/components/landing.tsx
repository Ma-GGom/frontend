"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuthActions } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { fetchSubscriberCount } from "@/features/home/api";
import { LandingHeader } from "@/features/home/components/landing-header";
import { isValidEmail, isValidVerificationCode } from "@/shared/lib/validators";
import { Button } from "@/shared/ui/button";
import { AppFooter } from "@/shared/ui/footer";
import { Input } from "@/shared/ui/input";
import { Toast } from "@/shared/ui/toast";

const CODE_EXPIRE_SECONDS = 180;
const VERIFIED_STATUS_MESSAGE =
  "인증이 완료됐어요.\n현재 기본 구독 설정이 적용되어 있으니\n원하는 정보를 받으려면 구독 설정에서 직접 수정해주세요.";

function formatCountdown(seconds: number): string {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

export function Landing() {
  const setStoredEmail = useAuthStore((state) => state.setEmail);
  const clearAuthSession = useAuthStore((state) => state.clearSession);

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [lastAttemptedCode, setLastAttemptedCode] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const { loading, error, sendCode, verifyCode } = useAuthActions();

  const isEmailValid = isValidEmail(email);
  const isCodeValid = isValidVerificationCode(verificationCode);
  const isCodeExpired = isCodeSent && remainingSeconds <= 0 && !isVerified;
  const helperErrorMessage =
    verificationError ??
    (isCodeExpired && !isVerified
      ? "인증시간이 만료됐어요. 재전송 버튼을 눌러주세요."
      : codeTouched && !isCodeValid && verificationCode.length > 0
        ? "인증번호 6자리를 입력해주세요."
        : null);
  const sendButtonDisabled = useMemo(
    () => !isEmailValid || loading || isVerified,
    [isEmailValid, loading, isVerified],
  );
  const toastError = error && error !== dismissedError ? error : null;

  useEffect(() => {
    let mounted = true;

    const readSubscriberCount = async () => {
      try {
        const data = await fetchSubscriberCount();
        if (mounted) setSubscriberCount(data.count);
      } catch {
        if (mounted) setSubscriberCount(null);
      }
    };

    void readSubscriberCount();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isCodeSent || isVerified || remainingSeconds <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isCodeSent, isVerified, remainingSeconds]);

  const resetVerificationFlow = () => {
    setIsCodeSent(false);
    setIsVerified(false);
    setVerificationCode("");
    setCodeTouched(false);
    setRemainingSeconds(0);
    setLastAttemptedCode("");
    setVerificationError(null);
  };

  const startVerificationFlow = () => {
    setIsCodeSent(true);
    setIsVerified(false);
    setVerificationCode("");
    setCodeTouched(false);
    setRemainingSeconds(CODE_EXPIRE_SECONDS);
    setLastAttemptedCode("");
    setVerificationError(null);
  };

  const handleSendOrResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setDismissedError(null);
    setVerificationError(null);
    setStatusMessage(null);

    if (!isEmailValid) return;

    const success = await sendCode(email);
    if (success) {
      startVerificationFlow();
      setStatusMessage("인증번호를 전송했어요. 3분 안에 입력해주세요.");
    }
  };

  const handleVerifyCode = async (targetCode = verificationCode) => {
    setCodeTouched(true);
    setDismissedError(null);
    setVerificationError(null);
    setStatusMessage(null);

    if (!isCodeSent) {
      return;
    }

    if (remainingSeconds <= 0) {
      setVerificationError("인증 시간이 만료됐어요. 재전송 후 다시 시도해주세요.");
      return;
    }

    if (!isValidVerificationCode(targetCode)) {
      return;
    }

    setLastAttemptedCode(targetCode);

    const result = await verifyCode(email, targetCode);
    if (result?.success) {
      setStoredEmail(email);
      setIsVerified(true);
      setStatusMessage(VERIFIED_STATUS_MESSAGE);
    }
  };

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail);
    if (isCodeSent || isVerified) {
      resetVerificationFlow();
      setStatusMessage(null);
    }
  };

  const handleSwitchEmail = () => {
    clearAuthSession();
    setStoredEmail("");
    setEmail("");
    setTouched(false);
    setDismissedError(null);
    setStatusMessage(null);
    resetVerificationFlow();
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-4 pb-2 pt-24 sm:pt-28">
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-indigo-300/35 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-violet-300/28 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-indigo-200/40 blur-[100px]" />
      </div>

      <LandingHeader />

      {/* 콘텐츠 */}
      <div className="landing-enter mt-5 sm:mt-6 flex w-full max-w-2xl flex-col items-center text-center">

        {/* 메인 헤드라인 */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800 sm:text-6xl lg:text-7xl">
            <span className="text-indigo-500">마</span>라톤 <span className="text-indigo-500">꼼</span>짝마!
          </h1>
          <p className="mx-auto max-w-lg text-base font-semibold leading-relaxed text-gray-500 sm:text-lg">
            <span className="block">마라톤 접수 오픈, 이제 놓치지 마세요.</span>
            <span className="block">원하는 대회를 원하는 시간에 이메일로 받아보세요.</span>
          </p>
        </div>

        {/* 구독 폼 */}
        <div className="mt-8 w-full max-w-sm space-y-3 px-4 sm:max-w-lg sm:px-0">
          <p className="text-sm font-semibold text-gray-500">
            현재{" "}
            <span className="font-bold text-indigo-500">
              {subscriberCount === null ? "—" : subscriberCount.toLocaleString("ko-KR")}명
            </span>
            이 구독 중이에요.
          </p>

          <form
            className="flex w-full flex-col items-center gap-3 sm:grid sm:grid-cols-[112px_296px_112px] sm:items-center sm:justify-center sm:gap-2"
            onSubmit={handleSendOrResend}
          >
            <div className="relative w-[88%] max-w-[296px] sm:col-start-2 sm:w-[296px] sm:max-w-none sm:-translate-x-1">
              <Input
                autoComplete="email"
                className={`${isVerified ? "cursor-not-allowed pr-10 opacity-60" : ""}`}
                disabled={isVerified}
                placeholder="your@email.com"
                type="email"
                value={email}
                onBlur={() => setTouched(true)}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
              {isVerified && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg font-extrabold leading-none text-emerald-500"
                >
                  ✓
                </span>
              )}
            </div>
            <Button
              className="w-[88%] max-w-[296px] sm:col-start-3 sm:w-[112px] sm:max-w-none"
              disabled={sendButtonDisabled}
              loading={loading}
              type="submit"
            >
              {isVerified ? "인증 완료" : isCodeSent ? "재전송" : "구독하기"}
            </Button>
          </form>

          {isCodeSent && !isVerified && (
            <div className="space-y-2">
              <div className="mx-auto flex w-[88%] max-w-[296px] items-center gap-2 sm:relative sm:w-[210px] sm:max-w-none sm:gap-0">
                <div className="min-w-0 flex-1">
                  <Input
                    className="w-full min-w-0 text-center"
                    disabled={isVerified}
                    inputMode="numeric"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="인증번호 6자리"
                    value={verificationCode}
                    onBlur={() => setCodeTouched(true)}
                    onChange={(event) => {
                      const nextCode = event.target.value.replace(/\D/g, "").slice(0, 6);
                      setVerificationCode(nextCode);
                      if (nextCode.length < 6) {
                        setLastAttemptedCode("");
                        return;
                      }

                      if (loading || isVerified || isCodeExpired) {
                        return;
                      }

                      if (nextCode !== lastAttemptedCode) {
                        void handleVerifyCode(nextCode);
                      }
                    }}
                  />
                </div>
                <span
                  className={`w-[52px] text-sm font-semibold sm:pointer-events-none sm:absolute sm:left-full sm:top-1/2 sm:ml-2 sm:w-auto sm:-translate-y-1/2 ${
                    isCodeExpired ? "text-rose-600" : "text-indigo-500"
                  }`}
                >
                  {formatCountdown(remainingSeconds)}
                </span>
              </div>
              {loading && <p className="text-xs text-gray-500">인증번호를 확인하고 있어요...</p>}
            </div>
          )}

          {touched && !isEmailValid && email.length > 0 && (
            <p className="text-xs text-red-600">올바른 이메일 형식을 입력해주세요.</p>
          )}
          {helperErrorMessage && <p className="text-sm text-red-600">{helperErrorMessage}</p>}
          {statusMessage && <p className="whitespace-pre-line text-sm text-emerald-700">{statusMessage}</p>}
          {isVerified && (
            <button
              className="text-xs font-semibold text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-700"
              type="button"
              onClick={handleSwitchEmail}
            >
              다른 이메일로 인증
            </button>
          )}
        </div>
      </div>
      <AppFooter />

      {/* API 에러 토스트 */}
      {toastError && (
        <Toast message={toastError} onClose={() => setDismissedError(toastError)} variant="error" />
      )}
    </main>
  );
}
