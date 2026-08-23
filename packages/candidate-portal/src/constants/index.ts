/**
 * Candidate Portal Constants
 * Re-exports shared candidate constants and provides package-specific constant mappings.
 */

export {
  COMMON_BRANDING,
  COMMON_PORTALS,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_VALIDATION_MESSAGES,
  COMMON_NOTIFICATIONS,
  CANDIDATE_PORTAL_TEXTS,
  COUNTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from "@talent-flow/api";

import { CANDIDATE_PORTAL_TEXTS, COMMON_BRANDING, COMMON_ACTIONS } from "@talent-flow/api";

export const CANDIDATE_CONSTANTS = {
  ...CANDIDATE_PORTAL_TEXTS,
  branding: COMMON_BRANDING,
  actions: COMMON_ACTIONS,
} as const;

export default CANDIDATE_CONSTANTS;
