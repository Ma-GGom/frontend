export const API_ENDPOINTS = {
  auth: {
    sendCode: "/auth/email/send-code",
    verifyCode: "/auth/email/verify",
  },
  subscriptions: {
    me: "/subscriptions/me",
    count: "/subscriptions/count",
  },
} as const;
