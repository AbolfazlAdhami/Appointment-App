import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CreateAppealSchema, ReviewAppealSchema } from "../schemas/appeal.schema";
import { createAppeal, listOpenAppeals, reviewAppeal } from "../services/appeal.service";

export async function createAppealHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const validation = CreateAppealSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ message: "Invalid appeal data", errors: validation.error.flatten() });
    return;
  }

  const result = await createAppeal({ actorUserId: user.userId, payload: validation.data });

  res.status(201).json({ id: result.id, status: "pending" });
}

export async function listAppealsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const limit = Math.min(parseInt(req.query.limit as string) || 25, 100);
  const cursor = (req.query.cursor as string) || undefined;

  const result = await listOpenAppeals({ actorUserId: user.userId, limit, cursor });

  res.status(200).json(result);
}

export async function reviewAppealHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const { appealId } = req.params as { appealId: string };
  if (!appealId) {
    res.status(400).json({ message: "Appeal ID is required" });
    return;
  }

  const validation = ReviewAppealSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ message: "Invalid review data", errors: validation.error.flatten() });
    return;
  }

  const result = await reviewAppeal({ actorUserId: user.userId, appealId, payload: validation.data });

  if (result.kind === "not_found") {
    res.status(404).json({ message: "Appeal not found" });
    return;
  }
  if (result.kind === "already_reviewed") {
    res.status(409).json({ message: "This appeal has already been reviewed" });
    return;
  }

  res.status(200).json({ status: result.status });
}
