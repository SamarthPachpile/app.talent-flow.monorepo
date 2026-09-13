export interface DragonflyConfig {
  host: string;
  port: number;
  password?: string;
  username?: string;
  url?: string;
  tls?: boolean;
  isConfigured: boolean;
  ttl: number;
  engine: string;
}

export function getDragonflyConfig(): DragonflyConfig {
  const url = process.env.DRAGONFLY_URL || process.env.REDIS_URL;

  let host = process.env.DRAGONFLY_HOST || process.env.REDIS_HOST || "127.0.0.1";

  let port = Number(process.env.DRAGONFLY_PORT || process.env.REDIS_PORT || 6379);
  let password = process.env.DRAGONFLY_PASSWORD || process.env.REDIS_PASSWORD || "";
  let username = process.env.DRAGONFLY_USERNAME || process.env.REDIS_USERNAME || "default";
  let tls = process.env.DRAGONFLY_TLS === "true" || process.env.REDIS_TLS === "true";

  if (url) {
    try {
      const parsed = new URL(url);
      host = parsed.hostname;
      port = parsed.port ? Number(parsed.port) : parsed.protocol === "rediss:" ? 6380 : 6379;
      if (parsed.password) password = decodeURIComponent(parsed.password);
      if (parsed.username) username = decodeURIComponent(parsed.username);
      if (
        parsed.protocol === "rediss:" ||
        host.includes("dragonflydb.cloud") ||
        host.includes("upstash.io")
      ) {
        tls = true;
      }
    } catch {
      // url was not a standard URI, keep original host
    }
  } else if (host.includes("dragonflydb.cloud") || host.includes("upstash.io")) {
    tls = true;
  }

  const ttl = Number(process.env.DRAGONFLY_CACHE_TTL || process.env.REDIS_CACHE_TTL || 3600);
  const isConfigured = Boolean(host || url);

  return {
    host,
    port,
    password,
    username,
    url,
    tls,
    isConfigured,
    ttl,
    engine: "Dragonfly DB",
  };
}

export const getRedisConfig = getDragonflyConfig;
export default getDragonflyConfig;
