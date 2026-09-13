import type { CandidateDocument, CandidateSettings } from "@talent-flow/schema-types";
import { defaultCandidateSettings } from "@talent-flow/schema-types";
import { Candidate, Settings } from "@talent-flow/schema-types";
import { DragonflyCacheService } from "@talent-flow/utilities/dragonfly";
import { logger } from "@talent-flow/utilities";
import bcrypt from "bcryptjs";

export { defaultCandidateSettings };

export class CandidateService {
  static async verifyPassword(candidate: any, plainPassword: string): Promise<boolean> {
    if (!candidate?.password) return false;
    try {
      if (candidate.password.startsWith("$2a$") || candidate.password.startsWith("$2b$")) {
        return await bcrypt.compare(plainPassword, candidate.password);
      }
      return plainPassword === candidate.password;
    } catch {
      return plainPassword === candidate.password;
    }
  }

  static async getCandidate(candidateId: string): Promise<CandidateDocument | null> {
    const cleanId = candidateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = DragonflyCacheService.keys.candidate(cleanId);

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<CandidateDocument | null>(
      cacheKey,
      async () => {
        // 2. Only if NOT present in Dragonfly DB, fetch from MongoDB Atlas
        try {
          const doc = await Candidate.findOne({ id: cleanId }).lean();
          if (doc && doc.email) {
            // Also index by email in Dragonfly DB for fast lookups
            await DragonflyCacheService.set(
              DragonflyCacheService.keys.candidateEmail(doc.email),
              doc,
              3600,
            );
          }
          return doc as unknown as CandidateDocument | null;
        } catch (err) {
          logger.warn("[CandidateService] DB getCandidate error:", err);
          return null;
        }
      },
      3600,
    );
  }

  static async getCandidateByEmail(email: string): Promise<CandidateDocument | null> {
    const cleanEmail = email.trim().toLowerCase();
    const emailCacheKey = DragonflyCacheService.keys.candidateEmail(cleanEmail);

    // 1. Strict Dragonfly DB Read First by email index
    return DragonflyCacheService.fetchFromDragonflyOrDb<CandidateDocument | null>(
      emailCacheKey,
      async () => {
        // 2. Fallback to MongoDB
        try {
          const doc = await Candidate.findOne({ email: cleanEmail }).lean();
          if (doc && doc.id) {
            await DragonflyCacheService.set(
              DragonflyCacheService.keys.candidate(doc.id),
              doc,
              3600,
            );
          }
          return doc as unknown as CandidateDocument | null;
        } catch (err) {
          logger.warn("[CandidateService] DB getCandidateByEmail error:", err);
          return null;
        }
      },
      3600,
    );
  }

  static async getAllCandidates(): Promise<CandidateDocument[]> {
    const cacheKey = DragonflyCacheService.keys.candidatesAll();

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<CandidateDocument[]>(
      cacheKey,
      async () => {
        // 2. MongoDB Fallback
        try {
          const docs = await Candidate.find().sort({ updatedAt: -1 }).limit(100).lean();
          // Populate individual candidate keys in Dragonfly DB
          for (const cand of docs) {
            if (cand.id) {
              await DragonflyCacheService.set(
                DragonflyCacheService.keys.candidate(cand.id),
                cand,
                3600,
              );
            }
          }
          return docs as unknown as CandidateDocument[];
        } catch (err) {
          logger.warn("[CandidateService] DB getAllCandidates error:", err);
          return [];
        }
      },
      600,
    );
  }

  static async saveCandidate(
    candidate: CandidateDocument | Partial<CandidateDocument>,
  ): Promise<CandidateDocument> {
    const cleanEmail = (candidate.email || "").trim().toLowerCase();
    const cleanId = (candidate.id || cleanEmail || "cand").toLowerCase().replace(/[^a-z0-9-]/g, "");

    const existing = await this.getCandidate(cleanId);

    let hashedPassword = candidate.password || existing?.password;
    if (
      candidate.password &&
      !candidate.password.startsWith("$2a$") &&
      !candidate.password.startsWith("$2b$")
    ) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(candidate.password, salt);
    }

    const payload: CandidateDocument = {
      ...(existing || {}),
      ...(candidate as any),
      id: cleanId,
      email: cleanEmail || existing?.email || "",
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    };

    const cacheKey = DragonflyCacheService.keys.candidate(cleanId);

    // 1. Write strictly to Dragonfly DB immediately
    await DragonflyCacheService.set(cacheKey, payload, 3600);
    if (cleanEmail) {
      await DragonflyCacheService.set(
        DragonflyCacheService.keys.candidateEmail(cleanEmail),
        payload,
        3600,
      );
    }

    // Invalidate / update list in Dragonfly DB
    await DragonflyCacheService.del(DragonflyCacheService.keys.candidatesAll());

    // 2. Enqueue mutation into Dragonfly Cron Sync Queue for MongoDB writing
    await DragonflyCacheService.writeToDragonflyAndEnqueueSync(
      "candidate",
      cacheKey,
      payload,
      cleanId,
    );

    return payload;
  }

  static async deleteCandidate(candidateId: string): Promise<boolean> {
    const cleanId = candidateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = DragonflyCacheService.keys.candidate(cleanId);

    const candidate = await this.getCandidate(cleanId);
    if (candidate?.email) {
      await DragonflyCacheService.del(DragonflyCacheService.keys.candidateEmail(candidate.email));
    }

    // 1. Delete strictly from Dragonfly DB
    await DragonflyCacheService.del(cacheKey);
    await DragonflyCacheService.del(DragonflyCacheService.keys.candidatesAll());

    // 2. Enqueue deletion into Dragonfly Cron Sync Queue for MongoDB deletion
    await DragonflyCacheService.deleteFromDragonflyAndEnqueueSync("candidate", cacheKey, cleanId);

    return true;
  }

  static async linkCompany(
    candidateId: string,
    companyId: string,
    companyName?: string,
  ): Promise<CandidateDocument | null> {
    const cleanId = candidateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cleanCompId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const candidate = await this.getCandidate(cleanId);
    if (!candidate) return null;

    const registeredCompanyIds = Array.isArray(candidate.registeredCompanyIds)
      ? [...candidate.registeredCompanyIds]
      : [];
    if (!registeredCompanyIds.includes(cleanCompId)) {
      registeredCompanyIds.push(cleanCompId);
    }

    const regCompanies = Array.isArray(candidate.registeredCompanies)
      ? [...candidate.registeredCompanies]
      : [];
    if (!regCompanies.some((c: any) => c.companyId === cleanCompId)) {
      regCompanies.push({
        companyId: cleanCompId,
        companyName: companyName || cleanCompId,
        registeredAt: new Date().toISOString(),
        status: "active",
      });
    }

    const updated: CandidateDocument = {
      ...candidate,
      registeredCompanyIds,
      registeredCompanies: regCompanies,
      updatedAt: new Date().toISOString(),
    };

    return this.saveCandidate(updated);
  }

  static async fetchSettings(candidateId = "cand-alex"): Promise<CandidateSettings> {
    const cleanId = candidateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = DragonflyCacheService.keys.candidateSettings(cleanId);

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<CandidateSettings>(
      cacheKey,
      async () => {
        // 2. MongoDB Fallback
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
    const cacheKey = DragonflyCacheService.keys.candidateSettings(cleanId);

    const settingsPayload = {
      scope: "candidate",
      targetId: cleanId,
      data: merged,
      updatedAt: new Date().toISOString(),
    };

    // 1. Write strictly to Dragonfly DB & Enqueue for Cron
    await DragonflyCacheService.set(cacheKey, merged, 86400);
    await DragonflyCacheService.writeToDragonflyAndEnqueueSync(
      "settings",
      cacheKey,
      settingsPayload,
      `candidate:${cleanId}`,
    );

    return merged;
  }
}
