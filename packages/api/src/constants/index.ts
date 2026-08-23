/**
 * TalentFlow Monorepo Central Constants Index
 * Aggregates and exports all structured constant texts across all packages in the ecosystem.
 */

export * from "./common";
export * from "./candidate";
export * from "./company";
export * from "./admin";
export * from "./graviton";
export * from "./signupOptions";

import {
  COMMON_BRANDING,
  COMMON_PORTALS,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_NOTIFICATIONS,
} from "./common";
import { CANDIDATE_PORTAL_TEXTS } from "./candidate";
import { COMPANY_PORTAL_TEXTS } from "./company";
import { ADMIN_PORTAL_TEXTS } from "./admin";
import { GRAVITON_PORTAL_TEXTS } from "./graviton";
import {
  COUNTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from "./signupOptions";

export const APP_CONSTANTS = {
  common: {
    branding: COMMON_BRANDING,
    portals: COMMON_PORTALS,
    actions: COMMON_ACTIONS,
    status: COMMON_STATUS,
    notifications: COMMON_NOTIFICATIONS,
  },
  candidate: CANDIDATE_PORTAL_TEXTS,
  company: COMPANY_PORTAL_TEXTS,
  admin: ADMIN_PORTAL_TEXTS,
  graviton: GRAVITON_PORTAL_TEXTS,
  options: {
    countries: COUNTRY_OPTIONS,
    companySizes: COMPANY_SIZE_OPTIONS,
    industries: INDUSTRY_OPTIONS,
    referralSources: REFERRAL_SOURCE_OPTIONS,
  },
} as const;

export default APP_CONSTANTS;
