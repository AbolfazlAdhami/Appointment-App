import { beforeEach, describe, expect, it, vi } from "vitest";

const txMock = vi.hoisted(() => ({
  user: { findUnique: vi.fn(), count: vi.fn(), update: vi.fn() },
  authSession: { updateMany: vi.fn() },
  auditLog: { create: vi.fn() },
}));
const prismaMock = vi.hoisted(() => ({ $transaction: vi.fn() }));

vi.mock("../../libs/prisma", () => ({ prisma: prismaMock }));

import { Role } from "../../generated/prisma/client";
import { UpdateUserStatusSchema } from "../../schemas/admin-user.schema";
import { updateUserStatus } from "../admin-user.service";

const adminTarget = { id: "admin-2", role: Role.ADMIN, isActive: true };

describe("Admin user status service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    txMock.user.findUnique.mockResolvedValue({ id: "user-2", role: Role.PATIENT, isActive: true });
    txMock.user.count.mockResolvedValue(2);
    txMock.user.update.mockResolvedValue(undefined);
    txMock.authSession.updateMany.mockResolvedValue({ count: 2 });
    txMock.auditLog.create.mockResolvedValue(undefined);
    prismaMock.$transaction.mockImplementation((callback: (tx: typeof txMock) => unknown) => callback(txMock));
  });

  it("deactivates user, revokes sessions, and audits in one serializable transaction", async () => {
    const result = await updateUserStatus({
      actorUserId: "admin-1",
      targetUserId: "user-2",
      payload: { isActive: false, reason: "Security review" },
    });

    expect(result).toEqual({ kind: "updated", user: { id: "user-2", role: Role.PATIENT, isActive: false } });
    expect(txMock.user.update).toHaveBeenCalledWith({ where: { id: "user-2" }, data: { isActive: false } });
    expect(txMock.authSession.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: "user-2", revokedAt: null },
      data: expect.objectContaining({ revokedAt: expect.any(Date) }),
    }));
    expect(txMock.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        actorUserId: "admin-1",
        action: "USER_DEACTIVATED",
        entityType: "User",
        entityId: "user-2",
        reason: "Security review",
      }),
    }));
    expect(prismaMock.$transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: "Serializable" });
  });

  it("does not revoke sessions when activating a user", async () => {
    txMock.user.findUnique.mockResolvedValue({ id: "user-2", role: Role.PATIENT, isActive: false });

    await updateUserStatus({
      actorUserId: "admin-1",
      targetUserId: "user-2",
      payload: { isActive: true, reason: "Appeal approved" },
    });

    expect(txMock.user.update).toHaveBeenCalledWith({ where: { id: "user-2" }, data: { isActive: true } });
    expect(txMock.authSession.updateMany).not.toHaveBeenCalled();
    expect(txMock.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: "USER_ACTIVATED" }),
    }));
  });

  it("prevents self-deactivation and deactivation of the last active admin", async () => {
    txMock.user.findUnique.mockResolvedValue(adminTarget);
    await expect(updateUserStatus({
      actorUserId: "admin-2",
      targetUserId: "admin-2",
      payload: { isActive: false, reason: "No longer needed" },
    })).resolves.toMatchObject({ kind: "self_deactivation" });
    expect(txMock.user.update).not.toHaveBeenCalled();

    txMock.user.findUnique.mockResolvedValue(adminTarget);
    txMock.user.count.mockResolvedValue(1);
    await expect(updateUserStatus({
      actorUserId: "admin-1",
      targetUserId: "admin-2",
      payload: { isActive: false, reason: "No longer needed" },
    })).resolves.toMatchObject({ kind: "last_active_admin" });
    expect(txMock.user.update).not.toHaveBeenCalled();
  });

  it("returns not found and unchanged states without generating audit noise", async () => {
    txMock.user.findUnique.mockResolvedValue(null);
    await expect(updateUserStatus({
      actorUserId: "admin-1",
      targetUserId: "missing",
      payload: { isActive: false, reason: "Reason" },
    })).resolves.toEqual({ kind: "not_found" });

    txMock.user.findUnique.mockResolvedValue({ id: "user-2", role: Role.PATIENT, isActive: true });
    await expect(updateUserStatus({
      actorUserId: "admin-1",
      targetUserId: "user-2",
      payload: { isActive: true, reason: "Reason" },
    })).resolves.toMatchObject({ kind: "unchanged" });
    expect(txMock.user.update).not.toHaveBeenCalled();
    expect(txMock.auditLog.create).not.toHaveBeenCalled();
  });
});

describe("UpdateUserStatusSchema", () => {
  it("requires an explicit status and meaningful reason and rejects role changes", () => {
    expect(UpdateUserStatusSchema.safeParse({ isActive: false, reason: "Policy review" }).success).toBe(true);
    expect(UpdateUserStatusSchema.safeParse({ isActive: false, reason: "x" }).success).toBe(false);
    expect(UpdateUserStatusSchema.safeParse({ isActive: false, reason: "Policy review", role: "ADMIN" }).success).toBe(false);
    expect(UpdateUserStatusSchema.safeParse({ isActive: "false", reason: "Policy review" }).success).toBe(false);
  });
});