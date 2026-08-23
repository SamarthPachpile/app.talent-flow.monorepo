import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-panel/")({
  beforeLoad: () => {
    const isAuth = typeof window !== "undefined" && !!localStorage.getItem("talentflow_admin_auth");

    if (isAuth) {
      throw redirect({ to: "/admin-panel/dashboard" });
    } else {
      throw redirect({ to: "/admin-panel/login" });
    }
  },
});
