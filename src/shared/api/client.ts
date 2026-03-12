import { env } from "@/shared/lib/env";
import { clearAuthToken, getAuthToken } from "@/shared/lib/storage";
import type { ApiError } from "@/types/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  auth?: boolean;
  headers?: HeadersInit;
}

export class ApiRequestError extends Error implements ApiError {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, { method: "GET", ...options });
  }

  async post<T, TBody = unknown>(path: string, body: TBody, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, { method: "POST", body, ...options });
  }

  async patch<T, TBody = unknown>(path: string, body: TBody, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, { method: "PATCH", body, ...options });
  }

  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, { method: "DELETE", ...options });
  }

  private async request<T>(
    path: string,
    config: {
      method: HttpMethod;
      body?: unknown;
      auth?: boolean;
      headers?: HeadersInit;
    },
  ): Promise<T> {
    const shouldUseAuth = config.auth ?? true;
    const token = shouldUseAuth ? getAuthToken() : null;
    const headers = new Headers(config.headers);

    if (config.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: config.method,
      headers,
      body: config.body !== undefined ? JSON.stringify(config.body) : undefined,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json") ?? false;
    const responseBody = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (shouldUseAuth && response.status === 401 && typeof window !== "undefined") {
        clearAuthToken();
        window.location.replace("/");
      }

      const errorMessage =
        typeof responseBody === "object" && responseBody !== null && "message" in responseBody
          ? String(responseBody.message)
          : `요청 처리에 실패했습니다. (${response.status})`;

      throw new ApiRequestError(response.status, errorMessage);
    }

    return responseBody as T;
  }
}

export const apiClient = new ApiClient(env.NEXT_PUBLIC_API_BASE_URL);
