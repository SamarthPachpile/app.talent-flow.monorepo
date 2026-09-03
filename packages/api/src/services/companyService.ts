import type { CompanyDocument, CompanySettings } from "@talent-flow/schema-types";
import { defaultCompanySettings } from "@talent-flow/schema-types";
import { Company, Settings } from "@talent-flow/schema-types/models";
import { DragonflyCacheService } from "@talent-flow/utilities/dragonfly";
import { logger } from "@talent-flow/utilities";

export { defaultCompanySettings };

export class CompanyService {
  static async getCompany(companyId: string): Promise<CompanyDocument | null> {
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = `tf:df:company:${cleanId}`;
    return DragonflyCacheService.fetchFromDragonflyOrDb<CompanyDocument | null>(
      cacheKey,
      async () => {
        try {
          const doc = await Company.findOne({
            $or: [{ id: cleanId }, { subdomain: cleanId }],
          }).lean();
          return doc as unknown as CompanyDocument | null;
        } catch (err) {
          logger.warn("[CompanyService] DB getCompany error:", err);
          return null;
        }
      },
      3600,
    );
  }

  static async getAllCompanies(): Promise<CompanyDocument[]> {
    const cacheKey = "tf:df:companies:all";
    return DragonflyCacheService.fetchFromDragonflyOrDb<CompanyDocument[]>(
      cacheKey,
      async () => {
        try {
          const docs = await Company.find().sort({ updatedAt: -1 }).limit(100).lean();
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
    const cleanId = (company.id || company.subdomain || company.name || "comp")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    const payload = {
      ...company,
      id: cleanId,
      subdomain: company.subdomain || cleanId,
      updatedAt: new Date().toISOString(),
    };

    const cacheKey = `tf:df:company:${cleanId}`;
    return DragonflyCacheService.writeToDragonflyAndSyncDb<CompanyDocument>(
      cacheKey,
      payload as CompanyDocument,
      async () => {
        try {
          await Company.findOneAndUpdate(
            { $or: [{ id: cleanId }, { subdomain: cleanId }] },
            { $set: payload },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
          );
          await DragonflyCacheService.del("tf:df:companies:all");
        } catch (err) {
          logger.error("[CompanyService] DB saveCompany error:", err);
        }
      },
    );
  }

  static async fetchSettings(companyId = "company"): Promise<CompanySettings> {
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const cacheKey = `tf:df:settings:company:${cleanId}`;
    return DragonflyCacheService.fetchFromDragonflyOrDb<CompanySettings>(
      cacheKey,
      async () => {
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
    const cacheKey = `tf:df:settings:company:${cleanId}`;
    return DragonflyCacheService.writeToDragonflyAndSyncDb<CompanySettings>(
      cacheKey,
      merged,
      async () => {
        try {
          await Settings.findOneAndUpdate(
            { scope: "company", targetId: cleanId },
            { $set: { data: merged, updatedAt: new Date() } },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
          );
        } catch (err) {
          logger.error("[CompanyService] DB saveSettings error:", err);
        }
      },
    );
  }
}
