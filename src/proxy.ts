import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/shared/lib/env";

function getEmailFromAccessToken(token: string): string | null {
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

export function proxy(request: NextRequest) {
  const token = request.cookies.get(env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME)?.value;
  const tokenEmail = token ? getEmailFromAccessToken(token) : null;

  if (!token || !tokenEmail) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*"],
};
