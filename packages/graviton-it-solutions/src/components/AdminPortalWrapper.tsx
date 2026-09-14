import { useEffect } from "react";
import { getAdminDomainUrl } from "@talent-flow/utilities";

export function AdminPortalWrapper() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const subpath = window.location.pathname.replace(/^\/admin-panel/, "") || "/";
      const search = window.location.search || "";
      const target = `${getAdminDomainUrl()}${subpath === "/" ? "" : subpath}${search}`;
      window.location.replace(target);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
      <div className="text-center space-y-3">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Redirecting to Admin Portal...</p>
      </div>
    </div>
  );
}
