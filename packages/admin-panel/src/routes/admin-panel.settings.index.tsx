import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingsPage } from "@/components/pages/settings-index-page";

export const Route = createFileRoute("/admin-panel/settings/")({
  head: () => ({
    meta: [{ title: "Platform Admin Settings — Admin Panel" }],
  }),
  component: AdminSettingsPage,
});
