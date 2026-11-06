import type { ErrorRequestHandler } from "express";
import { AuthServiceError } from "../services/auth.service";

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("[API ERROR]", err);

  if (err instanceof AuthServiceError) {
    const statusCodes = {
      INVALID_INPUT: 400,
      INVALID_OTP: 400,
      INVALID_CREDENTIALS: 401,
      DUPLICATE_USER: 409,
    } as const;

    return res.status(statusCodes[err.code]).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};

export default errorHandler;
