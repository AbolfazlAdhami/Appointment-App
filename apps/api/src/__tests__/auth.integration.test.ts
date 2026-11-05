import { afterAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { randomInt, randomUUID } from "node:crypto";

const smsMock = vi.hoisted(() => ({
  code: null as string | null,
}));

vi.mock("../providers/sms/sms.factory", () => ({
  createSmsProvider: () => ({
    send: vi.fn(async ({ message }: { message: string }) => {
      smsMock.code = message.match(/\d{6}/)?.[0] ?? null;
      return { messageIds: ["test-message"] };
    }),
  }),
}));

import app from "../app";
import { prisma } from "../libs/prisma";

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
  });
});
