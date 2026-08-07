import { AdminSettingsBackendService } from "./admin/settingsService";
import { CompanySettingsBackendService } from "./companies/settingsService";
import { CandidateSettingsBackendService } from "./candidates/settingsService";
import type {
  PlatformAdminSettings,
  CompanySettings,
  CandidateSettings,
  ApiResponse,
} from "./types";

// Unified Settings Service forwarding to app-specific services
export class SettingsBackendService {
  static async fetchAdminSettings(): Promise<PlatformAdminSettings> {
    return AdminSettingsBackendService.fetchAdminSettings();
  }

  static async saveAdminSettings(
    settings: Partial<PlatformAdminSettings>,
  ): Promise<ApiResponse<PlatformAdminSettings>> {
    return AdminSettingsBackendService.saveAdminSettings(settings);
  }

  static async fetchCompanySettings(): Promise<CompanySettings> {
    return CompanySettingsBackendService.fetchCompanySettings();
  }

  static async saveCompanySettings(
    settings: Partial<CompanySettings>,
  ): Promise<ApiResponse<CompanySettings>> {
    return CompanySettingsBackendService.saveCompanySettings(settings);
  }

  static async fetchCandidateSettings(candidateId = "cand-alex"): Promise<CandidateSettings> {
    return CandidateSettingsBackendService.fetchCandidateSettings(candidateId);
  }

  static async saveCandidateSettings(
    settings: Partial<CandidateSettings>,
    candidateId = "cand-alex",
  ): Promise<ApiResponse<CandidateSettings>> {
    return CandidateSettingsBackendService.saveCandidateSettings(settings, candidateId);
  }
}

// Export App-Specific Portals & Namespaces
export * as adminApi from "./admin";
export * as companyApi from "./companies";
export * as candidateApi from "./candidates";

// Admin API Exports
export {
  AdminApiService,
  AdminSettingsBackendService,
  adminApp,
  adminAuth,
  adminDb,
  adminStorage,
  adminAnalytics,
  initializeAdminFirebase,
  getAdminBackendStatus,
  uploadAdminFileToStorage,
  adminFirebaseConfig,
} from "./admin";

// Company API Exports
export {
  CompanyApiService,
  CompanySettingsBackendService,
  FirebaseAuthService as CompanyAuthService,
  sendMemberCredentialsSmtp,
  getSmtpConfig,
  companyApp,
  companyAuth,
  companyDb,
  companyStorage,
  companyAnalytics,
  initializeCompanyFirebase,
  getCompanyBackendStatus,
  uploadCompanyFileToStorage,
  companyFirebaseConfig,
} from "./companies";
export type {
  CompanyDocument,
  SendMemberCredentialsParams,
  SmtpSendResult,
  SmtpConfig,
} from "./companies";

// Candidate API Exports
export {
  CandidateApiService,
  CandidateSettingsBackendService,
  CandidateAuthService,
  CandidateAuthService as FirebaseAuthService,
  candidateApp,
  candidateAuth,
  candidateDb,
  candidateStorage,
  candidateAnalytics,
  initializeCandidateFirebase,
  getCandidateBackendStatus,
  uploadCandidateFileToStorage,
  candidateFirebaseConfig,
} from "./candidates";
export type { CandidateDocument } from "./candidates";

// Export Root Firebase Instances
export {
  app as firebaseApp,
  auth as firebaseAuth,
  db as firestore,
  storage as firebaseStorage,
  analytics as firebaseAnalytics,
  getBackendStatus,
  initializeFirebase,
  defaultFirebaseConfig,
  uploadFileToStorage,
} from "./firebase";

// Export Domain & API Types and Constants
export * from "./types";
export * from "./constants/signupOptions";
