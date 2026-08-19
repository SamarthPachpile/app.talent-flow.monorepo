import { App as CompanyOnboardingApp } from "@talent-flow/company-onboarding";
import { App as CandidatePortalApp } from "@talent-flow/candidate-portal";

interface EcosystemPortalWrapperProps {
  routePath?: string;
}

export function EcosystemPortalWrapper({ routePath }: EcosystemPortalWrapperProps) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : routePath || "";

  if (currentPath.startsWith("/companies") || currentPath.startsWith("/company")) {
    return <CompanyOnboardingApp />;
  }
  if (
    currentPath.startsWith("/candidates") ||
    currentPath.startsWith("/candidate-portal") ||
    currentPath.startsWith("/candidates-portal")
  ) {
    return <CandidatePortalApp />;
  }
  return null;
}
