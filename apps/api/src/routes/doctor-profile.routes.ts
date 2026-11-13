import { Router } from "express";
import {
  getOwnDoctorProfile,
  updateOwnDoctorProfileHandler,
  createOwnDoctorProfileHandler,
  submitOwnDoctorProfileHandler,
} from "../controllers/doctor-profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";

const router = Router();

router.get("/me", authenticate, authorizeAction("doctor.profile.read.self"), getOwnDoctorProfile);
router.post("/", authenticate, authorizeAction("doctor.profile.create.self"), createOwnDoctorProfileHandler);
router.post("/submit", authenticate, authorizeAction("doctor.profile.submit.self"), submitOwnDoctorProfileHandler);
router.patch("/me", authenticate, authorizeAction("doctor.profile.update.self"), updateOwnDoctorProfileHandler);

export default router;