/**
 * MongoDB Atlas Background Cron Synchronization Initializer
 * Registers entity sync processors that drain the Dragonfly DB write queue
 * and write/persist the data to MongoDB Atlas on a recurring cron schedule.
 * Strictly maintains Candidate, Company, Job, and Settings entities.
 */

import { DragonflyCronSyncService, DragonflyMutationTask } from "@talent-flow/utilities/dragonfly";
import { Candidate, Company, Job, Settings } from "@talent-flow/schema-types/models";
import { logger } from "@talent-flow/utilities";

let isInitialized = false;

export function initializeDragonflyMongoCronSync(intervalMs = 3000): void {
  if (isInitialized) {
    return;
  }

  logger.info(
    "[MongoCronSync] Initializing Dragonfly -> MongoDB Atlas Cron Processors for Candidate, Company, Job, Settings...",
  );

  // 1. Candidate Entity Processor
  DragonflyCronSyncService.registerEntityProcessor(
    "candidate",
    async (task: DragonflyMutationTask) => {
      const { action, targetId, payload } = task;

      if (action === "DELETE") {
        await Candidate.deleteOne({
          $or: [{ id: targetId }, { email: targetId }],
        });
        logger.info(`[MongoCronSync] Synced Candidate deletion: ${targetId}`);
        return;
      }

      if (payload) {
        const cleanId = (payload as any).id || targetId;
        const cleanEmail = ((payload as any).email || "").trim().toLowerCase();

        const query: Record<string, unknown>[] = [{ id: cleanId }];
        if (cleanEmail) query.push({ email: cleanEmail });
        if ((payload as any).googleId) query.push({ googleId: (payload as any).googleId });

        const existing = await Candidate.findOne({ $or: query });
        if (existing) {
          await Candidate.updateOne({ _id: existing._id }, { $set: payload as any });
        } else {
          await Candidate.create(payload as any);
        }
        logger.info(`[MongoCronSync] Synced Candidate UPSERT to MongoDB: ${cleanId}`);
      }
    },
  );

  // 2. Company Entity Processor
  DragonflyCronSyncService.registerEntityProcessor(
    "company",
    async (task: DragonflyMutationTask) => {
      const { action, targetId, payload } = task;

      if (action === "DELETE") {
        await Company.deleteOne({
          $or: [{ id: targetId }, { subdomain: targetId }],
        });
        logger.info(`[MongoCronSync] Synced Company deletion: ${targetId}`);
        return;
      }

      if (payload) {
        const cleanId = (payload as any).id || (payload as any).subdomain || targetId;
        await Company.findOneAndUpdate(
          { $or: [{ id: cleanId }, { subdomain: cleanId }] },
          { $set: payload as any },
          { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
        );
        logger.info(`[MongoCronSync] Synced Company UPSERT to MongoDB: ${cleanId}`);
      }
    },
  );

  // 3. Job Entity Processor
  DragonflyCronSyncService.registerEntityProcessor("job", async (task: DragonflyMutationTask) => {
    const { action, targetId, payload } = task;

    if (action === "DELETE") {
      await Job.deleteOne({ id: targetId });
      logger.info(`[MongoCronSync] Synced Job deletion: ${targetId}`);
      return;
    }

    if (payload) {
      const jobId = (payload as any).id || targetId;
      await Job.findOneAndUpdate(
        { id: jobId },
        { $set: payload as any },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      );
      logger.info(`[MongoCronSync] Synced Job UPSERT to MongoDB: ${jobId}`);
    }
  });

  // 4. Settings Entity Processor
  DragonflyCronSyncService.registerEntityProcessor(
    "settings",
    async (task: DragonflyMutationTask) => {
      const { payload } = task;
      if (payload) {
        const scope = (payload as any).scope || "admin";
        const targetId = (payload as any).targetId || "platform";
        const data = (payload as any).data || payload;

        await Settings.findOneAndUpdate(
          { scope, targetId },
          { $set: { scope, targetId, data, updatedAt: new Date() } },
          { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
        );
        logger.info(`[MongoCronSync] Synced Settings UPSERT to MongoDB: ${scope}:${targetId}`);
      }
    },
  );

  // Start the background Cron worker
  DragonflyCronSyncService.startCronSync(intervalMs);
  isInitialized = true;
  logger.info(
    `[MongoCronSync] Dragonfly -> MongoDB Atlas Cron Worker active (Interval: ${intervalMs}ms)`,
  );
}

export { DragonflyCronSyncService };
export default initializeDragonflyMongoCronSync;
