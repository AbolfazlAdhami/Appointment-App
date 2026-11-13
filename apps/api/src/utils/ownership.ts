import { Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";

/**
 * Returns true when `actorUserId` owns (or operates on behalf of) `resourceOwnerId`.
 * Used by services before performing write mutations to prevent cross-user access.
 */
export function isOwnerOrSelf(actorUserId: string, resourceOwnerId: string): boolean {
  return actorUserId === resourceOwnerId;
}

/**
 * Validates resource ownership and throws a structured error when invalid.
 * Call this inside services immediately after fetching a resource.
 */
export async function assertResourceOwnership(params: {
  resourceOwnerId: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
}): Promise<void> {
  const { resourceOwnerId, actorUserId, entityType, entityId } = params;

  if (!isOwnerOrSelf(actorUserId, resourceOwnerId)) {
    const err = Object.assign(
      new Error(`Access denied: ${entityType} ${entityId} does not belong to you`),
      { statusCode: 403 },
    );

    await prisma.auditLog.create({
      data: {
        actorUserId,
        actorType: Role.ADMIN,
        action: "RESOURCE_ACCESS_DENIED",
        entityType,
        entityId,
        outcome: "FAILURE" as const,
        reason: "Ownership mismatch",
        changes: { expectedOwner: resourceOwnerId, actualActor: actorUserId },
      },
    });

    throw err;
  }
}
