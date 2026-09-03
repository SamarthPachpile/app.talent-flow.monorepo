import { createApp } from "./app";
import config, { logger } from "./config";
import { connectToDatabase } from "./db/connection";
import { getDragonflyClient } from "@talent-flow/utilities/dragonfly";

export async function startServer() {
  try {
    const { PORT, HOST, environment } = config;

    logger.info("Initializing TalentFlow Core API Server...");

    // Connect to MongoDB Database
    logger.info("Connecting to MongoDB Atlas Database...");
    await connectToDatabase();
    logger.info("MongoDB Atlas connected successfully.");

    // Connect to Dragonfly / Redis Cache
    logger.info("Connecting to Dragonfly In-Memory Datastore...");
    await getDragonflyClient().catch((err) => {
      logger.warn(`Dragonfly initialization notice: ${err?.message || err}`);
    });

    const app = createApp();

    const server = app.listen(PORT, HOST, () => {
      logger.info(
        `TalentFlow Unified API Server listening at http://${HOST}:${PORT} [${environment} mode]`,
      );
      logger.info(`Health check available at http://${HOST}:${PORT}/api/health`);
    });

    return server;
  } catch (err) {
    logger.error("Failed to start TalentFlow API Server:", err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default startServer;
