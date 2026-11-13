import { describe, it, expect, beforeEach } from "vitest";
import { AppealStatus, Role } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import { createAppeal, listOpenAppeals, reviewAppeal } from "../appeal.service";

describe.skip("appeal service", () => {
  const patientId = "appeal-patient-1";
  const adminId = "appeal-admin-1";

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.appeal.deleteMany({}),
      prisma.auditLog.deleteMany({}),
      prisma.user.deleteMany({ where: { id: { in: [patientId, adminId] } } }),
    ]);

    await prisma.user.create({ data: { id: patientId, firstName: "A", lastName: "B", nationalId: "9990000001", dateOfBirth: new Date("2000-01-01"), phone: "+989000000001", role: Role.PATIENT } });
    await prisma.user.create({ data: { id: adminId, firstName: "Admin", lastName: "One", nationalId: "9990000002", dateOfBirth: new Date("1990-01-01"), phone: "+989000000002", role: Role.ADMIN } });
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
