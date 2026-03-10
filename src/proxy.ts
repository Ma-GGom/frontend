import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/shared/lib/env";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const url = new URL("/auth/email", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/subscription/:path*"],
};
