import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthTokenPayload {
  userId: string;
  sessionId: string;
}

export function generateAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.accessTokenExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, env.jwtSecret);

  if (typeof payload === "string" || typeof payload.userId !== "string" || typeof payload.sessionId !== "string") {
    throw new Error("Invalid access token payload");
  }

  return {
    userId: payload.userId,
    sessionId: payload.sessionId,
  };
}
