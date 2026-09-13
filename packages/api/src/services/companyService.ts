import type { CompanyDocument, CompanySettings } from "@talent-flow/schema-types";
import { defaultCompanySettings } from "@talent-flow/schema-types";
import { Company, Settings } from "@talent-flow/schema-types";
import { DragonflyCacheService } from "@talent-flow/utilities/dragonfly";
import { logger } from "@talent-flow/utilities";
import bcrypt from "bcryptjs";

export { defaultCompanySettings };

export class CompanyService {
  static async verifyPassword(company: any, plainPassword: string): Promise<boolean> {
    if (!company?.password) return false;
    try {
      if (company.password.startsWith("$2a$") || company.password.startsWith("$2b$")) {
        return await bcrypt.compare(plainPassword, company.password);
      }
      return plainPassword === company.password;
    } catch {
      return plainPassword === company.password;
    }
  }

  static async getCompany(companyId: string): Promise<CompanyDocument | null> {
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = DragonflyCacheService.keys.company(cleanId);

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<CompanyDocument | null>(
      cacheKey,
      async () => {
        // 2. Fallback to MongoDB only on Dragonfly miss
        try {
          const doc = await Company.findOne({
            $or: [{ id: cleanId }, { subdomain: cleanId }],
          }).lean();
          if (doc && doc.admin?.workEmail) {
            await DragonflyCacheService.set(
              DragonflyCacheService.keys.companyEmail(doc.admin.workEmail),
              doc,
              3600,
            );
          }
          return doc as unknown as CompanyDocument | null;
        } catch (err) {
          logger.warn("[CompanyService] DB getCompany error:", err);
          return null;
        }
      },
      3600,
    );
  }

  static async getCompanyByEmail(email: string): Promise<CompanyDocument | null> {
    const cleanEmail = email.trim().toLowerCase();
    const emailCacheKey = DragonflyCacheService.keys.companyEmail(cleanEmail);

    // 1. Strict Dragonfly DB Read First by email index
    return DragonflyCacheService.fetchFromDragonflyOrDb<CompanyDocument | null>(
      emailCacheKey,
      async () => {
        // 2. Fallback to MongoDB
        try {
          const doc = await Company.findOne({
            $or: [{ "admin.workEmail": cleanEmail }, { id: cleanEmail }, { subdomain: cleanEmail }],
          }).lean();
          if (doc && doc.id) {
            await DragonflyCacheService.set(DragonflyCacheService.keys.company(doc.id), doc, 3600);
          }
          return doc as unknown as CompanyDocument | null;
        } catch (err) {
          logger.warn("[CompanyService] DB getCompanyByEmail error:", err);
          return null;
        }
      },
      3600,
    );
  }

  static async getAllCompanies(): Promise<CompanyDocument[]> {
    const cacheKey = DragonflyCacheService.keys.companiesAll();

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<CompanyDocument[]>(
      cacheKey,
      async () => {
        // 2. MongoDB Fallback
        try {
          const docs = await Company.find().sort({ updatedAt: -1 }).limit(100).lean();
          // Populate individual company keys in Dragonfly DB
          for (const comp of docs) {
            if (comp.id) {
              await DragonflyCacheService.set(
                DragonflyCacheService.keys.company(comp.id),
                comp,
                3600,
              );
            }
          }
          return docs as unknown as CompanyDocument[];
        } catch (err) {
          logger.warn("[CompanyService] DB getAllCompanies error:", err);
          return [];
        }
      },
      600,
    );
  }

  static async saveCompany(company: Partial<CompanyDocument>): Promise<CompanyDocument> {
    const cleanEmail = (company.admin?.workEmail || company.email || "").trim().toLowerCase();
    const cleanId = (company.id || company.subdomain || company.name || "comp")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    const existing = await this.getCompany(cleanId);

    let hashedPassword = company.password || existing?.password;
    if (
      company.password &&
      !company.password.startsWith("$2a$") &&
      !company.password.startsWith("$2b$")
    ) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(company.password, salt);
    }

    const payload: CompanyDocument = {
      ...(existing || {}),
      ...(company as any),
      id: cleanId,
      password: hashedPassword,
      subdomain: company.subdomain || existing?.subdomain || cleanId,
      updatedAt: new Date().toISOString(),
    };

    const cacheKey = DragonflyCacheService.keys.company(cleanId);

    // 1. Write strictly to Dragonfly DB immediately
    await DragonflyCacheService.set(cacheKey, payload, 3600);
    if (cleanEmail) {
      await DragonflyCacheService.set(
        DragonflyCacheService.keys.companyEmail(cleanEmail),
        payload,
        3600,
      );
    }

    // Invalidate / refresh companies list in Dragonfly DB
    await DragonflyCacheService.del(DragonflyCacheService.keys.companiesAll());

    // 2. Enqueue mutation into Dragonfly Cron Sync Queue for MongoDB writing
    await DragonflyCacheService.writeToDragonflyAndEnqueueSync(
      "company",
      cacheKey,
      payload,
      cleanId,
    );

    return payload;
  }

  static async deleteCompany(companyId: string): Promise<boolean> {
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = DragonflyCacheService.keys.company(cleanId);

    const company = await this.getCompany(cleanId);
    if (company?.admin?.workEmail) {
      await DragonflyCacheService.del(
        DragonflyCacheService.keys.companyEmail(company.admin.workEmail),
      );
    }

    // 1. Delete strictly from Dragonfly DB
    await DragonflyCacheService.del(cacheKey);
    await DragonflyCacheService.del(DragonflyCacheService.keys.companiesAll());

    // 2. Enqueue deletion into Dragonfly Cron Sync Queue
    await DragonflyCacheService.deleteFromDragonflyAndEnqueueSync("company", cacheKey, cleanId);

    return true;
  }

  static async registerCandidate(
    companyId: string,
    candidate: { id?: string; email?: string; name?: string },
  ): Promise<CompanyDocument | null> {
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const company = await this.getCompany(cleanId);
    if (!company) return null;

    const registeredCandidateIds = Array.isArray(company.registeredCandidateIds)
      ? [...company.registeredCandidateIds]
      : [];
    const candId = candidate.id || candidate.email || "";
    if (candId && !registeredCandidateIds.includes(candId)) {
      registeredCandidateIds.push(candId);
    }

    const updatedStats = {
      ...(company.stats || {}),
      totalCandidates: (company.stats?.totalCandidates || 0) + 1,
    };

    const updated: CompanyDocument = {
      ...company,
      registeredCandidateIds,
      stats: updatedStats as any,
      updatedAt: new Date().toISOString(),
    };

    return this.saveCompany(updated);
  }

  static async fetchSettings(companyId = "company"): Promise<CompanySettings> {
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = DragonflyCacheService.keys.companySettings(cleanId);

    // 1. Strict Dragonfly DB Read First
    return DragonflyCacheService.fetchFromDragonflyOrDb<CompanySettings>(
      cacheKey,
      async () => {
        // 2. MongoDB Fallback
        try {
          const doc = await Settings.findOne({ scope: "company", targetId: cleanId }).lean();
          if (doc && doc.data) {
            return { ...defaultCompanySettings, ...(doc.data as Partial<CompanySettings>) };
          }
        } catch (err) {
          logger.warn("[CompanyService] DB fetchSettings error:", err);
        }
        return defaultCompanySettings;
      },
      86400,
    );
  }

  static async saveSettings(
    settings: Partial<CompanySettings>,
    companyId = "company",
  ): Promise<CompanySettings> {
    const current = await this.fetchSettings(companyId);
    const merged: CompanySettings = { ...current, ...settings };
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = DragonflyCacheService.keys.companySettings(cleanId);

    const settingsPayload = {
      scope: "company",
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
      `company:${cleanId}`,
    );

    return merged;
  }
}
