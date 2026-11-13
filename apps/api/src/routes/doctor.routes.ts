import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";
import {
  listDoctorsHandler,
  getDoctorDetailsHandler,
} from "../controllers/doctor-directory.controller";
import {
  listMySpecialtiesHandler,
  addDoctorSpecialtyHandler,
  removeDoctorSpecialtyHandler,
} from "../controllers/doctor-specialty.controller";
import {
  listMyCredentialsHandler,
  addDoctorCredentialHandler,
  removeDoctorCredentialHandler,
} from "../controllers/doctor-credential.controller";

const router = Router();

// ── Public doctor directory (no auth required for read) ───────────────
router.get("/", listDoctorsHandler);
router.get("/:doctorId", getDoctorDetailsHandler);

// ── Doctor self-management (auth required) ────────────────────────────
router.get(
  "/specialties",
  authenticate,
  authorizeAction("doctor.specialty.manage"),
  listMySpecialtiesHandler
);
router.post(
  "/specialties",
  authenticate,
  authorizeAction("doctor.specialty.manage"),
  addDoctorSpecialtyHandler
);
router.delete(
  "/specialties/:specialtyId",
  authenticate,
  authorizeAction("doctor.specialty.manage"),
  removeDoctorSpecialtyHandler
);

// ── Doctor credentials (auth required) ────────────────────────────────
router.get(
  "/credentials",
  authenticate,
  authorizeAction("doctor.credential.manage"),
  listMyCredentialsHandler
);
router.post(
  "/credentials",
  authenticate,
  authorizeAction("doctor.credential.manage"),
  addDoctorCredentialHandler
);
router.delete(
  "/credentials/:credentialId",
  authenticate,
  authorizeAction("doctor.credential.manage"),
  removeDoctorCredentialHandler
);

export default router;
