import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AdminApiService } from "./adminService";
import { CompanyApiService } from "./companyService";
import { CandidateApiService } from "./candidateService";
import type {
  PlatformAdminSettings,
  CompanySettings,
  CandidateSettings,
  ApiResponse,
} from "../types";

export class SettingsBackendService {
  // --- ADMIN SETTINGS API ---
  static async fetchAdminSettings(): Promise<PlatformAdminSettings> {
    try {
      if (db) {
        const docRef = doc(db, "settings", "admin_global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as PlatformAdminSettings;
        }
      }
    } catch (e) {
      console.warn("Firestore fetch error for admin settings, using API fallback:", e);
    }
    return AdminApiService.getSettings();
  }

  static async saveAdminSettings(
    settings: Partial<PlatformAdminSettings>,
  ): Promise<ApiResponse<PlatformAdminSettings>> {
    const res = AdminApiService.updateSettings(settings);
    try {
      if (db) {
        const docRef = doc(db, "settings", "admin_global");
        await setDoc(docRef, res.data, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore save warning for admin settings:", e);
    }
    return res;
  }

  // --- COMPANY SETTINGS API ---
  static async fetchCompanySettings(): Promise<CompanySettings> {
    try {
      if (db) {
        const docRef = doc(db, "settings", "company_default");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as CompanySettings;
        }
      }
    } catch (e) {
      console.warn("Firestore fetch error for company settings, using API fallback:", e);
    }
    return CompanyApiService.getSettings();
  }

  static async saveCompanySettings(
    settings: Partial<CompanySettings>,
  ): Promise<ApiResponse<CompanySettings>> {
    const res = CompanyApiService.updateSettings(settings);
    try {
      if (db) {
        const docRef = doc(db, "settings", "company_default");
        await setDoc(docRef, res.data, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore save warning for company settings:", e);
    }
    return res;
  }

  // --- CANDIDATE SETTINGS API ---
  static async fetchCandidateSettings(candidateId = "cand-alex"): Promise<CandidateSettings> {
    try {
      if (db) {
        const docRef = doc(db, "settings", `candidate_${candidateId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as CandidateSettings;
        }
      }
    } catch (e) {
      console.warn("Firestore fetch error for candidate settings, using API fallback:", e);
    }
    return CandidateApiService.getSettings();
  }

  static async saveCandidateSettings(
    settings: Partial<CandidateSettings>,
    candidateId = "cand-alex",
  ): Promise<ApiResponse<CandidateSettings>> {
    const res = CandidateApiService.updateSettings(settings);
    try {
      if (db) {
        const docRef = doc(db, "settings", `candidate_${candidateId}`);
        await setDoc(docRef, res.data, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore save warning for candidate settings:", e);
    }
    return res;
  }
}
