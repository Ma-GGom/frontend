export const API_ENDPOINTS = {
  auth: {
    sendCode: "/auth/email/send-code",
    verifyCode: "/auth/email/verify",
  },
  subscriptions: {
    create: "/subscriptions",
    me: "/subscriptions/me",
  },
} as const;
