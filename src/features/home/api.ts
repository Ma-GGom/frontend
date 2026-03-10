import type { ServerStatusResponse, SubscriberCountResponse } from "@/features/home/types";

export async function fetchSubscriberCount(): Promise<SubscriberCountResponse> {
  const response = await fetch("/api/subscribers/count", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("구독자 수를 불러오지 못했습니다.");
  }

  return (await response.json()) as SubscriberCountResponse;
}

export async function fetchServerStatus(): Promise<ServerStatusResponse> {
  const response = await fetch("/api/system/status", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("서버 상태를 불러오지 못했습니다.");
  }

  return (await response.json()) as ServerStatusResponse;
}
