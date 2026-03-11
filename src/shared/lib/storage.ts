import { env } from "@/shared/lib/env";

const AUTH_TOKEN_STORAGE_KEY = "maggom_auth_token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

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
