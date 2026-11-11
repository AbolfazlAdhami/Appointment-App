import dotenv from "dotenv";

const requestedNodeEnv = process.env.NODE_ENV;

dotenv.config({
  path: requestedNodeEnv === "test" ? ".env.test" : ".env",
  override: requestedNodeEnv === "test",
});

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
const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3001,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const otpSecret = process.env.OTP_SECRET;

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

  if (jwtSecret === "replace-with-a-secure-random-secret" || otpSecret === "replace-with-at-least-32-characters-random-secret") {
    throw new Error("Production authentication secrets must not use example values");
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

const objectStorageEndpoint = process.env.OBJECT_STORAGE_ENDPOINT;
const objectStorageRegion = process.env.OBJECT_STORAGE_REGION ?? "us-east-1";
const objectStorageBucket = process.env.OBJECT_STORAGE_BUCKET;
const objectStorageAccessKey = process.env.OBJECT_STORAGE_ACCESS_KEY;
const objectStorageSecretKey = process.env.OBJECT_STORAGE_SECRET_KEY;
const objectStorageForcePathStyle = process.env.OBJECT_STORAGE_FORCE_PATH_STYLE !== "false";
const objectStorageMaxFileSizeBytes = readPositiveInteger(process.env.OBJECT_STORAGE_MAX_FILE_SIZE_BYTES, 25 * 1024 * 1024, "OBJECT_STORAGE_MAX_FILE_SIZE_BYTES");

const storageConfigValues = [objectStorageEndpoint, objectStorageBucket, objectStorageAccessKey, objectStorageSecretKey];
const objectStorageConfigured = storageConfigValues.every(Boolean);

if (storageConfigValues.some(Boolean) && !objectStorageConfigured) {
  throw new Error("OBJECT_STORAGE_ENDPOINT, OBJECT_STORAGE_BUCKET, OBJECT_STORAGE_ACCESS_KEY, and OBJECT_STORAGE_SECRET_KEY must be configured together");
}

if (objectStorageEndpoint) {
  const endpointUrl = new URL(objectStorageEndpoint);
  if (!["http:", "https:"].includes(endpointUrl.protocol)) {
    throw new Error("OBJECT_STORAGE_ENDPOINT must use HTTP or HTTPS");
  }
  if (nodeEnv === "production" && endpointUrl.protocol !== "https:") {
    throw new Error("OBJECT_STORAGE_ENDPOINT must use HTTPS in production");
  }
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",

  port,
  corsOrigins,
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

  objectStorage: {
    configured: objectStorageConfigured,
    endpoint: objectStorageEndpoint,
    region: objectStorageRegion,
    bucket: objectStorageBucket,
    accessKey: objectStorageAccessKey,
    secretKey: objectStorageSecretKey,
    forcePathStyle: objectStorageForcePathStyle,
    maxFileSizeBytes: objectStorageMaxFileSizeBytes,
  },
};
