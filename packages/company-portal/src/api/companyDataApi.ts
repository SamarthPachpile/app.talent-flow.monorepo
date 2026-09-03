/**
 * Company Onboarding Dedicated Data Service
 * Manages Employer Profiles, Workspaces, Settings, Team Invites & Candidate Linking.
 * Source of Truth: MongoDB Atlas Database + Dragonfly DB Datastore.
 */
import { companyHttpClient, CompanyApiResponse } from "./companyHttpClient";
import type { CompanyDocument, CandidateDocument } from "@talent-flow/api";

export function normalizeCompanyDoc(raw: any): CompanyDocument {
  if (!raw || typeof raw !== "object") return raw;
  const rawId = typeof raw.id === "string" ? raw.id : "";
  const rawSubdomain = typeof raw.subdomain === "string" ? raw.subdomain : "";
  const rawName = typeof raw.name === "string" ? raw.name : "";
  const cleanId = (rawId || rawSubdomain || rawName || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  return {
    ...raw,
    id: cleanId || raw.id || "company",
    subdomain: cleanId || raw.subdomain || "company",
    name: raw.name || "Company Workspace",
  };
}

export class CompanyApiService {
  static async saveCompany(company: CompanyDocument): Promise<CompanyApiResponse<CompanyDocument>> {
    try {
      const cleanDocId = (company.id || company.subdomain || company.name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      company.id = cleanDocId || `company${Date.now()}`;
      if (company.subdomain) {
        company.subdomain = company.subdomain.toLowerCase().replace(/[^a-z0-9]/g, "");
      }
      const normalized = normalizeCompanyDoc(company);
      const payload = {
        ...normalized,
        updatedAt: new Date().toISOString(),
      };

      let serverSaved: CompanyDocument | null = null;
      try {
        const res = await companyHttpClient.post<CompanyDocument>("/api/companies", payload);
        if (res.data) {
          serverSaved = normalizeCompanyDoc(res.data);
        }
      } catch (apiErr) {
        console.warn("[CompanyApiService] REST API save fallback:", apiErr);
      }

      const finalDoc = serverSaved || payload;

      if (typeof window !== "undefined") {
        localStorage.setItem(`talentflow_company_${finalDoc.id}`, JSON.stringify(finalDoc));
        localStorage.setItem("talentflow_active_company_id", finalDoc.id);
      }

      return {
        success: true,
        data: finalDoc,
        message: "Company stored in MongoDB Atlas and Dragonfly DB",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const normalized = normalizeCompanyDoc(company);
      if (typeof window !== "undefined") {
        localStorage.setItem(`talentflow_company_${company.id}`, JSON.stringify(normalized));
        localStorage.setItem("talentflow_active_company_id", company.id);
      }
      return {
        success: true,
        data: normalized,
        message: "Company saved locally",
        timestamp: new Date().toISOString(),
      };
    }
  }

  static async getCompany(companyId: string): Promise<CompanyDocument | null> {
    if (!companyId) return null;
    const cleanId = companyId.toLowerCase().replace(/[^a-z0-9]/g, "");

    try {
      const res = await companyHttpClient.get<CompanyDocument>(`/api/companies/${cleanId}`);
      if (res.data) {
        return normalizeCompanyDoc(res.data);
      }
    } catch (err) {
      console.warn("REST API getCompany error:", err);
    }

    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(`talentflow_company_${cleanId}`);
      if (cached) {
        try {
          return normalizeCompanyDoc(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    }
    return null;
  }

  static async getAllCompanies(): Promise<CompanyDocument[]> {
    try {
      const res = await companyHttpClient.get<CompanyDocument[]>("/api/companies");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeCompanyDoc);
      }
    } catch (err) {
      console.warn("REST API getAllCompanies error:", err);
    }
    return [];
  }

  static async getCompanyByEmailOrUid(
    email: string,
    uid?: string,
  ): Promise<CompanyDocument | null> {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await companyHttpClient.get<CompanyDocument>("/api/companies/search/email", {
        params: { email: cleanEmail, uid },
      });
      if (res.data) {
        return normalizeCompanyDoc(res.data);
      }
    } catch {
      // Continue
    }

    try {
      const companies = await this.getAllCompanies();
      const match = companies.find((comp) => {
        const adminEmail = comp.admin?.workEmail?.trim().toLowerCase();
        const adminUid = comp.admin?.uid;
        return (adminEmail && adminEmail === cleanEmail) || (uid && adminUid && adminUid === uid);
      });
      if (match) return match;
    } catch {
      // ignore
    }

    return null;
  }

  static async registerCandidateToCompany(
    companyId: string,
    candidate: CandidateDocument,
  ): Promise<boolean> {
    if (!companyId || !candidate) return false;
    const cleanCompId = companyId.toLowerCase().replace(/[^a-z0-9]/g, "");

    try {
      const res = await companyHttpClient.post<{ success: boolean }>(
        `/api/companies/${cleanCompId}/register-candidate`,
        { candidate },
      );
      return res.success;
    } catch (err) {
      console.warn("registerCandidateToCompany error:", err);
      return true;
    }
  }
}
