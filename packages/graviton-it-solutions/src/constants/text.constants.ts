/**
 * Graviton IT Solutions Platform Text Constants
 * Package-level text constants for corporate marketing, HR CRM solution pages, careers, and contact forms.
 */

import {
  GRAVITON_PORTAL_TEXTS,
  CANDIDATE_PORTAL_TEXTS,
  COMPANY_PORTAL_TEXTS,
  ADMIN_PORTAL_TEXTS,
  COMMON_BRANDING,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_VALIDATION_MESSAGES,
  COMMON_NOTIFICATIONS,
} from "@talent-flow/api";

export const GRAVITON_TEXT_CONSTANTS = {
  ...GRAVITON_PORTAL_TEXTS,
  branding: COMMON_BRANDING,
  actions: COMMON_ACTIONS,
  status: COMMON_STATUS,
  validation: COMMON_VALIDATION_MESSAGES,
  notifications: COMMON_NOTIFICATIONS,
  ecosystemPortals: {
    candidate: CANDIDATE_PORTAL_TEXTS.meta,
    company: COMPANY_PORTAL_TEXTS.meta,
    admin: ADMIN_PORTAL_TEXTS.meta,
  },
  contact: {
    title: "Connect with Our Enterprise HR CRM Specialists",
    subtitle:
      "Request a customized platform demo, explore enterprise multi-tenant licensing, or consult with our HR software architects.",
    form: {
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. David Miller",
      email: "Business Work Email",
      emailPlaceholder: "david@enterprise.com",
      company: "Company / Organization",
      companyPlaceholder: "Acme Corp",
      serviceInterest: "Solution Interest",
      message: "Project Requirements / Message",
      messagePlaceholder: "Describe your hiring challenges, team size, and timeline...",
      submitButton: "Send Inquiry & Request Demo",
    },
    successMessage:
      "Thank you for contacting Graviton IT Solutions. Our enterprise team will respond within 24 business hours.",
  },
} as const;

export default GRAVITON_TEXT_CONSTANTS;
