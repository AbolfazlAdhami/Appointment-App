import type { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { revokeSession, refreshSession } from "../services/session.service";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

import { AuthUserResponseSchema, LogoutResponseSchema } from "../schemas/auth-response.schema";

export function register(_req: Request, res: Response): void {
  res.status(410).json({
    message: "Registration is available through phone OTP.",
  });
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

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: result.refreshTokenExpiresAt.getTime() - Date.now(),
    });

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


export async function refresh(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = req.cookies?.refreshToken;

  if (
    typeof refreshToken !== "string" ||
    refreshToken.length === 0
  ) {
    res.status(401).json({
      message: "Refresh token is required",
    });
    return;
  }

  try {
    const result = await refreshSession(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: result.refreshTokenExpiresAt.getTime() - Date.now(),
    });

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

