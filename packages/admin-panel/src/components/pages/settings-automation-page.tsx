import { useState } from "react";
import { Zap, BellRing, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingsCard } from "@/components/settings/settings-card";

export function AutomationSettings() {
  const [autoInvites, setAutoInvites] = useState(true);
  const [reminderEngine, setReminderEngine] = useState(true);
  const [duplicateCheck, setDuplicateCheck] = useState(true);
  const [autoEmailNotify, setAutoEmailNotify] = useState(true);

  const handleSave = () => {
    toast.success("Automation engine rules updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <SettingsCard
        icon={Zap}
        title="CRM Automation Rules & Trigger Engine"
        description="Automate 28 micro-stage transitions, calendar invites, and candidate email notifications."
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface">
            <div>
              <p className="font-semibold text-foreground">Auto-Send Google Calendar Invites</p>
              <p className="text-[11px] text-muted-foreground">
                Automatically trigger Google Meet calendar invites upon interview scheduling.
              </p>
            </div>
            <Switch checked={autoInvites} onCheckedChange={setAutoInvites} />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface">
            <div>
              <p className="font-semibold text-foreground">Interview Reminder Ping Engine</p>
              <p className="text-[11px] text-muted-foreground">
                Send automated email & SMS reminders 24h before scheduled interviews.
              </p>
            </div>
            <Switch checked={reminderEngine} onCheckedChange={setReminderEngine} />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface">
            <div>
              <p className="font-semibold text-foreground">Duplicate Candidate Detector</p>
              <p className="text-[11px] text-muted-foreground">
                Flag matching candidate emails or phone numbers across company workspaces.
              </p>
            </div>
            <Switch checked={duplicateCheck} onCheckedChange={setDuplicateCheck} />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface">
            <div>
              <p className="font-semibold text-foreground">Stage Transition Email Notifications</p>
              <p className="text-[11px] text-muted-foreground">
                Notify candidate via email when advanced to Offer, IT Hardware, or Day One.
              </p>
            </div>
            <Switch checked={autoEmailNotify} onCheckedChange={setAutoEmailNotify} />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-ember hover:bg-ember/90 text-ember-foreground text-xs gap-1.5"
            >
              <CheckCircle2 className="size-3.5" /> Save Automation Settings
            </Button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
