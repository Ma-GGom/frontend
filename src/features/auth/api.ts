import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { SendCodeRequest, SendCodeResponse, VerifyCodeRequest, VerifyCodeResponse } from "@/features/auth/types";

export const authApi = {
  sendCode(payload: SendCodeRequest) {
    return apiClient.post<SendCodeResponse, SendCodeRequest>(API_ENDPOINTS.auth.sendCode, payload, { auth: false });
  },

  verifyCode(payload: VerifyCodeRequest) {
    return apiClient.post<VerifyCodeResponse, VerifyCodeRequest>(API_ENDPOINTS.auth.verifyCode, payload, { auth: false });
  },
};
