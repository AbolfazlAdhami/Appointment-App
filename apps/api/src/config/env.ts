import dotenv from "dotenv";

dotenv.config();

function readPort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number");
  }

  return port;
}

function readPositiveInteger(value: string | undefined, fallback: number, name: string): number {
  const parsed = Number(value ?? fallback);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const port = readPort(process.env.PORT, 4000);

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const otpSecret = process.env.OTP_SECRET ?? jwtSecret;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

if (!otpSecret) {
  throw new Error("OTP_SECRET is required");
}

if (nodeEnv === "production") {
  if (jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters in production");
  }

  if (!process.env.OTP_SECRET || otpSecret.length < 32) {
    throw new Error("OTP_SECRET must contain at least 32 characters in production");
  }
}

const smsProvider = process.env.SMS_PROVIDER ?? "mock";

if (!["mock", "limo"].includes(smsProvider)) {
  throw new Error("SMS_PROVIDER must be mock or limo");
}

const limoSmsApiKey = process.env.LIMOSMS_API_KEY;
const limoSmsSenderNumber = process.env.LIMOSMS_SENDER_NUMBER;

if (smsProvider === "limo" && (!limoSmsApiKey || !limoSmsSenderNumber)) {
  throw new Error("LIMOSMS_API_KEY and LIMOSMS_SENDER_NUMBER are required");
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",

  port,
  databaseUrl,

  jwtSecret,
  otpSecret,

  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",

  refreshTokenTtlSeconds: readPositiveInteger(process.env.REFRESH_TOKEN_TTL_SECONDS, 7 * 24 * 60 * 60, "REFRESH_TOKEN_TTL_SECONDS"),

  otpExpiresInSeconds: readPositiveInteger(process.env.OTP_EXPIRES_IN_SECONDS, 120, "OTP_EXPIRES_IN_SECONDS"),

  otpMaxAttempts: readPositiveInteger(process.env.OTP_MAX_ATTEMPTS, 5, "OTP_MAX_ATTEMPTS"),

  otpResendCooldownSeconds: readPositiveInteger(process.env.OTP_RESEND_COOLDOWN_SECONDS, 60, "OTP_RESEND_COOLDOWN_SECONDS"),

  otpDailyLimit: readPositiveInteger(process.env.OTP_DAILY_LIMIT, 10, "OTP_DAILY_LIMIT"),

  jwtExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? process.env.JWT_EXPIRES_IN ?? "15m",

  smsProvider: smsProvider as "mock" | "limo",

  limoSmsApiKey,

  limoSmsSenderNumber,
};
