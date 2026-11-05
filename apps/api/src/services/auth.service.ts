import bcrypt from "bcrypt";
import { Role, OtpPurpose } from "../generated/prisma/client";

import { prisma } from "../libs/prisma";
import { verifyAndConsumePhoneOtpWithTransaction } from "./otp.service";
import { createSessionWithTransaction } from "./session.service";

export type AuthErrorCode = "INVALID_INPUT" | "DUPLICATE_USER" | "INVALID_OTP" | "INVALID_CREDENTIALS";

export class AuthServiceError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string | null;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  phone: string;
  code: string;
  email?: string;
  password?: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s()-]/g, "");
}

function toAuthUser(user: { id: string; firstName: string; lastName: string; email: string | null; role: Role }) {
  return {
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const phone = normalizePhone(input.phone);
  const nationalId = input.nationalId.trim();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email?.trim().toLowerCase() || null;

  if (!/^\+?\d{8,15}$/.test(phone)) {
    throw new AuthServiceError("INVALID_INPUT", "Invalid phone number");
  }

  if (!firstName || !lastName || !nationalId) {
    throw new AuthServiceError("INVALID_INPUT", "Registration information is incomplete");
  }

  if (input.password && !email) {
    throw new AuthServiceError("INVALID_INPUT", "Email is required when setting a password");
  }

  const dateOfBirth = new Date(input.dateOfBirth);

  if (!input.dateOfBirth || Number.isNaN(dateOfBirth.getTime()) || dateOfBirth >= new Date()) {
    throw new AuthServiceError("INVALID_INPUT", "Invalid date of birth");
  }

  // Hash before opening the transaction to avoid holding
  // a database connection during CPU-intensive password hashing.
  const passwordHash = input.password ? await bcrypt.hash(input.password, 12) : null;

  const result = await prisma.$transaction(async (tx) => {
    // Check uniqueness before consuming the OTP.
    const duplicateUser = await tx.user.findFirst({
      where: {
        OR: [{ phone }, { nationalId }, ...(email ? [{ email }] : [])],
      },
      select: {
        id: true,
      },
    });

    if (duplicateUser) {
      return {
        success: false as const,
        reason: "duplicate",
      };
    }

    // OTP consumption is part of this transaction.
    const otpResult = await verifyAndConsumePhoneOtpWithTransaction(tx, {
      phone,
      code: input.code,
      purpose: OtpPurpose.SIGNUP,
    });

    if (!otpResult.success) {
      return {
        success: false as const,
        reason: "invalid_otp",
      };
    }

    const now = new Date();

    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        nationalId,
        dateOfBirth,
        phone,
        phoneVerifiedAt: now,
        email,
        passwordHash,
        role: Role.PATIENT,
        lastLoginAt: now,

        patientProfile: {
          create: {},
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    // Session creation shares the same transaction.
    const session = await createSessionWithTransaction(tx, user.id);

    return {
      success: true as const,
      user,
      session,
    };
  });

  if (!result.success) {
    if (result.reason === "duplicate") {
      throw new AuthServiceError("DUPLICATE_USER", "Phone, national ID, or email is already registered");
    }

    throw new AuthServiceError("INVALID_OTP", "Invalid or expired verification code");
  }

  return {
    user: toAuthUser(result.user),
    accessToken: result.session.accessToken,
    refreshToken: result.session.refreshToken,
    refreshTokenExpiresAt: result.session.refreshTokenExpiresAt,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash || !user.isActive) {
    throw new AuthServiceError("INVALID_CREDENTIALS", "Invalid email or password");
  }

  const passwordIsValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordIsValid) {
    throw new AuthServiceError("INVALID_CREDENTIALS", "Invalid email or password");
  }

  const session = await prisma.$transaction(async (tx) => {
    const newSession = await createSessionWithTransaction(tx, user.id);

    await tx.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return newSession;
  });

  return {
    user: toAuthUser(user),
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    refreshTokenExpiresAt: session.refreshTokenExpiresAt,
  };
}
