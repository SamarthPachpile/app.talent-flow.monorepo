import type { EcosystemHealth } from "@talent-flow/schema-types";
import { getDbStatus } from "../db/connection";
import { getDragonflyConfig } from "@talent-flow/utilities/dragonfly";

export class GravitonService {
  static getEcosystemHealth(): EcosystemHealth {
    const db = getDbStatus();
    const df = getDragonflyConfig();

    return {
      status: db.connected ? "operational" : "degraded",
      version: "v2.0.0-modular",
      services: {
        database: db.connected ? "Connected (MongoDB Atlas)" : "Disconnected",
        cache: df.isConfigured ? "Connected (Dragonfly DB Datastore)" : "Degraded",
        auth: "Active (Passport.js Multi-Tenant Auth Engine)",
      },
      timestamp: new Date().toISOString(),
    };
  }
}
