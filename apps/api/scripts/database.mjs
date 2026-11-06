import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const mode = process.argv[2];
const apiDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(apiDirectory, process.env.NODE_ENV === "test" ? ".env.test" : ".env");

if (!existsSync(envPath)) {
  console.error(`Missing ${envPath}; set DATABASE_URL in the API environment file.`);
  process.exit(1);
}

const values = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, "")];
    }),
);

const databaseUrl = process.env.DATABASE_URL ?? values.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const url = new URL(databaseUrl);
const database = decodeURIComponent(url.pathname.slice(1));
if (!database || database === "postgres" || database === "template0" || database === "template1") {
  console.error(`Refusing backup/restore for unsafe database name: ${database || "(empty)"}`);
  process.exit(1);
}

const backupFile = `${database}-${new Date().toISOString().replaceAll(":", "-")}.dump`;
const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

if (mode === "backup") {
  run("pg_dump", ["--format=custom", "--no-owner", "--file", backupFile, databaseUrl]);
  console.log(`Backup written to ${backupFile}`);
} else if (mode === "restore") {
  const file = process.argv[3];
  if (!file || !existsSync(file)) {
    console.error("Usage: npm run db:restore -- <existing-backup.dump>");
    process.exit(1);
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const confirmation = await rl.question(`This will replace data in database '${database}'. Type the database name to confirm: `);
  rl.close();
  if (confirmation !== database) {
    console.error("Restore cancelled; database name did not match.");
    process.exit(1);
  }
  run("pg_restore", ["--clean", "--if-exists", "--no-owner", "--dbname", databaseUrl, file]);
} else {
  console.error("Usage: node scripts/database.mjs <backup|restore> [backup-file]");
  process.exit(1);
}