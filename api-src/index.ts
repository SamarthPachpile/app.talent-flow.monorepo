import type { Request, Response } from "express";
import { createApp } from "../packages/api/src/app";
import { connectToDatabase } from "../packages/api/src/db/connection";
import { getDragonflyClient } from "../packages/utilities/src/dragonfly";
import { initializeDragonflyMongoCronSync } from "../packages/api/src/services/mongoCronSyncInit";

let isInitialized = false;
const app = createApp();

async function bootstrap() {
  if (!isInitialized) {
    isInitialized = true;
    if (process.env.MONGODB_URI) {
      connectToDatabase().catch((err) => {
        console.warn("[Vercel API] MongoDB initial connection notice:", err?.message || err);
      });
    }

    if (process.env.DRAGONFLY_HOST || process.env.REDIS_HOST) {
      getDragonflyClient().catch((err) => {
        console.warn(
          "[Vercel API] Dragonfly / Redis initial connection notice:",
          err?.message || err,
        );
      });
    }

    try {
      initializeDragonflyMongoCronSync(3000);
    } catch (err) {
      console.warn("[Vercel API] Cron Sync initialization notice:", err);
    }
  }
}

export default async function handler(req: Request, res: Response) {
  await bootstrap();
  return app(req, res);
}
