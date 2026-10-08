import { Response } from "express";
import type { ApiResponse } from "@appointment/types";

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  const response: ApiResponse<T> = {
    data,
    metadata: {
      success: true,
      ...(message ? { message } : {}),
      timestamp: new Date().toISOString(),
    },
  };

  res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 400): void {
  const response: ApiResponse<null> = {
    data: null,
    metadata: {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(statusCode).json(response);
}
