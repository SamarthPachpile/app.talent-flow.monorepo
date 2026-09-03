import dotenv from "dotenv";
import path from "path";
import { logger } from "@talent-flow/utilities";

if (typeof process !== "undefined" && process.env) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
  dotenv.config({ path: path.resolve(process.cwd(), "../../../.env") });
}

export type ConfigType = {
  environment: string;
  PORT: number;
  HOST: string;
  MONGODB_URI: string;
  MONGODB_DATABASE: string;
  MONGO_MAX_POOL_SIZE: number;
  MONGO_MIN_POOL_SIZE: number;
  JWT_SECRET: string;
  SESSION_SECRET: string;
  DRAGONFLY_USERNAME: string;
  DRAGONFLY_HOST: string;
  DRAGONFLY_PORT: number;
  DRAGONFLY_PASSWORD: string;
  DRAGONFLY_CACHE_TTL: number;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  CLIENT_DOMAIN_URL: string;
  ADMIN_DOMAIN_URL: string;
};

const dragonflyHost = process.env.DRAGONFLY_HOST || process.env.REDIS_HOST || "127.0.0.1";
const dragonflyPort = Number(process.env.DRAGONFLY_PORT || process.env.REDIS_PORT) || 6379;
const dragonflyPassword = process.env.DRAGONFLY_PASSWORD || process.env.REDIS_PASSWORD || "";
const dragonflyUsername = process.env.DRAGONFLY_USERNAME || process.env.REDIS_USERNAME || "default";
const dragonflyCacheTtl =
  Number(process.env.DRAGONFLY_CACHE_TTL || process.env.REDIS_CACHE_TTL) || 3600;

export const config: ConfigType = {
  environment: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || process.env.VITE_PORT_API || process.env.VITE_API_PORT || 5000),
  HOST: process.env.HOST || "0.0.0.0",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/talentflow",
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || "talentflow",
  MONGO_MAX_POOL_SIZE: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
  MONGO_MIN_POOL_SIZE: Number(process.env.MONGO_MIN_POOL_SIZE) || 5,
  JWT_SECRET: process.env.JWT_SECRET || "talentflow_super_secret_jwt_key_2026_production",
  SESSION_SECRET: process.env.SESSION_SECRET || "talentflow_session_secret_2026_secure",
  DRAGONFLY_USERNAME: dragonflyUsername,
  DRAGONFLY_HOST: dragonflyHost,
  DRAGONFLY_PORT: dragonflyPort,
  DRAGONFLY_PASSWORD: dragonflyPassword,
  DRAGONFLY_CACHE_TTL: dragonflyCacheTtl,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
  CLIENT_DOMAIN_URL: process.env.CLIENT_DOMAIN_URL || "http://localhost:3000",
  ADMIN_DOMAIN_URL: process.env.ADMIN_DOMAIN_URL || "http://localhost:3001",
};

export { logger };
export default config;
