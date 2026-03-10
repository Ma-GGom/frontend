import { create } from "zustand";
import type { SubscriptionPayload, SubscriptionResponse } from "@/features/subscription/types";

interface SubscriptionState {
  form: SubscriptionPayload;
  hasExistingSubscription: boolean;
  setEmail: (email: string) => void;
  setReceiveDays: (days: string[]) => void;
  toggleDay: (day: string) => void;
  setReceiveTime: (value: string) => void;
  toggleRegion: (region: string) => void;
  toggleDistance: (distance: string) => void;
  setIncludeSmall: (value: boolean) => void;
  applyResponse: (data: SubscriptionResponse) => void;
  markExistingSubscription: (value: boolean) => void;
  reset: () => void;
}

const defaultForm: SubscriptionPayload = {
  email: "",
  receive_days: "MON,FRI",
  receive_time: "08:00:00",
  pref_regions: ["수도권"],
  pref_distances: ["10K"],
  include_small: true,
};

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  form: defaultForm,
  hasExistingSubscription: false,
  setEmail: (email) =>
    set((state) => ({
      form: { ...state.form, email },
    })),
  setReceiveDays: (days) =>
    set((state) => ({
      form: { ...state.form, receive_days: uniqueValues(days).join(",") },
    })),
  toggleDay: (day) =>
    set((state) => {
      const currentDays = state.form.receive_days.split(",").filter(Boolean);
      const hasDay = currentDays.includes(day);
      const nextDays = hasDay ? currentDays.filter((current) => current !== day) : [...currentDays, day];

      return {
        form: {
          ...state.form,
          receive_days: uniqueValues(nextDays).join(","),
        },
      };
    }),
  setReceiveTime: (value) =>
    set((state) => ({
      form: { ...state.form, receive_time: value },
    })),
  toggleRegion: (region) =>
    set((state) => {
      const hasRegion = state.form.pref_regions.includes(region);
      const nextRegions = hasRegion ? state.form.pref_regions.filter((current) => current !== region) : [...state.form.pref_regions, region];
      return {
        form: {
          ...state.form,
          pref_regions: uniqueValues(nextRegions),
        },
      };
    }),
  toggleDistance: (distance) =>
    set((state) => {
      const hasDistance = state.form.pref_distances.includes(distance);
      const nextDistances = hasDistance
        ? state.form.pref_distances.filter((current) => current !== distance)
        : [...state.form.pref_distances, distance];
      return {
        form: {
          ...state.form,
          pref_distances: uniqueValues(nextDistances),
        },
      };
    }),
  setIncludeSmall: (include_small) =>
    set((state) => ({
      form: { ...state.form, include_small },
    })),
  applyResponse: (data) =>
    set(() => ({
      form: data,
      hasExistingSubscription: true,
    })),
  markExistingSubscription: (value) =>
    set(() => ({
      hasExistingSubscription: value,
    })),
  reset: () =>
    set(() => ({
      form: defaultForm,
      hasExistingSubscription: false,
    })),
}));
