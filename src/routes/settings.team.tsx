import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_PERMISSIONS, TEAM } from "@/lib/settings-data";
import { SettingsCard } from "@/components/settings/settings-card";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/team")({
  head: () => ({
    meta: [
      { title: "Team & Roles — Hiring Workspace Settings" },
      {
        name: "description",
        content:
          "Manage recruiters, hiring managers, interviewers and HR ops, and see exactly what each role can do in the hiring pipeline.",
      },
      { property: "og:title", content: "Team & Roles — Hiring Workspace Settings" },
      {
        property: "og:description",
        content: "Role-based access for recruiters, hiring managers, interviewers and HR ops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamSettings,
});

function TeamSettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={Users}
        title="Members"
        description="People with access to this hiring workspace."
        action={
          <Button size="sm" variant="outline" onClick={() => toast("Invite dialog coming soon")}>
            <UserPlus className="size-4" /> Invite
          </Button>
        }
      >
        <ul className="divide-y divide-border">
          {TEAM.map((m) => (
            <li key={m.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="truncate text-sm text-muted-foreground">{m.email}</p>
              </div>
              <Badge variant="secondary">{m.role}</Badge>
              <Badge variant={m.status === "Active" ? "outline" : "default"}>{m.status}</Badge>
            </li>
          ))}
        </ul>
      </SettingsCard>

      <SettingsCard
        icon={ShieldCheck}
        title="Role permissions"
        description="What each role can do across the 28-stage lifecycle."
      >
        <ul className="divide-y divide-border">
          {ROLE_PERMISSIONS.map((r) => (
            <li key={r.role} className="py-3.5 first:pt-0 last:pb-0">
              <p className="text-sm font-medium">{r.role}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {r.can.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </SettingsCard>
    </div>
  );
}
