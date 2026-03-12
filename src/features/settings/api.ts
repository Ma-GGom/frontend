import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { SubscriptionResponse, SubscriptionUpdatePayload } from "@/features/settings/types";

export const settingsApi = {
  getMySubscription() {
    return apiClient.get<SubscriptionResponse>(API_ENDPOINTS.subscriptions.me);
  },

  updateSubscription(payload: SubscriptionUpdatePayload) {
    return apiClient.patch<void, SubscriptionUpdatePayload>(API_ENDPOINTS.subscriptions.me, payload);
  },

  deleteSubscription() {
    return apiClient.delete<void>(API_ENDPOINTS.subscriptions.me);
  },
};
