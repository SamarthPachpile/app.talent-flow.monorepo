import { doc, getDoc, setDoc } from "firebase/firestore";
import { adminDb } from "./firebase";
import { AdminApiService } from "./adminService";
import type { PlatformAdminSettings, ApiResponse } from "../types";

export class AdminSettingsBackendService {
  static async fetchAdminSettings(): Promise<PlatformAdminSettings> {
    try {
      if (adminDb) {
        const docRef = doc(adminDb, "settings", "admin_global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as PlatformAdminSettings;
        }
      }
    } catch (e) {
      console.warn("Admin Firestore fetch error for admin settings, using API fallback:", e);
    }
    return AdminApiService.getSettings();
  }

  static async saveAdminSettings(
    settings: Partial<PlatformAdminSettings>,
  ): Promise<ApiResponse<PlatformAdminSettings>> {
    const res = AdminApiService.updateSettings(settings);
    try {
      if (adminDb) {
        const docRef = doc(adminDb, "settings", "admin_global");
        await setDoc(docRef, res.data, { merge: true });
      }
    } catch (e) {
      console.warn("Admin Firestore save warning for admin settings:", e);
    }
    return res;
  }
}
