import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import config, { logger } from "./config";
import { configurePassport } from "@talent-flow/utilities/auth";
import { apiRouter } from "./routes";
import { getDbStatus } from "./db/connection";
import { getDragonflyConfig } from "@talent-flow/utilities/dragonfly";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { httpStatusCodes } from "@talent-flow/schema-types";
import { successResponse, errorResponse } from "@talent-flow/utilities";

export function createApp(): Express {
  const app = express();

  app.use(loggerMiddleware);

  app.use(
    cors({
      origin: [
        config.CLIENT_DOMAIN_URL,
        config.ADMIN_DOMAIN_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "*",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Session-Id", "x-session-id"],
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  const passport = configurePassport();
  app.use(passport.initialize());

  app.get("/api/health", (_req: Request, res: Response) => {
    const dbStatus = getDbStatus();
    const dragonflyConfig = getDragonflyConfig();

    return successResponse(
      res,
      httpStatusCodes.SUCCESS,
      "TalentFlow API Server is healthy and operational",
      {
        service: "TalentFlow Core API",
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: config.environment,
        database: {
          engine: "MongoDB Atlas",
          connected: dbStatus.connected,
          readyState: dbStatus.readyState,
          name: dbStatus.database,
          host: dbStatus.host,
        },
        cache: {
          engine: "Dragonfly DB",
          configured: dragonflyConfig.isConfigured,
          host: dragonflyConfig.host,
          port: dragonflyConfig.port,
        },
        auth: {
          engine: "Passport.js + JWT",
          googleAuthEnabled: Boolean(config.GOOGLE_CLIENT_ID),
        },
      },
    );
  });

  app.use("/api", apiRouter);

  app.use((_req: Request, res: Response) => {
    return errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "API endpoint not found");
  });

  app.use(
    (
      err: Error & { status?: number; statusCode?: number },
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      logger.error("[TalentFlow API Error Handler]:", err);
      const statusCode = err.statusCode || err.status || httpStatusCodes.INTERNAL_SERVER_ERROR;
      return errorResponse(res, statusCode, err.message || "Internal server error");
    },
  );

  return app;
}

export default createApp;
