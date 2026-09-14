/**
 * Utility functions for cross-portal navigation and domain resolution.
 * Strictly uses environment variables (VITE_ADMIN_DOMAIN_URL, etc.) to redirect
 * to dedicated portal domains without injecting extra routing prefixes.
 */

function getEnvVar(key: string): string | undefined {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return String(import.meta.env[key]);
    }
  } catch {
    // Ignore
  }

  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return String(process.env[key]);
  }

  return undefined;
}

function isProduction(): boolean {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && Boolean(import.meta.env?.PROD)) {
      return true;
    }
  } catch {
    // Ignore
  }

  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    return true;
  }

  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return true;
  }

  return false;
}

export function getLandingDomainUrl(): string {
  const envUrl =
    getEnvVar("VITE_LANDING_DOMAIN_URL") ||
    getEnvVar("LANDING_DOMAIN_URL") ||
    getEnvVar("GRAVITON_DOMAIN_URL") ||
    getEnvVar("CLIENT_DOMAIN_URL");
  if (envUrl) return envUrl.replace(/\/+$/, "");

  return isProduction()
    ? "https://app-talent-flow-monorepo-graviton-i.vercel.app"
    : "http://localhost:3000";
}

export function getAdminDomainUrl(): string {
  const envUrl = getEnvVar("VITE_ADMIN_DOMAIN_URL") || getEnvVar("ADMIN_DOMAIN_URL");
  if (envUrl) return envUrl.replace(/\/+$/, "");

  return isProduction()
    ? "https://app-talent-flow-monorepo-admin-pane.vercel.app"
    : "http://localhost:3001";
}

export function getCompanyDomainUrl(): string {
  const envUrl = getEnvVar("VITE_COMPANY_DOMAIN_URL") || getEnvVar("COMPANY_DOMAIN_URL");
  if (envUrl) return envUrl.replace(/\/+$/, "");

  return isProduction()
    ? "https://app-talent-flow-monorepo-company-po.vercel.app"
    : "http://localhost:3002";
}

export function getCandidateDomainUrl(): string {
  const envUrl = getEnvVar("VITE_CANDIDATE_DOMAIN_URL") || getEnvVar("CANDIDATE_DOMAIN_URL");
  if (envUrl) return envUrl.replace(/\/+$/, "");

  return isProduction()
    ? "https://app-talent-flow-monorepo-candidate.vercel.app"
    : "http://localhost:3003";
}

export type PortalType = "admin" | "company" | "candidate" | "landing";

export function getPortalUrl(portal: PortalType, path: string = "/"): string {
  let baseDomain = "";
  switch (portal) {
    case "admin":
      baseDomain = getAdminDomainUrl();
      break;
    case "company":
      baseDomain = getCompanyDomainUrl();
      break;
    case "candidate":
      baseDomain = getCandidateDomainUrl();
      break;
    case "landing":
    default:
      baseDomain = getLandingDomainUrl();
      break;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseDomain}${cleanPath === "/" ? "" : cleanPath}`;
}

export function redirectToPortal(portal: PortalType, path: string = "/"): void {
  if (typeof window !== "undefined") {
    window.location.href = getPortalUrl(portal, path);
  }
}
