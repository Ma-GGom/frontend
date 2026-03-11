import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { SubscriptionMutationResponse, SubscriptionPayload, SubscriptionResponse } from "@/features/settings/types";

export const settingsApi = {
  createSubscription(payload: SubscriptionPayload) {
    return apiClient.post<SubscriptionMutationResponse, SubscriptionPayload>(API_ENDPOINTS.subscriptions.create, payload);
  },

  getMySubscription() {
    return apiClient.get<SubscriptionResponse>(API_ENDPOINTS.subscriptions.me);
  },

  updateSubscription(payload: Partial<SubscriptionPayload>) {
    return apiClient.patch<SubscriptionMutationResponse, Partial<SubscriptionPayload>>(API_ENDPOINTS.subscriptions.me, payload);
  },

  deleteSubscription() {
    return apiClient.delete<SubscriptionMutationResponse>(API_ENDPOINTS.subscriptions.me);
  },
};
