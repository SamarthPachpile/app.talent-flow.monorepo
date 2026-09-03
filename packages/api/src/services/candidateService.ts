import type { CandidateDocument, CandidateSettings } from "@talent-flow/schema-types";
import { defaultCandidateSettings } from "@talent-flow/schema-types";
import { Candidate, Settings } from "@talent-flow/schema-types/models";
import { DragonflyCacheService } from "@talent-flow/utilities/dragonfly";
import { logger } from "@talent-flow/utilities";

export { defaultCandidateSettings };

export class CandidateService {
  static async getCandidate(candidateId: string): Promise<CandidateDocument | null> {
    const cleanId = candidateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = `tf:df:candidate:${cleanId}`;
    return DragonflyCacheService.fetchFromDragonflyOrDb<CandidateDocument | null>(
      cacheKey,
      async () => {
        try {
          const doc = await Candidate.findOne({ id: cleanId }).lean();
          return doc as unknown as CandidateDocument | null;
        } catch (err) {
          logger.warn("[CandidateService] DB getCandidate error:", err);
          return null;
        }
      },
      3600,
    );
  }

  static async getAllCandidates(): Promise<CandidateDocument[]> {
    const cacheKey = "tf:df:candidates:all";
    return DragonflyCacheService.fetchFromDragonflyOrDb<CandidateDocument[]>(
      cacheKey,
      async () => {
        try {
          const docs = await Candidate.find().sort({ updatedAt: -1 }).limit(100).lean();
          return docs as unknown as CandidateDocument[];
        } catch (err) {
          logger.warn("[CandidateService] DB getAllCandidates error:", err);
          return [];
        }
      },
      600,
    );
  }

  static async saveCandidate(candidate: CandidateDocument): Promise<CandidateDocument> {
    const cleanId = (candidate.id || candidate.email || "cand")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    const payload = {
      ...candidate,
      id: cleanId,
      updatedAt: new Date().toISOString(),
    };

    const cacheKey = `tf:df:candidate:${cleanId}`;
    return DragonflyCacheService.writeToDragonflyAndSyncDb<CandidateDocument>(
      cacheKey,
      payload,
      async () => {
        try {
          await Candidate.findOneAndUpdate(
            { id: cleanId },
            { $set: payload },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
          );
          await DragonflyCacheService.del("tf:df:candidates:all");
        } catch (err) {
          logger.error("[CandidateService] DB saveCandidate error:", err);
        }
      },
    );
  }

  static async fetchSettings(candidateId = "cand-alex"): Promise<CandidateSettings> {
    const cleanId = candidateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = `tf:df:settings:candidate:${cleanId}`;
    return DragonflyCacheService.fetchFromDragonflyOrDb<CandidateSettings>(
      cacheKey,
      async () => {
        try {
          const doc = await Settings.findOne({ scope: "candidate", targetId: cleanId }).lean();
          if (doc && doc.data) {
            return { ...defaultCandidateSettings, ...(doc.data as Partial<CandidateSettings>) };
          }
        } catch (err) {
          logger.warn("[CandidateService] DB fetchSettings error:", err);
        }
        return defaultCandidateSettings;
      },
      86400,
    );
  }

  static async saveSettings(
    settings: Partial<CandidateSettings>,
    candidateId = "cand-alex",
  ): Promise<CandidateSettings> {
    const current = await this.fetchSettings(candidateId);
    const merged: CandidateSettings = { ...current, ...settings };
    const cleanId = candidateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = `tf:df:settings:candidate:${cleanId}`;
    return DragonflyCacheService.writeToDragonflyAndSyncDb<CandidateSettings>(
      cacheKey,
      merged,
      async () => {
        try {
          await Settings.findOneAndUpdate(
            { scope: "candidate", targetId: cleanId },
            { $set: { data: merged, updatedAt: new Date() } },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
          );
        } catch (err) {
          logger.error("[CandidateService] DB saveSettings error:", err);
        }
      },
    );
  }
}
