import { Router } from "express";
import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAction } from "../middlewares/authorization.middleware";
import { downloadFile, uploadFile } from "../controllers/file-asset.controller";
import { env } from "../config/env";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeAction("file.upload.self"),
  express.raw({ type: "*/*", limit: env.objectStorage.maxFileSizeBytes }),
  uploadFile,
);

router.get("/:fileId", authenticate, authorizeAction("file.read.self"), downloadFile);

export default router;