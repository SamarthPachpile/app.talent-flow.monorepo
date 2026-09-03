import { getDragonflyClient } from "./dragonflyClient";
import { logger } from "../logger";

const memoryL1 = new Map<string, { val: string; exp: number }>();

/**
 * Delete specific cache keys from Dragonfly DB
 */
export async function deleteCacheWithKeys(cacheKeys: string[]): Promise<void> {
  if (!Array.isArray(cacheKeys) || cacheKeys.length === 0) {
    logger.warn("[DragonflyOperations] No cache keys provided for deletion.");
    return;
  }

  cacheKeys.forEach((k) => memoryL1.delete(k));

  try {
    const client = await getDragonflyClient();
    if (!client) return;

    for (const key of cacheKeys) {
      await client.del(key);
    }
  } catch (error) {
    logger.error(`[DragonflyOperations] Error deleting cache entries: ${error}`);
  }
}

/**
 * Set cache value with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = 3600,
): Promise<boolean> {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  memoryL1.set(key, { val: serialized, exp: Date.now() + ttlSeconds * 1000 });

  try {
    const client = await getDragonflyClient();
    if (!client) return true;

    await client.set(key, serialized, "EX", ttlSeconds);
    return true;
  } catch (error) {
    logger.error(`[DragonflyOperations] Error setting cache for ${key}: ${error}`);
    return true;
  }
}

/**
 * Get cache value
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const mem = memoryL1.get(key);
  if (mem && mem.exp > Date.now()) {
    try {
      return JSON.parse(mem.val) as T;
    } catch {
      return mem.val as unknown as T;
    }
  }

  try {
    const client = await getDragonflyClient();
    if (!client) return null;

    const data = await client.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  } catch (error) {
    return null;
  }
}

/**
 * Delete cache key
 */
export async function deleteCache(key: string): Promise<boolean> {
  memoryL1.delete(key);
  try {
    const client = await getDragonflyClient();
    if (!client) return true;

    const res = await client.del(key);
    return res > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Set user session key in Dragonfly DB
 */
export async function setUserSession(
  role: "candidate" | "company" | "admin" | "user",
  userId: string,
  sessionId: string,
  ttlSeconds: number = 6 * 3600,
): Promise<boolean> {
  const key = `session:${role}:${userId}`;
  return setCache(key, sessionId, ttlSeconds);
}

/**
 * Get user active session ID from Dragonfly DB
 */
export async function getUserSession(
  role: "candidate" | "company" | "admin" | "user",
  userId: string,
): Promise<string | null> {
  const key = `session:${role}:${userId}`;
  return getCache<string>(key);
}

/**
 * Invalidate user active session in Dragonfly DB
 */
export async function deleteUserSession(
  role: "candidate" | "company" | "admin" | "user",
  userId: string,
): Promise<boolean> {
  const key = `session:${role}:${userId}`;
  return deleteCache(key);
}
