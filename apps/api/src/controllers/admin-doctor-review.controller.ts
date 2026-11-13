import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { DoctorReviewSchema } from "../schemas/doctor-review.schema";
import { listDoctorsForReview, reviewDoctorProfile } from "../services/doctor-review.service";
import { DoctorVerificationStatus } from "../generated/prisma/client";

export async function listDoctorsForReviewHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const limit = Math.min(parseInt(req.query.limit as string) || 25, 100);
  const cursor = (req.query.cursor as string) || undefined;
  const status = (req.query.status as string) || undefined;

  const result = await listDoctorsForReview({
    actorUserId: user.userId,
    limit,
    cursor,
    ...(status ? { status: status as DoctorVerificationStatus } : {}),
  });

  res.status(200).json(result);
}

export async function reviewDoctorProfileHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const { doctorId } = req.params as { doctorId: string };
  if (!doctorId) {
    res.status(400).json({ message: "Doctor ID is required" });
    return;
  }

  const validation = DoctorReviewSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid review data", errors: validation.error.flatten() });
    return;
  }

  const result = await reviewDoctorProfile({
    actorUserId: user.userId,
    doctorId,
    payload: validation.data,
  });

  if (result.kind === "not_found") {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }
  if (result.kind === "already_reviewed") {
    res.status(409).json({ message: "Doctor profile has already been reviewed" });
    return;
  }

  res.status(200).json({ status: result.status });
}
