/**
 * Shared Monorepo Common Constants & Texts
 * Centralized source of truth for global branding, actions, statuses, and generic UI copy.
 */

export const COMMON_BRANDING = {
  appName: "TalentFlow Hub",
  companyName: "Graviton IT Solutions",
  platformTagline: "Next-Generation Enterprise Talent & Workspace Management Suite",
  poweredBy: "Powered by Graviton IT Solutions & TalentFlow Monorepo",
  copyright: `© ${new Date().getFullYear()} Graviton IT Solutions. All rights reserved.`,
  supportEmail: "support@gravitonitsolutions.com",
  adminEmail: "admin@talentflow.internal",
  helpdeskUrl: "https://support.gravitonitsolutions.com",
  documentationUrl: "https://docs.gravitonitsolutions.com",
  privacyPolicyUrl: "/privacy",
  termsOfServiceUrl: "/terms",
} as const;

export const COMMON_PORTALS = {
  graviton: {
    id: "graviton-it-solutions",
    name: "Graviton IT Solutions",
    description: "Corporate Marketing, Consulting, Services & Careers Platform",
    path: "/",
  },
  candidate: {
    id: "candidate-portal",
    name: "Candidate Portal",
    description: "Personalized Candidate Onboarding Roadmap & Status Tracking",
    path: "/candidates-portal",
  },
  company: {
    id: "company-onboarding",
    name: "Employer Workspace",
    description: "Enterprise Company Onboarding, HR ATS & Pipeline Management",
    path: "/companies",
  },
  admin: {
    id: "admin-panel",
    name: "Super Admin Suite",
    description: "Monorepo Governance, Multi-Tenant Audits & Platform Operations",
    path: "/admin-panel",
  },
} as const;

export const COMMON_ACTIONS = {
  save: "Save Changes",
  saving: "Saving...",
  saved: "Saved Successfully",
  cancel: "Cancel",
  submit: "Submit",
  submitting: "Submitting...",
  submitted: "Submitted",
  confirm: "Confirm",
  delete: "Delete",
  deleting: "Deleting...",
  edit: "Edit",
  update: "Update",
  create: "Create",
  back: "Back",
  next: "Next Step",
  continue: "Continue",
  done: "Done",
  close: "Close",
  filter: "Filter",
  search: "Search",
  reset: "Reset Filters",
  refresh: "Refresh",
  download: "Download",
  downloading: "Downloading...",
  upload: "Upload File",
  uploading: "Uploading...",
  signIn: "Sign In",
  signUp: "Sign Up",
  signOut: "Sign Out",
  logOut: "Log Out",
  loggingOut: "Logging out...",
  retry: "Try Again",
  viewDetails: "View Details",
  manage: "Manage",
  explore: "Explore",
  applyNow: "Apply Now",
  getStarted: "Get Started",
  learnMore: "Learn More",
  switchCompany: "Switch Company",
  switchPortal: "Switch Portal",
  copyLink: "Copy Link",
  linkCopied: "Link Copied!",
} as const;

export const COMMON_STATUS = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  inProgress: "In Progress",
  completed: "Completed",
  approved: "Approved",
  rejected: "Rejected",
  underReview: "Under Review",
  draft: "Draft",
  scheduled: "Scheduled",
  verified: "Verified",
  unverified: "Unverified",
  failed: "Failed",
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Information",
} as const;

export const COMMON_VALIDATION_MESSAGES = {
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Please enter a valid phone number with country code",
  passwordTooShort: "Password must be at least 8 characters long",
  passwordsMismatch: "Passwords do not match",
  acceptTermsRequired: "You must accept the Terms of Service & Privacy Policy to proceed",
  turnstileRequired: "Please complete the bot verification check",
  networkError: "Network connectivity issue. Please check your connection and retry.",
  unauthorized: "You do not have permission to access this resource.",
  sessionExpired: "Your session has expired. Please sign in again.",
  unknownError: "An unexpected error occurred. Please try again.",
} as const;

export const COMMON_NOTIFICATIONS = {
  changesSaved: "All changes have been saved successfully.",
  accountCreated: "Account created successfully! Welcome aboard.",
  signedIn: "Signed in successfully.",
  signedOut: "You have been signed out.",
  fileUploaded: "File uploaded successfully.",
  actionFailed: "Operation could not be completed. Please try again.",
} as const;
