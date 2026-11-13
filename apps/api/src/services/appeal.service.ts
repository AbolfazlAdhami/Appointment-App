import { AuditActorType, AuditOutcome, AppealStatus, Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { CreateAppealInput, ReviewAppealInput } from "../schemas/appeal.schema";

export type AppealRecord = {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  reason: string;
  status: AppealStatus;
  reviewNote: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
};

export type ListAppealsResult = {
  items: AppealRecord[];
  total: number;
  cursor: string | null;
};

export async function createAppeal(input: {
  actorUserId: string;
  payload: CreateAppealInput;
}): Promise<{ id: string }> {
  const appeal = await prisma.appeal.create({
    data: {
      userId: input.actorUserId,
      reason: input.payload.reason.trim(),
      status: AppealStatus.PENDING,
    },
    select: { id: true },
  });

  return appeal;
}

export async function listOpenAppeals(params: {
  actorUserId: string;
  limit: number;
  cursor?: string;
}): Promise<ListAppealsResult> {
  const where = params.cursor
    ? { id: { lt: params.cursor }, status: { not: AppealStatus.REJECTED } }
    : { status: { not: AppealStatus.REJECTED } };

  const [items, total] = await Promise.all([
    prisma.appeal.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: params.limit,
      skip: params.cursor ? 1 : 0,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    }),
    prisma.appeal.count({ where }),
  ]);

  const itemsTyped = items.map((a) => ({
    id: a.id,
    userId: a.userId,
    userName: `${a.user.firstName} ${a.user.lastName}`.trim(),
    userRole: a.user.role,
    reason: a.reason,
    status: a.status,
    reviewNote: a.reviewNote ?? null,
    reviewedAt: a.reviewedAt,
    createdAt: a.createdAt,
  }));

  const cursor = items.length > 0 ? items[items.length - 1].id : null;

  return { items: itemsTyped, total, cursor };
}

export async function reviewAppeal(input: {
  actorUserId: string;
  appealId: string;
  payload: ReviewAppealInput;
}): Promise<{
  kind: "not_found" | "already_reviewed" | "reviewed";
  status?: AppealStatus;
}> {
  return prisma.$transaction(async (tx) => {
    const appeal = await tx.appeal.findUnique({
      where: { id: input.appealId },
      select: { id: true, userId: true, status: true },
    });

    if (!appeal) return { kind: "not_found" } as const;
    if (appeal.status !== AppealStatus.PENDING) return { kind: "already_reviewed" } as const;

    const decision = input.payload.decision === "ACCEPTED" ? AppealStatus.ACCEPTED : AppealStatus.REJECTED;

    // If accepted, restore user account and set isActive=true
    if (decision === AppealStatus.ACCEPTED) {
      await tx.user.update({
        where: { id: appeal.userId },
        data: { isActive: true },
      });
    }

    await tx.appeal.update({
      where: { id: appeal.id },
      data: {
        status: decision,
        reviewNote: input.payload.note?.trim() || null,
        reviewedById: input.actorUserId,
        reviewedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        actorType: AuditActorType.ADMIN,
        action: `APPEAL_${decision}`,
        entityType: "Appeal",
        entityId: appeal.id,
        outcome: AuditOutcome.SUCCESS,
        reason: input.payload.note || undefined,
        changes: { userId: appeal.userId, previousStatus: AppealStatus.PENDING, newStatus: decision },
      },
    });

    return { kind: "reviewed", status: decision } as const;
  }, { isolationLevel: "Serializable" });
}
