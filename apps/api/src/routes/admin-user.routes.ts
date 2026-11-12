import { Router } from "express";
import { setUserStatus } from "../controllers/admin-user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";

const router = Router();

router.patch("/:userId/status", authenticate, authorizeAction("admin.users.status.update"), setUserStatus);

export default router;