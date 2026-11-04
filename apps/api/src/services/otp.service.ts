import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

import { OtpChannel, OtpPurpose, type Prisma } from "../generated/prisma/client";

import { env } from "../config/env";
import { prisma } from "../libs/prisma";
import { createSmsProvider } from "../providers/sms/sms.factory";

const GENERIC_MESSAGE = "اگر اطلاعات واردشده معتبر باشد، کد تأیید برای شما ارسال خواهد شد.";

const INVALID_OTP_MESSAGE = "Invalid or expired verification code";

type PhoneOtpPurpose = Extract<OtpPurpose, "SIGNUP" | "LOGIN">;

interface RequestPhoneOtpInput {
  phone: string;
  purpose: PhoneOtpPurpose;
}

export interface VerifyPhoneOtpInput {
  phone: string;
  code: string;
  purpose: PhoneOtpPurpose;
}

export interface VerifiedPhoneOtp {
  challengeId: string;
  userId: string | null;
  phone: string;
  purpose: PhoneOtpPurpose;
}

export type OtpVerificationResult =
  | {
      success: true;
      data: VerifiedPhoneOtp;
    }
  | {
      success: false;
    };

function normalizePhone(phone: string): string {
  return phone.replace(/[\s()-]/g, "");
}

function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

function hashOtp(phone: string, purpose: OtpPurpose, code: string): string {
  return createHmac("sha256", env.otpSecret).update(`${phone}:${purpose}:${code}`).digest("hex");
}

function getUtcDayStart(): Date {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function requestPhoneOtp(input: RequestPhoneOtpInput): Promise<{ message: string }> {
  const phone = normalizePhone(input.phone);

  if (!/^\+?\d{8,15}$/.test(phone)) {
    throw new Error("Invalid phone number");
  }

  const now = new Date();

  const latestChallenge = await prisma.otpChallenge.findFirst({
    where: {
      destination: phone,
      purpose: input.purpose,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (latestChallenge) {
    const elapsedSeconds = (now.getTime() - latestChallenge.createdAt.getTime()) / 1000;

    if (elapsedSeconds < env.otpResendCooldownSeconds) {
      return { message: GENERIC_MESSAGE };
    }
  }

  const dailyRequestCount = await prisma.otpChallenge.count({
    where: {
      destination: phone,
      purpose: input.purpose,
      createdAt: {
        gte: getUtcDayStart(),
      },
    },
  });

  if (dailyRequestCount >= env.otpDailyLimit) {
    return { message: GENERIC_MESSAGE };
  }

  const user = await prisma.user.findUnique({
    where: { phone },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (input.purpose === OtpPurpose.SIGNUP && user) {
    return { message: GENERIC_MESSAGE };
  }

  if (input.purpose === OtpPurpose.LOGIN && (!user || !user.isActive)) {
    return { message: GENERIC_MESSAGE };
  }

  const code = generateOtp();
  const codeHash = hashOtp(phone, input.purpose, code);

  await prisma.otpChallenge.updateMany({
    where: {
      destination: phone,
      purpose: input.purpose,
      consumedAt: null,
    },
    data: {
      consumedAt: now,
    },
  });

  const challenge = await prisma.otpChallenge.create({
    data: {
      userId: input.purpose === OtpPurpose.LOGIN ? user?.id : null,
      channel: OtpChannel.SMS,
      purpose: input.purpose,
      destination: phone,
      codeHash,
      expiresAt: new Date(now.getTime() + env.otpExpiresInSeconds * 1000),
      maxAttempts: env.otpMaxAttempts,
    },
  });

  try {
    const smsProvider = createSmsProvider();

    await smsProvider.send({
      to: phone,
      message: `Your verification code is: ${code}`,
    });
  } catch (error) {
    await prisma.otpChallenge.delete({
      where: {
        id: challenge.id,
      },
    });

    throw error;
  }

  return {
    message: GENERIC_MESSAGE,
  };
}

/**
 * Verifies and consumes an OTP using the supplied transaction.
 *
 * Important:
 * Invalid OTP attempts return a failure result instead of throwing.
 * This allows the transaction to commit the attempt counter update.
 */
export async function verifyAndConsumePhoneOtpWithTransaction(tx: Prisma.TransactionClient, input: VerifyPhoneOtpInput): Promise<OtpVerificationResult> {
  const phone = normalizePhone(input.phone);
  const { code, purpose } = input;

  if (!/^\+?\d{8,15}$/.test(phone) || !/^\d{6}$/.test(code)) {
    return { success: false };
  }

  const now = new Date();

  const challenge = await tx.otpChallenge.findFirst({
    where: {
      destination: phone,
      purpose,
      consumedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!challenge || challenge.expiresAt <= now || challenge.attempts >= challenge.maxAttempts) {
    return { success: false };
  }

  const submittedHash = Buffer.from(hashOtp(phone, purpose, code), "hex");

  const storedHash = Buffer.from(challenge.codeHash, "hex");

  const isValid = storedHash.length === submittedHash.length && timingSafeEqual(storedHash, submittedHash);

  if (!isValid) {
    const attemptUpdate = await tx.otpChallenge.updateMany({
      where: {
        id: challenge.id,
        consumedAt: null,
        expiresAt: { gt: now },
        attempts: { lt: challenge.maxAttempts },
      },
      data: {
        attempts: { increment: 1 },
      },
    });

    if (attemptUpdate.count !== 1) {
      return { success: false };
    }

    const updatedChallenge = await tx.otpChallenge.findUnique({
      where: {
        id: challenge.id,
      },
      select: {
        attempts: true,
        maxAttempts: true,
        consumedAt: true,
      },
    });

    if (updatedChallenge && updatedChallenge.attempts >= updatedChallenge.maxAttempts && updatedChallenge.consumedAt === null) {
      await tx.otpChallenge.updateMany({
        where: {
          id: challenge.id,
          consumedAt: null,
        },
        data: {
          consumedAt: now,
        },
      });
    }

    return { success: false };
  }

  const consumed = await tx.otpChallenge.updateMany({
    where: {
      id: challenge.id,
      consumedAt: null,
      expiresAt: { gt: now },
      attempts: { lt: challenge.maxAttempts },
      codeHash: challenge.codeHash,
    },
    data: {
      consumedAt: now,
    },
  });

  if (consumed.count !== 1) {
    return { success: false };
  }

  return {
    success: true,
    data: {
      challengeId: challenge.id,
      userId: challenge.userId,
      phone: challenge.destination,
      purpose,
    },
  };
}

/**
 * Backward-compatible wrapper for existing OTP login code.
 *
 * The transaction commits failed-attempt updates before the error
 * is thrown to the caller.
 */
export async function verifyPhoneOtp(input: VerifyPhoneOtpInput): Promise<VerifiedPhoneOtp> {
  const result = await prisma.$transaction((tx) => verifyAndConsumePhoneOtpWithTransaction(tx, input));

  if (!result.success) {
    throw new Error(INVALID_OTP_MESSAGE);
  }

  return result.data;
}
