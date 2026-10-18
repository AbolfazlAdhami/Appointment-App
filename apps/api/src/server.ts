import app from "./app";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
