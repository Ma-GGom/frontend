"use client";

import { useCallback, useState } from "react";
import { settingsApi } from "@/features/settings/api";
import type { SubscriptionPayload } from "@/features/settings/types";

interface LoadMySubscriptionOptions {
  silent?: boolean;
}

export function useSettingsActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadMySubscription = useCallback(async (options?: LoadMySubscriptionOptions) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      return await settingsApi.getMySubscription();
    } catch (caughtError) {
      if (!options?.silent) {
        setError(caughtError instanceof Error ? caughtError.message : "구독 정보를 불러오지 못했습니다.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubscription = useCallback(async (payload: SubscriptionPayload) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const response = await settingsApi.createSubscription(payload);
      setMessage(response.message ?? "구독이 등록되었습니다.");
      return response;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "구독 등록에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSubscription = useCallback(async (payload: Partial<SubscriptionPayload>) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const response = await settingsApi.updateSubscription(payload);
      setMessage(response.message ?? "구독 설정이 변경되었습니다.");
      return response;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "구독 설정 변경에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const response = await settingsApi.deleteSubscription();
      setMessage(response.message ?? "구독이 해지되었습니다.");
      return response;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "구독 해지에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    message,
    loadMySubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
