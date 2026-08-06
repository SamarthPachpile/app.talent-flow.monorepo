import { createFileRoute } from "@tanstack/react-router";
import { AdminHomePage } from "@/components/admin-home-page";

export const Route = createFileRoute("/admin-panel/")({
  head: () => ({
    meta: [
      { title: "TalentFlow Admin Suite — Home Portfolio" },
      { name: "description", content: "Centralized ATS governance and multi-tenant CRM engine." },
    ],
  }),
  component: AdminHomePage,
});
