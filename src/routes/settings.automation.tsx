import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AUTOMATION_RULES } from "@/lib/settings-data";
import { SettingsCard } from "@/components/settings/settings-card";

export const Route = createFileRoute("/settings/automation")({
  head: () => ({
    meta: [
      { title: "Stage Automation — Hiring Workspace Settings" },
      {
        name: "description",
        content:
          "Turn stage-triggered automations on or off: acknowledgement emails, recruiter assignment, interview reminders and document chasers.",
      },
      { property: "og:title", content: "Stage Automation — Hiring Workspace Settings" },
      {
        property: "og:description",
        content: "When a candidate hits a stage, the workspace acts automatically.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AutomationSettings,
});

function AutomationSettings() {
  const [rules, setRules] = useState(AUTOMATION_RULES);

  return (
    <SettingsCard
      icon={Zap}
      title="Stage automation"
      description="When a candidate reaches a stage, the workspace performs the action automatically."
    >
      <ul className="divide-y divide-border">
        {rules.map((rule) => (
          <li key={rule.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                When · {rule.when}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{rule.then}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{rule.channel}</Badge>
                <Badge variant="outline">{rule.delay}</Badge>
              </div>
            </div>
            <Switch
              checked={rule.active}
              aria-label={`Toggle ${rule.then}`}
              onCheckedChange={(v) =>
                setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, active: v } : r)))
              }
            />
          </li>
        ))}
      </ul>
    </SettingsCard>
  );
}
