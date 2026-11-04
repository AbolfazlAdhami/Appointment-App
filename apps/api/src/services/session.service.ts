import { createHash, randomBytes } from "node:crypto";
import type { Prisma } from "../generated/prisma/client";

import { prisma } from "../libs/prisma";
import { env } from "../config/env";
import { generateAccessToken } from "../utils/jwt";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

function generateRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getRefreshTokenExpiration(): Date {
  return new Date(Date.now() + env.refreshTokenTtlSeconds * 1000);
}

/**
 * Creates a session using an existing Prisma transaction.
 * This function does not start or commit a transaction.
 */
export async function createSessionWithTransaction(tx: Prisma.TransactionClient, userId: string): Promise<SessionTokens> {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = getRefreshTokenExpiration();

  const session = await tx.authSession.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt,
    },
  });

  const accessToken = generateAccessToken({
    userId,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
}

/**
 * Creates a session independently.
 * Used by the existing email/password login.
 */
export async function createSession(userId: string): Promise<SessionTokens> {
  return prisma.$transaction((tx) => createSessionWithTransaction(tx, userId));
}

export async function refreshSession(currentRefreshToken: string): Promise<SessionTokens> {
  const currentHash = hashRefreshToken(currentRefreshToken);

  const session = await prisma.authSession.findUnique({
    where: {
      refreshTokenHash: currentHash,
    },
    include: {
      user: {
        select: {
          id: true,
          isActive: true,
        },
      },
    },
  });

  const now = new Date();

  if (!session || session.revokedAt || session.expiresAt <= now || !session.user.isActive) {
    throw new Error("Invalid or expired refresh token");
  }

  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
  const newExpiresAt = getRefreshTokenExpiration();

  const updated = await prisma.authSession.updateMany({
    where: {
      id: session.id,
      refreshTokenHash: currentHash,
      revokedAt: null,
      expiresAt: {
        gt: now,
      },
    },
    data: {
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: newExpiresAt,
      lastUsedAt: now,
    },
  });

  if (updated.count !== 1) {
    throw new Error("Invalid or expired refresh token");
  }

  const accessToken = generateAccessToken({
    userId: session.userId,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    refreshTokenExpiresAt: newExpiresAt,
  };
}

export async function revokeSession(sessionId: string, userId: string): Promise<void> {
  await prisma.authSession.updateMany({
    where: {
      id: sessionId,
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.authSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
