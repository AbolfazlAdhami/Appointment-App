import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UpdateDoctorProfileSchema } from "../schemas/doctor-profile.schema";
import { getDoctorProfile, updateOwnDoctorProfile } from "../services/doctor-profile.service";

export async function getOwnDoctorProfile(req: Request, res: Response): Promise<void> {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const profile = await getDoctorProfile(user.userId);
  if (!profile) {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }

  res.status(200).json({ profile });
}

export async function updateOwnDoctorProfileHandler(req: Request, res: Response): Promise<void> {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const validation = UpdateDoctorProfileSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid doctor profile update", errors: validation.error.flatten() });
    return;
  }

  const result = await updateOwnDoctorProfile({ authenticatedUserId: user.userId, changes: validation.data });

  if (result.kind === "not_found") {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }
  if (result.kind === "read_only") {
    res.status(409).json({ message: "Approved or suspended doctor profiles are read-only" });
    return;
  }

  res.status(200).json({ profile: result.profile });
}