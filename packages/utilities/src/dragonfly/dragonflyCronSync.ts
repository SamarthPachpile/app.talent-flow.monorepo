/**
 * Dragonfly DB Write-Behind Cron Synchronization Engine
 * All writes/mutations are stored immediately in Dragonfly DB first,
 * and queued for an automated background Cron job to synchronize them to MongoDB Atlas.
 */

import { getDragonflyClient, isNodeRuntime } from "./dragonflyClient";
import { logger } from "../logger";

export type MutationAction = "UPSERT" | "DELETE";
export type MutationEntity =
  "candidate" | "company" | "job" | "settings" | "user" | "lead" | "custom";

export interface DragonflyMutationTask<T = unknown> {
  taskId: string;
  entity: MutationEntity;
  action: MutationAction;
  key: string;
  targetId?: string;
  payload?: T;
  timestamp: string;
  retryCount?: number;
}

export type EntitySyncProcessor<T = unknown> = (task: DragonflyMutationTask<T>) => Promise<void>;

export interface SyncCronStats {
  running: boolean;
  intervalMs: number;
  totalSynced: number;
  totalErrors: number;
  pendingInQueue: number;
  lastRunTimestamp: string | null;
  lastRunDurationMs: number;
  recentAuditLogs: Array<{
    taskId: string;
    entity: string;
    action: string;
    status: "SUCCESS" | "FAILED";
    timestamp: string;
    error?: string;
  }>;
}

const QUEUE_KEY = "tf:df:write_queue:pending";
const IN_PROGRESS_KEY = "tf:df:write_queue:processing";
const RETRY_KEY = "tf:df:write_queue:retry";

// In-memory fallback queue for offline or browser environments
const memoryQueue: DragonflyMutationTask[] = [];

// Registry of entity-specific MongoDB write handlers
const entityProcessors = new Map<MutationEntity, EntitySyncProcessor>();

// Cron state and statistics tracking
let cronTimer: NodeJS.Timeout | null = null;
let isProcessingBatch = false;

const syncStats: SyncCronStats = {
  running: false,
  intervalMs: 3000,
  totalSynced: 0,
  totalErrors: 0,
  pendingInQueue: 0,
  lastRunTimestamp: null,
  lastRunDurationMs: 0,
  recentAuditLogs: [],
};

export class DragonflyCronSyncService {
  /**
   * Register a MongoDB write/delete handler for an entity type
   */
  static registerEntityProcessor<T = unknown>(
    entity: MutationEntity,
    processor: EntitySyncProcessor<T>,
  ): void {
    entityProcessors.set(entity, processor as EntitySyncProcessor);
    logger.info(`[Dragonfly Cron] Registered MongoDB sync processor for entity: ${entity}`);
  }

  /**
   * Enqueue a mutation task directly into Dragonfly DB write-behind queue
   */
  static async enqueueMutation<T = unknown>(
    entity: MutationEntity,
    action: MutationAction,
    key: string,
    payload?: T,
    targetId?: string,
  ): Promise<DragonflyMutationTask<T>> {
    const taskId = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const task: DragonflyMutationTask<T> = {
      taskId,
      entity,
      action,
      key,
      targetId: targetId || (payload as any)?.id || (payload as any)?.subdomain || key,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    const taskJson = JSON.stringify(task);

    // 1. Push to Dragonfly DB queue if in server environment
    if (isNodeRuntime()) {
      try {
        const client = await getDragonflyClient();
        if (client) {
          await client.rpush(QUEUE_KEY, taskJson);
          return task;
        }
      } catch (err) {
        logger.warn(
          `[Dragonfly Cron] Failed to enqueue task to Dragonfly DB, falling back to memory:`,
          err,
        );
      }
    }

    // 2. Fallback to in-memory queue
    memoryQueue.push(task as DragonflyMutationTask);
    return task;
  }

  /**
   * Process a batch of pending mutations from the Dragonfly DB queue and write to MongoDB Atlas
   */
  static async processSyncBatch(batchSize = 50): Promise<{ processed: number; errors: number }> {
    if (isProcessingBatch) {
      return { processed: 0, errors: 0 };
    }

    isProcessingBatch = true;
    const startTime = Date.now();
    let processedCount = 0;
    let errorCount = 0;

    try {
      const tasksToProcess: DragonflyMutationTask[] = [];

      // 1. Drain tasks from Dragonfly DB queue
      if (isNodeRuntime()) {
        try {
          const client = await getDragonflyClient();
          if (client) {
            for (let i = 0; i < batchSize; i++) {
              const raw = await client.lpop(QUEUE_KEY);
              if (!raw) break;
              try {
                tasksToProcess.push(JSON.parse(raw));
              } catch {
                // invalid JSON, ignore
              }
            }
          }
        } catch (err) {
          logger.warn(`[Dragonfly Cron] Error popping tasks from Dragonfly DB queue:`, err);
        }
      }

      // 2. Also take from memory queue
      while (memoryQueue.length > 0 && tasksToProcess.length < batchSize) {
        const memTask = memoryQueue.shift();
        if (memTask) tasksToProcess.push(memTask);
      }

      // 3. Process each task with its registered MongoDB processor
      for (const task of tasksToProcess) {
        const processor = entityProcessors.get(task.entity);
        if (!processor) {
          logger.warn(
            `[Dragonfly Cron] No MongoDB processor registered for entity '${task.entity}'`,
          );
          continue;
        }

        try {
          await processor(task);
          processedCount++;
          syncStats.totalSynced++;

          // Record audit log
          DragonflyCronSyncService.recordAuditLog({
            taskId: task.taskId,
            entity: task.entity,
            action: task.action,
            status: "SUCCESS",
            timestamp: new Date().toISOString(),
          });
        } catch (err: unknown) {
          errorCount++;
          syncStats.totalErrors++;
          const errorMsg = (err as Error)?.message || String(err);

          logger.error(
            `[Dragonfly Cron] Error executing MongoDB write for task ${task.taskId} (${task.entity}:${task.action}):`,
            err,
          );

          DragonflyCronSyncService.recordAuditLog({
            taskId: task.taskId,
            entity: task.entity,
            action: task.action,
            status: "FAILED",
            timestamp: new Date().toISOString(),
            error: errorMsg,
          });

          // Re-queue for retry if under 3 attempts
          if ((task.retryCount || 0) < 3) {
            task.retryCount = (task.retryCount || 0) + 1;
            DragonflyCronSyncService.requeueFailedTask(task).catch(() => {});
          }
        }
      }
    } finally {
      syncStats.lastRunTimestamp = new Date().toISOString();
      syncStats.lastRunDurationMs = Date.now() - startTime;
      isProcessingBatch = false;
    }

    return { processed: processedCount, errors: errorCount };
  }

  /**
   * Re-queue a failed task with incremented retry count
   */
  private static async requeueFailedTask(task: DragonflyMutationTask): Promise<void> {
    if (isNodeRuntime()) {
      try {
        const client = await getDragonflyClient();
        if (client) {
          await client.rpush(QUEUE_KEY, JSON.stringify(task));
          return;
        }
      } catch {
        // ignore
      }
    }
    memoryQueue.push(task);
  }

  /**
   * Record audit entry (keeps latest 50)
   */
  private static recordAuditLog(entry: {
    taskId: string;
    entity: string;
    action: string;
    status: "SUCCESS" | "FAILED";
    timestamp: string;
    error?: string;
  }): void {
    syncStats.recentAuditLogs.unshift(entry);
    if (syncStats.recentAuditLogs.length > 50) {
      syncStats.recentAuditLogs.pop();
    }
  }

  /**
   * Start the automated background Cron Sync Job
   */
  static startCronSync(intervalMs = 3000): void {
    if (cronTimer) {
      clearInterval(cronTimer);
    }

    syncStats.intervalMs = intervalMs;
    syncStats.running = true;

    cronTimer = setInterval(async () => {
      try {
        await DragonflyCronSyncService.processSyncBatch();
      } catch (err) {
        logger.error(`[Dragonfly Cron Sync Worker Error]:`, err);
      }
    }, intervalMs);

    logger.info(
      `[Dragonfly Cron] Background MongoDB Sync Cron Worker started (Interval: ${intervalMs}ms)`,
    );
  }

  /**
   * Stop the Cron Sync Job
   */
  static stopCronSync(): void {
    if (cronTimer) {
      clearInterval(cronTimer);
      cronTimer = null;
    }
    syncStats.running = false;
    logger.info(`[Dragonfly Cron] Background MongoDB Sync Cron Worker stopped`);
  }

  /**
   * Force an immediate flush of the sync queue to MongoDB
   */
  static async forceFlush(): Promise<{ processed: number; errors: number }> {
    logger.info(`[Dragonfly Cron] Force flush requested. Draining write-behind queue...`);
    let totalProcessed = 0;
    let totalErrors = 0;

    // Process in batches until queue is completely empty
    for (let i = 0; i < 20; i++) {
      const res = await DragonflyCronSyncService.processSyncBatch(100);
      totalProcessed += res.processed;
      totalErrors += res.errors;
      if (res.processed === 0) break;
    }

    return { processed: totalProcessed, errors: totalErrors };
  }

  /**
   * Get live synchronization statistics and queue count
   */
  static async getStats(): Promise<SyncCronStats> {
    let pendingCount = memoryQueue.length;

    if (isNodeRuntime()) {
      try {
        const client = await getDragonflyClient();
        if (client) {
          const count = await client.llen(QUEUE_KEY);
          pendingCount += count;
        }
      } catch {
        // ignore
      }
    }

    return {
      ...syncStats,
      pendingInQueue: pendingCount,
    };
  }
}

export default DragonflyCronSyncService;
