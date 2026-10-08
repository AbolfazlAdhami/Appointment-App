import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT ?? 4000);

if (Number.isNaN(port)) {
  throw new Error("PORT must be a valid number");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

export const env = {
  port,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};
