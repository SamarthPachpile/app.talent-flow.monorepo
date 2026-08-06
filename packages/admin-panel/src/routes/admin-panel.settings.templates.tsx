import { createFileRoute } from "@tanstack/react-router";
import { TemplatesSettings } from "@/components/pages/settings-templates-page";

export const Route = createFileRoute("/admin-panel/settings/templates")({
  component: TemplatesSettings,
});
