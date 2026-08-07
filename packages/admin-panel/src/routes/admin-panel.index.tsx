import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-panel/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("talentflow_admin_auth");
    }
    throw redirect({ to: "/admin-panel/login" });
  },
});
