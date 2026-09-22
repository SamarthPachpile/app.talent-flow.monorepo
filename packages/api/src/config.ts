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

import { getDragonflyConfig } from "@talent-flow/utilities/dragonfly";

function getPortFromUrl(urlStr: string, fallback: number): number {
  try {
    if (urlStr) {
      const parsed = new URL(urlStr);
      if (parsed.port) return Number(parsed.port);
      if (parsed.protocol === "https:") return 443;
      if (parsed.protocol === "http:") return 80;
    }
  } catch {
    // ignore
  }
  return fallback;
}

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
  ADMIN_DOMAIN_URL: string;
  CANDIDATE_DOMAIN_URL: string;
  COMPANY_DOMAIN_URL: string;
  LANDING_DOMAIN_URL: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
};

const dragonflyConfig = getDragonflyConfig();

export const config: ConfigType = {
  environment: nodeEnv,
  isProduction,
  PORT: process.env.PORT ? Number(process.env.PORT) : getPortFromUrl(apiUrl, 5000),
  HOST: process.env.HOST || "0.0.0.0",
  API_URL: apiUrl,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/talentflow",
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || "talentflow",
  MONGO_MAX_POOL_SIZE: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
  MONGO_MIN_POOL_SIZE: Number(process.env.MONGO_MIN_POOL_SIZE) || 5,
  JWT_SECRET: process.env.JWT_SECRET || "talentflow-secret-key-change-in-prod-2026",
  SESSION_SECRET: process.env.SESSION_SECRET || "talentflow-session-secret-2026",
  DRAGONFLY_USERNAME: dragonflyConfig.username || "default",
  DRAGONFLY_HOST: dragonflyConfig.host,
  DRAGONFLY_PORT: dragonflyConfig.port,
  DRAGONFLY_PASSWORD: dragonflyConfig.password || "",
  DRAGONFLY_CACHE_TTL: dragonflyConfig.ttl,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || `${apiUrl}/api/auth/google/callback`,
  ADMIN_DOMAIN_URL:
    process.env.VITE_ADMIN_DOMAIN_URL ||
    process.env.ADMIN_DOMAIN_URL ||
    (isProduction ? "" : "http://localhost:3001"),
  CANDIDATE_DOMAIN_URL:
    process.env.VITE_CANDIDATE_DOMAIN_URL ||
    process.env.CANDIDATE_DOMAIN_URL ||
    (isProduction ? "" : "http://localhost:3003"),
  COMPANY_DOMAIN_URL:
    process.env.VITE_COMPANY_DOMAIN_URL ||
    process.env.COMPANY_DOMAIN_URL ||
    (isProduction ? "" : "http://localhost:3002"),
  LANDING_DOMAIN_URL:
    process.env.VITE_LANDING_DOMAIN_URL ||
    process.env.LANDING_DOMAIN_URL ||
    (isProduction ? "" : "http://localhost:3000"),
  SMTP_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || "",
  SMTP_FROM:
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    "TalentFlow <noreply@talentflow.io>",
};

export { logger };
export default config;
