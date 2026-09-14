import type { MongoDbConfig } from "@talent-flow/schema-types";
import config from "./config";

export const defaultMongoConfig: MongoDbConfig = {
  uri: config.MONGODB_URI,
  database: config.MONGODB_DATABASE,
  user: "",
};

export async function initializeDatabase() {
  return true;
}
