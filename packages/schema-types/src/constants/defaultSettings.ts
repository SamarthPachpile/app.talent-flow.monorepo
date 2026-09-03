import type { PlatformAdminSettings, CompanySettings, CandidateSettings } from "../types";

export const defaultAdminSettings: PlatformAdminSettings = {
  systemName: "TalentFlow Enterprise Control Hub",
  environment: "production",
  supportEmail: "ops-admin@talentflow.hub",
  maintenanceMode: false,
  globalBrandingTitle: "TalentFlow CRM",
  maxTenantQuota: 50,
  defaultSeatLimit: 25,
  sessionTimeoutMinutes: 60,
  mfaRequired: true,
  ipWhitelistEnabled: false,
  allowedIpRanges: "192.168.1.0/24, 10.0.0.0/16",
  auditLogRetentionDays: 365,
  featureFlags: {
    enableAts: true,
    enableScheduler: true,
    enableCandidatePortal: true,
    enableAssetManagement: true,
    enableESignature: true,
    enableAutomationEngine: true,
  },
};

export const defaultCompanySettings: CompanySettings = {
  profile: {
    companyName: "Acme Innovations",
    subdomain: "acme-innovations",
    domain: "acmeinnovations.com",
    industry: "Technology & Software",
    size: "50-250 Employees",
    brandColor: "#6366f1",
    headquarters: "San Francisco, CA",
    senderAddress: "hiring@acmeinnovations.com",
    emailSignature: "Best regards,\nThe Acme Hiring Team",
  },
  hiringDefaults: {
    defaultInterviewDuration: "45",
    workingHours: "9:00 AM - 6:00 PM PST",
    offerExpiryDays: "7",
    stageSlaWarningHours: "48",
  },
  notifications: {
    stageChangeDigest: true,
    blockedCandidateAlerts: true,
    interviewFeedbackChase: true,
    offerActivityAlerts: true,
  },
  compliance: {
    duplicateDetection: true,
    anonymousScreening: false,
    dataRetentionMonths: "24",
  },
  templates: [],
  automations: [],
  team: [],
};

export const defaultCandidateSettings: CandidateSettings = {
  profile: {
    fullName: "Alex Rivera",
    preferredName: "Alex",
    headline: "Senior Full Stack Engineer",
    currentLocation: "San Francisco, CA",
    phone: "+1 (555) 234-5678",
    email: "alex.rivera@example.com",
    portfolioUrl: "https://alexrivera.dev",
    linkedinUrl: "https://linkedin.com/in/alexrivera",
    githubUrl: "https://github.com/alexrivera",
    bio: "Passionate engineer with 6+ years of experience in distributed systems and React microfrontends.",
  },
  privacy: {
    profileVisibility: "verified_recruiters",
    hideFromCurrentEmployer: true,
    showSalaryExpectations: false,
    allowDirectMessages: true,
    anonymizeResume: false,
  },
  preferences: {
    preferredRoles: ["Senior Frontend Engineer", "Staff Engineer", "Full Stack Lead"],
    workTypes: ["Full-time", "Contract"],
    workModes: ["Remote", "Hybrid"],
    preferredLocations: ["Remote", "San Francisco, CA", "New York, NY"],
    minimumSalary: 140000,
    expectedSalary: 165000,
    currency: "USD",
    noticePeriodWeeks: 2,
    readyToRelocate: false,
  },
  documents: {
    primaryResumeName: "Alex_Rivera_Resume.pdf",
    autoAttachCoverLetter: true,
    portfolioUrl: "https://alexrivera.dev",
  },
  account: {
    mfaEnabled: false,
    passwordLastChanged: "2026-08-15",
  },
  notifications: {
    jobAlertsDigest: "daily",
    applicationStatusAlerts: true,
    interviewReminders: true,
    marketingEmails: false,
    smsAlerts: false,
  },
};
