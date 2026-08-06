import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRedirectComponent,
});

function DashboardRedirectComponent() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isCandAuth = !!localStorage.getItem("talentflow_candidate_auth");
      const isCompAuth = localStorage.getItem("talentflow_company_auth") === "true";

      if (isCandAuth) {
        window.location.replace("/candidates-portal/dashboard");
      } else if (isCompAuth) {
        window.location.replace("/companies/dashboard");
      } else {
        window.location.replace("/admin-panel/dashboard");
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin size-8 border-4 border-ember border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
