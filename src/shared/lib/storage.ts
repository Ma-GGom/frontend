import { env } from "@/shared/lib/env";

const AUTH_TOKEN_STORAGE_KEY = "maggom_auth_token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getAuthTokenFromCookie(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const cookieKey = `${env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME}=`;
  const matchedCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(cookieKey));

  if (!matchedCookie) {
    return null;
  }

  return decodeURIComponent(matchedCookie.slice(cookieKey.length));
}

export function getEmailFromAccessToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) {
      return null;
    }

    const normalizedPayload = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const parsedPayload = JSON.parse(atob(paddedPayload)) as { sub?: unknown };

    return typeof parsedPayload.sub === "string" ? parsedPayload.sub : null;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);

  document.cookie = `${env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  document.cookie = `${env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}
