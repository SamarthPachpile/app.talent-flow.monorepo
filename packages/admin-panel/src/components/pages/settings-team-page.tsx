import { useState } from "react";
import { Users, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SettingsCard } from "@/components/settings/settings-card";

export function TeamSettings() {
  const [members, setMembers] = useState([
    {
      id: "1",
      name: "System Operator",
      email: "admin@talentflow.io",
      role: "Super Admin",
      status: "Active",
    },
    {
      id: "2",
      name: "Sarah Jenkins",
      email: "sarah@acmecorp.com",
      role: "Company Admin",
      status: "Active",
    },
    {
      id: "3",
      name: "Dan Whitfield",
      email: "dan.w@talentflow.io",
      role: "Recruiter",
      status: "Active",
    },
  ]);

  const [newEmail, setNewEmail] = useState("");

  const handleInvite = () => {
    if (!newEmail) return;
    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: newEmail.split("@")[0],
        email: newEmail,
        role: "Recruiter",
        status: "Invited",
      },
    ]);
    toast.success(`Invite sent to ${newEmail}`);
    setNewEmail("");
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <SettingsCard
        icon={Users}
        title="Admin Team & Access Management"
        description="Manage admin operators, recruiters, and role-based permissions."
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="operator@company.com"
              className="bg-surface text-xs"
            />
            <Button
              onClick={handleInvite}
              className="bg-ember hover:bg-ember/90 text-ember-foreground text-xs gap-1.5 shrink-0"
            >
              <UserPlus className="size-3.5" /> Invite Member
            </Button>
          </div>

          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden mt-4">
            {members.map((m) => (
              <div key={m.id} className="p-3.5 bg-surface flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{m.name}</p>
                  <p className="text-11px text-muted-foreground">{m.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-10px">
                    {m.role}
                  </Badge>
                  <Badge className="bg-success/15 text-success border border-success/30 text-10px">
                    {m.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
