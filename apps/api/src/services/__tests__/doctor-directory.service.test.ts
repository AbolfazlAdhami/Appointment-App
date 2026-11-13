import { describe, it, expect, beforeEach } from "vitest";
import { DoctorVerificationStatus, Role } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import { listDoctors, getDoctorPublicDetails } from "../doctor-directory.service";

describe("doctor-directory service", () => {
  const doctorUserId = "doctor-dir-user-1";
  const unpublishedUserId = "doctor-dir-unpublished";
  const testUserIds = [doctorUserId, unpublishedUserId];

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.doctorProfile.deleteMany({ where: { userId: { in: testUserIds } } }),
      prisma.user.deleteMany({ where: { id: { in: testUserIds } } }),
    ]);

    await prisma.user.create({
      data: {
        id: doctorUserId,
        firstName: "Approved",
        lastName: "Doctor",
        nationalId: "0000001001",
        dateOfBirth: new Date("1980-01-01"),
        phone: "+989000000001",
        role: Role.DOCTOR,
      },
    });

    await prisma.doctorProfile.create({
      data: {
        userId: doctorUserId,
        headline: "Cardiologist",
        shortIntroduction: "Heart specialist",
        yearsOfExperience: 15,
        verificationStatus: DoctorVerificationStatus.APPROVED,
        isPublished: true,
      },
    });
  });

  it("returns the created approved doctor in the public list", async () => {
    const result = await listDoctors({ limit: 100, actorUserId: doctorUserId, actorRole: Role.PATIENT });

    const mine = result.items.find((d) => d.doctorName === "Approved Doctor");
    expect(mine).toBeDefined();
    expect(mine?.verificationStatus).toBe(DoctorVerificationStatus.APPROVED);
    expect(mine?.headline).toBe("Cardiologist");
  });

  it("does not return unapproved doctors in the public list", async () => {
    await prisma.user.create({
      data: {
        id: unpublishedUserId,
        firstName: "Unapproved",
        lastName: "Doctor",
        nationalId: "0000001002",
        dateOfBirth: new Date("1980-01-01"),
        phone: "+989000000002",
        role: Role.DOCTOR,
      },
    });

    await prisma.doctorProfile.create({
      data: {
        userId: unpublishedUserId,
        headline: "Not yet approved",
        verificationStatus: DoctorVerificationStatus.DRAFT,
        isPublished: false,
      },
    });

    const result = await listDoctors({ limit: 100, actorUserId: doctorUserId, actorRole: Role.PATIENT });
    const mine = result.items.find((d) => d.doctorName === "Unapproved Doctor");
    expect(mine).toBeUndefined();
  });

  it("returns public details for approved doctor", async () => {
    const doctor = await prisma.doctorProfile.findUniqueOrThrow({
      where: { userId: doctorUserId },
      select: { id: true },
    });

    const details = await getDoctorPublicDetails(doctor.id);
    expect(details?.doctorName).toBe("Approved Doctor");
    expect(details?.headline).toBe("Cardiologist");
    expect(details?.yearsOfExperience).toBe(15);
  });
});
