export interface OfficeLocationBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  capacity: number;
}

export interface CompanyProfile {
  name: string;
  legalName: string;
  subdomain: string;
  domain: string;
  industry: string;
  size: string;
  logoUrl: string;
  coverImageUrl: string;
  gstNumber: string;
  panNumber: string;
  cinNumber: string;
  registrationNumber: string;
  website: string;
  linkedin: string;
  about: string;
  yearFounded: string;
  employeeCount: string;
  headOfficeAddress: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  timezone: string;
  businessHours: string;
  brandColor: string;
  headquarters: string;
}

export interface AdminContact {
  fullName: string;
  workEmail: string;
  phone: string;
  jobTitle: string;
  billingEmail: string;
}

export interface SelectedPlan {
  id: "starter" | "growth" | "enterprise";
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  billingCycle: "monthly" | "annually";
  seatLimit: number;
}

export interface EnabledModules {
  ats: boolean;
  interviewScheduler: boolean;
  candidatePortal: boolean;
  onboardingChecklist: boolean;
  itAssetManagement: boolean;
  documentESign: boolean;
  automationEngine: boolean;
}

export interface OfficeLocationsState {
  headOffice: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  branchOffices: OfficeLocationBranch[];
  remoteLocations: {
    enabled: boolean;
    allowedCountries: string[];
  };
  workingHours: string;
  holidayCalendar: string;
}

export interface HRTeamMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  role:
    "HR Admin" | "Recruiter" | "Hiring Manager" | "Finance" | "IT Admin" | "Operations" | string;
  permissions: string[];
  status?: "Pending" | "Active" | "Invited";
}

export interface TeamInvite {
  id: string;
  email: string;
  role: "Admin" | "Hiring Manager" | "Recruiter" | "Interviewer";
  department: string;
  status: "Pending" | "Accepted" | "Sent";
}

export interface RecruitmentStage {
  id: string;
  name: string;
  color: string;
  slaHours?: number;
  description?: string;
}

export interface InterviewSettingsState {
  types: ("Online" | "Offline" | "Hybrid")[];
  platform: "Google Meet" | "Zoom" | "Microsoft Teams" | "Custom";
  customPlatformUrl?: string;
  durationMinutes: string;
  feedbackFormEnabled: boolean;
  scorecardTemplates: string[];
}

export interface EmailConfigState {
  recruitmentEmail: string;
  replyEmail: string;
  careerEmail: string;
  provider: "SMTP" | "Google Workspace" | "Microsoft 365";
  autoEmails: {
    applicationReceived: boolean;
    interviewInvite: boolean;
    rejectionNotice: boolean;
    offerReleased: boolean;
  };
}

export interface CareerPortalState {
  url: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  bannerUrl: string;
  aboutCompany: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    glassdoor: string;
    instagram: string;
  };
  applicationFormFields: {
    requireCoverLetter: boolean;
    requirePortfolio: boolean;
    requireNoticePeriod: boolean;
    requireCurrentCtc: boolean;
    requireExpectedCtc: boolean;
  };
  privacyPolicy: string;
  terms: string;
}

export interface NotificationPreferencesState {
  channels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  events: {
    applicationSubmitted: boolean;
    interviewScheduled: boolean;
    interviewReminder: boolean;
    offerReleased: boolean;
    documentsPending: boolean;
    joiningReminder: boolean;
    laptopReady: boolean;
  };
}

export interface ApprovalMatrixState {
  jobApproval: { approverRole: string; requiredCount: number };
  interviewApproval: { approverRole: string; requiredCount: number };
  offerApproval: { approverRole: string; requiredCount: number };
  salaryApproval: { approverRole: string; requiredCount: number };
  laptopApproval: { approverRole: string; requiredCount: number };
  joiningApproval: { approverRole: string; requiredCount: number };
}

export interface SystemMetadataState {
  companyId: string;
  workspaceId: string;
  tenantId: string;
  subscriptionPlan: string;
  trialStartDate: string;
  trialEndDate: string;
  accountStatus: "Trial" | "Active" | "Suspended";
  companySlug: string;
  verifiedDomainStatus: "Verified" | "Pending";
  emailVerificationStatus: boolean;
  phoneVerificationStatus: boolean;
  primaryAdminUserId: string;
  workspaceCreationTimestamp: string;
  lastLoginTimestamp: string;
  lastActivityTimestamp: string;
  ipAddress: string;
  defaultTimezone: string;
  defaultCurrency: string;
  defaultLanguage: string;
  featureFlags: Record<string, boolean>;
  auditLogInitialized: boolean;
  apiKey: string;
  defaultRoleTemplates: Record<string, string[]>;
}

export interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;

  // Wizard Step 1 - Company Profile
  profile: CompanyProfile;

  // Admin Info
  admin: AdminContact;

  // Subscription Plan
  plan: SelectedPlan;

  // Modules
  modules: EnabledModules;

  // Wizard Step 2 - Office Locations
  officeLocations: OfficeLocationsState;

  // Wizard Step 3 - HR Team
  hrTeam: HRTeamMember[];

  // Legacy team invites reference
  teamInvites: TeamInvite[];

  // Wizard Step 4 - Departments
  departments: string[];

  // Wizard Step 5 - Job Titles
  jobTitles: string[];

  // Wizard Step 6 - Recruitment Workflow
  recruitmentWorkflow: RecruitmentStage[];

  // Wizard Step 7 - Candidate Documents
  candidateDocuments: Record<string, { enabled: boolean; required: boolean }>;

  // Wizard Step 8 - Interview Settings
  interviewSettings: InterviewSettingsState;

  // Wizard Step 9 - Email Configuration
  emailConfig: EmailConfigState;

  // Wizard Step 10 - Career Portal
  careerPortal: CareerPortalState;

  // Wizard Step 11 - Candidate Experience
  candidateExperience: Record<string, boolean>;

  // Wizard Step 12 - IT Setup
  itSetup: Record<string, boolean>;

  // Wizard Step 13 - Notification Preferences
  notificationPreferences: NotificationPreferencesState;

  // Wizard Step 14 - Approval Matrix
  approvalMatrix: ApprovalMatrixState;

  // Wizard Step 15 - Integrations
  integrations: Record<string, boolean>;

  // Wizard Step 16 - Invite Remaining Users
  userInvitations: {
    bulkEmails: string;
    csvFile: string | null;
    invitesSent: boolean;
    sentInvitesList: Array<{ email: string; role: string; department: string; sentAt: string }>;
  };

  // Automatically Captured Metadata
  systemMetadata: SystemMetadataState;
}
