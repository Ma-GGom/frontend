import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { SubscriberCountResponse } from "@/features/home/types";

export async function fetchSubscriberCount(): Promise<SubscriberCountResponse> {
  return apiClient.get<SubscriberCountResponse>(API_ENDPOINTS.subscriptions.count, { auth: false });
}
