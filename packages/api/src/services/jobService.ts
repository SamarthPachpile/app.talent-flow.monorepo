import type { JobPosting } from "@talent-flow/schema-types";
import { Job } from "@talent-flow/schema-types/models";
import { DragonflyCacheService } from "@talent-flow/utilities/dragonfly";
import { logger } from "@talent-flow/utilities";

export class JobService {
  static async getAllJobs(): Promise<JobPosting[]> {
    const cacheKey = DragonflyCacheService.keys.jobsAll();

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<JobPosting[]>(
      cacheKey,
      async () => {
        // 2. MongoDB Fallback
        try {
          const docs = await Job.find({ status: { $ne: "archived" } })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
          for (const job of docs) {
            if (job.id) {
              await DragonflyCacheService.set(DragonflyCacheService.keys.job(job.id), job, 3600);
            }
          }
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
    const cacheKey = DragonflyCacheService.keys.jobs(cleanCompId);

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<JobPosting[]>(
      cacheKey,
      async () => {
        // 2. MongoDB Fallback
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
    const cacheKey = DragonflyCacheService.keys.job(jobId);

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<JobPosting | null>(
      cacheKey,
      async () => {
        // 2. MongoDB Fallback
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

    const cacheKey = DragonflyCacheService.keys.job(jobId);

    // 1. Write strictly to Dragonfly DB immediately
    await DragonflyCacheService.set(cacheKey, payload, 3600);
    await DragonflyCacheService.del(DragonflyCacheService.keys.jobsAll());
    await DragonflyCacheService.del(DragonflyCacheService.keys.jobs(cleanCompId));

    // 2. Enqueue mutation into Dragonfly Cron Sync Queue for MongoDB writing
    await DragonflyCacheService.writeToDragonflyAndEnqueueSync("job", cacheKey, payload, jobId);

    return payload;
  }

  static async updateJobStatus(jobId: string, status: string): Promise<JobPosting | null> {
    const job = await this.getJobById(jobId);
    if (!job) return null;

    job.status = status;
    job.updatedAt = new Date().toISOString();

    const cacheKey = DragonflyCacheService.keys.job(jobId);

    // 1. Update strictly in Dragonfly DB immediately
    await DragonflyCacheService.set(cacheKey, job, 3600);
    await DragonflyCacheService.del(DragonflyCacheService.keys.jobsAll());
    if (job.companyId) {
      await DragonflyCacheService.del(DragonflyCacheService.keys.jobs(job.companyId));
    }

    // 2. Enqueue mutation to Cron Sync Queue
    await DragonflyCacheService.writeToDragonflyAndEnqueueSync("job", cacheKey, job, jobId);

    return job;
  }

  static async deleteJob(jobId: string): Promise<boolean> {
    const job = await this.getJobById(jobId);
    const cacheKey = DragonflyCacheService.keys.job(jobId);

    // 1. Delete strictly from Dragonfly DB immediately
    await DragonflyCacheService.del(cacheKey);
    await DragonflyCacheService.del(DragonflyCacheService.keys.jobsAll());
    if (job?.companyId) {
      await DragonflyCacheService.del(DragonflyCacheService.keys.jobs(job.companyId));
    }

    // 2. Enqueue deletion to Cron Sync Queue
    await DragonflyCacheService.deleteFromDragonflyAndEnqueueSync("job", cacheKey, jobId);

    return true;
  }
}
