import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { candidateDb } from "./firebase";
import type { CandidateSettings, ApiResponse } from "../types";

export interface CandidateDocument {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  compliance?: string;
  payroll?: string;
  companySize?: string;
  industry?: string;
  referralSource?: string;
  uid?: string;
  isCompleted: boolean;
  currentStageId?: string;
  targetRole?: string;
  experienceYears?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  skills?: string[];
  bio?: string;
  education?: {
    degree: string;
    institution: string;
    graduationYear: string;
  };
  hardwarePreferences?: {
    laptop: "macbook" | "thinkpad";
    accessories: string[];
  };
  notificationPreferences?: {
    emailStageUpdates: boolean;
    emailInterviewInvites: boolean;
    smsReminders: boolean;
  };
  companyId?: string;
  registeredCompanyIds?: string[];
  registeredCompanies?: Array<{
    companyId: string;
    companyName?: string;
    registeredAt: string;
  }>;
  fullOnboardingState?: Record<string, unknown>;
  termsAccepted?: boolean;
  captchaVerified?: boolean;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_CANDIDATE_SETTINGS = "talentflow_candidate_settings";

const defaultCandidateSettings: CandidateSettings = {
  profile: {
    id: "candidate-default",
    fullName: "Candidate",
    email: "candidate@example.com",
    phone: "",
    location: "Remote",
    linkedinUrl: "",
    githubUrl: "",
    headline: "Professional Candidate",
    bio: "",
  },
  notifications: {
    emailStageUpdates: true,
    emailInterviewInvites: true,
    smsReminders: true,
    weeklyJobMatches: false,
  },
  privacy: {
    openToWork: true,
    publicProfile: false,
    anonymousScreeningOptIn: true,
    allowTalentPoolSearch: true,
  },
  documents: {
    primaryResumeName: "Alex_Rivera_Senior_Fullstack_2026.pdf",
    primaryResumeUrl: "#",
    autoAttachCoverLetter: true,
    portfolioUrl: "https://alexrivera.dev",
  },
  account: {
    mfaEnabled: false,
    passwordLastChanged: "30 days ago",
    connectedAccounts: {
      google: true,
      github: true,
      linkedin: false,
    },
  },
};

export class CandidateApiService {
  /**
   * Save or update candidate document in Firestore 'candidates' collection
   */
  static async saveCandidateToFirestore(
    candidate: CandidateDocument,
  ): Promise<ApiResponse<CandidateDocument>> {
    try {
      // Use standard default Firestore auto-generated ID if missing or email-based
      const isEmailBasedId =
        candidate.id &&
        candidate.email &&
        (candidate.id === candidate.email.toLowerCase().replace(/[^a-z0-9]/g, "") ||
          candidate.id.includes("@"));

      if (!candidate.id || isEmailBasedId) {
        candidate.id = doc(collection(candidateDb, "candidates")).id;
      }

      const candidateRef = doc(candidateDb, "candidates", candidate.id);
      const payload: CandidateDocument = {
        ...candidate,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(candidateRef, payload, { merge: true });

      // Cache in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`talentflow_candidate_${candidate.id}`, JSON.stringify(payload));
        localStorage.setItem("talentflow_active_candidate_id", candidate.id);
        localStorage.setItem("talentflow_candidate_profile", JSON.stringify(payload));
      }

      return {
        success: true,
        data: payload,
        message: "Candidate stored in Firestore 'candidates' collection successfully",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("Firestore saveCandidate error (using local cache fallback):", err);
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

  /**
   * Fetch single candidate document from Firestore 'candidates' collection
   */
  static async getCandidateFromFirestore(candidateId: string): Promise<CandidateDocument | null> {
    try {
      const candidateRef = doc(candidateDb, "candidates", candidateId);
      const docSnap = await getDoc(candidateRef);
      if (docSnap.exists()) {
        return docSnap.data() as CandidateDocument;
      }
    } catch (err) {
      console.warn("Firestore getCandidate error:", err);
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

  /**
   * Fetch all candidates from Firestore 'candidates' collection
   */
  static async getAllCandidatesFromFirestore(): Promise<CandidateDocument[]> {
    try {
      const colRef = collection(candidateDb, "candidates");
      const snap = await getDocs(colRef);
      const list: CandidateDocument[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as CandidateDocument);
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn("Firestore getAllCandidates error:", err);
    }
    return [];
  }

  /**
   * Search and fetch candidate document by email or UID from Firestore 'candidates' collection
   */
  static async getCandidateByEmailOrUid(
    email: string,
    uid?: string,
  ): Promise<CandidateDocument | null> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const candidates = await this.getAllCandidatesFromFirestore();
      const match = candidates.find((cand) => {
        const cEmail = cand.email?.trim().toLowerCase();
        const cUid = cand.uid;
        return (cEmail && cEmail === cleanEmail) || (uid && cUid === uid);
      });

      if (match) return match;
    } catch (err) {
      console.warn("Firestore getCandidateByEmailOrUid error:", err);
    }

    if (typeof window !== "undefined") {
      const activeProf = localStorage.getItem("talentflow_candidate_profile");
      if (activeProf) {
        try {
          const parsed = JSON.parse(activeProf);
          const parsedEmail = (parsed.email || "").trim().toLowerCase();
          const parsedUid = parsed.uid;
          if ((parsedEmail && parsedEmail === cleanEmail) || (uid && parsedUid === uid)) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("talentflow_candidate_")) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || "");
            const itemEmail = (item.email || "").trim().toLowerCase();
            const itemUid = item.uid;
            if ((itemEmail && itemEmail === cleanEmail) || (uid && itemUid === uid)) {
              return item;
            }
          } catch {
            // ignore
          }
        }
      }
    }

    return null;
  }

  static getSettings(): CandidateSettings {
    if (typeof window === "undefined") return defaultCandidateSettings;
    const stored = localStorage.getItem(STORAGE_KEY_CANDIDATE_SETTINGS);
    if (!stored) return defaultCandidateSettings;
    try {
      return { ...defaultCandidateSettings, ...JSON.parse(stored) };
    } catch {
      return defaultCandidateSettings;
    }
  }

  static updateSettings(
    partialSettings: Partial<CandidateSettings>,
  ): ApiResponse<CandidateSettings> {
    const current = this.getSettings();
    const updated: CandidateSettings = {
      ...current,
      ...partialSettings,
      profile: { ...current.profile, ...(partialSettings.profile || {}) },
      notifications: { ...current.notifications, ...(partialSettings.notifications || {}) },
      privacy: { ...current.privacy, ...(partialSettings.privacy || {}) },
      documents: { ...current.documents, ...(partialSettings.documents || {}) },
      account: { ...current.account, ...(partialSettings.account || {}) },
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_CANDIDATE_SETTINGS, JSON.stringify(updated));
    }
    return {
      success: true,
      data: updated,
      message: "Candidate settings saved successfully",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Associate a company ID & metadata to candidate's registeredCompanyIds array in Firestore 'candidates' collection
   */
  static async addCompanyToCandidate(
    candidateId: string,
    companyIdOrSlug: string,
    companyName?: string,
  ): Promise<CandidateDocument | null> {
    if (!candidateId || !companyIdOrSlug) return null;
    const cleanCompId = companyIdOrSlug.toLowerCase().replace(/[^a-z0-9]/g, "");

    try {
      const cand = await this.getCandidateFromFirestore(candidateId);
      if (!cand) return null;

      const existingCompanyIds = cand.registeredCompanyIds || [];
      const existingCompanies = cand.registeredCompanies || [];

      const updatedCompanyIds = Array.from(new Set([...existingCompanyIds, cleanCompId]));
      const filteredCompanies = existingCompanies.filter((c) => c.companyId !== cleanCompId);
      const updatedCompanies = [
        ...filteredCompanies,
        {
          companyId: cleanCompId,
          companyName: companyName || companyIdOrSlug,
          registeredAt: new Date().toISOString(),
        },
      ];

      const updatedCand: CandidateDocument = {
        ...cand,
        companyId: cleanCompId,
        registeredCompanyIds: updatedCompanyIds,
        registeredCompanies: updatedCompanies,
        updatedAt: new Date().toISOString(),
      };

      await this.saveCandidateToFirestore(updatedCand);
      return updatedCand;
    } catch (err) {
      console.warn("addCompanyToCandidate error:", err);
      return null;
    }
  }

  /**
   * Helper to check if a candidate is registered to a specific company candidate portal
   */
  static isCandidateRegisteredForCompany(
    candidate: CandidateDocument,
    companyIdOrSlug: string,
  ): boolean {
    if (!candidate || !companyIdOrSlug) return false;
    const cleanCompId = companyIdOrSlug.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (
      candidate.companyId &&
      candidate.companyId.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId
    ) {
      return true;
    }

    if (
      candidate.registeredCompanyIds &&
      candidate.registeredCompanyIds.some(
        (id) => id.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId,
      )
    ) {
      return true;
    }

    if (
      candidate.registeredCompanies &&
      candidate.registeredCompanies.some(
        (c) => c.companyId.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId,
      )
    ) {
      return true;
    }

    return false;
  }
}
