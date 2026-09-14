import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { logger } from "@talent-flow/utilities";

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production" || Boolean(process.env.VERCEL);

// Load env files strictly in priority order:
// 1. .env.[mode].local / .env.local
// 2. .env.production (if production) or .env.development (if development)
const searchDirs = [
  process.cwd(),
  path.resolve(process.cwd(), ".."),
  path.resolve(process.cwd(), "../.."),
  path.resolve(process.cwd(), "../../.."),
];

const envFileNames = [
  `.env.${nodeEnv}.local`,
  ".env.local",
  isProduction ? ".env.production" : ".env.development",
];

for (const dir of searchDirs) {
  for (const envFileName of envFileNames) {
    const fullPath = path.resolve(dir, envFileName);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath, override: false });
    }
  }
}

const defaultApiUrl = isProduction ? "" : "http://localhost:5000";
const apiUrl = (process.env.VITE_API_URL || process.env.API_URL || defaultApiUrl).replace(
  /\/+$/,
  "",
);

export type ConfigType = {
  environment: string;
  isProduction: boolean;
  PORT: number;
  HOST: string;
  API_URL: string;
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
  CANDIDATE_DOMAIN_URL: string;
  COMPANY_DOMAIN_URL: string;
  LANDING_DOMAIN_URL: string;
  GRAVITON_DOMAIN_URL: string;
};

const dragonflyHost = process.env.DRAGONFLY_HOST || process.env.REDIS_HOST || "127.0.0.1";
const dragonflyPort = Number(process.env.DRAGONFLY_PORT || process.env.REDIS_PORT) || 6379;
const dragonflyPassword = process.env.DRAGONFLY_PASSWORD || process.env.REDIS_PASSWORD || "";
const dragonflyUsername = process.env.DRAGONFLY_USERNAME || process.env.REDIS_USERNAME || "default";
const dragonflyCacheTtl =
  Number(process.env.DRAGONFLY_CACHE_TTL || process.env.REDIS_CACHE_TTL) || 3600;

export const config: ConfigType = {
  environment: nodeEnv,
  isProduction,
  PORT: Number(process.env.PORT || process.env.VITE_PORT_API || process.env.VITE_API_PORT || 5000),
  HOST: process.env.HOST || "0.0.0.0",
  API_URL: apiUrl,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/talentflow",
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || "talentflow",
  MONGO_MAX_POOL_SIZE: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
  MONGO_MIN_POOL_SIZE: Number(process.env.MONGO_MIN_POOL_SIZE) || 5,
  JWT_SECRET: process.env.JWT_SECRET || "",
  SESSION_SECRET: process.env.SESSION_SECRET || "",
  DRAGONFLY_USERNAME: dragonflyUsername,
  DRAGONFLY_HOST: dragonflyHost,
  DRAGONFLY_PORT: dragonflyPort,
  DRAGONFLY_PASSWORD: dragonflyPassword,
  DRAGONFLY_CACHE_TTL: dragonflyCacheTtl,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || `${apiUrl}/api/auth/google/callback`,
  CLIENT_DOMAIN_URL: process.env.CLIENT_DOMAIN_URL || (isProduction ? "" : "http://localhost:3000"),
  ADMIN_DOMAIN_URL: process.env.ADMIN_DOMAIN_URL || (isProduction ? "" : "http://localhost:3001"),
  CANDIDATE_DOMAIN_URL:
    process.env.CANDIDATE_DOMAIN_URL || (isProduction ? "" : "http://localhost:3003"),
  COMPANY_DOMAIN_URL:
    process.env.COMPANY_DOMAIN_URL || (isProduction ? "" : "http://localhost:3002"),
  LANDING_DOMAIN_URL:
    process.env.LANDING_DOMAIN_URL || (isProduction ? "" : "http://localhost:3000"),
  GRAVITON_DOMAIN_URL:
    process.env.GRAVITON_DOMAIN_URL || (isProduction ? "" : "http://localhost:3000"),
};

export { logger };
export default config;
