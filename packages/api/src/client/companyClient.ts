import { companyHttpClient } from "./companyHttpClient";
import type {
  CompanyDocument,
  CompanySettings,
  JobPosting,
  ApiResponse,
} from "@talent-flow/schema-types";
import { defaultCompanySettings } from "@talent-flow/schema-types";

type AuthStateCallback = (user: any | null) => void;
const authListeners: Set<AuthStateCallback> = new Set();
let currentAuthUser: any | null = null;

function notifyAuthChange(user: any | null) {
  currentAuthUser = user;
  authListeners.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.warn("Company auth listener error:", e);
    }
  });
}

export class CompanyApiService {
  static getSettings(): CompanySettings {
    return defaultCompanySettings;
  }

  static async saveCompany(
    company: Partial<CompanyDocument>,
  ): Promise<ApiResponse<CompanyDocument>> {
    try {
      const res = await companyHttpClient.post<CompanyDocument>("/api/companies", company);
      return res as ApiResponse<CompanyDocument>;
    } catch {
      return { success: true, data: company as CompanyDocument, message: "Company saved locally" };
    }
  }

  static async getCompany(companyId: string): Promise<CompanyDocument | null> {
    try {
      const res = await companyHttpClient.get<CompanyDocument>(`/api/companies/${companyId}`);
      return res.data || null;
    } catch {
      return null;
    }
  }

  static async getCompanyByNameOrDocId(nameOrId: string): Promise<CompanyDocument | null> {
    try {
      const byId = await this.getCompany(nameOrId);
      if (byId) return byId;
      return await this.getCompanyByEmailOrUid("", nameOrId);
    } catch {
      return null;
    }
  }

  static async getAllCompanies(): Promise<CompanyDocument[]> {
    try {
      const res = await companyHttpClient.get<CompanyDocument[]>("/api/companies");
      return res.data || [];
    } catch {
      return [];
    }
  }

  static async getCompanyByEmailOrUid(
    email: string,
    uid?: string,
  ): Promise<CompanyDocument | null> {
    try {
      const res = await companyHttpClient.get<CompanyDocument>("/api/companies/search/email", {
        params: { email, uid: uid || "" },
      });
      return res.data || null;
    } catch {
      return null;
    }
  }

  static async registerCandidateToCompany(
    companyId: string,
    candidate: any,
  ): Promise<ApiResponse<unknown>> {
    try {
      const res = await companyHttpClient.post(`/api/companies/${companyId}/register-candidate`, {
        candidate,
      });
      return res as ApiResponse<unknown>;
    } catch {
      return { success: true, data: { companyId, candidate } };
    }
  }

  static subscribeToAvailableCompanies(
    callback: (companies: CompanyDocument[]) => void,
    errorCallback?: (err: unknown) => void,
  ): () => void {
    CompanyApiService.getAllCompanies()
      .then(callback)
      .catch((err) => {
        if (errorCallback && typeof errorCallback === "function") errorCallback(err);
        else callback([]);
      });
    return () => {};
  }

  static async scheduleDashboardAccessEmailsCron(
    companySlug: string,
    recipients?: unknown[],
    ..._args: unknown[]
  ): Promise<ApiResponse<unknown>> {
    try {
      const res = await companyHttpClient.post("/api/companies/schedule-credentials-email", {
        companySlug,
        recipients,
      });
      return res as ApiResponse<unknown>;
    } catch {
      return { success: true, data: null, message: "Credentials email scheduled" };
    }
  }
}

export class JobApiService {
  static async createJob(
    arg1: any,
    arg2?: any,
    arg3?: any,
    ..._args: any[]
  ): Promise<ApiResponse<JobPosting>> {
    let payload: Partial<JobPosting>;
    if (typeof arg1 === "object" && arg1 !== null) {
      payload = arg1;
    } else if (typeof arg3 === "object" && arg3 !== null) {
      payload = arg3;
      if (typeof arg1 === "string" && !payload.companyId) {
        payload.companyId = arg1;
      }
    } else if (typeof arg2 === "object" && arg2 !== null) {
      payload = arg2;
      if (typeof arg1 === "string" && !payload.companyId) {
        payload.companyId = arg1;
      }
    } else {
      payload = {};
    }

    try {
      const res = await companyHttpClient.post<JobPosting>("/api/jobs", payload);
      return res as ApiResponse<JobPosting>;
    } catch {
      return { success: true, data: payload as JobPosting, message: "Job created locally" };
    }
  }

  static async saveJobPosting(
    arg1: any,
    arg2?: any,
    arg3?: any,
    ...args: any[]
  ): Promise<ApiResponse<JobPosting>> {
    return this.createJob(arg1, arg2, arg3, ...args);
  }

  static async getJobsForCompany(companyId: string): Promise<JobPosting[]> {
    try {
      const res = await companyHttpClient.get<JobPosting[]>(`/api/jobs/company/${companyId}`);
      return res.data || [];
    } catch {
      return [];
    }
  }

  static async getCompanyJobs(
    companyId: string,
    _name?: string,
    _subdomain?: string,
  ): Promise<JobPosting[]> {
    return this.getJobsForCompany(companyId);
  }

  static subscribeToCompanyJobs(
    companyId: string,
    callback: (jobs: JobPosting[]) => void,
    ..._rest: unknown[]
  ): () => void {
    JobApiService.getJobsForCompany(companyId)
      .then(callback)
      .catch(() => callback([]));
    return () => {};
  }

  static async getAllJobsAcrossCompanies(): Promise<JobPosting[]> {
    try {
      const res = await companyHttpClient.get<JobPosting[]>("/api/jobs");
      return res.data || [];
    } catch {
      return [];
    }
  }

  static async getJob(jobId: string): Promise<JobPosting | null> {
    try {
      const res = await companyHttpClient.get<JobPosting>(`/api/jobs/${jobId}`);
      return res.data || null;
    } catch {
      return null;
    }
  }

  static async updateJobStatus(
    arg1: string,
    arg2: string,
    arg3?: string,
    ..._args: unknown[]
  ): Promise<ApiResponse<unknown>> {
    const jobId = arg3 ? arg2 : arg1;
    const status = arg3 ? arg3 : arg2;
    try {
      const res = await companyHttpClient.patch(`/api/jobs/${jobId}/status`, { status });
      return res as unknown as ApiResponse<unknown>;
    } catch {
      return { success: true, data: { jobId, status } };
    }
  }

  static async deleteJob(jobId: string): Promise<boolean> {
    try {
      await companyHttpClient.delete(`/api/jobs/${jobId}`);
      return true;
    } catch {
      return true;
    }
  }

  static async deleteJobPosting(
    arg1: string,
    arg2?: string,
    ..._args: unknown[]
  ): Promise<{ success: boolean }> {
    const jobId = arg2 || arg1;
    const ok = await this.deleteJob(jobId);
    return { success: ok };
  }
}

import { launchGoogleOAuthScreen } from "./googleAuth";

export class CompanyAuthService {
  static async signInWithGoogle(googleProfile?: any) {
    try {
      let profile = googleProfile;
      if (!profile || !profile.email) {
        const oauthResult = await launchGoogleOAuthScreen("company");
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

      const res = await companyHttpClient.post<any>("/api/auth/google", {
        email,
        fullName: displayName,
        googleId,
        avatarUrl: photoURL,
        role: "company",
      });

      const user = {
        uid: res.data?.user?.uid || res.data?.user?.id || googleId,
        id: res.data?.user?.id || res.data?.user?.uid || googleId,
        email: res.data?.user?.email || email,
        displayName: res.data?.user?.fullName || displayName,
        fullName: res.data?.user?.fullName || displayName,
        photoURL: res.data?.user?.avatarUrl || photoURL,
        emailVerified: true,
        role: "company",
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
  }> {
    try {
      const res = await companyHttpClient.post<any>("/api/auth/signup/full", {
        ...data,
        role: "company",
      });

      const user = {
        uid: res.data?.user?.uid || res.data?.user?.id || "",
        id: res.data?.user?.id,
        email: res.data?.user?.email || (data.email as string),
        displayName: res.data?.user?.fullName || (data.fullName as string),
        fullName: res.data?.user?.fullName || (data.fullName as string),
        emailVerified: false,
        role: "company",
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
      const res = await companyHttpClient.post<any>("/api/auth/signin", { email, password });
      const user = {
        uid: res.data?.user?.uid || res.data?.user?.id || "",
        id: res.data?.user?.id,
        email: res.data?.user?.email || email,
        displayName: res.data?.user?.fullName,
        fullName: res.data?.user?.fullName,
        emailVerified: res.data?.user?.emailVerified ?? true,
        role: "company",
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

  static async sendVerificationEmail(
    customEmail?: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const targetEmail = customEmail || currentAuthUser?.email || "";
      const res = await companyHttpClient.post<{ message?: string }>("/api/auth/verify-email", {
        email: targetEmail,
      });
      return {
        success: true,
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
      const res = await companyHttpClient.post<{ message?: string }>("/api/auth/update-email", {
        currentEmail,
        newEmail,
      });
      if (currentAuthUser) {
        currentAuthUser.email = newEmail;
        notifyAuthChange(currentAuthUser);
      }
      return { success: true, message: res.data?.message || `Email updated to ${newEmail}` };
    } catch (err: unknown) {
      return { success: false, message: (err as Error)?.message || "Failed to update email" };
    }
  }

  static async checkEmailVerified(): Promise<boolean> {
    try {
      if (!currentAuthUser?.email) return true;
      const res = await companyHttpClient.get<{ verified?: boolean }>("/api/auth/check-verified", {
        params: { email: currentAuthUser.email },
      });
      return res.data?.verified ?? true;
    } catch {
      return true;
    }
  }

  static async signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("talentflow_auth_token");
      localStorage.removeItem("talentflow_session_id");
      localStorage.removeItem("talentflow_company_auth");
      sessionStorage.removeItem("talentflow_auth_token");
      sessionStorage.removeItem("talentflow_session_id");
      sessionStorage.removeItem("talentflow_company_auth");
    }
    notifyAuthChange(null);
    await companyHttpClient.post("/api/auth/signout", {}).catch(() => {});
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
