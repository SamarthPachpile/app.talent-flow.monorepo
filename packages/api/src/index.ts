// Export Firebase instance & backend status
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

// Export Backend Services & APIs
export { AdminApiService } from "./services/adminService";
export { CompanyApiService } from "./services/companyService";
export type { CompanyDocument } from "./services/companyService";
export { CandidateApiService } from "./services/candidateService";
export type { CandidateDocument } from "./services/candidateService";
export { SettingsBackendService } from "./services/settingsService";
export { FirebaseAuthService } from "./services/authService";
export { sendMemberCredentialsSmtp, getSmtpConfig } from "./services/smtpService";
export type {
  SendMemberCredentialsParams,
  SmtpSendResult,
  SmtpConfig,
} from "./services/smtpService";

// Export Domain & API Types
export * from "./types";
export * from "./constants/signupOptions";
