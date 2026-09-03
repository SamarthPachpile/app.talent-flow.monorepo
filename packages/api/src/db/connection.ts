import mongoose from "mongoose";
import config, { logger } from "../config";

export interface MongoDbStatus {
  connected: boolean;
  readyState: number;
  host: string;
  database: string;
  lastPing: string;
  error?: string;
}

let isConnecting = false;

export async function connectToDatabase(customUri?: string): Promise<typeof mongoose> {
  const uri = customUri || config.MONGODB_URI;

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (isConnecting) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once("open", () => resolve(mongoose));
      mongoose.connection.once("error", reject);
    });
  }

  try {
    isConnecting = true;
    logger.info("[MongoDB] Connecting to MongoDB Atlas cluster...");

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: config.MONGO_MAX_POOL_SIZE || 20,
      minPoolSize: config.MONGO_MIN_POOL_SIZE || 5,
      autoIndex: true,
    });

    logger.info(
      "[MongoDB] Successfully connected to MongoDB database " +
        (mongoose.connection.name || "") +
        " on " +
        (mongoose.connection.host || ""),
    );

    mongoose.connection.on("error", (err) => {
      logger.error("[MongoDB] Connection error:", { error: String(err) });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("[MongoDB] Disconnected from database. Attempting automatic reconnection...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("[MongoDB] Reconnected to database.");
    });

    isConnecting = false;
    return conn;
  } catch (error: unknown) {
    isConnecting = false;
    const err = error as Error & { name?: string };
    if (err.name === "MongooseServerSelectionError") {
      logger.error(
        "[MongoDB] Failed to connect to MongoDB Atlas cluster. " +
          "Your current IP may not be whitelisted in MongoDB Atlas Network Access.\n" +
          "To allow access: Go to MongoDB Atlas Console -> Security -> Network Access -> Add IP Address (whitelist your current IP or 0.0.0.0/0 for development).\n" +
          "Underlying error: " +
          err.message,
      );
    } else {
      logger.error("[MongoDB] Database connection error:", { error: String(error) });
    }
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("[MongoDB] Disconnected from MongoDB.");
  }
}

export function getDbStatus(): MongoDbStatus {
  const state = mongoose.connection.readyState;
  return {
    connected: state === 1,
    readyState: state,
    host: mongoose.connection.host || "Atlas Cluster",
    database: mongoose.connection.name || config.MONGODB_DATABASE || "talentflow",
    lastPing: new Date().toISOString(),
  };
}

export default mongoose;
