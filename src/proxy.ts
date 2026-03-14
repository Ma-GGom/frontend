import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/shared/lib/env";

interface AccessTokenPayload {
  sub?: unknown;
  role?: unknown;
  roles?: unknown;
  authorities?: unknown;
}

function getAccessTokenPayload(token: string): AccessTokenPayload | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) {
      return null;
    }

    const normalizedPayload = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    return JSON.parse(atob(paddedPayload)) as AccessTokenPayload;
  } catch {
    return null;
  }
}

function collectRoleValues(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function hasAdminRole(payload: AccessTokenPayload | null): boolean {
  if (!payload) {
    return false;
  }

  const roles = [
    ...collectRoleValues(payload.role),
    ...collectRoleValues(payload.roles),
    ...collectRoleValues(payload.authorities),
  ].map((role) => role.trim().toUpperCase());

  return roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");
}

function parseAdminEmailAllowlist(raw: string): Set<string> {
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME)?.value;
  const tokenPayload = token ? getAccessTokenPayload(token) : null;
  const tokenEmail = tokenPayload && typeof tokenPayload.sub === "string" ? tokenPayload.sub : null;

  if (!token || !tokenEmail) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const allowlistRaw = process.env.ADMIN_EMAIL_ALLOWLIST ?? "";
    const allowlist = parseAdminEmailAllowlist(allowlistRaw);
    const isAdmin = hasAdminRole(tokenPayload) || allowlist.has(tokenEmail.toLowerCase());

    if (!isAdmin) {
      const url = new URL("/settings", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*", "/admin/:path*"],
};
