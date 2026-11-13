import { AuditActorType, AuditOutcome, Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { UpdateUserStatusInput } from "../schemas/admin-user.schema";

export type UpdateUserStatusResult =
  | { kind: "not_found" }
  | { kind: "self_deactivation" }
  | { kind: "last_active_admin" }
  | { kind: "unchanged"; user: { id: string; role: Role; isActive: boolean } }
  | { kind: "updated"; user: { id: string; role: Role; isActive: boolean; previousRole?: Role } };

export async function updateUserStatus(input: {
  actorUserId: string;
  targetUserId: string;
  payload: UpdateUserStatusInput;
}): Promise<UpdateUserStatusResult> {
  return prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: input.targetUserId },
      select: { id: true, role: true, isActive: true, firstName: true, lastName: true },
    });

    if (!target) return { kind: "not_found" };

    if (!input.payload.isActive && target.id === input.actorUserId) {
      return { kind: "self_deactivation" };
    }

    if (target.isActive === input.payload.isActive) {
      return { kind: "unchanged", user: { id: target.id, role: target.role, isActive: target.isActive } };
    }

    if (!input.payload.isActive && target.role === Role.ADMIN) {
      const activeAdminCount = await tx.user.count({ where: { role: Role.ADMIN, isActive: true } });
      if (activeAdminCount <= 1) return { kind: "last_active_admin" };
    }

    const previousRole = target.role;

    await tx.user.update({
      where: { id: target.id },
      data: { isActive: input.payload.isActive },
    });

    if (!input.payload.isActive) {
      await tx.authSession.updateMany({
        where: { userId: target.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await tx.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        actorType: AuditActorType.ADMIN,
        action: input.payload.isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
        entityType: "User",
        entityId: target.id,
        outcome: AuditOutcome.SUCCESS,
        reason: input.payload.reason,
        changes: {
          isActive: { from: target.isActive, to: input.payload.isActive },
          ...(previousRole !== target.role ? { role: { from: previousRole, to: target.role } } : {}),
        },
      },
    });

    return {
      kind: "updated",
      user: { id: target.id, role: target.role, isActive: input.payload.isActive },
    };
  }, { isolationLevel: "Serializable" });
}
