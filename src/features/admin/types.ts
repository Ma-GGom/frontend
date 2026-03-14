export type AdminTemplateType = "WELCOME" | "NOTIFICATION";

export interface AdminSendTestMailRequest {
  to_email: string;
  template_type: AdminTemplateType;
  subject?: string;
  variables: Record<string, unknown>;
}

export interface AdminSendTestMailResponse {
  message?: string;
  request_id?: string;
  [key: string]: unknown;
}

export interface AdminTestMailHistoryItem {
  id: string;
  sent_at: string;
  to_email: string;
  template_type: AdminTemplateType;
  status: "success" | "error";
  detail: string;
}
