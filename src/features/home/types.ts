export interface SubscriberCountResponse {
  count: number;
  source: "mock" | "remote";
  updated_at: string;
}

export type ServerStatus = "online" | "offline" | "unknown";
export type ServerStatusLevel = "congested" | "normal" | "smooth";

export interface ServerStatusResponse {
  status: ServerStatus;
  level: ServerStatusLevel;
  message: string;
  checked_at: string;
}
