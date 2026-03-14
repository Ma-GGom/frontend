"use client";

import { useState } from "react";
import { adminApi } from "@/features/admin/api";
import type {
  AdminSendTestMailRequest,
  AdminSendTestMailResponse,
} from "@/features/admin/types";

export function useAdminActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sendTestMail = async (
    payload: AdminSendTestMailRequest,
  ): Promise<AdminSendTestMailResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await adminApi.sendTestMail(payload);
      setMessage(response.message ?? "테스트 메일 발송 요청이 완료되었습니다.");
      return response;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "테스트 메일 발송에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    message,
    sendTestMail,
  };
}
