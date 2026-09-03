import type { BackendStatus, MongoDbConfig } from "@talent-flow/schema-types";
import { getDbStatus } from "./db/connection";

export const defaultMongoConfig: MongoDbConfig = {
  uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/talentflow",
  database: process.env.MONGODB_DATABASE || "talentflow",
  user: process.env.MONGODB_USER || "",
  host: process.env.MONGODB_HOST || "127.0.0.1",
  port: Number(process.env.MONGODB_PORT) || 27017,
};

export async function initializeDatabase() {
  return true;
}

export function getBackendStatus(): BackendStatus {
  const db = getDbStatus();
  return {
    initialized: true,
    connected: db.connected,
    engine: "MongoDB Atlas + Dragonfly DB",
    database: db.database,
    authStatus: "ready",
    dbStatus: db.connected ? "active" : "disconnected",
    lastPing: new Date().toISOString(),
  };
}

export function getAdminBackendStatus(): BackendStatus {
  return getBackendStatus();
}

export function getCompanyBackendStatus(): BackendStatus {
  return getBackendStatus();
}

export function getCandidateBackendStatus(): BackendStatus {
  return getBackendStatus();
}

export {
  uploadFileToStorage,
  uploadCompanyFileToStorage,
  uploadCandidateFileToStorage,
  uploadAdminFileToStorage,
} from "./client/storage";
