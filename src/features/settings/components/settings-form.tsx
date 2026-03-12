"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { useSettingsActions } from "@/features/settings/hooks";
import { useSettingsStore } from "@/features/settings/store";
import { DISTANCE_OPTIONS } from "@/shared/constants/distances";
import { RECEIVE_DAY_OPTIONS } from "@/shared/constants/receive-days";
import { RECEIVE_TIME_SLOTS } from "@/shared/constants/receive-time-slots";
import { REGION_OPTIONS } from "@/shared/constants/regions";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { Toast } from "@/shared/ui/toast";

export function SettingsForm() {
  const router = useRouter();
  const authToken = useAuthStore((state) => state.authToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const form = useSettingsStore((state) => state.form);
  const hasExistingSubscription = useSettingsStore((state) => state.hasExistingSubscription);
  const toggleDay = useSettingsStore((state) => state.toggleDay);
  const setReceiveTime = useSettingsStore((state) => state.setReceiveTime);
  const toggleRegion = useSettingsStore((state) => state.toggleRegion);
  const toggleDistance = useSettingsStore((state) => state.toggleDistance);
  const applyResponse = useSettingsStore((state) => state.applyResponse);
  const markExistingSubscription = useSettingsStore((state) => state.markExistingSubscription);
  const resetForm = useSettingsStore((state) => state.reset);

  const { loading, error, message, loadMySubscription, updateSubscription, deleteSubscription } = useSettingsActions();
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [dismissedMessage, setDismissedMessage] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrapSubscription = async () => {
      const response = await loadMySubscription({ silent: true });
      if (mounted && response) {
        applyResponse(response);
      }
    };

    void bootstrapSubscription();

    return () => {
      mounted = false;
    };
  }, [applyResponse, authToken, loadMySubscription]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDismissedError(null);
    setDismissedMessage(null);

    const updated = await updateSubscription(form);
    if (updated) {
      markExistingSubscription(true);
    }
  };

  const handleDelete = async () => {
    setDismissedError(null);
    setDismissedMessage(null);
    const deleted = await deleteSubscription();
    if (deleted) {
      clearSession();
      resetForm();
      setIsDeleteConfirmOpen(false);
      router.replace("/");
    }
  };

  const selectedDays = form.receive_days.split(",").filter(Boolean);
  const toastError = error && error !== dismissedError ? error : null;
  const toastMessage = message && message !== dismissedMessage ? message : null;

  return (
    <div className="space-y-4">
      <form id="settings-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <h3 className="text-sm font-bold tracking-wide text-gray-700">수신 주기</h3>

            <fieldset className="mt-3 space-y-2">
              <legend className="text-xs font-semibold text-gray-500">수신 요일</legend>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {RECEIVE_DAY_OPTIONS.map((day) => (
                  <Checkbox
                    key={day.value}
                    checked={selectedDays.includes(day.value)}
                    className="text-xs"
                    label={day.label}
                    onChange={() => toggleDay(day.value)}
                  />
                ))}
              </div>
            </fieldset>

            <div className="mt-3 space-y-2">
              <span className="text-xs font-semibold text-gray-500">
                수신 시간
              </span>
              <div className="grid grid-cols-3 gap-2">
                {RECEIVE_TIME_SLOTS.map((timeSlot) => {
                  const isSelected = form.receive_time === timeSlot.value;
                  return (
                    <button
                      key={timeSlot.value}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                        isSelected
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                      type="button"
                      onClick={() => setReceiveTime(timeSlot.value)}
                    >
                      {timeSlot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <h3 className="text-sm font-bold tracking-wide text-gray-700">관심 조건</h3>

            <fieldset className="mt-3 space-y-2">
              <legend className="text-xs font-semibold text-gray-500">선호 지역</legend>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {REGION_OPTIONS.map((region) => (
                  <Checkbox
                    key={region}
                    checked={form.pref_regions.includes(region)}
                    className="text-xs"
                    label={region}
                    onChange={() => toggleRegion(region)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-3 space-y-2">
              <legend className="text-xs font-semibold text-gray-500">선호 코스</legend>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {DISTANCE_OPTIONS.map((distance) => (
                  <Checkbox
                    key={distance}
                    checked={form.pref_distances.includes(distance)}
                    className="text-xs"
                    label={distance}
                    onChange={() => toggleDistance(distance)}
                  />
                ))}
              </div>
            </fieldset>
          </section>
        </div>

        <section className="pt-1">
          <div className="flex justify-start">
            <Button
              className="h-9 w-auto rounded-lg bg-rose-500 px-3 text-sm shadow-none transition-colors hover:bg-rose-600 hover:shadow-none disabled:bg-rose-200"
              disabled={!hasExistingSubscription || loading}
              loading={loading}
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              구독 해지
            </Button>
          </div>
        </section>
      </form>

      <ConfirmModal
        cancelLabel="취소"
        confirmLabel="해지하기"
        description="구독을 해지하면 알림 메일이 더 이상 발송되지 않습니다."
        loading={loading}
        open={isDeleteConfirmOpen}
        title="구독을 해지할까요?"
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          void handleDelete();
        }}
      />

      {toastError && (
        <Toast
          message={toastError}
          variant="error"
          onClose={() => setDismissedError(toastError)}
        />
      )}
      {!toastError && toastMessage && (
        <Toast
          message={toastMessage}
          variant="success"
          onClose={() => setDismissedMessage(toastMessage)}
        />
      )}
    </div>
  );
}
