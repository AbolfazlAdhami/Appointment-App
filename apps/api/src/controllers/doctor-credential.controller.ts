import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { DoctorCredentialCreateSchema } from "../schemas/doctor-credential.schema";
import {
  createDoctorCredential,
  listDoctorCredentials,
  removeDoctorCredential,
} from "../services/doctor-credential.service";

export async function listMyCredentialsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const credentials = await listDoctorCredentials(user.userId);
  if (credentials === null) {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }

  res.status(200).json({ credentials });
}

export async function addDoctorCredentialHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const validation = DoctorCredentialCreateSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ message: "Invalid credential data", errors: validation.error.flatten() });
    return;
  }

  const result = await createDoctorCredential({ actorUserId: user.userId, payload: validation.data });

  if (result.kind === "not_found") {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }

  res.status(201).json({ credential: result.credential });
}

export async function removeDoctorCredentialHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const { credentialId } = req.params as { credentialId: string };
  if (!credentialId) {
    res.status(400).json({ message: "Credential ID is required" });
    return;
  }

  const result = await removeDoctorCredential({ actorUserId: user.userId, credentialId });

  if (result.kind === "not_found") {
    res.status(404).json({ message: "Doctor profile not found" });
    return;
  }

  res.status(200).json({ removed: result.count > 0 });
}
