import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { DoctorSpecialtySchema } from "../schemas/doctor-specialty.schema";
import {
  addDoctorSpecialty,
  removeDoctorSpecialty,
  listDoctorSpecialties,
} from "../services/doctor-specialty.service";

export async function listMySpecialtiesHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const specialties = await listDoctorSpecialties(user.userId);
  if (specialties === null) {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }

  res.status(200).json({ specialties });
}

export async function addDoctorSpecialtyHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const validation = DoctorSpecialtySchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid specialty data", errors: validation.error.flatten() });
    return;
  }

  const result = await addDoctorSpecialty({ actorUserId: user.userId, payload: validation.data });

  if (result.kind === "not_found") {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }
  if (result.kind === "already_exists") {
    res.status(409).json({ message: "Specialty already assigned to this doctor" });
    return;
  }

  res.status(201).json({ specialty: result.specialty });
}

export async function removeDoctorSpecialtyHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const { specialtyId } = req.params as { specialtyId: string };
  if (!specialtyId) {
    res.status(400).json({ message: "Specialty ID is required" });
    return;
  }

  const result = await removeDoctorSpecialty({ actorUserId: user.userId, specialtyId });

  if (result.kind === "not_found") {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }

  res.status(200).json({ removed: result.count > 0 });
}
