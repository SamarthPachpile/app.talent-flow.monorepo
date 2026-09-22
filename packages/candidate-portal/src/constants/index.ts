/**
 * Candidate Portal Constants
 * Re-exports shared candidate constants, text constants, and provides package-specific constant mappings.
 */

export * from "./text.constants";
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

import { CANDIDATE_TEXT_CONSTANTS } from "./text.constants";

export const CANDIDATE_CONSTANTS = CANDIDATE_TEXT_CONSTANTS;

export default CANDIDATE_CONSTANTS;
