import { Router } from "express";
import { getOwnDoctorProfile, updateOwnDoctorProfileHandler } from "../controllers/doctor-profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";

const router = Router();

router.get("/me", authenticate, authorizeAction("doctor.profile.read.self"), getOwnDoctorProfile);
router.patch("/me", authenticate, authorizeAction("doctor.profile.update.self"), updateOwnDoctorProfileHandler);

export default router;