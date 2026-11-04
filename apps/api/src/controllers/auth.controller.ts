import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AuthUserResponseSchema, LogoutResponseSchema, ErrorResponseSchema } from "../schemas/auth-response.schema";

const COOKIE_NAME = "accessToken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

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

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME, clearCookieOptions);

  res.status(200).json(
    LogoutResponseSchema.parse({
      message: "Logged out successfully",
    }),
  );
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const { userId, email, firstName, lastName, role } = req.user;

  res.json(
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
