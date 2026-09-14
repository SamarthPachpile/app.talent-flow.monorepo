import { useEffect } from "react";
import { getCompanyDomainUrl, getCandidateDomainUrl } from "@talent-flow/utilities";

interface EcosystemPortalWrapperProps {
  routePath?: string;
}

export function EcosystemPortalWrapper({ routePath }: EcosystemPortalWrapperProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const search = window.location.search || "";

      if (currentPath.startsWith("/companies") || currentPath.startsWith("/company")) {
        const subpath = currentPath.replace(/^\/(companies|company)/, "") || "/";
        const target = `${getCompanyDomainUrl()}${subpath === "/" ? "" : subpath}${search}`;
        window.location.replace(target);
      } else if (
        currentPath.startsWith("/candidates") ||
        currentPath.startsWith("/candidate-portal") ||
        currentPath.startsWith("/candidates-portal")
      ) {
        const subpath =
          currentPath.replace(/^\/(candidates-portal|candidate-portal|candidates)/, "") || "/";
        const target = `${getCandidateDomainUrl()}${subpath === "/" ? "" : subpath}${search}`;
        window.location.replace(target);
      }
    }
  }, [routePath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
      <div className="text-center space-y-3">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Redirecting to dedicated portal...</p>
      </div>
    </div>
  );
}
