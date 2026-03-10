"use client";

import { FormEvent, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useSubscriptionActions } from "@/features/subscription/hooks";
import { useSubscriptionStore } from "@/features/subscription/store";
import type { SubscriptionPayload } from "@/features/subscription/types";
import { DISTANCE_OPTIONS } from "@/shared/constants/distances";
import { RECEIVE_DAY_OPTIONS } from "@/shared/constants/receive-days";
import { REGION_OPTIONS } from "@/shared/constants/regions";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";

function ensureTimeWithSeconds(timeValue: string): string {
  return timeValue.length === 5 ? `${timeValue}:00` : timeValue;
}

function toTimeInputValue(timeValue: string): string {
  return timeValue.slice(0, 5);
}

export function SubscriptionForm() {
  const savedEmail = useAuthStore((state) => state.email);
  const form = useSubscriptionStore((state) => state.form);
  const hasExistingSubscription = useSubscriptionStore((state) => state.hasExistingSubscription);
  const setEmail = useSubscriptionStore((state) => state.setEmail);
  const toggleDay = useSubscriptionStore((state) => state.toggleDay);
  const setReceiveTime = useSubscriptionStore((state) => state.setReceiveTime);
  const toggleRegion = useSubscriptionStore((state) => state.toggleRegion);
  const toggleDistance = useSubscriptionStore((state) => state.toggleDistance);
  const setIncludeSmall = useSubscriptionStore((state) => state.setIncludeSmall);
  const applyResponse = useSubscriptionStore((state) => state.applyResponse);
  const markExistingSubscription = useSubscriptionStore((state) => state.markExistingSubscription);
  const resetForm = useSubscriptionStore((state) => state.reset);

  const { loading, error, message, loadMySubscription, createSubscription, updateSubscription, deleteSubscription } = useSubscriptionActions();

  useEffect(() => {
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [savedEmail, setEmail]);

  const loadSubscription = async () => {
    const response = await loadMySubscription();
    if (response) {
      applyResponse(response);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: SubscriptionPayload = {
      ...form,
      receive_time: ensureTimeWithSeconds(form.receive_time),
    };

    if (hasExistingSubscription) {
      const response = await updateSubscription(payload);
      if (response?.success) {
        markExistingSubscription(true);
      }
      return;
    }

    const response = await createSubscription(payload);
    if (response?.success) {
      markExistingSubscription(true);
    }
  };

  const handleDelete = async () => {
    const response = await deleteSubscription();
    if (response?.success) {
      resetForm();
    }
  };

  const selectedDays = form.receive_days.split(",").filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
        인증 후 최초 등록은 <strong>POST /subscriptions</strong>, 이후 저장은 <strong>PATCH /subscriptions/me</strong> 호출 방식입니다.
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="subscription-email">
            수신 이메일
          </label>
          <Input
            id="subscription-email"
            placeholder="user@example.com"
            required
            type="email"
            value={form.email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium text-slate-700">수신 요일</legend>
          <div className="grid grid-cols-4 gap-2">
            {RECEIVE_DAY_OPTIONS.map((day) => (
              <Checkbox
                key={day.value}
                checked={selectedDays.includes(day.value)}
                label={day.label}
                onChange={() => toggleDay(day.value)}
              />
            ))}
          </div>
        </fieldset>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="receive-time">
            수신 시간
          </label>
          <Input
            id="receive-time"
            required
            type="time"
            value={toTimeInputValue(form.receive_time)}
            onChange={(event) => setReceiveTime(ensureTimeWithSeconds(event.target.value))}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium text-slate-700">선호 지역</legend>
          <div className="grid grid-cols-2 gap-2">
            {REGION_OPTIONS.map((region) => (
              <Checkbox
                key={region}
                checked={form.pref_regions.includes(region)}
                label={region}
                onChange={() => toggleRegion(region)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium text-slate-700">선호 코스</legend>
          <div className="grid grid-cols-2 gap-2">
            {DISTANCE_OPTIONS.map((distance) => (
              <Checkbox
                key={distance}
                checked={form.pref_distances.includes(distance)}
                label={distance}
                onChange={() => toggleDistance(distance)}
              />
            ))}
          </div>
        </fieldset>

        <Checkbox checked={form.include_small} label="소규모 대회 포함" onChange={(event) => setIncludeSmall(event.target.checked)} />

        <div className="grid grid-cols-2 gap-3">
          <Button className="w-full" loading={loading} type="submit">
            {hasExistingSubscription ? "설정 저장" : "구독 등록"}
          </Button>
          <Button className="w-full bg-slate-700 hover:bg-slate-800" loading={loading} type="button" onClick={loadSubscription}>
            내 설정 불러오기
          </Button>
        </div>
      </form>

      <Button className="w-full bg-red-600 hover:bg-red-700" loading={loading} type="button" onClick={handleDelete}>
        구독 해지
      </Button>

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
