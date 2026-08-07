import { doc, getDoc, setDoc } from "firebase/firestore";
import { companyDb } from "./firebase";
import { CompanyApiService } from "./companyService";
import type { CompanySettings, ApiResponse } from "../types";

export class CompanySettingsBackendService {
  static async fetchCompanySettings(): Promise<CompanySettings> {
    try {
      if (companyDb) {
        const docRef = doc(companyDb, "settings", "company_default");
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
      if (companyDb) {
        const docRef = doc(companyDb, "settings", "company_default");
        await setDoc(docRef, res.data, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore save warning for company settings:", e);
    }
    return res;
  }
}
