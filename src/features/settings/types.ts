export interface SubscriptionSettings {
  receive_days: string;
  receive_time: string;
  pref_regions: string[];
  pref_distances: string[];
  include_small: boolean;
}

export type SubscriptionResponse = SubscriptionSettings;
export type SubscriptionUpdatePayload = Partial<SubscriptionSettings>;
