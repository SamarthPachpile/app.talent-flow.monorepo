/**
 * Vite REST API & MongoDB Database Middleware Plugin with Dragonfly DB Datastore
 * Bridges browser client requests directly to MongoDB Atlas and Dragonfly DB during local development.
 */
import type { Plugin, ViteDevServer } from "vite";
import type { ServerResponse } from "http";
import type { Express } from "express";

let expressAppInstance: Express | null = null;
let dbConnected = false;

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Session-Id, x-session-id",
  );
  res.end(JSON.stringify(data));
}

export function viteDragonflyPlugin(): Plugin {
  return {
    name: "vite-plugin-talentflow-api",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";

        if (!url.startsWith("/api")) {
          return next();
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
          res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, Session-Id, x-session-id",
          );
          return res.end();
        }

        try {
          if (!dbConnected) {
            const { connectToDatabase } = await import("../db/connection");
            connectToDatabase()
              .then(() => {
                dbConnected = true;
              })
              .catch((err) => {
                console.warn("[Vite API Plugin] MongoDB connection warning:", err.message);
              });
          }

          if (!expressAppInstance) {
            const { createApp } = await import("../app");
            expressAppInstance = createApp();
          }

          if (expressAppInstance) {
            expressAppInstance(
              req as unknown as Parameters<Express>[0],
              res as unknown as Parameters<Express>[1],
              next,
            );
          } else {
            next();
          }
        } catch (err) {
          console.warn("[Vite API Plugin] Error handling request:", err);
          sendJson(res, 500, { error: (err as Error).message });
        }
      });
    },
  };
}

export const viteApiPlugin = viteDragonflyPlugin;
export const viteRedisPlugin = viteDragonflyPlugin;
export default viteDragonflyPlugin;
