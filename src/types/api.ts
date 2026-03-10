export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
}
