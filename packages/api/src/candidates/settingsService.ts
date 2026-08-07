import { doc, getDoc, setDoc } from "firebase/firestore";
import { candidateDb } from "./firebase";
import { CandidateApiService } from "./candidateService";
import type { CandidateSettings, ApiResponse } from "../types";

export class CandidateSettingsBackendService {
  static async fetchCandidateSettings(candidateId = "cand-alex"): Promise<CandidateSettings> {
    try {
      if (candidateDb) {
        const docRef = doc(candidateDb, "settings", `candidate_${candidateId}`);
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
      if (candidateDb) {
        const docRef = doc(candidateDb, "settings", `candidate_${candidateId}`);
        await setDoc(docRef, res.data, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore save warning for candidate settings:", e);
    }
    return res;
  }
}
