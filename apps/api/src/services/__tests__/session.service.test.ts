import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { randomInt, randomUUID } from "node:crypto";

import { Role } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import { createSession, refreshSession, revokeSession, revokeAllSessions } from "../session.service";

describe("Session Service", () => {
  let userId: string;
  let phone: string;

  beforeEach(async () => {
    const suffix = randomUUID().replace(/-/g, "").slice(0, 10);
    phone = `+4915${randomInt(100000000, 999999999)}`;

    const user = await prisma.user.create({
      data: {
        firstName: "Session",
        lastName: "Test",
        nationalId: `S${suffix}`,
        dateOfBirth: new Date("1995-05-15"),
        phone,
        role: Role.PATIENT,
      },
    });

    userId = user.id;
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { id: userId },
    });
  });

  it("creates a session and stores only the refresh token hash", async () => {
    const tokens = await createSession(userId);

    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
    expect(tokens.refreshTokenExpiresAt.getTime()).toBeGreaterThan(Date.now());

    const session = await prisma.authSession.findFirstOrThrow({
      where: { userId },
    });

    expect(session.refreshTokenHash).not.toBe(tokens.refreshToken);
    expect(session.refreshTokenHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rotates the refresh token", async () => {
    const original = await createSession(userId);
    const refreshed = await refreshSession(original.refreshToken);

    expect(refreshed.refreshToken).not.toBe(original.refreshToken);
    expect(refreshed.accessToken).toBeTruthy();

    const session = await prisma.authSession.findFirstOrThrow({
      where: { userId },
    });

    expect(session.refreshTokenHash).not.toBe(original.refreshToken);
    expect(session.lastUsedAt).not.toBeNull();
  });

  it("rejects reuse of an old refresh token", async () => {
    const original = await createSession(userId);

    await refreshSession(original.refreshToken);

    await expect(refreshSession(original.refreshToken)).rejects.toThrow("Invalid or expired refresh token");
  });

  it("rejects an expired session", async () => {
    const tokens = await createSession(userId);

    await prisma.authSession.updateMany({
      where: { userId },
      data: {
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await expect(refreshSession(tokens.refreshToken)).rejects.toThrow("Invalid or expired refresh token");
  });

  it("rejects a revoked session", async () => {
    const tokens = await createSession(userId);

    const session = await prisma.authSession.findFirstOrThrow({
      where: { userId },
    });

    await revokeSession(session.id, userId);

    await expect(refreshSession(tokens.refreshToken)).rejects.toThrow("Invalid or expired refresh token");
  });

  it("rejects refresh when the user is inactive", async () => {
    const tokens = await createSession(userId);

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    await expect(refreshSession(tokens.refreshToken)).rejects.toThrow("Invalid or expired refresh token");
  });

  it("revokes all active sessions for a user", async () => {
    await createSession(userId);
    await createSession(userId);

    await revokeAllSessions(userId);

    const sessions = await prisma.authSession.findMany({
      where: { userId },
    });

    expect(sessions).toHaveLength(2);
    expect(sessions.every((session) => session.revokedAt !== null)).toBe(true);
  });

  it("allows only one concurrent refresh using the same token", async () => {
    const tokens = await createSession(userId);

    const results = await Promise.allSettled([refreshSession(tokens.refreshToken), refreshSession(tokens.refreshToken)]);

    const fulfilled = results.filter((result) => result.status === "fulfilled");

    const rejected = results.filter((result) => result.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
  });
});
