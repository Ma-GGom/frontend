"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuthActions } from "@/features/auth/hooks";
import { fetchServerStatus, fetchSubscriberCount } from "@/features/home/api";
import type { ServerStatusLevel, ServerStatusResponse } from "@/features/home/types";
import { isValidEmail } from "@/shared/lib/validators";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Toast } from "@/shared/ui/toast";

export function SubscriptionLanding() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatusResponse | null>(null);
  const [previewLevel] = useState<ServerStatusLevel | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const params = new URLSearchParams(window.location.search);
    const previewStatus = params.get("statusPreview");
    if (previewStatus === "congested" || previewStatus === "normal" || previewStatus === "smooth") {
      return previewStatus;
    }

    return null;
  });
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const { loading, error, message, sendCode } = useAuthActions();

  const isEmailValid = isValidEmail(email);
  const subscribeButtonDisabled = useMemo(() => !isEmailValid || loading, [isEmailValid, loading]);
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

    const readServerStatus = async () => {
      try {
        const data = await fetchServerStatus();
        if (mounted) setServerStatus(data);
      } catch {
        if (mounted) {
          setServerStatus({
            status: "unknown",
            level: "congested",
            message: "불안",
            checked_at: new Date().toISOString(),
          });
        }
      }
    };

    void readSubscriberCount();
    void readServerStatus();

    const timerId = setInterval(() => {
      void readServerStatus();
    }, 60000);

    return () => {
      mounted = false;
      clearInterval(timerId);
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setDismissedError(null);
    if (!isEmailValid) return;
    await sendCode(email);
  };

  const statusLevel: ServerStatusLevel = previewLevel ?? serverStatus?.level ?? "normal";

  const segmentClass = (index: 1 | 2 | 3) => {
    if (statusLevel === "congested") {
      if (index === 1) return "bg-rose-500";
      return "bg-white";
    }

    if (statusLevel === "normal") {
      if (index === 1) return "bg-orange-500";
      if (index === 2) return "bg-orange-500";
      return "bg-white";
    }

    if (index === 1) return "bg-emerald-500";
    if (index === 2) return "bg-emerald-500";
    return "bg-emerald-500";
  };

  const isSmooth = statusLevel === "smooth";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-4 pb-12 pt-20 sm:pt-28">
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-indigo-300/35 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-violet-300/28 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-indigo-200/40 blur-[100px]" />
      </div>

      {/* 콘텐츠 */}
      <div className="landing-enter mt-6 sm:mt-8 flex w-full max-w-2xl flex-col items-center text-center">
        {/* 메인 헤드라인 */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black leading-tight tracking-tight text-gray-800 sm:text-6xl lg:text-7xl">
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

          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <Input
              autoComplete="email"
              className="w-full flex-none sm:flex-1"
              placeholder="your@email.com"
              type="email"
              value={email}
              onBlur={() => setTouched(true)}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="w-full sm:w-auto"
              disabled={subscribeButtonDisabled}
              loading={loading}
              type="submit"
            >
              구독하기
            </Button>
          </form>

          {touched && !isEmailValid && email.length > 0 && (
            <p className="text-xs text-red-600">올바른 이메일 형식을 입력해주세요.</p>
          )}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
        </div>

        {/* 하단 스탯 */}
        <div className="mt-6 inline-flex items-center gap-3 px-1 py-0.5 text-sm text-gray-600">
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-gray-900">서버 상태</span>
            <div className="inline-grid grid-cols-3 gap-x-1.5">
              <span className={`relative h-2.5 w-8 overflow-hidden rounded-full border border-gray-200 ${segmentClass(1)}`}>
                {isSmooth && <span aria-hidden className="server-wave" />}
              </span>
              <span className={`relative h-2.5 w-8 overflow-hidden rounded-full border border-gray-200 ${segmentClass(2)}`}>
                {isSmooth && <span aria-hidden className="server-wave server-wave-delay-1" />}
              </span>
              <span className={`relative h-2.5 w-8 overflow-hidden rounded-full border border-gray-200 ${segmentClass(3)}`}>
                {isSmooth && <span aria-hidden className="server-wave server-wave-delay-2" />}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* API 에러 토스트 */}
      {toastError && (
        <Toast message={toastError} onClose={() => setDismissedError(toastError)} variant="error" />
      )}
    </main>
  );
}
