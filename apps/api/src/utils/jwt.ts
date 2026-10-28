import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { Role } from "../generated/prisma/client";
import { env } from "../config/env";

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}

export function generateAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, env.jwtSecret);

  if (typeof payload === "string" || typeof payload.userId !== "string" || !Object.values(Role).includes(payload.role as Role)) {
    throw new Error("Invalid access token payload");
  }

  return {
    userId: payload.userId,
    role: payload.role as Role,
  };
}
