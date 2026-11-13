import type { Request, Response } from "express";
import { z } from "zod";
import { revokeSession, refreshSession } from "../services/session.service";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AuthUserResponseSchema, LogoutResponseSchema } from "../schemas/auth-response.schema";
import { registerUser, loginUser, loginWithPhoneOtp, AuthServiceError } from "../services/auth.service";
import { requestPhoneOtp } from "../services/otp.service";
import { RegisterSchema, RequestPhoneOtpSchema } from "../schemas/auth-request.schema";
import { UpdateProfileSchema } from "../schemas/profile.schema";
import { getUserProfile, updateUserProfile } from "../services/profile.service";
import { requestContactOtp, verifyPhoneContactOtp, verifyEmailContactOtp } from "../services/contact-verification.service";

function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: expiresAt.getTime() - Date.now(),
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const validation = RegisterSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        message: "Invalid registration data",
        errors: validation.error.flatten(),
      });
      return;
    }

    const result = await registerUser(validation.data);

    setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);

    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      switch (error.code) {
        case "DUPLICATE_USER":
          res.status(409).json({ message: error.message });
          return;

        case "INVALID_OTP":
        case "INVALID_INPUT":
          res.status(400).json({ message: error.message });
          return;
      }
    }

    res.status(500).json({
      message: "Registration failed",
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser({ email, password });

    setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);

    res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
}

export async function loginOtp(req: Request, res: Response): Promise<void> {
  const validation = z.object({ phone: z.string().trim().min(8).max(20).regex(/^\+?[0-9\s()-]+$/), code: z.string().regex(/^\d{6}$/) }).safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid OTP login data", errors: validation.error.flatten() });
    return;
  }
  try {
    const result = await loginWithPhoneOtp(validation.data);
    setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);
    res.status(200).json({ user: result.user, accessToken: result.accessToken });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      res.status(error.code === "INVALID_INPUT" ? 400 : 401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Login failed" });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    if (!authenticatedReq.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    await revokeSession(authenticatedReq.user.sessionId, authenticatedReq.user.userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    res.status(200).json(
      LogoutResponseSchema.parse({
        message: "Logged out successfully",
      }),
    );
  } catch {
    res.status(500).json({
      message: "Logout failed",
    });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.refreshToken;

  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    res.status(401).json({
      message: "Refresh token is required",
    });
    return;
  }

  try {
    const result = await refreshSession(refreshToken);

    setRefreshCookie(res, result.refreshToken, result.refreshTokenExpiresAt);

    res.status(200).json({
      accessToken: result.accessToken,
    });
  } catch {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const { userId, email, firstName, lastName, role } = req.user;

  res.status(200).json(
    AuthUserResponseSchema.parse({
      user: {
        id: userId,
        name: [firstName, lastName].filter(Boolean).join(" "),
        email,
        role,
      },
    }),
  );
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const profile = await getUserProfile(req.user.userId);

  if (!profile) {
    res.status(404).json({ message: "User profile not found" });
    return;
  }

  res.status(200).json({ user: profile });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const validation = UpdateProfileSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Invalid profile update",
      errors: validation.error.flatten(),
    });
    return;
  }

  const profile = await updateUserProfile(req.user.userId, validation.data);

  if (!profile) {
    res.status(404).json({ message: "User profile not found" });
    return;
  }

  res.status(200).json({ user: profile });
}

export async function requestOtp(req: Request, res: Response): Promise<void> {
  const validation = RequestPhoneOtpSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Invalid OTP request",
      errors: validation.error.flatten(),
    });
    return;
  }

  try {
    const result = await requestPhoneOtp(validation.data);

    res.status(200).json(result);
  } catch (error) {
    console.error("[AUTH][OTP_REQUEST]", error);

    res.status(500).json({
      message: "Unable to process OTP request",
    });
  }
}

// ── Contact verification endpoints ───────────────────────────────────────────

const ContactSendOtpSchema = z.object({
  destination: z.string().trim().min(8),
  purpose: z.enum(["SIGNUP", "LOGIN", "PHONE_VERIFICATION"]),
});

export async function sendContactOtp(req: Request, res: Response): Promise<void> {
  const validation = ContactSendOtpSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ message: "Invalid contact OTP request", errors: validation.error.flatten() });
    return;
  }

  try {
    const result = await requestContactOtp({
      destination: validation.data.destination,
      purpose: validation.data.purpose as any,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("[AUTH][CONTACT_SEND_OTP]", error);
    res.status(500).json({ message: "Unable to send verification code" });
  }
}

const ContactVerifySchema = z.object({
  destination: z.string().trim().min(8),
  code: z.string().regex(/^\d{6}$/),
  channel: z.enum(["SMS", "EMAIL"]),
});

export async function verifyContactOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const validation = ContactVerifySchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid verification payload", errors: validation.error.flatten() });
    return;
  }

  let ok: boolean;
  if (validation.data.channel === "SMS") {
    const result = await verifyPhoneContactOtp({
      destination: validation.data.destination,
      code: validation.data.code,
      actorUserId: user.userId,
    });
    ok = result.success;
  } else {
    const result = await verifyEmailContactOtp({
      destination: validation.data.destination,
      code: validation.data.code,
      actorUserId: user.userId,
    });
    ok = result.success;
  }

  if (!ok) {
    res.status(401).json({ message: "Invalid or expired verification code" });
    return;
  }

  res.status(200).json({ message: "Contact verified successfully" });
}
