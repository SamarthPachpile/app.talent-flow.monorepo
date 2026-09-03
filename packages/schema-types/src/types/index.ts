export interface MongoDbConfig {
  uri: string;
  database: string;
  user: string;
  host?: string;
  port?: number;
}

export interface BackendStatus {
  initialized?: boolean;
  connected?: boolean;
  engine: string;
  database: string;
  authStatus: string;
  dbStatus?: string;
  version?: string;
  lastPing?: string;
  lastSync?: string;
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
  defaultInterviewDuration: string;
  workingHours: string;
  offerExpiryDays: string;
  stageSlaWarningHours: string;
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

export interface CandidateProfileSettings {
  id?: string;
  fullName: string;
  preferredName?: string;
  headline?: string;
  currentLocation?: string;
  location?: string;
  phone?: string;
  email?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  bio?: string;
}

export interface CandidateNotificationSettings {
  emailStageUpdates?: boolean;
  emailInterviewInvites?: boolean;
  smsReminders?: boolean;
  weeklyJobMatches?: boolean;
  jobAlertsDigest?: string;
  applicationStatusAlerts?: boolean;
  interviewReminders?: boolean;
  marketingEmails?: boolean;
  smsAlerts?: boolean;
}

export interface CandidatePrivacySettings {
  openToWork?: boolean;
  publicProfile?: boolean;
  anonymousScreeningOptIn?: boolean;
  allowTalentPoolSearch?: boolean;
  profileVisibility?: string;
  hideFromCurrentEmployer?: boolean;
  showSalaryExpectations?: boolean;
  allowDirectMessages?: boolean;
  anonymizeResume?: boolean;
}

export interface CandidatePreferencesSettings {
  preferredRoles?: string[];
  workTypes?: string[];
  workModes?: string[];
  preferredLocations?: string[];
  minimumSalary?: number;
  expectedSalary?: number;
  currency?: string;
  noticePeriodWeeks?: number;
  readyToRelocate?: boolean;
}

export interface CandidateDocumentSettings {
  primaryResumeName?: string;
  primaryResumeUrl?: string;
  autoAttachCoverLetter?: boolean;
  portfolioUrl?: string;
  defaultResumeName?: string;
  autoAttachResume?: boolean;
  customDocuments?: Array<{ id: string; name: string; url: string; uploadDate: string }>;
}

export interface CandidateAccountSettings {
  mfaEnabled: boolean;
  passwordLastChanged: string;
  connectedAccounts?: {
    google?: boolean;
    github?: boolean;
    linkedin?: boolean;
  };
}

export interface CandidateSettings {
  profile: CandidateProfileSettings;
  privacy: CandidatePrivacySettings;
  preferences?: CandidatePreferencesSettings;
  notifications: CandidateNotificationSettings;
  documents: CandidateDocumentSettings;
  account: CandidateAccountSettings;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface AmountPair {
  monthly: number;
  annual: number;
}

export interface CtcComponentItem {
  monthly: number;
  annual: number;
}

export interface CtcBreakdown {
  currency: string;
  totalCtc: number;
  baseSalary: number;
  fixedCompensation: {
    basic: AmountPair;
    retainingAllowance?: AmountPair;
    houseRentAllowance: AmountPair;
    specialAllowance: AmountPair;
    totalFixedCompensation: AmountPair;
    totFixedCompInput?: AmountPair;
  };
  retiralBenefits: {
    employerPfContribution: AmountPair;
    gratuity: AmountPair;
    totalRetiralBenefits: AmountPair;
  };
  fixedCtc: AmountPair;
  variablePay: {
    performanceIncentive: AmountPair;
    totalVariables: AmountPair;
  };
  totalCostToCompany: AmountPair;
}

export interface JobPosting {
  id: string;
  jobCode?: string;
  companyId?: string;
  companyName?: string;
  subdomain?: string;
  title: string;
  department?: string;
  location?: string;
  country?: string;
  workMode?: "Remote" | "Hybrid" | "Onsite" | string;
  workplaceType?: "Remote" | "Hybrid" | "On-site" | string | any;
  employmentType?:
    "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance" | string | any;
  experienceLevel?:
    "Mid Level" | "Senior" | "Entry Level" | "Lead / Staff" | "Director / Executive" | string | any;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  status?:
    | "active"
    | "draft"
    | "closed"
    | "archived"
    | "Active"
    | "Draft"
    | "Closed"
    | "Archived"
    | string;
  ctcBreakdown?: CtcBreakdown;
  minSalary?: number;
  maxSalary?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: "year" | "month" | "hour" | string | any;
  salaryRange?: string;
  salaryCurrency?: string;
  currency?: string;
  priority?: "Low" | "Medium" | "High" | "Urgent" | string | any;
  benefits?: string[];
  niceToHave?: string[];
  hiringManager?: {
    name?: string;
    email?: string;
    designation?: string;
  };
  recruiterEmail?: string;
  applicationDeadline?: string;
  postedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  applicantCount?: number;
  applicantsCount?: number;
  openings?: number;
}

export interface CompanyJobsDocument {
  companyId: string;
  companyName: string;
  jobs: JobPosting[];
  updatedAt?: string;
}

export interface CompanyAdminUser {
  id?: string;
  uid?: string;
  email: string;
  fullName?: string;
  jobTitle?: string;
  billingEmail?: string;
  role?: string;
}

export interface CompanyDocument {
  id: string;
  name: string;
  subdomain: string;
  companyName?: string;
  domain?: string;
  about?: string;
  linkedin?: string;
  termsAccepted?: boolean;
  captchaVerified?: boolean;
  yearFounded?: string;
  employeeCount?: string;
  headOfficeAddress?: string;
  state?: string;
  city?: string;
  pincode?: string;
  zipCode?: string;
  businessHours?: any;
  officeLocations?: any;
  departments?: any;
  jobTitles?: any;
  hrTeam?: any;
  recruitmentWorkflow?: any;
  candidateDocuments?: any;
  interviewSettings?: any;
  emailConfig?: any;
  careerPortal?: any;
  candidateExperience?: any;
  itSetup?: any;
  eSignature?: any;
  candidateHardware?: any;
  welcomeKit?: any;
  plan?: any;
  email?: string;
  industry?: string;
  size?: string;
  brandColor?: string;
  headquarters?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  legalName?: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  registrationNumber?: string;
  timezone?: string;
  currency?: string;
  website?: string;
  description?: string;
  country?: string;
  referralSource?: string;
  modules?: any;
  integrations?: any;
  admin?: {
    fullName?: string;
    workEmail?: string;
    phone?: string;
    avatarUrl?: string;
    uid?: string;
    jobTitle?: string;
    billingEmail?: string;
  };
  teamInvites?: Array<Record<string, unknown>>;
  status?: string;
  isCompleted?: boolean;
  emailVerified?: boolean;
  profile?: CompanyProfileSettings;
  settings?: CompanySettings;
  registeredCandidateIds?: string[];
  stats?: {
    totalCandidates?: number;
    activeJobs?: number;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CandidateDocument {
  id: string;
  uid?: string;
  email: string;
  fullName?: string;
  phone?: string;
  location?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  compliance?: string;
  payroll?: string;
  companySize?: string;
  industry?: string;
  referralSource?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  targetRole?: string;
  experienceYears?: string | number;
  currentStageId?: string;
  roadmapStage?: string;
  status?: string;
  isCompleted?: boolean;
  emailVerified?: boolean;
  termsAccepted?: boolean;
  captchaVerified?: boolean;
  notificationPreferences?: any;
  skills?: string[];
  experience?: any;
  education?: any;
  resumes?: any;
  primaryResumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  companyId?: string;
  registeredCompanyIds?: string[];
  registeredCompanies?: Array<{
    companyId: string;
    companyName?: string;
    registeredAt?: string;
    status?: string;
  }>;
  applications?: any;
  settings?: CandidateSettings;
  hardwarePreferences?: {
    laptop?: string;
    accessories?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SendMemberCredentialsParams {
  companySlug: string;
  recipients: Array<{
    name: string;
    email: string;
    tempPassword?: string;
    role: string;
  }>;
}

export interface SmtpSendResult {
  success: boolean;
  sentCount: number;
  failedCount: number;
  errors?: string[];
  message?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export interface EcosystemHealth {
  status: "operational" | "degraded" | "outage";
  version: string;
  services: {
    database: string;
    cache: string;
    auth: string;
  };
  timestamp: string;
}

export interface ContactLead {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  createdAt?: string;
}
