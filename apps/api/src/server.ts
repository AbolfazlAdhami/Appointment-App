import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  await connectDatabase(env.mongodbUri);

  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
