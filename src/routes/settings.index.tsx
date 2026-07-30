import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SettingsCard, SettingsRow } from "@/components/settings/settings-card";

export const Route = createFileRoute("/settings/")({
  head: () => ({
    meta: [
      { title: "General Settings — Hiring Workspace" },
      {
        name: "description",
        content:
          "Configure organisation details, hiring defaults, working hours and notification preferences for your recruitment workspace.",
      },
      { property: "og:title", content: "General Settings — Hiring Workspace" },
      {
        property: "og:description",
        content: "Organisation profile, hiring defaults, SLA timers and notification preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeneralSettings,
});

function GeneralSettings() {
  const [company, setCompany] = useState("Northwind Technologies");
  const [sender, setSender] = useState("talent@northwind.co");
  const [signature, setSignature] = useState(
    "Northwind Technologies · 14 Harbour Street, Bristol\nQuestions? Just reply to this email.",
  );

  return (
    <div className="space-y-6">
      <SettingsCard
        icon={Building2}
        title="Organisation"
        description="Shown on candidate-facing emails, offer letters and the candidate portal."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company name</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender">Sending address</Label>
            <Input id="sender" value={sender} onChange={(e) => setSender(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="signature">Email footer / signature</Label>
            <Textarea
              id="signature"
              rows={3}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Clock}
        title="Hiring defaults"
        description="Applied to every new requisition unless overridden."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Default interview duration</Label>
            <Select defaultValue="45">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["30", "45", "60", "90"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Working hours</Label>
            <Select defaultValue="9-18">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9-17">09:00 – 17:00</SelectItem>
                <SelectItem value="9-18">09:00 – 18:00</SelectItem>
                <SelectItem value="10-19">10:00 – 19:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Offer expiry</Label>
            <Select defaultValue="7">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["3", "5", "7", "14"].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Stage SLA breach warning</Label>
            <Select defaultValue="48">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["24", "48", "72"].map((h) => (
                  <SelectItem key={h} value={h}>
                    After {h} hours
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Notifications"
        description="Who gets pinged, and when, as candidates move through the 28 micro-stages."
      >
        <div className="divide-y divide-border">
          <SettingsRow
            title="Stage change digest"
            description="Daily summary of every candidate that moved stage."
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            title="Blocked candidate alerts"
            description="Alert the recruiter when a candidate stalls past the SLA."
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            title="Interview feedback chase"
            description="Nudge interviewers who haven't submitted scorecards."
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            title="Offer activity"
            description="Notify HR when an offer is viewed, accepted or declined."
          >
            <Switch />
          </SettingsRow>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Data & compliance"
        description="Retention and privacy behaviour for candidate records."
      >
        <div className="divide-y divide-border">
          <SettingsRow
            title="Duplicate detection"
            description="Flag re-applications from the same email or phone number."
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            title="Anonymous screening"
            description="Hide name, photo and gender during the screening phase."
          >
            <Switch />
          </SettingsRow>
          <SettingsRow
            title="Candidate data retention"
            description="Automatically purge rejected candidate data after this period."
          >
            <Select defaultValue="12">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["6", "12", "24"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m} months
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Settings saved")}>
          <Save className="size-4" /> Save changes
        </Button>
      </div>
    </div>
  );
}
