import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { randomInt } from "node:crypto";

const smsMock = vi.hoisted(() => ({
  send: vi.fn(),
  code: null as string | null,
}));

vi.mock("../../providers/sms/sms.factory", () => ({
  createSmsProvider: () => ({
    send: smsMock.send,
  }),
}));

import { OtpPurpose } from "../../generated/prisma/client";
import { env } from "../../config/env";
import { prisma } from "../../libs/prisma";
import { requestPhoneOtp, verifyPhoneOtp } from "../otp.service";

describe("OTP Service", () => {
  let phone: string;

  beforeEach(() => {
    phone = `+4915${randomInt(100000000, 999999999)}`;
    smsMock.code = null;

    smsMock.send.mockImplementation(async ({ message }: { message: string }) => {
      smsMock.code = message.match(/\d{6}/)?.[0] ?? null;
    });
  });

  afterEach(async () => {
    await prisma.otpChallenge.deleteMany({
      where: { destination: phone },
    });
  });

  async function requestOtp() {
    await requestPhoneOtp({
      phone,
      purpose: OtpPurpose.SIGNUP,
    });

    expect(smsMock.code).toMatch(/^\d{6}$/);
    return smsMock.code!;
  }

  it("verifies a valid OTP and prevents replay", async () => {
    const code = await requestOtp();

    const result = await verifyPhoneOtp({
      phone,
      code,
      purpose: OtpPurpose.SIGNUP,
    });

    expect(result.phone).toBe(phone);

    await expect(
      verifyPhoneOtp({
        phone,
        code,
        purpose: OtpPurpose.SIGNUP,
      }),
    ).rejects.toThrow("Invalid or expired verification code");
  });

  it("increments failed attempts and consumes OTP at the limit", async () => {
    const code = await requestOtp();
    const wrongCode = code === "000000" ? "000001" : "000000";

    for (let i = 0; i < env.otpMaxAttempts; i++) {
      await expect(
        verifyPhoneOtp({
          phone,
          code: wrongCode,
          purpose: OtpPurpose.SIGNUP,
        }),
      ).rejects.toThrow("Invalid or expired verification code");
    }

    const challenge = await prisma.otpChallenge.findFirstOrThrow({
      where: { destination: phone },
    });

    expect(challenge.attempts).toBe(env.otpMaxAttempts);
    expect(challenge.consumedAt).not.toBeNull();

    await expect(
      verifyPhoneOtp({
        phone,
        code,
        purpose: OtpPurpose.SIGNUP,
      }),
    ).rejects.toThrow("Invalid or expired verification code");
  });

  it("rejects an expired OTP", async () => {
    const code = await requestOtp();

    await prisma.otpChallenge.updateMany({
      where: { destination: phone },
      data: {
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await expect(
      verifyPhoneOtp({
        phone,
        code,
        purpose: OtpPurpose.SIGNUP,
      }),
    ).rejects.toThrow("Invalid or expired verification code");
  });

  it("does not send another OTP during the resend cooldown", async () => {
    await requestOtp();

    await requestPhoneOtp({
      phone,
      purpose: OtpPurpose.SIGNUP,
    });

    const challengeCount = await prisma.otpChallenge.count({
      where: { destination: phone },
    });

    expect(challengeCount).toBe(1);
    expect(smsMock.send).toHaveBeenCalledTimes(1);
  });
});
