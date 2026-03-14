import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { apiClient } from "@/shared/api/client";
import type {
  AdminSendTestMailRequest,
  AdminSendTestMailResponse,
} from "@/features/admin/types";

export const adminApi = {
  sendTestMail(payload: AdminSendTestMailRequest) {
    return apiClient.post<AdminSendTestMailResponse, AdminSendTestMailRequest>(
      API_ENDPOINTS.admin.sendTestMail,
      payload,
    );
  },
};
