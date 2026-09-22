/**
 * Graviton IT Solutions Platform Constants
 * Re-exports shared corporate marketing constants, text constants, and provides package-specific constant mappings.
 */

export * from "./text.constants";
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

import { GRAVITON_TEXT_CONSTANTS } from "./text.constants";

export const GRAVITON_CONSTANTS = GRAVITON_TEXT_CONSTANTS;

export default GRAVITON_CONSTANTS;
