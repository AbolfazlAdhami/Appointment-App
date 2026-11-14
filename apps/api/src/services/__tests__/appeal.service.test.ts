import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { randomUUID } from "node:crypto";
import { AppealStatus, Role } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import { createAppeal, listOpenAppeals, reviewAppeal } from "../appeal.service";

describe("appeal service", () => {
  let patientId: string;
  let adminId: string;
  let patientPhone: string;
  let adminPhone: string;
  let patientNationalId: string;
  let adminNationalId: string;

  beforeEach(async () => {
    const suffix = randomUUID().replace(/-/g, "").slice(0, 10);
    patientId = `appeal-patient-${suffix}`;
    adminId = `appeal-admin-${suffix}`;
    patientPhone = `+989${randomUUID().replace(/-/g, "").slice(0, 9)}`;
    adminPhone = `+989${randomUUID().replace(/-/g, "").slice(0, 9)}`;
    patientNationalId = `P${suffix}`;
    adminNationalId = `A${suffix}`;

    await prisma.$transaction([
      prisma.appeal.deleteMany({}),
      prisma.auditLog.deleteMany({}),
      prisma.user.deleteMany({ where: { id: { in: [patientId, adminId] } } }),
    ]);

    await prisma.user.create({ data: { id: patientId, firstName: "A", lastName: "B", nationalId: patientNationalId, dateOfBirth: new Date("2000-01-01"), phone: patientPhone, role: Role.PATIENT, isActive: false } });
    await prisma.user.create({ data: { id: adminId, firstName: "Admin", lastName: "One", nationalId: adminNationalId, dateOfBirth: new Date("1990-01-01"), phone: adminPhone, role: Role.ADMIN } });
  });

  afterEach(async () => {
    await prisma.auditLog.deleteMany({ where: { entityType: "Appeal" } });
    await prisma.appeal.deleteMany({ where: { userId: patientId } });
    await prisma.user.deleteMany({ where: { id: { in: [patientId, adminId] } } });
  });

  it("should create a pending appeal and include it in open list", async () => {
    const created = await createAppeal({ actorUserId: patientId, payload: { reason: "I was deactivated by mistake" } });
    expect(created.id).toBeTruthy();

    const listed = await listOpenAppeals({ actorUserId: adminId, limit: 10 });
    expect(listed.items.length).toBe(1);
    expect(listed.items[0].status).toBe(AppealStatus.PENDING);
  });

  it("should approve an appeal and reactivate the user account", async () => {
    const created = await createAppeal({ actorUserId: patientId, payload: { reason: "Wrongfully suspended" } });

    const reviewed = await reviewAppeal({ actorUserId: adminId, appealId: created.id, payload: { decision: "ACCEPTED", note: "Restored" } });
    expect(reviewed.kind).toBe("reviewed");
    expect(reviewed.status).toBe(AppealStatus.ACCEPTED);

    const user = await prisma.user.findUnique({ where: { id: patientId }, select: { isActive: true } });
    expect(user?.isActive).toBe(true);
  });

  it("should reject duplicate review attempts", async () => {
    const created = await createAppeal({ actorUserId: patientId, payload: { reason: "Some reason" } });
    await reviewAppeal({ actorUserId: adminId, appealId: created.id, payload: { decision: "REJECTED" } });

    const second = await reviewAppeal({ actorUserId: adminId, appealId: created.id, payload: { decision: "ACCEPTED" } });
    expect(second.kind).toBe("already_reviewed");
  });
});
