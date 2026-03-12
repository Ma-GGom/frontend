export type AuthFlow = "SUBSCRIBE" | "SETTINGS";

export interface SendCodeRequest {
  email: string;
  flow: AuthFlow;
}

export interface SendCodeResponse {
  message: string;
  expires_in: number;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  access_token: string;
}
