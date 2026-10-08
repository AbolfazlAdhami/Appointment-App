import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const COOKIE_NAME = "accessToken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required",
      });

      return;
    }

    const result = await registerUser({
      name,
      email,
      password,
    });

    res.cookie(COOKIE_NAME, result.token, cookieOptions);

    res.status(201).json({
      user: result.user,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });

      return;
    }

    const result = await loginUser({
      email,
      password,
    });

    res.cookie(COOKIE_NAME, result.token, cookieOptions);

    res.json({
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME);

  res.json({
    message: "Logged out successfully",
  });
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.json({
    user: req.user,
  });
}
