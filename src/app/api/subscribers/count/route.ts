import { NextResponse } from "next/server";

function parseCount(rawValue: string | undefined, fallback: number): number {
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number(rawValue);
  if (Number.isFinite(parsed) && parsed >= 0) {
    return Math.floor(parsed);
  }

  return fallback;
}

async function fetchRemoteCount(remoteUrl: string): Promise<number | null> {
  try {
    const response = await fetch(remoteUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    if (typeof payload === "object" && payload !== null && "count" in payload) {
      const candidate = Number((payload as { count: unknown }).count);
      if (Number.isFinite(candidate) && candidate >= 0) {
        return Math.floor(candidate);
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  const fallbackCount = parseCount(process.env.SUBSCRIBER_COUNT_MOCK, 127);
  const remoteUrl = process.env.SUBSCRIBER_COUNT_API_URL;

  if (remoteUrl) {
    const remoteCount = await fetchRemoteCount(remoteUrl);
    if (remoteCount !== null) {
      return NextResponse.json(
        {
          count: remoteCount,
          source: "remote",
          updated_at: new Date().toISOString(),
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }
  }

  return NextResponse.json(
    {
      count: fallbackCount,
      source: "mock",
      updated_at: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
