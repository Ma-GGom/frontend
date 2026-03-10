import type { ApiSuccessResponse } from "@/types/api";

export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse extends ApiSuccessResponse {
  expires_in: number;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse extends ApiSuccessResponse {
  auth_token: string;
}
