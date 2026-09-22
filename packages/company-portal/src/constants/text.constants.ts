/**
 * Company Onboarding & Employer Portal Text Constants
 * Package-level text constants for employer workspace, wizard, pipeline Kanban, and ATS management.
 */

import {
  COMPANY_PORTAL_TEXTS,
  COMMON_BRANDING,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_VALIDATION_MESSAGES,
  COMMON_NOTIFICATIONS,
} from "@talent-flow/api";

export const COMPANY_TEXT_CONSTANTS = {
  ...COMPANY_PORTAL_TEXTS,
  branding: COMMON_BRANDING,
  actions: COMMON_ACTIONS,
  status: COMMON_STATUS,
  validation: COMMON_VALIDATION_MESSAGES,
  notifications: COMMON_NOTIFICATIONS,
  toasts: {
    welcome: "Welcome to your Employer Workspace.",
    signedOut: "Signed out of company workspace.",
    workspaceCreated: "Enterprise workspace configured successfully!",
    candidateStageUpdated: "Candidate stage updated on pipeline.",
    offerGenerated: "Offer letter generated and sent to candidate.",
    integrationConnected: "ATS connector synchronized successfully.",
    settingsSaved: "Company settings and branding saved.",
  },
  dialogs: {
    createJobTitle: "Create New Job Opening",
    sendOfferTitle: "Issue Formal Offer Package",
    inviteTeamMemberTitle: "Invite HR Team Member to Workspace",
    deleteCandidateConfirm: "Confirm Candidate Rejection & Archive",
  },
} as const;

export default COMPANY_TEXT_CONSTANTS;
