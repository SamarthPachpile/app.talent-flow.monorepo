/**
 * Consolidated Text Constants for Schema Types
 * Central repository for all ecosystem texts, UI copy, and notification messages.
 */

export * from "./common";
export * from "./candidate";
export * from "./company";
export * from "./admin";
export * from "./graviton";

import {
  COMMON_BRANDING,
  COMMON_PORTALS,
  COMMON_ACTIONS,
  COMMON_STATUS,
  COMMON_VALIDATION_MESSAGES,
  COMMON_NOTIFICATIONS,
} from "./common";
import { CANDIDATE_PORTAL_TEXTS } from "./candidate";
import { COMPANY_PORTAL_TEXTS } from "./company";
import { ADMIN_PORTAL_TEXTS } from "./admin";
import { GRAVITON_PORTAL_TEXTS } from "./graviton";

export const TEXT_CONSTANTS = {
  branding: COMMON_BRANDING,
  portals: COMMON_PORTALS,
  actions: COMMON_ACTIONS,
  status: COMMON_STATUS,
  validation: COMMON_VALIDATION_MESSAGES,
  notifications: COMMON_NOTIFICATIONS,
  candidate: CANDIDATE_PORTAL_TEXTS,
  company: COMPANY_PORTAL_TEXTS,
  admin: ADMIN_PORTAL_TEXTS,
  graviton: GRAVITON_PORTAL_TEXTS,
} as const;

export default TEXT_CONSTANTS;
