/**
 * Graviton IT Solutions Platform Constants
 * Re-exports shared corporate marketing constants and provides package-specific constant mappings.
 */

export {
  COMMON_BRANDING,
  COMMON_PORTALS,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_VALIDATION_MESSAGES,
  COMMON_NOTIFICATIONS,
  GRAVITON_PORTAL_TEXTS,
  CANDIDATE_PORTAL_TEXTS,
  COMPANY_PORTAL_TEXTS,
  ADMIN_PORTAL_TEXTS,
  COUNTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from "@talent-flow/api";

import { GRAVITON_PORTAL_TEXTS, COMMON_BRANDING, COMMON_ACTIONS } from "@talent-flow/api";

export const GRAVITON_CONSTANTS = {
  ...GRAVITON_PORTAL_TEXTS,
  branding: COMMON_BRANDING,
  actions: COMMON_ACTIONS,
} as const;

export default GRAVITON_CONSTANTS;
