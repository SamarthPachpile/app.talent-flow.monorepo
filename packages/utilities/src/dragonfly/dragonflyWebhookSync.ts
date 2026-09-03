/**
 * Dragonfly DB Webhook & Simultaneous Database Synchronization Engine
 * Listens for new/updated data written to Dragonfly DB and simultaneously synchronizes it to the MongoDB Atlas Database.
 */

import { getDragonflyClient, isNodeRuntime } from "./dragonflyClient";

export type DragonflyEventType =
  | "COMPANY_UPSERT"
  | "COMPANY_DELETE"
  | "JOB_UPSERT"
  | "JOB_DELETE"
  | "CANDIDATE_UPSERT"
  | "SETTINGS_UPDATE"
  | "DATA_SYNC_GENERIC";

export interface DragonflyWriteEvent<T = unknown> {
  eventId: string;
  eventType: DragonflyEventType;
  key: string;
  payload: T;
  timestamp: string;
  syncedToDb?: boolean;
}

export type DbSyncHandler<T = unknown> = (event: DragonflyWriteEvent<T>) => Promise<void>;

// In-memory registered database sync handlers
const registeredSyncHandlers = new Map<DragonflyEventType, DbSyncHandler[]>();

// Activity and sync queue audit log
const syncAuditLog: Array<{
  eventId: string;
  eventType: DragonflyEventType;
  key: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  timestamp: string;
  error?: string;
}> = [];

export class DragonflyWebhookSyncService {
  private static readonly CHANNEL = "tf:dragonfly:events:data_written";

  /**
   * Register a database synchronization handler for a specific data event
   */
  static registerDbSyncHandler<T = unknown>(
    eventType: DragonflyEventType,
    handler: DbSyncHandler<T>,
  ): () => void {
    const handlers = registeredSyncHandlers.get(eventType) || [];
    handlers.push(handler as DbSyncHandler);
    registeredSyncHandlers.set(eventType, handlers);

    return () => {
      const current = registeredSyncHandlers.get(eventType) || [];
      registeredSyncHandlers.set(
        eventType,
        current.filter((h) => h !== handler),
      );
    };
  }

  /**
   * Publish a Dragonfly write event to webhook subscribers and execute simultaneous DB sync
   */
  static async notifyDataWritten<T = unknown>(
    eventType: DragonflyEventType,
    key: string,
    payload: T,
    directSyncFn?: () => Promise<unknown>,
  ): Promise<DragonflyWriteEvent<T>> {
    const eventId = `df_evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const event: DragonflyWriteEvent<T> = {
      eventId,
      eventType,
      key,
      payload,
      timestamp: new Date().toISOString(),
    };

    // 1. Publish event to Dragonfly DB pub/sub channel if in Node environment
    if (isNodeRuntime()) {
      try {
        const client = await getDragonflyClient();
        if (client) {
          await client.publish(this.CHANNEL, JSON.stringify(event));
        }
      } catch (err) {
        // Pub/sub failure is non-fatal
      }
    }

    // 2. Dispatch simultaneously to registered database sync handlers
    const handlers = registeredSyncHandlers.get(eventType) || [];
    const syncPromises: Promise<unknown>[] = handlers.map((handler) =>
      handler(event).catch((err) => {
        console.error(`[Dragonfly Sync] Handler error for ${eventType} (${key}):`, err);
      }),
    );

    // 3. Execute direct DB sync function simultaneously (background write-behind)
    if (directSyncFn) {
      syncPromises.push(
        directSyncFn().catch((err) => {
          console.error(`[Dragonfly Sync] Direct DB sync failed for key ${key}:`, err);
          throw err;
        }),
      );
    }

    // Process all sync tasks in the background
    Promise.allSettled(syncPromises).then((results) => {
      const hasErrors = results.some((r) => r.status === "rejected");
      syncAuditLog.unshift({
        eventId,
        eventType,
        key,
        status: hasErrors ? "FAILED" : "SUCCESS",
        timestamp: new Date().toISOString(),
      });
      if (syncAuditLog.length > 100) {
        syncAuditLog.pop();
      }
    });

    return event;
  }

  /**
   * Retrieve recent webhook synchronization audit records
   */
  static getSyncAuditLogs() {
    return [...syncAuditLog];
  }
}

// Backward compatibility exports
export type RedisEventType = DragonflyEventType;
export type RedisWriteEvent<T = unknown> = DragonflyWriteEvent<T>;
export const RedisWebhookSyncService = DragonflyWebhookSyncService;
export default DragonflyWebhookSyncService;
