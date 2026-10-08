import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "appointment-api",
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
