import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";
import { createAppealHandler, listAppealsHandler, reviewAppealHandler } from "../controllers/appeal.controller";

const router = Router();

router.post("/", authenticate, authorizeAction("appeal.create"), createAppealHandler);
router.get("/open", authenticate, authorizeAction("appeal.list"), listAppealsHandler);
router.patch("/:appealId/review", authenticate, authorizeAction("appeal.read"), reviewAppealHandler);

export default router;
