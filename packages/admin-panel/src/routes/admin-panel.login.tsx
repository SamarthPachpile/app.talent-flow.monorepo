import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginPage } from "@/components/admin-login-page";

export const Route = createFileRoute("/admin-panel/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — TalentFlow Admin Suite" },
      {
        name: "description",
        content: "Sign in to access the Admin CRM Global Pipeline Dashboard.",
      },
    ],
  }),
  component: AdminLoginPage,
});
