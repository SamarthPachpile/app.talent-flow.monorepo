/**
 * Candidate Portal Text Constants
 * Package-level text constants for candidate onboarding, roadmap, hardware selection, and profile settings.
 */

import {
  CANDIDATE_PORTAL_TEXTS,
  COMMON_BRANDING,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_VALIDATION_MESSAGES,
  COMMON_NOTIFICATIONS,
} from "@talent-flow/api";

export const CANDIDATE_TEXT_CONSTANTS = {
  ...CANDIDATE_PORTAL_TEXTS,
  branding: COMMON_BRANDING,
  actions: COMMON_ACTIONS,
  status: COMMON_STATUS,
  validation: COMMON_VALIDATION_MESSAGES,
  notifications: COMMON_NOTIFICATIONS,
  toasts: {
    welcome: "Welcome! You are now logged in to the Candidate Dashboard.",
    signedOut: "Signed out of candidate portal",
    offerAccepted: "Offer contract e-signed successfully!",
    hardwareConfirmed: "Hardware choices confirmed & order dispatched to IT!",
    profileSaved: "Candidate profile details saved successfully to database.",
    avatarUpdated: "Candidate avatar updated successfully.",
    companyNotFound: "Requested employer portal not found.",
  },
  dialogs: {
    confirmSignOffer: "Confirm Electronic Signature for Employment Agreement",
    confirmHardwareOrder: "Confirm Workstation Hardware Allocation",
    requestDataExport: "Request Personal Candidate Data Export (GDPR)",
  },
} as const;

export default CANDIDATE_TEXT_CONSTANTS;
