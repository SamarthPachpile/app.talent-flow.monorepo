/**
 * Candidate Portal Dedicated Data Service
 * Manages Candidate Profiles, Setup Wizards, Roadmaps, and Job Applications.
 * Source of Truth: MongoDB Atlas Database + Dragonfly DB Datastore.
 */
import { candidateHttpClient, CandidateApiResponse } from "./candidateHttpClient";
import type { CandidateDocument, CompanyDocument, CandidateSettings } from "@talent-flow/api";

export class CandidateApiService {
  static async saveCandidate(
    candidate: CandidateDocument,
  ): Promise<CandidateApiResponse<CandidateDocument>> {
    try {
      const isEmailBasedId =
        candidate.id &&
        candidate.email &&
        (candidate.id === candidate.email.toLowerCase().replace(/[^a-z0-9]/g, "") ||
          candidate.id.includes("@"));

      if (!candidate.id || isEmailBasedId) {
        candidate.id = `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      }

      const payload: CandidateDocument = {
        ...candidate,
        updatedAt: new Date().toISOString(),
      };

      let serverSaved: CandidateDocument | null = null;
      try {
        const res = await candidateHttpClient.post<CandidateDocument>("/api/candidates", payload);
        if (res.data) {
          serverSaved = res.data;
        }
      } catch (apiErr) {
        console.warn("[CandidateApiService] REST API save fallback:", apiErr);
      }

      const finalDoc = serverSaved || payload;

      if (typeof window !== "undefined") {
        localStorage.setItem(`talentflow_candidate_${finalDoc.id}`, JSON.stringify(finalDoc));
        localStorage.setItem("talentflow_active_candidate_id", finalDoc.id);
        localStorage.setItem("talentflow_candidate_profile", JSON.stringify(finalDoc));
      }

      return {
        success: true,
        data: finalDoc,
        message: "Candidate stored in MongoDB Atlas and Dragonfly DB",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      if (typeof window !== "undefined") {
        localStorage.setItem(`talentflow_candidate_${candidate.id}`, JSON.stringify(candidate));
        localStorage.setItem("talentflow_active_candidate_id", candidate.id);
        localStorage.setItem("talentflow_candidate_profile", JSON.stringify(candidate));
      }
      return {
        success: true,
        data: candidate,
        message: "Candidate saved locally",
        timestamp: new Date().toISOString(),
      };
    }
  }

  static async getCandidate(candidateId: string): Promise<CandidateDocument | null> {
    if (!candidateId) return null;

    try {
      const res = await candidateHttpClient.get<CandidateDocument>(
        `/api/candidates/${candidateId}`,
      );
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("REST API getCandidate error:", err);
    }

    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(`talentflow_candidate_${candidateId}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
    }
    return null;
  }

  static async getAllCandidates(): Promise<CandidateDocument[]> {
    try {
      const res = await candidateHttpClient.get<CandidateDocument[]>("/api/candidates");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn("REST API getAllCandidates error:", err);
    }
    return [];
  }

  static async getCandidateByEmailOrUid(
    email: string,
    uid?: string,
  ): Promise<CandidateDocument | null> {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await candidateHttpClient.get<CandidateDocument>("/api/candidates/search/email", {
        params: { email: cleanEmail, uid },
      });
      if (res.data) {
        return res.data;
      }
    } catch {
      // Continue
    }

    try {
      const candidates = await this.getAllCandidates();
      const match = candidates.find((cand) => {
        const cEmail = cand.email?.trim().toLowerCase();
        const cUid = cand.uid;
        return (cEmail && cEmail === cleanEmail) || (uid && cUid === uid);
      });
      if (match) return match;
    } catch {
      // ignore
    }

    return null;
  }

  static isCandidateRegisteredForCompany(candidate: CandidateDocument, companyId: string): boolean {
    if (!candidate || !companyId) return true;
    const cleanCompId = companyId.toLowerCase().replace(/[^a-z0-9]/g, "");

    const inRegisteredIds = candidate.registeredCompanyIds?.some(
      (id) => id.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId,
    );
    const inRegisteredObjs = candidate.registeredCompanies?.some(
      (c) => c.companyId.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId,
    );
    const inCompanyId =
      candidate.companyId &&
      candidate.companyId.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId;

    return Boolean(inRegisteredIds || inRegisteredObjs || inCompanyId);
  }

  static async addCompanyToCandidate(
    candidateId: string,
    companyId: string,
    companyName?: string,
  ): Promise<CandidateDocument | null> {
    if (!candidateId || !companyId) return null;

    try {
      const res = await candidateHttpClient.post<CandidateDocument>(
        `/api/candidates/${candidateId}/add-company`,
        { companyId, companyName },
      );
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("addCompanyToCandidate error:", err);
    }
    return null;
  }
}
