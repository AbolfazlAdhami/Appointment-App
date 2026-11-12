import { DoctorVerificationStatus } from "../generated/prisma/client";
import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { UpdateDoctorProfileInput } from "../schemas/doctor-profile.schema";

const doctorProfileSelect = {
  id: true,
  headline: true,
  shortIntroduction: true,
  biography: true,
  yearsOfExperience: true,
  videoUrl: true,
  verificationStatus: true,
  isPublished: true,
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