import { createFileRoute } from "@tanstack/react-router";
import { TeamSettings } from "@/components/pages/settings-team-page";

export const Route = createFileRoute("/admin-panel/settings/team")({
  component: TeamSettings,
});
