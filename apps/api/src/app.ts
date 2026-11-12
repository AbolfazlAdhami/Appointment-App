import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import fileAssetRoutes from "./routes/file-asset.routes";
import adminUserRoutes from "./routes/admin-user.routes";

const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "appointment-api",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileAssetRoutes);
app.use("/api/admin/users", adminUserRoutes);

export default app;
