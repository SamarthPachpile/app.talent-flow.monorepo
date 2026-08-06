import { createFileRoute } from "@tanstack/react-router";
import { AutomationSettings } from "@/components/pages/settings-automation-page";

export const Route = createFileRoute("/admin-panel/settings/automation")({
  component: AutomationSettings,
});
