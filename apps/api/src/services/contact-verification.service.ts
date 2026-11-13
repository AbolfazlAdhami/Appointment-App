import { randomInt } from "node:crypto";
import { OtpChannel, OtpPurpose } from "../generated/prisma/client";
import { env } from "../config/env";
import { prisma } from "../libs/prisma";
import { createSmsProvider } from "../providers/sms/sms.factory";

const GENERIC_MESSAGE = "اگر اطلاعات واردشده معتبر باشد، کد تأیید برای شما ارسال خواهد شد.";

function normalizePhone(phone: string): string {
  return phone.replace(/[\s()-]/g, "");
}

function getUtcDayStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function generateCode(): string {
  return randomInt(100000, 1000000).toString();
}

function hashCode(destination: string, purpose: string, code: string): string {
  const crypto = require("node:crypto");
  return crypto.createHmac("sha256", env.otpSecret).update(`${destination}:${purpose}:${code}`).digest("hex");
}

export interface RequestContactOtpInput {
  destination: string;
  /** PHONE_VERIFICATION sends via SMS; for email you still use PHONE_VERIFICATION with EMAIL channel */
  purpose: Extract<OtpPurpose, "SIGNUP" | "LOGIN" | "PHONE_VERIFICATION">;
  userId?: string;
}

export interface ContactOtpResult {
  message: string;
}

/** Sends a verification OTP to a phone number (SMS) or logs an in-app event for email. */
export async function requestContactOtp(input: RequestContactOtpInput): Promise<ContactOtpResult> {
  const now = new Date();

  if (input.purpose === OtpPurpose.PHONE_VERIFICATION || input.purpose === OtpPurpose.SIGNUP || input.purpose === OtpPurpose.LOGIN) {
    const normalized = normalizePhone(input.destination);
    if (!/^\+?\d{8,15}$/.test(normalized)) throw new Error("Invalid phone number");

    const latest = await prisma.otpChallenge.findFirst({
      where: { destination: normalized, purpose: input.purpose },
      orderBy: { createdAt: "desc" },
    });

    if (latest && (now.getTime() - latest.createdAt.getTime()) / 1000 < env.otpResendCooldownSeconds) {
      return { message: GENERIC_MESSAGE };
    }

    const dailyCount = await prisma.otpChallenge.count({
      where: { destination: normalized, purpose: input.purpose, createdAt: { gte: getUtcDayStart() } },
    });
    if (dailyCount >= env.otpDailyLimit) return { message: GENERIC_MESSAGE };

    await prisma.otpChallenge.updateMany({
      where: { destination: normalized, purpose: input.purpose, consumedAt: null },
      data: { consumedAt: now },
    });

    const code = generateCode();
    const codeHash = hashCode(normalized, input.purpose, code);

    const challenge = await prisma.otpChallenge.create({
      data: {
        userId: input.userId ?? undefined,
        channel: OtpChannel.SMS,
        purpose: input.purpose,
        destination: normalized,
        codeHash,
        expiresAt: new Date(now.getTime() + env.otpExpiresInSeconds * 1000),
        maxAttempts: env.otpMaxAttempts,
      },
    });

    try {
      const sms = createSmsProvider();
      await sms.send({ to: normalized, message: `Your verification code is: ${code}` });
    } catch (error) {
      await prisma.otpChallenge.delete({ where: { id: challenge.id } });
      throw error;
    }

    return { message: GENERIC_MESSAGE };
  }

  throw new Error("Unsupported OTP purpose");
}

/** Verifies a PHONE_VERIFICATION OTP and updates user.phoneVerifiedAt. */
export async function verifyPhoneContactOtp(params: {
  destination: string;
  code: string;
  actorUserId: string;
}): Promise<{ success: boolean }> {
  const now = new Date();
  const normalized = normalizePhone(params.destination);

  if (!/^\+?\d{8,15}$/.test(normalized) || !/^\d{6}$/.test(params.code)) {
    return { success: false };
  }

  const challenge = await prisma.otpChallenge.findFirst({
    where: { destination: normalized, purpose: OtpPurpose.PHONE_VERIFICATION, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge || challenge.expiresAt <= now) return { success: false };

  const expectedHash = hashCode(normalized, OtpPurpose.PHONE_VERIFICATION, params.code);
  const isValid = challenge.codeHash === expectedHash;

  if (!isValid) {
    if (challenge.attempts + 1 >= challenge.maxAttempts) {
      await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: now } });
    } else {
      await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: challenge.attempts + 1 } });
    }
    return { success: false };
  }

  await prisma.user.update({
    where: { id: params.actorUserId },
    data: { phoneVerifiedAt: now },
  });
  await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: now } });

  return { success: true };
}

/** Verifies an EMAIL_VERIFICATION OTP and updates user.emailVerifiedAt. */
export async function verifyEmailContactOtp(params: {
  destination: string;
  code: string;
  actorUserId: string;
}): Promise<{ success: boolean }> {
  const now = new Date();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.destination) || !/^\d{6}$/.test(params.code)) {
    return { success: false };
  }

  // Use PHONE_VERIFICATION purpose but EMAIL channel for stored challenges that target email
  const challenge = await prisma.otpChallenge.findFirst({
    where: { destination: params.destination, channel: OtpChannel.EMAIL, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge || challenge.expiresAt <= now) return { success: false };

  const expectedHash = hashCode(params.destination, challenge.purpose, params.code);
  const isValid = challenge.codeHash === expectedHash;

  if (!isValid) {
    if (challenge.attempts + 1 >= challenge.maxAttempts) {
      await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: now } });
    } else {
      await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: challenge.attempts + 1 } });
    }
    return { success: false };
  }

  await prisma.user.update({
    where: { id: params.actorUserId },
    data: { emailVerifiedAt: now },
  });
  await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: now } });

  return { success: true };
}
