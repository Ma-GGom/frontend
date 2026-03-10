import type { ApiSuccessResponse } from "@/types/api";

export interface SubscriptionPayload {
  email: string;
  receive_days: string;
  receive_time: string;
  pref_regions: string[];
  pref_distances: string[];
  include_small: boolean;
}

export type SubscriptionResponse = SubscriptionPayload;

export interface SubscriptionMutationResponse extends ApiSuccessResponse {
  member_id?: number;
}
