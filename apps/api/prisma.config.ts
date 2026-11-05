import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const nodeEnv = process.env.NODE_ENV ?? "development";

dotenv.config({
  path: nodeEnv === "test" ? ".env.test" : ".env",
  override: nodeEnv === "test",
});

const databaseUrl = env("DATABASE_URL");

if (nodeEnv === "test") {
  const databaseName = new URL(databaseUrl).pathname.slice(1);

  if (databaseName !== "pezeshki_test") {
    throw new Error(`Unsafe test database: expected pezeshki_test, received ${databaseName}`);
  }
}

export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
