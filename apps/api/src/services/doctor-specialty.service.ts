import { prisma } from "../libs/prisma";
import type { DoctorSpecialtyInput } from "../schemas/doctor-specialty.schema";

export async function addDoctorSpecialty(params: {
  actorUserId: string;
  payload: DoctorSpecialtyInput;
}) {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: params.actorUserId },
    select: { id: true },
  });

  if (!doctorProfile) {
    return { kind: "not_found" as const };
  }

  const existing = await prisma.doctorSpecialty.findUnique({
    where: {
      doctorProfileId_specialtyId: {
        doctorProfileId: doctorProfile.id,
        specialtyId: params.payload.specialtyId,
      },
    },
  });

  if (existing) {
    return { kind: "already_exists" as const, specialty: existing };
  }

  const specialty = await prisma.doctorSpecialty.create({
    data: {
      doctorProfileId: doctorProfile.id,
      specialtyId: params.payload.specialtyId,
      isPrimary: params.payload.isPrimary,
    },
    select: {
      id: true,
      isPrimary: true,
      specialty: { select: { id: true, name: true, slug: true } },
    },
  });

  return { kind: "added" as const, specialty };
}

export async function removeDoctorSpecialty(params: {
  actorUserId: string;
  specialtyId: string;
}) {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: params.actorUserId },
    select: { id: true },
  });

  if (!doctorProfile) {
    return { kind: "not_found" as const };
  }

  const deleted = await prisma.doctorSpecialty.deleteMany({
    where: {
      doctorProfileId: doctorProfile.id,
      specialtyId: params.specialtyId,
    },
  });

  return { kind: "removed" as const, count: deleted.count };
}

export async function listDoctorSpecialties(actorUserId: string) {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: actorUserId },
    select: {
      id: true,
      specialties: {
        select: {
          id: true,
          isPrimary: true,
          specialty: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!doctorProfile) return null;

  return doctorProfile.specialties.map((s) => ({
    id: s.id,
    isPrimary: s.isPrimary,
    specialty: s.specialty,
  }));
}
