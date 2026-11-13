import { DoctorVerificationStatus, Role } from "../generated/prisma/client";
import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import type { DoctorListQuery } from "../schemas/doctor-list.schema";

const publicDoctorSelect = {
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
  user: {
    select: {
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
  specialties: {
    select: {
      isPrimary: true,
      specialty: { select: { id: true, name: true, slug: true } },
    },
  },
  clinicMemberships: {
    select: {
      clinic: { select: { id: true, name: true, city: true, province: true } },
    },
  },
  services: {
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      appointmentType: true,
      consultationMode: true,
      durationMinutes: true,
      price: true,
      currency: true,
    },
    orderBy: { name: "asc" },
  },
} satisfies Prisma.DoctorProfileSelect;

export type DoctorDirectoryItem = {
  id: string;
  doctorName: string;
  headline: string | null;
  shortIntroduction: string | null;
  yearsOfExperience: number | null;
  videoUrl: string | null;
  verificationStatus: string;
  isPublished: boolean;
  specialties: { id: string; name: string; slug: string; isPrimary: boolean }[];
  clinics: { id: string; name: string; city: string | null; province: string | null }[];
  createdAt: Date;
};

export async function listDoctors(input: DoctorListQuery & { actorUserId?: string; actorRole?: Role }) {
  const where: Prisma.DoctorProfileWhereInput = {
    isPublished: true,
    verificationStatus: DoctorVerificationStatus.APPROVED,
  };

  if (input.specialty) {
    where.specialties = { some: { specialtyId: input.specialty } };
  }

  if (input.city) {
    where.clinicMemberships = {
      some: { clinic: { city: { contains: input.city, mode: "insensitive" } } },
    };
  }

  if (input.search) {
    where.OR = [
      { headline: { contains: input.search, mode: "insensitive" } },
      { shortIntroduction: { contains: input.search, mode: "insensitive" } },
      { user: { firstName: { contains: input.search, mode: "insensitive" } } },
      { user: { lastName: { contains: input.search, mode: "insensitive" } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.doctorProfile.findMany({
      where,
      select: publicDoctorSelect,
      orderBy: { createdAt: "desc" },
      take: input.limit,
      skip: input.cursor ? 1 : 0,
      cursor: input.cursor ? { id: input.cursor } : undefined,
    }),
    prisma.doctorProfile.count({ where }),
  ]);

  const typedItems: DoctorDirectoryItem[] = items.map((d) => {
    const user = d.user as { firstName: string; lastName: string; phone: string };
    return {
      id: d.id,
      doctorName: `${user.firstName} ${user.lastName}`.trim(),
      headline: d.headline,
      shortIntroduction: d.shortIntroduction,
      yearsOfExperience: d.yearsOfExperience,
      videoUrl: d.videoUrl,
      verificationStatus: d.verificationStatus,
      isPublished: d.isPublished,
      specialties: (d.specialties as { specialty: { id: string; name: string; slug: string }; isPrimary: boolean }[]).map(
        (s) => ({
          id: s.specialty.id,
          name: s.specialty.name,
          slug: s.specialty.slug,
          isPrimary: s.isPrimary,
        })
      ),
      clinics: (d.clinicMemberships as { clinic: { id: string; name: string; city: string | null; province: string | null } }[]).map(
        (m) => ({
          id: m.clinic.id,
          name: m.clinic.name,
          city: m.clinic.city,
          province: m.clinic.province,
        })
      ),
      createdAt: d.createdAt,
    };
  });

  const cursor = items.length > 0 ? items[items.length - 1].id : null;

  return { items: typedItems, total, cursor };
}

export async function getDoctorPublicDetails(doctorId: string) {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
    select: publicDoctorSelect,
  });

  if (!doctor || !doctor.isPublished || doctor.verificationStatus !== DoctorVerificationStatus.APPROVED) {
    return null;
  }

  const user = doctor.user as { firstName: string; lastName: string; phone: string };

  return {
    id: doctor.id,
    doctorName: `${user.firstName} ${user.lastName}`.trim(),
    phone: user.phone,
    headline: doctor.headline,
    shortIntroduction: doctor.shortIntroduction,
    biography: doctor.biography,
    yearsOfExperience: doctor.yearsOfExperience,
    videoUrl: doctor.videoUrl,
    verificationStatus: doctor.verificationStatus,
    isPublished: doctor.isPublished,
    specialties: (doctor.specialties as { specialty: { id: string; name: string; slug: string }; isPrimary: boolean }[]).map(
      (s) => ({
        id: s.specialty.id,
        name: s.specialty.name,
        slug: s.specialty.slug,
        isPrimary: s.isPrimary,
      })
    ),
    services: (doctor.services as {
      id: string;
      name: string;
      description: string | null;
      appointmentType: string;
      consultationMode: string;
      durationMinutes: number;
      price: unknown;
      currency: string;
    }[]).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      appointmentType: s.appointmentType,
      consultationMode: s.consultationMode,
      durationMinutes: s.durationMinutes,
      price: s.price,
      currency: s.currency,
    })),
    clinics: (doctor.clinicMemberships as { clinic: { id: string; name: string; city: string | null; province: string | null } }[]).map(
      (m) => ({
        id: m.clinic.id,
        name: m.clinic.name,
        city: m.clinic.city,
        province: m.clinic.province,
      })
    ),
    createdAt: doctor.createdAt,
  };
}
