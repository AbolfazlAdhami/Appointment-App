import { Router } from "express";

import { login, loginOtp, logout, me, register, refresh, requestOtp, getProfile, updateProfile, sendContactOtp, verifyContactOtp } from "../controllers/auth.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";

const router = Router();

router.post("/otp/request", requestOtp);
router.post("/register", register);

router.post("/login", login);
router.post("/login/otp", loginOtp);
router.post("/refresh", refresh);
router.post("/contact/send-otp", sendContactOtp);
router.post("/contact/verify", authenticate, authorizeAction("contact.verifyPhone"), verifyContactOtp);

router.post("/logout", authenticate, authorizeAction("auth.logout"), logout);
router.get("/me", authenticate, authorizeAction("auth.me"), me);
router.get("/profile", authenticate, authorizeAction("profile.read.self"), getProfile);
router.patch("/profile", authenticate, authorizeAction("profile.update.self"), updateProfile);

export default router;
