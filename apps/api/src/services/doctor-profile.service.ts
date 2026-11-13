import { DoctorVerificationStatus } from "../generated/prisma/client";
import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { UpdateDoctorProfileInput, CreateDoctorProfileInput } from "../schemas/doctor-profile.schema";

const doctorProfileSelect = {
  id: true,
  headline: true,
  shortIntroduction: true,
  biography: true,
  yearsOfExperience: true,
  videoUrl: true,
  verificationStatus: true,
  isPublished: true,
  submittedAt: true,
  createdAt: true,
  updatedAt: true,
  specialties: {
    select: {
      isPrimary: true,
      specialty: { select: { id: true, name: true, slug: true } },
    },
  },
} satisfies Prisma.DoctorProfileSelect;

export type DoctorProfileAccessResult =
  | { kind: "not_found" }
  | { kind: "read_only" }
  | { kind: "profile"; profile: NonNullable<Awaited<ReturnType<typeof getDoctorProfile>>> };

export async function getDoctorProfile(authenticatedUserId: string) {
  return prisma.doctorProfile.findUnique({
    where: { userId: authenticatedUserId },
    select: doctorProfileSelect,
  });
}

export async function updateOwnDoctorProfile(input: {
  authenticatedUserId: string;
  changes: UpdateDoctorProfileInput;
}): Promise<DoctorProfileAccessResult> {
  const current = await prisma.doctorProfile.findUnique({
    where: { userId: input.authenticatedUserId },
    select: { id: true, verificationStatus: true },
  });

  if (!current) return { kind: "not_found" };
  if (current.verificationStatus === DoctorVerificationStatus.APPROVED || current.verificationStatus === DoctorVerificationStatus.SUSPENDED) {
    return { kind: "read_only" };
  }

  const updated = await prisma.doctorProfile.updateMany({
    where: {
      id: current.id,
      userId: input.authenticatedUserId,
      verificationStatus: { notIn: [DoctorVerificationStatus.APPROVED, DoctorVerificationStatus.SUSPENDED] },
    },
    data: input.changes,
  });

  if (updated.count !== 1) return { kind: "read_only" };

  const profile = await getDoctorProfile(input.authenticatedUserId);
  return profile ? { kind: "profile", profile } : { kind: "not_found" };
}

export type CreateDoctorProfileResult =
  | { kind: "already_exists" }
  | { kind: "created"; profile: NonNullable<Awaited<ReturnType<typeof getDoctorProfile>>> };

export async function createOwnDoctorProfile(input: {
  authenticatedUserId: string;
  data: CreateDoctorProfileInput;
}): Promise<CreateDoctorProfileResult> {
  const existing = await prisma.doctorProfile.findUnique({
    where: { userId: input.authenticatedUserId },
    select: { id: true },
  });

  if (existing) return { kind: "already_exists" };

  await prisma.doctorProfile.create({
    data: {
      userId: input.authenticatedUserId,
      headline: input.data.headline ?? null,
      shortIntroduction: input.data.shortIntroduction ?? null,
      biography: input.data.biography ?? null,
      yearsOfExperience: input.data.yearsOfExperience ?? null,
      videoUrl: input.data.videoUrl ?? null,
      verificationStatus: DoctorVerificationStatus.DRAFT,
      isPublished: false,
    },
  });

  const profile = await getDoctorProfile(input.authenticatedUserId);
  if (!profile) return { kind: "already_exists" };
  return { kind: "created", profile };
}

export type SubmitDoctorProfileResult =
  | { kind: "not_found" }
  | { kind: "already_submitted" }
  | { kind: "submitted"; verificationStatus: DoctorVerificationStatus };

export async function submitOwnDoctorProfileForReview(input: {
  authenticatedUserId: string;
}): Promise<SubmitDoctorProfileResult> {
  const current = await prisma.doctorProfile.findUnique({
    where: { userId: input.authenticatedUserId },
    select: { id: true, verificationStatus: true },
  });

  if (!current) return { kind: "not_found" };
  if (
    current.verificationStatus === DoctorVerificationStatus.PENDING_REVIEW ||
    current.verificationStatus === DoctorVerificationStatus.APPROVED ||
    current.verificationStatus === DoctorVerificationStatus.SUSPENDED
  ) {
    return { kind: "already_submitted" };
  }

  const updated = await prisma.doctorProfile.updateMany({
    where: {
      id: current.id,
      userId: input.authenticatedUserId,
      verificationStatus: { notIn: [
        DoctorVerificationStatus.PENDING_REVIEW,
        DoctorVerificationStatus.APPROVED,
        DoctorVerificationStatus.SUSPENDED,
      ] },
    },
    data: {
      verificationStatus: DoctorVerificationStatus.PENDING_REVIEW,
      submittedAt: new Date(),
    },
  });

  if (updated.count !== 1) return { kind: "already_submitted" };

  return { kind: "submitted", verificationStatus: DoctorVerificationStatus.PENDING_REVIEW };
}