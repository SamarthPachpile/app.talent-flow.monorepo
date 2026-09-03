/**
 * Dragonfly DB Client Provider (Node / Server Environment)
 * High-performance Dragonfly DB connection pool using standard RESP2/RESP3 protocol.
 * Dragonfly DB (https://github.com/dragonflydb/dragonfly) is a drop-in multi-threaded
 * in-memory datastore replacing traditional Redis.
 */
import { getDragonflyConfig } from "./config";
import type { Redis as RedisInstance } from "ioredis";

let dragonflyInstance: RedisInstance | null = null;
let isNodeEnvironment = false;
let connectionAttempted = false;

try {
  isNodeEnvironment =
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null &&
    typeof window === "undefined";
} catch {
  isNodeEnvironment = false;
}

export function isNodeRuntime(): boolean {
  return isNodeEnvironment;
}

let lastConnectAttempt = 0;
const CONNECT_COOLDOWN_MS = 60000; // Only attempt re-establishing connection every 60s if offline

export async function getDragonflyClient(): Promise<RedisInstance | null> {
  if (!isNodeEnvironment) {
    return null;
  }

  if (dragonflyInstance) {
    return dragonflyInstance;
  }

  const now = Date.now();
  if (lastConnectAttempt > 0 && now - lastConnectAttempt < CONNECT_COOLDOWN_MS) {
    // In cooldown period; use fast in-memory L1 fallback
    return null;
  }

  lastConnectAttempt = now;

  try {
    const config = getDragonflyConfig();
    if (!config.isConfigured || !config.host) {
      return null;
    }

    // Dynamically import ioredis in Node environments without Vite bundling issues in browser builds
    const ioredisModule = await (new Function('return import("ioredis")')() as Promise<
      typeof import("ioredis")
    >);
    const Redis =
      ioredisModule.default || (ioredisModule as unknown as typeof import("ioredis").default);

    const client = new Redis({
      host: config.host,
      port: config.port,
      username: config.username || undefined,
      password: config.password || undefined,
      family: 4, // Explicit IPv4
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
      retryStrategy() {
        // Return null to disable infinite background reconnection attempts
        return null;
      },
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    client.on("connect", () => {
      console.log(`[Dragonfly DB] Connected to ${config.host}:${config.port}`);
    });

    client.on("ready", () => {
      console.log(`[Dragonfly DB] Datastore ready and active (Multi-threaded in-memory engine)`);
    });

    client.on("error", (err: Error) => {
      if (!connectionAttempted) {
        console.info(
          `[Dragonfly DB] Server info: ${err.message}. (Fast L1 in-memory datastore active)`,
        );
        connectionAttempted = true;
      }
    });

    client.on("close", () => {
      dragonflyInstance = null;
    });

    try {
      await client.connect();
      dragonflyInstance = client;
      return dragonflyInstance;
    } catch (err: unknown) {
      try {
        client.disconnect();
      } catch {
        // Suppress disconnection errors on offline client
      }
      if (!connectionAttempted) {
        console.info(
          `[Dragonfly DB] Offline (${config.host}:${config.port}). Using built-in high-performance L1 memory datastore.`,
        );
        connectionAttempted = true;
      }
      return null;
    }
  } catch (err) {
    if (!connectionAttempted) {
      console.info(`[Dragonfly DB] Using in-memory fallback cache.`);
      connectionAttempted = true;
    }
    return null;
  }
}

export async function closeDragonflyClient(): Promise<void> {
  if (dragonflyInstance) {
    try {
      await dragonflyInstance.quit();
    } catch {
      dragonflyInstance.disconnect();
    }
    dragonflyInstance = null;
  }
}

// Aliases for backward compatibility
export const getRedisClient = getDragonflyClient;
export const closeRedisClient = closeDragonflyClient;
export default getDragonflyClient;
