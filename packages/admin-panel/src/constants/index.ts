/**
 * Super Admin Panel Constants
 * Re-exports shared admin constants and provides package-specific constant mappings.
 */

export {
  COMMON_BRANDING,
  COMMON_PORTALS,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_VALIDATION_MESSAGES,
  COMMON_NOTIFICATIONS,
  ADMIN_PORTAL_TEXTS,
  COUNTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from "@talent-flow/api";

import { ADMIN_PORTAL_TEXTS, COMMON_BRANDING, COMMON_ACTIONS } from "@talent-flow/api";

export const ADMIN_CONSTANTS = {
  ...ADMIN_PORTAL_TEXTS,
  branding: COMMON_BRANDING,
  actions: COMMON_ACTIONS,
} as const;

export default ADMIN_CONSTANTS;
