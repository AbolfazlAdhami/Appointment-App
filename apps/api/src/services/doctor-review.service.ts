import { AuditActorType, AuditOutcome, DoctorVerificationStatus, Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { DoctorReviewInput } from "../schemas/doctor-review.schema";

export type DoctorReviewResult =
  | { kind: "not_found" }
  | { kind: "already_reviewed" }
  | { kind: "reviewed"; status: DoctorVerificationStatus };

export async function listDoctorsForReview(params: {
  actorUserId: string;
  limit: number;
  cursor?: string;
  status?: DoctorVerificationStatus;
}) {
  const where: Record<string, unknown> = {};

  if (params.status) {
    where.verificationStatus = params.status;
  }

  const [items, total] = await Promise.all([
    prisma.doctorProfile.findMany({
      where,
      orderBy: { createdAt: "asc" },
      take: params.limit,
      skip: params.cursor ? 1 : 0,
      cursor: params.cursor ? { id: params.cursor } : undefined,
      select: {
        id: true,
        userId: true,
        headline: true,
        verificationStatus: true,
        isPublished: true,
        submittedAt: true,
        reviewedAt: true,
        reviewNote: true,
        createdAt: true,
        user: { select: { firstName: true, lastName: true, role: true, isActive: true } },
        specialties: { select: { specialty: { select: { name: true } } } },
      },
    }),
    prisma.doctorProfile.count({ where }),
  ]);

  const cursor = items.length > 0 ? items[items.length - 1].id : null;

  return {
    items: items.map((d) => ({
      id: d.id,
      userId: d.userId,
      doctorName: `${d.user.firstName} ${d.user.lastName}`.trim(),
      headline: d.headline,
      verificationStatus: d.verificationStatus,
      isPublished: d.isPublished,
      submittedAt: d.submittedAt,
      reviewedAt: d.reviewedAt,
      reviewNote: d.reviewNote,
      specialties: d.specialties.map((s) => s.specialty.name),
      createdAt: d.createdAt,
    })),
    total,
    cursor,
  };
}

export async function reviewDoctorProfile(params: {
  actorUserId: string;
  doctorId: string;
  payload: DoctorReviewInput;
}): Promise<DoctorReviewResult> {
  return prisma.$transaction(async (tx) => {
    const doctor = await tx.doctorProfile.findUnique({
      where: { id: params.doctorId },
      select: { id: true, userId: true, verificationStatus: true },
    });

    if (!doctor) return { kind: "not_found" };
    if (doctor.verificationStatus !== DoctorVerificationStatus.PENDING_REVIEW) {
      return { kind: "already_reviewed" };
    }

    const decision = params.payload.decision;
    const newStatus =
      decision === "APPROVED"
        ? DoctorVerificationStatus.APPROVED
        : decision === "REJECTED"
          ? DoctorVerificationStatus.REJECTED
          : DoctorVerificationStatus.NEEDS_CORRECTION;

    const updated = await tx.doctorProfile.update({
      where: { id: doctor.id },
      data: {
        verificationStatus: newStatus,
        isPublished: decision === "APPROVED",
        reviewedById: params.actorUserId,
        reviewedAt: new Date(),
        reviewNote: params.payload.reviewNote?.trim() || null,
      },
      select: { id: true, verificationStatus: true },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: params.actorUserId,
        actorType: AuditActorType.ADMIN,
        action: `DOCTOR_PROFILE_${decision}`,
        entityType: "DoctorProfile",
        entityId: doctor.id,
        outcome: AuditOutcome.SUCCESS,
        reason: params.payload.reviewNote || undefined,
        changes: {
          userId: doctor.userId,
          previousStatus: DoctorVerificationStatus.PENDING_REVIEW,
          newStatus,
          isPublished: decision === "APPROVED",
        },
      },
    });

    return { kind: "reviewed", status: updated.verificationStatus };
  }, { isolationLevel: "Serializable" });
}
