import { Router } from "express";
import { getUsers, setUserStatus } from "../controllers/admin-user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";

const router = Router();

router.get("/", authenticate, authorizeAction("admin.users.list"), getUsers);
router.patch("/:userId/status", authenticate, authorizeAction("admin.users.status.update"), setUserStatus);

export default router;