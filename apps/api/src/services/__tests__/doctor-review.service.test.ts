import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DoctorVerificationStatus, Role } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import { listDoctorsForReview, reviewDoctorProfile } from "../doctor-review.service";

describe("doctor-review service", () => {
  const doctorUserId = "doctor-review-user-1";
  const adminUserId = "doctor-review-admin-1";

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.doctorProfile.deleteMany({ where: { userId: doctorUserId } }),
      prisma.auditLog.deleteMany({ where: { entityId: doctorUserId, actorUserId: adminUserId } }),
      prisma.user.deleteMany({ where: { id: { in: [doctorUserId, adminUserId] } } }),
    ]);

    await prisma.user.create({
      data: {
        id: doctorUserId,
        firstName: "Pending",
        lastName: "Doctor",
        nationalId: "0000001010",
        dateOfBirth: new Date("1985-01-01"),
        phone: "+989000000010",
        role: Role.DOCTOR,
      },
    });

    await prisma.user.create({
      data: {
        id: adminUserId,
        firstName: "Review",
        lastName: "Admin",
        nationalId: "0000001011",
        dateOfBirth: new Date("1980-01-01"),
        phone: "+989000000011",
        role: Role.ADMIN,
      },
    });

    await prisma.doctorProfile.create({
      data: {
        userId: doctorUserId,
        verificationStatus: DoctorVerificationStatus.PENDING_REVIEW,
        submittedAt: new Date(),
      },
    });
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.doctorProfile.deleteMany({ where: { userId: doctorUserId } }),
      prisma.auditLog.deleteMany({ where: { actorUserId: adminUserId } }),
      prisma.user.deleteMany({ where: { id: { in: [doctorUserId, adminUserId] } } }),
    ]);
  });

  it("approves a pending doctor and publishes the profile", async () => {
    const doctor = await prisma.doctorProfile.findUniqueOrThrow({
      where: { userId: doctorUserId },
      select: { id: true },
    });

    const result = await reviewDoctorProfile({
      actorUserId: adminUserId,
      doctorId: doctor.id,
      payload: { decision: "APPROVED", reviewNote: "Approved" },
    });

    expect(result.kind).toBe("reviewed");
    if (result.kind === "reviewed") {
      expect(result.status).toBe(DoctorVerificationStatus.APPROVED);
    }

    const updated = await prisma.doctorProfile.findUniqueOrThrow({
      where: { id: doctor.id },
      select: { verificationStatus: true, isPublished: true },
    });
    expect(updated.verificationStatus).toBe(DoctorVerificationStatus.APPROVED);
    expect(updated.isPublished).toBe(true);
  });

  it("rejects duplicate review attempts", async () => {
    const doctor = await prisma.doctorProfile.findUniqueOrThrow({
      where: { userId: doctorUserId },
      select: { id: true },
    });

    await reviewDoctorProfile({
      actorUserId: adminUserId,
      doctorId: doctor.id,
      payload: { decision: "APPROVED" },
    });

    const second = await reviewDoctorProfile({
      actorUserId: adminUserId,
      doctorId: doctor.id,
      payload: { decision: "REJECTED" },
    });

    expect(second.kind).toBe("already_reviewed");
  });

  it("lists the pending doctor for admin review", async () => {
    const result = await listDoctorsForReview({
      actorUserId: adminUserId,
      limit: 10,
      status: DoctorVerificationStatus.PENDING_REVIEW,
    });

    const mine = result.items.find((d) => d.userId === doctorUserId);
    expect(mine).toBeDefined();
    expect(mine?.doctorName).toBe("Pending Doctor");
  });
});
