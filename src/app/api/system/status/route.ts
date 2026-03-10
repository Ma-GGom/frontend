import { NextResponse } from "next/server";

type ServerStatus = "online" | "offline" | "unknown";
type ServerStatusLevel = "congested" | "normal" | "smooth";

interface ServerStatusPayload {
  status: ServerStatus;
  level: ServerStatusLevel;
  message: string;
  checked_at: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

async function checkEndpoint(url: string): Promise<ServerStatusPayload> {
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    const latencyMs = Date.now() - startedAt;

    if (response.status >= 500) {
      return {
        status: "offline",
        level: "congested",
        message: "불안",
        checked_at: nowIso(),
      };
    }

    if (latencyMs > 1200) {
      return {
        status: "online",
        level: "congested",
        message: "불안",
        checked_at: nowIso(),
      };
    }

    if (latencyMs > 500) {
      return {
        status: "online",
        level: "normal",
        message: "보통",
        checked_at: nowIso(),
      };
    }

    return {
      status: "online",
      level: "smooth",
      message: "원활",
      checked_at: nowIso(),
    };
  } catch {
    return {
      status: "offline",
      level: "congested",
      message: "불안",
      checked_at: nowIso(),
    };
  }
}

function getTargetEndpoint(): string | null {
  const explicit = process.env.SYSTEM_STATUS_API_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (apiBase) {
    return apiBase;
  }

  return null;
}

export async function GET() {
  const target = getTargetEndpoint();

  if (!target) {
    return NextResponse.json(
      {
        status: "unknown",
        level: "normal",
        message: "보통",
        checked_at: nowIso(),
      } satisfies ServerStatusPayload,
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const payload = await checkEndpoint(target);
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
