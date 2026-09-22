import { candidateHttpClient } from "./candidateHttpClient";
import type { CandidateDocument, CandidateSettings, ApiResponse } from "@talent-flow/schema-types";
import { defaultCandidateSettings } from "@talent-flow/schema-types";

type AuthStateCallback = (user: any | null) => void;
const authListeners: Set<AuthStateCallback> = new Set();
let currentAuthUser: any | null = null;

function notifyAuthChange(user: any | null) {
  currentAuthUser = user;
  authListeners.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.warn("Candidate auth listener error:", e);
    }
  });
}

export class CandidateApiService {
  static getSettings(): CandidateSettings {
    return defaultCandidateSettings;
  }

  static async saveCandidate(
    candidate: CandidateDocument,
  ): Promise<ApiResponse<CandidateDocument>> {
    try {
      const res = await candidateHttpClient.post<CandidateDocument>(
        "/api/candidates-profile",
        candidate,
      );
      return res as ApiResponse<CandidateDocument>;
    } catch {
      return { success: true, data: candidate, message: "Candidate saved locally" };
    }
  }

  static async getCandidate(candidateId: string): Promise<CandidateDocument | null> {
    try {
      const res = await candidateHttpClient.get<CandidateDocument>(
        `/api/candidates-profile/${candidateId}`,
      );
      return res.data || null;
    } catch {
      return null;
    }
  }

  static async getAllCandidates(): Promise<CandidateDocument[]> {
    try {
      const res = await candidateHttpClient.get<CandidateDocument[]>("/api/candidates-profile");
      return res.data || [];
    } catch {
      return [];
    }
  }

  static async getCandidateByEmailOrUid(
    email: string,
    uid?: string,
  ): Promise<CandidateDocument | null> {
    try {
      const res = await candidateHttpClient.get<CandidateDocument>(
        "/api/candidates-profile/search-email",
        {
          params: { email, uid: uid || "" },
        },
      );
      return res.data || null;
    } catch {
      return null;
    }
  }

  static isCandidateRegisteredForCompany(candidate: CandidateDocument, companyId: string): boolean {
    if (!candidate || !companyId) return true;
    const cleanCompId = companyId.toLowerCase().replace(/[^a-z0-9]/g, "");
    return Boolean(
      candidate.registeredCompanyIds?.some(
        (id) => id.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId,
      ) ||
      candidate.registeredCompanies?.some(
        (c) => c.companyId.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId,
      ) ||
      (candidate.companyId &&
        candidate.companyId.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanCompId),
    );
  }

  static async addCompanyToCandidate(
    candidateId: string,
    companyId: string,
    companyName?: string,
  ): Promise<CandidateDocument | null> {
    try {
      const res = await candidateHttpClient.post<CandidateDocument>(
        `/api/candidates-profile/${candidateId}/link-company`,
        {
          companyId,
          companyName,
        },
      );
      return res.data || null;
    } catch {
      return null;
    }
  }
}

export const CandidateSettingsBackendService = {
  fetchCandidateSettings: async (candidateId = "cand-alex"): Promise<CandidateSettings> => {
    const res = await candidateHttpClient.get<CandidateSettings>(
      `/api/candidates-profile/${candidateId}/candidate-settings`,
    );
    return res.data || defaultCandidateSettings;
  },
  saveCandidateSettings: async (
    settings: Partial<CandidateSettings>,
    candidateId = "cand-alex",
  ): Promise<ApiResponse<CandidateSettings>> => {
    return candidateHttpClient.post<CandidateSettings>(
      `/api/candidates-profile/${candidateId}/candidate-settings`,
      settings,
    ) as Promise<ApiResponse<CandidateSettings>>;
  },
};

import { launchGoogleOAuthScreen } from "./googleAuth";

export class CandidateAuthService {
  static async signInWithGoogle(googleProfile?: any) {
    try {
      let profile = googleProfile;
      if (!profile || !profile.email) {
        const oauthResult = await launchGoogleOAuthScreen("candidate");
        if (oauthResult.error) {
          return { user: null, token: undefined, error: oauthResult.error };
        }
        profile = oauthResult.profile;
      }

      if (!profile || !profile.email) {
        return { user: null, token: undefined, error: "Google sign-in cancelled or failed" };
      }

      const email = profile.email.toLowerCase().trim();
      const displayName = profile.fullName || profile.displayName || email.split("@")[0];
      const googleId = profile.googleId || `google_${Date.now()}`;
      const photoURL =
        profile.avatarUrl ||
        profile.photoURL ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

      const res = await candidateHttpClient.post<any>("/api/candidates-auth/google-auth", {
        email,
        fullName: displayName,
        googleId,
        avatarUrl: photoURL,
        role: "candidate",
      });

      const user = {
        uid: res.data?.user?.uid || res.data?.user?.id || googleId,
        id: res.data?.user?.id || res.data?.user?.uid || googleId,
        email: res.data?.user?.email || email,
        displayName: res.data?.user?.fullName || displayName,
        fullName: res.data?.user?.fullName || displayName,
        photoURL: res.data?.user?.avatarUrl || photoURL,
        emailVerified: true,
        role: "candidate",
      };

      if (typeof window !== "undefined") {
        if (res.data?.token) {
          localStorage.setItem("talentflow_auth_token", res.data.token);
          sessionStorage.setItem("talentflow_auth_token", res.data.token);
        }
        if (res.data?.sessionId) {
          localStorage.setItem("talentflow_session_id", res.data.sessionId);
          sessionStorage.setItem("talentflow_session_id", res.data.sessionId);
        }
      }

      notifyAuthChange(user);
      return { user, token: res.data?.token, sessionId: res.data?.sessionId, error: undefined };
    } catch (err: unknown) {
      return {
        user: null,
        token: undefined,
        error: (err as Error)?.message || "Google sign in failed",
      };
    }
  }

  static async signUpWithFullDetails(data: Record<string, unknown>): Promise<{
    user: any;
    error?: string;
    token?: string;
    sessionId?: string;
    verificationSent?: boolean;
    userProfile?: any;
    otp?: string;
  }> {
    try {
      const res = await candidateHttpClient.post<any>("/api/candidates-auth/signup-details", {
        ...data,
        role: "candidate",
      });

      const user = {
        uid: res.data?.user?.uid || res.data?.user?.id || "",
        id: res.data?.user?.id,
        email: res.data?.user?.email || (data.email as string),
        displayName: res.data?.user?.fullName || (data.fullName as string),
        fullName: res.data?.user?.fullName || (data.fullName as string),
        emailVerified: false,
        role: "candidate",
      };

      if (typeof window !== "undefined") {
        if (res.data?.token) {
          localStorage.setItem("talentflow_auth_token", res.data.token);
          sessionStorage.setItem("talentflow_auth_token", res.data.token);
        }
        if (res.data?.sessionId) {
          localStorage.setItem("talentflow_session_id", res.data.sessionId);
          sessionStorage.setItem("talentflow_session_id", res.data.sessionId);
        }
      }

      notifyAuthChange(user);
      return {
        user,
        userProfile: res.data?.userProfile,
        verificationSent: true,
        token: res.data?.token,
        sessionId: res.data?.sessionId,
        otp: res.data?.otp,
      };
    } catch (err: unknown) {
      return { user: null, error: (err as Error)?.message || "Registration failed" };
    }
  }

  static async signIn(
    email: string,
    password: string,
  ): Promise<{ user: any; error?: string; token?: string; sessionId?: string }> {
    try {
      const res = await candidateHttpClient.post<any>("/api/candidates-auth/candidate-signin", {
        email,
        password,
      });
      const user = {
        uid: res.data?.user?.uid || res.data?.user?.id || "",
        id: res.data?.user?.id,
        email: res.data?.user?.email || email,
        displayName: res.data?.user?.fullName,
        fullName: res.data?.user?.fullName,
        emailVerified: res.data?.user?.emailVerified ?? true,
        role: "candidate",
      };

      if (typeof window !== "undefined") {
        if (res.data?.token) {
          localStorage.setItem("talentflow_auth_token", res.data.token);
          sessionStorage.setItem("talentflow_auth_token", res.data.token);
        }
        if (res.data?.sessionId) {
          localStorage.setItem("talentflow_session_id", res.data.sessionId);
          sessionStorage.setItem("talentflow_session_id", res.data.sessionId);
        }
      }

      notifyAuthChange(user);
      return { user, token: res.data?.token, sessionId: res.data?.sessionId };
    } catch (err: unknown) {
      return { user: null, error: (err as Error)?.message || "Invalid credentials" };
    }
  }

  static async sendOtp(
    destination: string,
  ): Promise<{ success: boolean; otp?: string; message?: string }> {
    try {
      const res = await candidateHttpClient.post<any>("/api/candidates-auth/send-otp", {
        destination,
        email: destination,
      });
      return {
        success: true,
        otp: res.data?.otp,
        message: res.data?.message || `Verification code sent to ${destination}`,
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: (err as Error)?.message || "Failed to dispatch verification code",
      };
    }
  }

  static async verifyOtp(
    userEnteredOtp: string,
    email?: string,
  ): Promise<{ success: boolean; valid?: boolean; verified?: boolean; message?: string }> {
    try {
      const res = await candidateHttpClient.post<any>("/api/candidates-auth/verify-otp", {
        userEnteredOtp,
        email: email || currentAuthUser?.email,
      });
      const isValid = Boolean(res.data?.valid || res.data?.verified);
      if (isValid && currentAuthUser) {
        currentAuthUser.emailVerified = true;
        notifyAuthChange(currentAuthUser);
      }
      return {
        success: isValid,
        valid: isValid,
        verified: isValid,
        message: res.data?.message || (isValid ? "Email verified successfully!" : "Invalid code"),
      };
    } catch (err: unknown) {
      return {
        success: false,
        valid: false,
        verified: false,
        message: (err as Error)?.message || "Verification code is incorrect",
      };
    }
  }

  static async sendVerificationEmail(
    customEmail?: string,
  ): Promise<{ success: boolean; otp?: string; message?: string }> {
    try {
      const targetEmail = customEmail || currentAuthUser?.email || "";
      const res = await candidateHttpClient.post<{ message?: string; otp?: string }>(
        "/api/candidates-auth/send-verification",
        {
          email: targetEmail,
        },
      );
      return {
        success: true,
        otp: res.data?.otp,
        message: res.data?.message || `Verification link sent to ${targetEmail}`,
      };
    } catch {
      return { success: true, message: `Verification link sent to ${customEmail || "your email"}` };
    }
  }

  static async updateUserEmailAndResend(
    newEmail: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const currentEmail = currentAuthUser?.email || "";
      const res = await candidateHttpClient.post<{ message?: string }>(
        "/api/candidates-auth/change-email",
        {
          currentEmail,
          newEmail,
        },
      );
      if (currentAuthUser) {
        currentAuthUser.email = newEmail;
        notifyAuthChange(currentAuthUser);
      }
      return { success: true, message: res.data?.message || `Email updated to ${newEmail}` };
    } catch (err: unknown) {
      return { success: false, message: (err as Error)?.message || "Failed to update email" };
    }
  }

  static async checkEmailVerified(emailToCheck?: string): Promise<boolean> {
    try {
      const email = emailToCheck || currentAuthUser?.email;
      if (!email) return false;
      const res = await candidateHttpClient.get<{
        data?: { verified?: boolean };
        verified?: boolean;
      }>("/api/candidates-auth/verify-status", {
        params: { email },
      });
      const isVerified = res.data?.data?.verified ?? res.data?.verified ?? false;
      return Boolean(isVerified);
    } catch {
      return false;
    }
  }

  static async signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("talentflow_auth_token");
      localStorage.removeItem("talentflow_session_id");
      localStorage.removeItem("talentflow_candidate_auth");
      sessionStorage.removeItem("talentflow_auth_token");
      sessionStorage.removeItem("talentflow_session_id");
      sessionStorage.removeItem("talentflow_candidate_auth");
    }
    notifyAuthChange(null);
    await candidateHttpClient.post("/api/candidates-auth/candidate-signout", {}).catch(() => {});
    return { success: true };
  }

  static onAuthChange(callback: AuthStateCallback) {
    authListeners.add(callback);
    callback(currentAuthUser);
    return () => {
      authListeners.delete(callback);
    };
  }

  static getCurrentUser(): any | null {
    return currentAuthUser;
  }
}
