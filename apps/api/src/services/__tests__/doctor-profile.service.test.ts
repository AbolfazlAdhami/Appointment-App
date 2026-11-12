import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  doctorProfile: {
    findUnique: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock("../../libs/prisma", () => ({ prisma: prismaMock }));

import { DoctorVerificationStatus } from "../../generated/prisma/client";
import { UpdateDoctorProfileSchema } from "../../schemas/doctor-profile.schema";
import { getDoctorProfile, updateOwnDoctorProfile } from "../doctor-profile.service";

const publicProfile = {
  id: "doctor-profile-1",
  headline: "Family physician",
  shortIntroduction: null,
  biography: null,
  yearsOfExperience: 10,
  videoUrl: null,
  verificationStatus: DoctorVerificationStatus.DRAFT,
  isPublished: false,
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  specialties: [],
};

describe("Doctor self-profile service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("looks up the profile using only authenticated userId", async () => {
    prismaMock.doctorProfile.findUnique.mockResolvedValue(publicProfile);
    await expect(getDoctorProfile("authenticated-doctor")).resolves.toEqual(publicProfile);
    expect(prismaMock.doctorProfile.findUnique).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: "authenticated-doctor" },
      select: expect.objectContaining({ id: true, verificationStatus: true, specialties: expect.any(Object) }),
    }));
  });

  it("updates the owned profile scoped by both profile ID and authenticated user ID", async () => {
    prismaMock.doctorProfile.findUnique
      .mockResolvedValueOnce({ id: "doctor-profile-1", verificationStatus: DoctorVerificationStatus.DRAFT })
      .mockResolvedValueOnce({ ...publicProfile, headline: "Updated headline" });
    prismaMock.doctorProfile.updateMany.mockResolvedValue({ count: 1 });

    const result = await updateOwnDoctorProfile({
      authenticatedUserId: "authenticated-doctor",
      changes: { headline: "Updated headline" },
    });

    expect(result).toMatchObject({ kind: "profile", profile: { headline: "Updated headline" } });
    expect(prismaMock.doctorProfile.updateMany).toHaveBeenCalledWith({
      where: {
        id: "doctor-profile-1",
        userId: "authenticated-doctor",
        verificationStatus: { notIn: [DoctorVerificationStatus.APPROVED, DoctorVerificationStatus.SUSPENDED] },
      },
      data: { headline: "Updated headline" },
    });
  });

  it.each([DoctorVerificationStatus.APPROVED, DoctorVerificationStatus.SUSPENDED])("does not update %s profiles", async (verificationStatus) => {
    prismaMock.doctorProfile.findUnique.mockResolvedValue({ id: "doctor-profile-1", verificationStatus });

    await expect(updateOwnDoctorProfile({
      authenticatedUserId: "authenticated-doctor",
      changes: { headline: "Attempt" },
    })).resolves.toEqual({ kind: "read_only" });
    expect(prismaMock.doctorProfile.updateMany).not.toHaveBeenCalled();
  });

  it("rejects protected fields and invalid profile values", () => {
    expect(UpdateDoctorProfileSchema.safeParse({ headline: "Good" }).success).toBe(true);
    expect(UpdateDoctorProfileSchema.safeParse({ userId: "other-user", headline: "Forged" }).success).toBe(false);
    expect(UpdateDoctorProfileSchema.safeParse({ verificationStatus: "APPROVED" }).success).toBe(false);
    expect(UpdateDoctorProfileSchema.safeParse({ isPublished: true }).success).toBe(false);
    expect(UpdateDoctorProfileSchema.safeParse({ yearsOfExperience: -1 }).success).toBe(false);
    expect(UpdateDoctorProfileSchema.safeParse({}).success).toBe(false);
  });
});