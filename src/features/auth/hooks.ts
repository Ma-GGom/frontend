"use client";

import { useState } from "react";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

export function useAuthActions() {
  const setEmail = useAuthStore((state) => state.setEmail);
  const setAuthToken = useAuthStore((state) => state.setAuthToken);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sendCode = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await authApi.sendCode({ email });
      setEmail(email);
      setMessage(`${response.message ?? "인증번호 발송 완료"} (유효시간: ${response.expires_in}초)`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "인증번호 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await authApi.verifyCode({ email, code });
      setAuthToken(response.auth_token);
      setMessage(response.message ?? "인증이 완료되었습니다.");
      return response;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "인증 검증에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    message,
    sendCode,
    verifyCode,
  };
}
