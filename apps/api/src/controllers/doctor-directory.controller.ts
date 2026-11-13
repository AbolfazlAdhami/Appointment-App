import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { DoctorListQuerySchema } from "../schemas/doctor-list.schema";
import { listDoctors, getDoctorPublicDetails } from "../services/doctor-directory.service";

export async function listDoctorsHandler(req: Request, res: Response): Promise<void> {
  const validation = DoctorListQuerySchema.safeParse(req.query);

  if (!validation.success) {
    res.status(400).json({ message: "Invalid doctor list query", errors: validation.error.flatten() });
    return;
  }

  const actor = (req as AuthenticatedRequest).user;
  const result = await listDoctors({
    ...validation.data,
    actorUserId: actor?.userId,
    actorRole: actor?.role,
  });

  res.status(200).json(result);
}

export async function getDoctorDetailsHandler(req: Request, res: Response): Promise<void> {
  const { doctorId } = req.params as { doctorId: string };

  if (!doctorId) {
    res.status(400).json({ message: "Doctor ID is required" });
    return;
  }

  const doctor = await getDoctorPublicDetails(doctorId);

  if (!doctor) {
    res.status(404).json({ message: "Doctor not found or not published" });
    return;
  }

  res.status(200).json({ doctor });
}
