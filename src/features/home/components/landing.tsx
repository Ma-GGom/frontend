"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  "인증이 완료됐어요.\n현재 기본 구독 설정이 적용되어 있으니\n원하는 정보를 받으려면 설정에서 직접 수정해주세요.";

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
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [lastAttemptedCode, setLastAttemptedCode] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [agreementError, setAgreementError] = useState<string | null>(null);
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
  const isConsentRowLocked = isCodeSent && !isCodeExpired && !isVerified;
  const sendCodeButtonDisabled = useMemo(
    () => !isEmailValid || !isPrivacyAgreed || loading || isVerified,
    [isEmailValid, isPrivacyAgreed, loading, isVerified],
  );
  const formErrorMessage = agreementError ?? helperErrorMessage;
  const toastError = error && error !== dismissedError ? error : null;

  useEffect(() => {
    let mounted = true;

    const readSubscriberCount = async () => {
      try {
        const data = await fetchSubscriberCount();
        if (mounted) {
          setSubscriberCount(data.count);
        }
      } catch {
        if (mounted) {
          setSubscriberCount(null);
        }
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
    setAgreementError(null);
    setStatusMessage(null);

    if (!isEmailValid) return;
    if (!isPrivacyAgreed) {
      setAgreementError("개인정보처리방침 동의가 필요해요.");
      return;
    }

    const success = await sendCode(email, "SUBSCRIBE");
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
    if (result?.access_token) {
      setStoredEmail(email);
      setIsVerified(true);
      setStatusMessage(VERIFIED_STATUS_MESSAGE);
      try {
        const data = await fetchSubscriberCount();
        setSubscriberCount(data.count);
      } catch {
        setSubscriberCount(null);
      }
    }
  };

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail);
    setAgreementError(null);
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
    setIsPrivacyAgreed(false);
    setAgreementError(null);
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

          <form className="w-full space-y-3" onSubmit={handleSendOrResend}>
            <div className="relative mx-auto w-[88%] max-w-[296px] sm:w-[408px] sm:max-w-none">
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

            <div className="mx-auto flex w-[88%] max-w-[296px] items-center justify-end gap-3 sm:w-[408px] sm:max-w-none">
              <div className={`inline-flex items-center gap-1 ${isConsentRowLocked ? "opacity-55" : ""}`}>
                <label
                  className={`inline-flex h-8 w-8 select-none items-center justify-center ${
                    isConsentRowLocked || isVerified ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  htmlFor="privacy-agree"
                >
                  <input
                    checked={isPrivacyAgreed}
                    className="peer sr-only"
                    disabled={isConsentRowLocked || isVerified || loading}
                    id="privacy-agree"
                    type="checkbox"
                    onChange={(event) => {
                      setIsPrivacyAgreed(event.target.checked);
                      setAgreementError(null);
                    }}
                  />
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] border border-gray-300 bg-white transition-colors peer-checked:border-indigo-500">
                    <svg
                      aria-hidden
                      className={`h-4 w-4 text-indigo-500 transition-all ${isPrivacyAgreed ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
                      fill="none"
                      viewBox="0 0 16 16"
                  >
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                  </svg>
                </span>
              </label>
                <span className="text-xs font-medium leading-none text-gray-600 sm:text-sm">[필수]</span>
                <Link
                  className="text-xs font-medium leading-none text-gray-600 underline underline-offset-2 transition-colors hover:text-indigo-600 sm:text-sm"
                  href="/privacy-policy"
                >
                  개인정보처리방침
                </Link>
                <span className="text-xs font-medium leading-none text-gray-600 sm:text-sm">동의</span>
              </div>

              <Button
                className="h-10 w-auto min-w-[88px] whitespace-nowrap rounded-lg px-4 text-sm"
                disabled={sendCodeButtonDisabled}
                loading={loading}
                type="submit"
              >
                {isVerified ? "인증 완료" : isCodeSent ? "재전송" : "구독하기"}
              </Button>
            </div>
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
          {formErrorMessage && <p className="text-sm text-red-600">{formErrorMessage}</p>}
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
