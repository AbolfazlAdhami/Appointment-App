import type { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    sessionId: string;
    email: string | null;
    firstName: string;
    lastName: string;
    role: Role;
  };
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const payload = verifyAccessToken(token);

    const session = await prisma.authSession.findUnique({
      where: {
        id: payload.sessionId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    const now = new Date();

    if (!session || session.userId !== payload.userId || session.revokedAt !== null || session.expiresAt <= now || !session.user.isActive) {
      res.status(401).json({ message: "Invalid or expired session" });
      return;
    }

    (req as AuthenticatedRequest).user = {
      userId: session.user.id,
      sessionId: session.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authenticatedReq = req as AuthenticatedRequest;

    if (!authenticatedReq.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!roles.includes(authenticatedReq.user.role)) {
      res.status(403).json({ message: "Access forbidden" });
      return;
    }

    next();
  };
}
