import type { Request, Response } from "express";
import { createApp } from "../packages/api/src/app";
import { connectToDatabase } from "../packages/api/src/db/connection";
import { getDragonflyClient } from "../packages/utilities/src/dragonfly";
import { initializeDragonflyMongoCronSync } from "../packages/api/src/services/mongoCronSyncInit";

let isInitialized = false;
const app = createApp();

async function bootstrap() {
  if (!isInitialized) {
    try {
      await connectToDatabase();
    } catch (err) {
      console.error("[Vercel API] MongoDB connection error:", err);
    }

    try {
      await getDragonflyClient();
    } catch (err) {
      console.warn("[Vercel API] Dragonfly / Redis init notice:", err);
    }

    try {
      initializeDragonflyMongoCronSync(3000);
    } catch (err) {
      console.error("[Vercel API] Cron Sync initialization error:", err);
    }

    isInitialized = true;
  }
}

export default async function handler(req: Request, res: Response) {
  await bootstrap();
  return app(req, res);
}
