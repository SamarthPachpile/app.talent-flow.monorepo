export interface FirebaseAppConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseBackendStatus {
  initialized: boolean;
  connected: boolean;
  projectId: string;
  authStatus: "ready" | "unauthenticated" | "authenticating";
  firestoreStatus: "active" | "offline" | "connecting";
  lastPing: string;
}

export interface CountryDetails {
  name: string;
  code: string;
  phonePrefix: string;
  timezone: string;
  currency: string;
  compliance: string;
  payroll: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  companyName?: string;
  phone: string;
  country: string;
  timezone: string;
  currency: string;
  compliance: string;
  payroll: string;
  companySize: string;
  industry: string;
  referralSource?: string;
  termsAccepted: boolean;
  captchaVerified: boolean;
  emailVerified?: boolean;
}

// ---------------------------
// ADMIN PANEL BACKEND TYPES
// ---------------------------

export interface PlatformAdminSettings {
  systemName: string;
  environment: "production" | "staging" | "development";
  supportEmail: string;
  maintenanceMode: boolean;
  globalBrandingTitle: string;
  maxTenantQuota: number;
  defaultSeatLimit: number;
  sessionTimeoutMinutes: number;
  mfaRequired: boolean;
  ipWhitelistEnabled: boolean;
  allowedIpRanges: string;
  auditLogRetentionDays: number;
  featureFlags: {
    enableAts: boolean;
    enableScheduler: boolean;
    enableCandidatePortal: boolean;
    enableAssetManagement: boolean;
    enableESignature: boolean;
    enableAutomationEngine: boolean;
  };
}

export interface SystemHealthMetric {
  id: string;
  service: string;
  status: "healthy" | "warning" | "degraded";
  latencyMs: number;
  uptime: string;
  lastChecked: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  status: "success" | "failure";
  ipAddress: string;
}

// ---------------------------
// COMPANY ONBOARDING & RECRUITMENT TYPES
// ---------------------------

export interface CompanyProfileSettings {
  companyName: string;
  subdomain: string;
  domain: string;
  industry: string;
  size: string;
  logoUrl?: string;
  brandColor: string;
  headquarters: string;
  senderAddress: string;
  emailSignature: string;
}

export interface HiringDefaultsSettings {
  defaultInterviewDuration: string; // e.g. "45"
  workingHours: string; // e.g. "9-18"
  offerExpiryDays: string; // e.g. "7"
  stageSlaWarningHours: string; // e.g. "48"
}

export interface CompanyNotificationSettings {
  stageChangeDigest: boolean;
  blockedCandidateAlerts: boolean;
  interviewFeedbackChase: boolean;
  offerActivityAlerts: boolean;
}

export interface DataComplianceSettings {
  duplicateDetection: boolean;
  anonymousScreening: boolean;
  dataRetentionMonths: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: "Screening" | "Interview" | "Offer" | "Onboarding" | "Rejection";
  trigger: string;
  subject: string;
  body: string;
  active: boolean;
  updated: string;
}

export interface AutomationRule {
  id: string;
  when: string;
  then: string;
  channel: "Email" | "SMS" | "In-app" | "Slack";
  delay: string;
  active: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "Hiring Manager" | "Interviewer" | "HR Ops";
  status: "Active" | "Invited";
}

export interface CompanySettings {
  profile: CompanyProfileSettings;
  hiringDefaults: HiringDefaultsSettings;
  notifications: CompanyNotificationSettings;
  compliance: DataComplianceSettings;
  templates: EmailTemplate[];
  automations: AutomationRule[];
  team: TeamMember[];
}

// ---------------------------
// CANDIDATE PORTAL BACKEND TYPES
// ---------------------------

export interface CandidateProfileSettings {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  headline: string;
  bio: string;
}

export interface CandidateNotificationSettings {
  emailStageUpdates: boolean;
  emailInterviewInvites: boolean;
  smsReminders: boolean;
  weeklyJobMatches: boolean;
}

export interface CandidatePrivacySettings {
  openToWork: boolean;
  publicProfile: boolean;
  anonymousScreeningOptIn: boolean;
  allowTalentPoolSearch: boolean;
}

export interface CandidateDocumentSettings {
  primaryResumeName: string;
  primaryResumeUrl?: string;
  autoAttachCoverLetter: boolean;
  portfolioUrl: string;
}

export interface CandidateAccountSettings {
  mfaEnabled: boolean;
  passwordLastChanged: string;
  connectedAccounts: {
    google: boolean;
    github: boolean;
    linkedin: boolean;
  };
}

export interface CandidateSettings {
  profile: CandidateProfileSettings;
  notifications: CandidateNotificationSettings;
  privacy: CandidatePrivacySettings;
  documents: CandidateDocumentSettings;
  account: CandidateAccountSettings;
}

// ---------------------------
// GENERIC API RESPONSE
// ---------------------------

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
