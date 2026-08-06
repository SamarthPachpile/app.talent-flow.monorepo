import { useState } from "react";
import { BookOpen, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SettingsCard } from "@/components/settings/settings-card";

export function GuidelinesSettings() {
  const [hiringGuidelines, setHiringGuidelines] = useState(
    "1. All candidates must complete screening prior to Hiring Manager review.\n2. E-signatures on offers are legally binding.\n3. IT hardware dispatch requires address verification.",
  );

  const handleSave = () => {
    toast.success("Recruitment guidelines updated for all recruiters!");
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <SettingsCard
        icon={BookOpen}
        title="Enterprise Hiring & Compliance Guidelines"
        description="Standard operating procedures rendered across recruiter and manager dashboards."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1.5">
              Global Recruiter Policy Document
            </label>
            <Textarea
              rows={6}
              value={hiringGuidelines}
              onChange={(e) => setHiringGuidelines(e.target.value)}
              className="bg-surface font-mono text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-ember hover:bg-ember/90 text-ember-foreground text-xs gap-1.5"
            >
              <CheckCircle2 className="size-3.5" /> Save Compliance Guidelines
            </Button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
