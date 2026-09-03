import type { JobPosting } from "@talent-flow/schema-types";
import { Job } from "@talent-flow/schema-types/models";
import { DragonflyCacheService } from "@talent-flow/utilities/dragonfly";
import { logger } from "@talent-flow/utilities";

export class JobService {
  static async getAllJobs(): Promise<JobPosting[]> {
    const cacheKey = "tf:df:jobs:all";
    return DragonflyCacheService.fetchFromDragonflyOrDb<JobPosting[]>(
      cacheKey,
      async () => {
        try {
          const docs = await Job.find({ status: { $ne: "archived" } })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
          return docs as unknown as JobPosting[];
        } catch (err) {
          logger.warn("[JobService] DB getAllJobs error:", err);
          return [];
        }
      },
      600,
    );
  }

  static async getJobsForCompany(companyId: string): Promise<JobPosting[]> {
    const cleanCompId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = `tf:df:jobs:company:${cleanCompId}`;
    return DragonflyCacheService.fetchFromDragonflyOrDb<JobPosting[]>(
      cacheKey,
      async () => {
        try {
          const docs = await Job.find({
            $or: [{ companyId: cleanCompId }, { subdomain: cleanCompId }],
          })
            .sort({ createdAt: -1 })
            .lean();
          return docs as unknown as JobPosting[];
        } catch (err) {
          logger.warn("[JobService] DB getJobsForCompany error:", err);
          return [];
        }
      },
      600,
    );
  }

  static async getJobById(jobId: string): Promise<JobPosting | null> {
    const cacheKey = `tf:df:job:${jobId}`;
    return DragonflyCacheService.fetchFromDragonflyOrDb<JobPosting | null>(
      cacheKey,
      async () => {
        try {
          const doc = await Job.findOne({ id: jobId }).lean();
          return doc as unknown as JobPosting | null;
        } catch (err) {
          logger.warn("[JobService] DB getJobById error:", err);
          return null;
        }
      },
      3600,
    );
  }

  static async createJob(jobData: Partial<JobPosting>): Promise<JobPosting> {
    const jobId = jobData.id || `job_${Date.now()}`;
    const cleanCompId = (jobData.companyId || jobData.subdomain || "default")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    const payload: JobPosting = {
      ...(jobData as JobPosting),
      id: jobId,
      companyId: cleanCompId,
      status: jobData.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const cacheKey = `tf:df:job:${jobId}`;
    return DragonflyCacheService.writeToDragonflyAndSyncDb<JobPosting>(
      cacheKey,
      payload,
      async () => {
        try {
          await Job.findOneAndUpdate(
            { id: jobId },
            { $set: payload },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
          );
          await DragonflyCacheService.del("tf:df:jobs:all");
          await DragonflyCacheService.del(`tf:df:jobs:company:${cleanCompId}`);
        } catch (err) {
          logger.error("[JobService] DB createJob error:", err);
        }
      },
    );
  }

  static async updateJobStatus(jobId: string, status: string): Promise<JobPosting | null> {
    const job = await this.getJobById(jobId);
    if (!job) return null;

    job.status = status;
    job.updatedAt = new Date().toISOString();

    const cacheKey = `tf:df:job:${jobId}`;
    return DragonflyCacheService.writeToDragonflyAndSyncDb<JobPosting>(cacheKey, job, async () => {
      try {
        await Job.updateOne(
          { id: jobId },
          { $set: { status, updatedAt: new Date().toISOString() } },
        );
        await DragonflyCacheService.del("tf:df:jobs:all");
        if (job.companyId) {
          await DragonflyCacheService.del(`tf:df:jobs:company:${job.companyId}`);
        }
      } catch (err) {
        logger.error("[JobService] DB updateJobStatus error:", err);
      }
    });
  }

  static async deleteJob(jobId: string): Promise<boolean> {
    try {
      const job = await this.getJobById(jobId);
      await Job.deleteOne({ id: jobId });
      await DragonflyCacheService.del(`tf:df:job:${jobId}`);
      await DragonflyCacheService.del("tf:df:jobs:all");
      if (job?.companyId) {
        await DragonflyCacheService.del(`tf:df:jobs:company:${job.companyId}`);
      }
      return true;
    } catch (err) {
      logger.error("[JobService] DB deleteJob error:", err);
      return false;
    }
  }
}
