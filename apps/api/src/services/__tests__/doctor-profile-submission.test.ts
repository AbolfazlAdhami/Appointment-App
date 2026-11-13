import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DoctorVerificationStatus, Role } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import {
  createOwnDoctorProfile,
  submitOwnDoctorProfileForReview,
  getDoctorProfile,
} from "../doctor-profile.service";
import { reviewDoctorProfile } from "../doctor-review.service";

describe("doctor-profile create & submit-for-review (DB)", () => {
  const doctorUserId = "doctor-create-user-1";

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.doctorProfile.deleteMany({ where: { userId: doctorUserId } }),
      prisma.auditLog.deleteMany({ where: { actorUserId: doctorUserId } }),
      prisma.user.deleteMany({ where: { id: doctorUserId } }),
    ]);

    await prisma.user.create({
      data: {
        id: doctorUserId,
        firstName: "New",
        lastName: "Doc",
        nationalId: "0000002001",
        dateOfBirth: new Date("1982-01-01"),
        phone: "+989000000101",
        role: Role.DOCTOR,
      },
    });
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.doctorProfile.deleteMany({ where: { userId: doctorUserId } }),
      prisma.auditLog.deleteMany({ where: { actorUserId: doctorUserId } }),
      prisma.user.deleteMany({ where: { id: doctorUserId } }),
    ]);
  });

  it("creates a doctor profile in DRAFT state", async () => {
    const result = await createOwnDoctorProfile({
      authenticatedUserId: doctorUserId,
      data: { headline: "Neurologist", yearsOfExperience: 10 },
    });

    expect(result.kind).toBe("created");
    if (result.kind === "created") {
      expect(result.profile.verificationStatus).toBe(DoctorVerificationStatus.DRAFT);
      expect(result.profile.isPublished).toBe(false);
      expect(result.profile.headline).toBe("Neurologist");
    }
  });

  it("rejects duplicate creation", async () => {
    await createOwnDoctorProfile({ authenticatedUserId: doctorUserId, data: {} });
    const second = await createOwnDoctorProfile({ authenticatedUserId: doctorUserId, data: {} });
    expect(second.kind).toBe("already_exists");
  });

  it("submits a draft profile for review and makes it visible to admin", async () => {
    await createOwnDoctorProfile({ authenticatedUserId: doctorUserId, data: { headline: "Surgeon" } });

    const submit = await submitOwnDoctorProfileForReview({ authenticatedUserId: doctorUserId });
    expect(submit.kind).toBe("submitted");
    if (submit.kind === "submitted") {
      expect(submit.verificationStatus).toBe(DoctorVerificationStatus.PENDING_REVIEW);
    }

    const profile = await getDoctorProfile(doctorUserId);
    expect(profile?.verificationStatus).toBe(DoctorVerificationStatus.PENDING_REVIEW);
    expect(profile?.submittedAt).toBeInstanceOf(Date);
  });

  it("rejects re-submit of an already submitted profile", async () => {
    await createOwnDoctorProfile({ authenticatedUserId: doctorUserId, data: {} });
    await submitOwnDoctorProfileForReview({ authenticatedUserId: doctorUserId });
    const again = await submitOwnDoctorProfileForReview({ authenticatedUserId: doctorUserId });
    expect(again.kind).toBe("already_submitted");
  });

  it("full round-trip: create -> submit -> admin approve -> published", async () => {
    await createOwnDoctorProfile({ authenticatedUserId: doctorUserId, data: { headline: "Dentist" } });
    const submit = await submitOwnDoctorProfileForReview({ authenticatedUserId: doctorUserId });
    expect(submit.kind).toBe("submitted");

    const doctorProfile = await prisma.doctorProfile.findUniqueOrThrow({
      where: { userId: doctorUserId },
      select: { id: true },
    });

    const review = await reviewDoctorProfile({
      actorUserId: doctorUserId,
      doctorId: doctorProfile.id,
      payload: { decision: "APPROVED", reviewNote: "Verified" },
    });
    expect(review.kind).toBe("reviewed");

    const finalProfile = await getDoctorProfile(doctorUserId);
    expect(finalProfile?.verificationStatus).toBe(DoctorVerificationStatus.APPROVED);
    expect(finalProfile?.isPublished).toBe(true);
  });
});
