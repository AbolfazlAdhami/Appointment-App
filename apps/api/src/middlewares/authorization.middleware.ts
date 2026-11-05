
import type { Request, Response, NextFunction } from "express";
import type { Role } from "../generated/prisma/client";
import type { AuthenticatedRequest } from "./auth.middleware";

export function authorize(...roles: Role[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const authenticatedReq = req as AuthenticatedRequest;

    if (!authenticatedReq.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (!roles.includes(authenticatedReq.user.role)) {
      res.status(403).json({
        message: "Access forbidden",
      });
      return;
    }

    next();
  };
}
