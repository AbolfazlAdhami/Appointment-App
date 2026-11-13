import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import fileAssetRoutes from "./routes/file-asset.routes";
import adminUserRoutes from "./routes/admin-user.routes";
import doctorProfileRoutes from "./routes/doctor-profile.routes";
import appealRoutes from "./routes/appeal.routes";
import doctorRoutes from "./routes/doctor.routes";
import adminDoctorRoutes from "./routes/admin-doctor.routes";

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
app.use("/api/admin/appeals", appealRoutes);
app.use("/api/admin/doctors", adminDoctorRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor/profile", doctorProfileRoutes);

export default app;
