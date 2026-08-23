import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/pages/dashboard-page";

export const Route = createFileRoute("/admin-panel/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Panel Dashboard — Global ATS Pipeline Board" },
      { name: "description", content: "Overview of all candidates and client company workspaces." },
    ],
  }),
  component: DashboardPage,
});
