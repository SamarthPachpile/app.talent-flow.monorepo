import { createFileRoute } from "@tanstack/react-router";
import { GuidelinesSettings } from "@/components/pages/settings-guidelines-page";

export const Route = createFileRoute("/admin-panel/settings/guidelines")({
  component: GuidelinesSettings,
});
