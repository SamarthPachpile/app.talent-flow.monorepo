export interface DragonflyConfig {
  host: string;
  port: number;
  password?: string;
  username?: string;
  isConfigured: boolean;
  ttl: number;
  engine: string;
}

export function getDragonflyConfig(): DragonflyConfig {
  const host =
    process.env.DRAGONFLY_HOST ||
    process.env.DRAGONFLY_URL ||
    process.env.REDIS_HOST ||
    "127.0.0.1";

  const port = Number(process.env.DRAGONFLY_PORT || process.env.REDIS_PORT || 6379);

  const password = process.env.DRAGONFLY_PASSWORD || process.env.REDIS_PASSWORD || "";

  const username = process.env.DRAGONFLY_USERNAME || process.env.REDIS_USERNAME || "default";

  const ttl = Number(process.env.DRAGONFLY_CACHE_TTL || process.env.REDIS_CACHE_TTL || 3600);

  const isConfigured = Boolean(host);

  return {
    host,
    port,
    password,
    username,
    isConfigured,
    ttl,
    engine: "Dragonfly DB",
  };
}

export const getRedisConfig = getDragonflyConfig;
export default getDragonflyConfig;
