import { Router } from "express";

import { login, loginOtp, logout, me, register, refresh, requestOtp } from "../controllers/auth.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";

const router = Router();

router.post("/otp/request", requestOtp);
router.post("/register", register);

router.post("/login", login);
router.post("/login/otp", loginOtp);
router.post("/refresh", refresh);

router.post("/logout", authenticate, authorizeAction("auth.logout"), logout);
router.get("/me", authenticate, authorizeAction("auth.me"), me);

export default router;
