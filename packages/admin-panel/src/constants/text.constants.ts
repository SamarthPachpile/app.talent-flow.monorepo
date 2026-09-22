/**
 * Super Admin Panel Text Constants
 * Package-level text constants for admin suite UI, tables, modals, and governance actions.
 */

import {
  ADMIN_PORTAL_TEXTS,
  COMMON_BRANDING,
  COMMON_ACTIONS,
  COMMON_STATUS,
} from "@talent-flow/api";

export const ADMIN_TEXT_CONSTANTS = {
  ...ADMIN_PORTAL_TEXTS,
  branding: COMMON_BRANDING,
  actions: COMMON_ACTIONS,
  status: COMMON_STATUS,
  dialogs: {
    deleteCompanyConfirmTitle: "Confirm Company Workspace Deletion",
    deleteCompanyConfirmMessage:
      "Are you sure you want to permanently delete this company workspace? All active candidate records, job postings, and offer letters will be erased.",
    approveOfferTitle: "Approve Offer Letter Exception",
    rejectOfferTitle: "Reject Offer Request",
    syncDragonflyTitle: "Trigger Dragonfly Manual Cache Re-sync",
  },
  toasts: {
    companyCreated: "New enterprise workspace onboarded successfully.",
    companyUpdated: "Enterprise workspace settings saved.",
    companyDeleted: "Enterprise workspace deleted.",
    approvalGranted: "Executive approval granted for candidate offer.",
    approvalRejected: "Candidate offer request rejected.",
    settingsSaved: "Platform governance settings saved successfully.",
    dragonflySynced: "Dragonfly cache refreshed from primary database.",
  },
} as const;

export default ADMIN_TEXT_CONSTANTS;
