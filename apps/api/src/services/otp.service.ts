import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { OtpChannel, OtpPurpose } from "../generated/prisma/client";

import { env } from "../config/env";
import { prisma } from "../libs/prisma";
import { createSmsProvider } from "../providers/sms/sms.factory";

const GENERIC_MESSAGE = "اگر اطلاعات واردشده معتبر باشد، کد تأیید برای شما ارسال خواهد شد.";

interface RequestPhoneOtpInput {
  phone: string;
  purpose: Extract<OtpPurpose, "SIGNUP" | "LOGIN">;
}

interface VerifyPhoneOtpInput {
  phone: string;
  code: string;
  purpose: Extract<OtpPurpose, "SIGNUP" | "LOGIN">;
}

export interface VerifiedPhoneOtp {
  challengeId: string;
  userId: string | null;
  phone: string;
  purpose: Extract<OtpPurpose, "SIGNUP" | "LOGIN">;
}

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

  // فقط یک Challenge فعال برای این شماره و هدف نگه می‌داریم.
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

const INVALID_OTP_MESSAGE = "Invalid or expired verification code";

export async function verifyPhoneOtp(input: VerifyPhoneOtpInput): Promise<VerifiedPhoneOtp> {
  const phone = normalizePhone(input.phone);
  const { code, purpose } = input;

  if (!/^\+?\d{8,15}$/.test(phone) || !/^\d{6}$/.test(code)) {
    throw new Error(INVALID_OTP_MESSAGE);
  }

  const now = new Date();

  // 1. Find the latest active challenge
  const challenge = await prisma.otpChallenge.findFirst({
    where: {
      destination: phone,
      purpose,
      consumedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!challenge) {
    throw new Error(INVALID_OTP_MESSAGE);
  }

  // 2. Check expiration
  if (challenge.expiresAt <= now) {
    throw new Error(INVALID_OTP_MESSAGE);
  }

  // 3. Check maximum attempts
  if (challenge.attempts >= challenge.maxAttempts) {
    throw new Error(INVALID_OTP_MESSAGE);
  }

  // 4. Hash submitted code
  const submittedHash = Buffer.from(hashOtp(phone, purpose, code), "hex");

  const storedHash = Buffer.from(challenge.codeHash, "hex");

  // 5. Constant-time comparison
  const isValid = storedHash.length === submittedHash.length && timingSafeEqual(storedHash, submittedHash);

  if (!isValid) {
    // Increment attempts only if challenge is still active.
    const attemptUpdate = await prisma.otpChallenge.updateMany({
      where: {
        id: challenge.id,
        consumedAt: null,
        expiresAt: {
          gt: now,
        },
        attempts: {
          lt: challenge.maxAttempts,
        },
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    if (attemptUpdate.count !== 1) {
      throw new Error(INVALID_OTP_MESSAGE);
    }

    // Invalidate challenge when maximum attempts are reached.
    await prisma.otpChallenge.updateMany({
      where: {
        id: challenge.id,
        consumedAt: null,
        attempts: {
          gte: challenge.maxAttempts,
        },
      },
      data: {
        consumedAt: now,
      },
    });

    throw new Error(INVALID_OTP_MESSAGE);
  }

  // 6. Consume OTP atomically.
  // Only one concurrent request can successfully consume it.
  const consumed = await prisma.otpChallenge.updateMany({
    where: {
      id: challenge.id,
      consumedAt: null,
      expiresAt: {
        gt: now,
      },
      attempts: {
        lt: challenge.maxAttempts,
      },
      codeHash: challenge.codeHash,
    },
    data: {
      consumedAt: now,
    },
  });

  if (consumed.count !== 1) {
    throw new Error(INVALID_OTP_MESSAGE);
  }

  // 7. Return verified challenge information.
  return {
    challengeId: challenge.id,
    userId: challenge.userId,
    phone: challenge.destination,
    purpose,
  };
}
