import { afterAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { randomInt, randomUUID } from "node:crypto";

const smsMock = vi.hoisted(() => ({
  code: null as string | null,
}));

const objectStorageMock = vi.hoisted(() => ({
  objects: new Map<string, Buffer>(),
}));

vi.mock("../providers/sms/sms.factory", () => ({
  createSmsProvider: () => ({
    send: vi.fn(async ({ message }: { message: string }) => {
      smsMock.code = message.match(/\d{6}/)?.[0] ?? null;
      return { messageIds: ["test-message"] };
    }),
  }),
}));

vi.mock("../providers/object-storage/s3-object-storage.provider", () => ({
  getObjectStorageProvider: () => ({
    ensureBucket: vi.fn(async () => undefined),
    putObject: vi.fn(async ({ key, body }: { key: string; body: Buffer }) => {
      objectStorageMock.objects.set(key, body);
    }),
    getObject: vi.fn(async (key: string) => {
      const body = objectStorageMock.objects.get(key);
      if (!body) return null;
      const { Readable } = await import("node:stream");
      return { body: Readable.from(body), contentLength: body.length, contentType: "image/png" };
    }),
    deleteObject: vi.fn(async (key: string) => {
      objectStorageMock.objects.delete(key);
    }),
  }),
}));

import app from "../app";
import { prisma } from "../libs/prisma";
import { Role } from "../generated/prisma/client";
import { generateAccessToken } from "../utils/jwt";

const databaseName = new URL(process.env.DATABASE_URL!).pathname.slice(1);

if (databaseName !== "pezeshki_test") {
  throw new Error(`Unsafe test database: ${databaseName}`);
}

const suffix = randomUUID().replace(/-/g, "").slice(0, 10);

const fixture = {
  firstName: "Test",
  lastName: "Patient",
  nationalId: `T${suffix}`,
  dateOfBirth: "1995-05-15",
  phone: `+4915${randomInt(100000000, 999999999)}`,
  email: `test-${suffix}@example.com`,
  password: "TestPassword123!",
};

describe("Authentication Integration", () => {
  afterAll(async () => {
    await prisma.patientProfile.deleteMany({
      where: { user: { phone: fixture.phone } },
    });

    await prisma.user.deleteMany({
      where: { phone: fixture.phone },
    });

    await prisma.otpChallenge.deleteMany({
      where: { destination: fixture.phone },
    });

    await prisma.$disconnect();
  });

  it("completes the authentication lifecycle", async () => {
    // Invalid OTP request
    const invalidOtpRequest = await request(app).post("/api/auth/otp/request").send({ phone: "", purpose: "SIGNUP" });

    expect(invalidOtpRequest.status).toBe(400);

    // Invalid registration payload
    const invalidRegistrationPayload = await request(app).post("/api/auth/register").send({
      firstName: "",
      lastName: "",
    });

    expect(invalidRegistrationPayload.status).toBe(400);

    // Missing login credentials
    const missingCredentials = await request(app).post("/api/auth/login").send({
      email: fixture.email,
    });

    expect(missingCredentials.status).toBe(400);

    // Refresh without cookie
    const missingRefreshToken = await request(app).post("/api/auth/refresh");

    expect(missingRefreshToken.status).toBe(401);

    // 1. Request signup OTP
    const otpResponse = await request(app).post("/api/auth/otp/request").send({
      phone: fixture.phone,
      purpose: "SIGNUP",
    });

    expect(otpResponse.status).toBe(200);
    expect(smsMock.code).toMatch(/^\d{6}$/);

    const otp = smsMock.code!;

    // 2. Reject an incorrect OTP
    const invalidRegistration = await request(app)
      .post("/api/auth/register")
      .send({
        ...fixture,
        code: "000000",
      });

    expect(invalidRegistration.status).toBe(400);

    // 3. Register successfully
    const registration = await request(app)
      .post("/api/auth/register")
      .send({
        ...fixture,
        code: otp,
      });

    expect(registration.status).toBe(201);
    expect(registration.body.user).toMatchObject({
      email: fixture.email,
      role: "PATIENT",
    });
    expect(registration.body.accessToken).toBeTruthy();

    const initialAccessToken = registration.body.accessToken;
    const initialCookie = registration.headers["set-cookie"]?.find((cookie: string) => cookie.startsWith("refreshToken="));

    expect(initialCookie).toBeTruthy();
    expect(initialCookie).toContain("HttpOnly");
    expect(initialCookie).toContain("Path=/api/auth");

    // 4. Patient profile must be created
    const user = await prisma.user.findUnique({
      where: { phone: fixture.phone },
      include: { patientProfile: true },
    });

    expect(user).toBeTruthy();
    expect(user?.patientProfile).toBeTruthy();
    expect(user?.passwordHash).not.toBe(fixture.password);
    expect(user?.phoneVerifiedAt).toBeTruthy();

    // 5. Duplicate registration must fail
    const duplicateRegistration = await request(app)
      .post("/api/auth/register")
      .send({
        ...fixture,
        code: otp,
      });

    expect(duplicateRegistration.status).toBe(409);

    // 6. Login with incorrect password
    const invalidLogin = await request(app).post("/api/auth/login").send({
      email: fixture.email,
      password: "WrongPassword123!",
    });

    expect(invalidLogin.status).toBe(401);

    // 7. Login successfully
    const login = await request(app).post("/api/auth/login").send({
      email: fixture.email,
      password: fixture.password,
    });

    expect(login.status).toBe(200);
    expect(login.body.accessToken).toBeTruthy();

    // 7.1. OTP login must issue an independent session
    const otpLoginRequest = await request(app).post("/api/auth/otp/request").send({
      phone: fixture.phone,
      purpose: "LOGIN",
    });

    expect(otpLoginRequest.status).toBe(200);
    expect(smsMock.code).toMatch(/^\d{6}$/);

    const otpLoginCode = smsMock.code!;

    const otpLogin = await request(app).post("/api/auth/login/otp").send({
      phone: fixture.phone,
      code: otpLoginCode,
    });

    expect(otpLogin.status).toBe(200);
    expect(otpLogin.body.user.email).toBe(fixture.email);
    expect(otpLogin.body.accessToken).toBeTruthy();
    expect(otpLogin.headers["set-cookie"]?.some((cookie: string) => cookie.startsWith("refreshToken=") && cookie.includes("HttpOnly"))).toBe(true);

    const otpLoginMe = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${otpLogin.body.accessToken}`);

    expect(otpLoginMe.status).toBe(200);
    expect(otpLoginMe.body.user.email).toBe(fixture.email);

    const replayOtpLogin = await request(app).post("/api/auth/login/otp").send({
      phone: fixture.phone,
      code: otpLoginCode,
    });

    expect(replayOtpLogin.status).toBe(401);

    const malformedOtpLogin = await request(app).post("/api/auth/login/otp").send({
      phone: fixture.phone,
      code: "12",
    });

    expect(malformedOtpLogin.status).toBe(400);

    const loginCookie = login.headers["set-cookie"]?.find((cookie: string) => cookie.startsWith("refreshToken="));

    expect(loginCookie).toBeTruthy();

    // 8. Get current user
    const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${login.body.accessToken}`);

    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(fixture.email);
    expect(me.body.user.role).toBe("PATIENT");

    // 9. Reject unauthenticated access
    const unauthorizedMe = await request(app).get("/api/auth/me");

    expect(unauthorizedMe.status).toBe(401);

    // 10. Refresh session
    const refresh = await request(app).post("/api/auth/refresh").set("Cookie", loginCookie!.split(";")[0]);

    // Refresh without a valid token
    const invalidRefresh = await request(app).post("/api/auth/refresh").set("Cookie", "refreshToken=invalid-token");

    expect(invalidRefresh.status).toBe(401);

    const invalidRefreshCookie = invalidRefresh.headers["set-cookie"]?.find((cookie: string) => cookie.startsWith("refreshToken="));

    expect(invalidRefreshCookie).toContain("Expires=");

    expect(refresh.status).toBe(200);
    expect(refresh.body.accessToken).toBeTruthy();

    const rotatedCookie = refresh.headers["set-cookie"]?.find((cookie: string) => cookie.startsWith("refreshToken="));

    expect(rotatedCookie).toBeTruthy();

    // 11. Old refresh token must not work again
    const replayRefresh = await request(app).post("/api/auth/refresh").set("Cookie", loginCookie!.split(";")[0]);

    expect(replayRefresh.status).toBe(401);

    // 12. Logout
    const logout = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${refresh.body.accessToken}`);

    expect(logout.status).toBe(200);

    // 13. Access token must be invalid after logout
    const afterLogout = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${refresh.body.accessToken}`);

    expect(afterLogout.status).toBe(401);

    // 14. Refresh token must be invalid after logout
    const refreshAfterLogout = await request(app).post("/api/auth/refresh").set("Cookie", rotatedCookie!.split(";")[0]);

    expect(refreshAfterLogout.status).toBe(401);

    // 15. Initial registration session remains independent
    const initialSession = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${initialAccessToken}`);

    expect(initialSession.status).toBe(200);

    // Invalid access token
    const invalidAccessToken = await request(app).get("/api/auth/me").set("Authorization", "Bearer invalid-token");

    expect(invalidAccessToken.status).toBe(401);

    const profile = await request(app).get("/api/auth/profile").set("Authorization", `Bearer ${initialAccessToken}`);
    expect(profile.status).toBe(200);
    expect(profile.body.user).toMatchObject({
      id: registration.body.user.id,
      firstName: fixture.firstName,
      lastName: fixture.lastName,
      role: "PATIENT",
      phone: fixture.phone,
    });
    expect(profile.body.user).not.toHaveProperty("nationalId");
    expect(profile.body.user).not.toHaveProperty("passwordHash");

    const profileUpdate = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${initialAccessToken}`)
      .send({ firstName: "Updated" });
    expect(profileUpdate.status).toBe(200);
    expect(profileUpdate.body.user.firstName).toBe("Updated");
    expect(profileUpdate.body.user.role).toBe("PATIENT");

    const forgedRoleUpdate = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${initialAccessToken}`)
      .send({ role: "ADMIN", firstName: "Escalated" });
    expect(forgedRoleUpdate.status).toBe(400);

    const invalidProfileUpdate = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${initialAccessToken}`)
      .send({ firstName: "x" });
    expect(invalidProfileUpdate.status).toBe(400);

    const unauthenticatedProfile = await request(app).get("/api/auth/profile");
    expect(unauthenticatedProfile.status).toBe(401);

    const png = Buffer.from("89504e470d0a1a0a00000000", "hex");
    const fileUpload = await request(app)
      .post("/api/files")
      .set("Authorization", `Bearer ${initialAccessToken}`)
      .set("Content-Type", "image/png")
      .set("X-File-Name", "scan.png")
      .send(png);
    expect(fileUpload.status).toBe(201);
    expect(fileUpload.body.file.isPrivate).toBe(true);
    expect(fileUpload.body.file).not.toHaveProperty("storageKey");

    const fileId = fileUpload.body.file.id as string;
    const fileDownload = await request(app)
      .get(`/api/files/${fileId}`)
      .set("Authorization", `Bearer ${initialAccessToken}`);
    expect(fileDownload.status).toBe(200);
    expect(fileDownload.headers["cache-control"]).toBe("private, no-store");
    expect(Buffer.from(fileDownload.body).equals(png)).toBe(true);

    const otherUser = await prisma.user.create({
      data: {
        firstName: "Other",
        lastName: "Patient",
        nationalId: `O${randomUUID().replace(/-/g, "").slice(0, 10)}`,
        dateOfBirth: new Date("1990-01-01"),
        phone: `+4916${randomInt(100000000, 999999999)}`,
      },
    });
    const otherSession = await prisma.authSession.create({
      data: {
        userId: otherUser.id,
        refreshTokenHash: randomUUID().replace(/-/g, "").padEnd(64, "0"),
        expiresAt: new Date(Date.now() + 60_000),
      },
    });
    const { generateAccessToken } = await import("../utils/jwt");
    const otherAccessToken = generateAccessToken({ userId: otherUser.id, sessionId: otherSession.id });
    const forbiddenDownload = await request(app)
      .get(`/api/files/${fileId}`)
      .set("Authorization", `Bearer ${otherAccessToken}`);
    expect(forbiddenDownload.status).toBe(403);

    const spoofedUpload = await request(app)
      .post("/api/files")
      .set("Authorization", `Bearer ${initialAccessToken}`)
      .set("Content-Type", "image/png")
      .send(Buffer.from("plain text"));
    expect(spoofedUpload.status).toBe(400);

    const forbiddenAdminAction = await request(app)
      .patch(`/api/admin/users/${registration.body.user.id}/status`)
      .set("Authorization", `Bearer ${initialAccessToken}`)
      .send({ isActive: false, reason: "Test authorization" });
    expect(forbiddenAdminAction.status).toBe(403);

    const forbiddenAdminList = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${initialAccessToken}`);
    expect(forbiddenAdminList.status).toBe(403);

    const adminSuffix = randomUUID().replace(/-/g, "").slice(0, 10);
    const admin = await prisma.user.create({
      data: {
        firstName: "Integration",
        lastName: "Admin",
        nationalId: `A${adminSuffix}`,
        dateOfBirth: new Date("1980-01-01"),
        phone: `+4917${randomInt(100000000, 999999999)}`,
        role: Role.ADMIN,
      },
    });
    const adminSession = await prisma.authSession.create({
      data: {
        userId: admin.id,
        refreshTokenHash: randomUUID().replace(/-/g, "").padEnd(64, "0"),
        expiresAt: new Date(Date.now() + 60_000),
      },
    });
    const adminToken = generateAccessToken({ userId: admin.id, sessionId: adminSession.id });
    const adminList = await request(app)
      .get("/api/admin/users?role=PATIENT&isActive=true&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(adminList.status).toBe(200);
    expect(adminList.body.users.some((user: { id: string }) => user.id === otherUser.id)).toBe(true);
    expect(adminList.body.users[0]).not.toHaveProperty("nationalId");
    expect(adminList.body.users[0]).not.toHaveProperty("phone");
    const deactivation = await request(app)
      .patch(`/api/admin/users/${otherUser.id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ isActive: false, reason: "Integration test deactivation" });
    expect(deactivation.status).toBe(200);
    expect(deactivation.body).toMatchObject({ changed: true, user: { id: otherUser.id, isActive: false } });
    expect(await prisma.authSession.count({ where: { userId: otherUser.id, revokedAt: null } })).toBe(0);
    expect(await prisma.auditLog.count({ where: { actorUserId: admin.id, entityId: otherUser.id, action: "USER_DEACTIVATED" } })).toBe(1);

    const activation = await request(app)
      .patch(`/api/admin/users/${otherUser.id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ isActive: true, reason: "Integration test activation" });
    expect(activation.status).toBe(200);
    expect(activation.body).toMatchObject({ changed: true, user: { id: otherUser.id, isActive: true } });
    await prisma.auditLog.deleteMany({ where: { actorUserId: admin.id, entityId: otherUser.id } });
    await prisma.user.delete({ where: { id: admin.id } });
    await prisma.user.delete({ where: { id: otherUser.id } });
  });
});
