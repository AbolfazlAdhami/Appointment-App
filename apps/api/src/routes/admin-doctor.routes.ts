import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";
import {
  listDoctorsForReviewHandler,
  reviewDoctorProfileHandler,
} from "../controllers/admin-doctor-review.controller";

const router = Router();

// ── Admin doctor review ───────────────────────────────────────────────
router.get(
  "/review",
  authenticate,
  authorizeAction("admin.doctorProfile.review.list"),
  listDoctorsForReviewHandler
);
router.patch(
  "/:doctorId/review",
  authenticate,
  authorizeAction("admin.doctorProfile.review.detail"),
  reviewDoctorProfileHandler
);

export default router;
