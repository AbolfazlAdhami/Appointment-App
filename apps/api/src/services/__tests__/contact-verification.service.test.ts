import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../libs/prisma";
import { requestContactOtp, verifyPhoneContactOtp, verifyEmailContactOtp } from "../contact-verification.service";

describe("contact-verification service", () => {
  const testUserId = "test-contact-user";
  const validPhone = "+989123456789";
  const validCode = "123456";

  beforeEach(async () => {
    vi.restoreAllMocks();
    await prisma.$transaction([
      prisma.otpChallenge.deleteMany({ where: { userId: testUserId } }),
      prisma.user.deleteMany({ where: { id: testUserId } }),
    ]);
  });

  it("should return success after verifying a phone OTP", async () => {
    // Insert a test user with a known phone
    await prisma.user.create({
      data: { id: testUserId, firstName: "Test", lastName: "User", nationalId: "0000000001", dateOfBirth: new Date("2000-01-01"), phone: validPhone },
    });

    // Inject a pre-hashed challenge matching validCode
    const crypto = require("node:crypto");
    const codeHash = crypto.createHmac("sha256", process.env.OTP_SECRET || "x").update(`${validPhone}:PHONE_VERIFICATION:${validCode}`).digest("hex");

    await prisma.otpChallenge.create({
      data: {
        userId: testUserId,
        channel: "SMS",
        purpose: "PHONE_VERIFICATION",
        destination: validPhone,
        codeHash,
        expiresAt: new Date(Date.now() + 60_000),
        maxAttempts: 5,
      },
    });

    const result = await verifyPhoneContactOtp({ destination: validPhone, code: validCode, actorUserId: testUserId });
    expect(result.success).toBe(true);

    const user = await prisma.user.findUnique({ where: { id: testUserId }, select: { phoneVerifiedAt: true } });
    expect(user?.phoneVerifiedAt).toBeDefined();
  });

  it("should reject an invalid phone OTP", async () => {
    const result = await verifyPhoneContactOtp({ destination: validPhone, code: "000000", actorUserId: testUserId });
    expect(result.success).toBe(false);
  });

  it("should send a phone OTP without throwing", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = await requestContactOtp({ destination: validPhone, purpose: "PHONE_VERIFICATION" });
    expect(result.message).toBeDefined();
    consoleSpy.mockRestore();
  });
});
