import { useState } from "react";
import { FileText, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SettingsCard } from "@/components/settings/settings-card";

export function TemplatesSettings() {
  const [offerTemplate, setOfferTemplate] = useState(
    "Dear {{candidate_name}},\n\nWe are thrilled to offer you the position of {{role_title}} at {{company_name}}.\n\nBase Salary: {{salary}}\nStart Date: {{start_date}}\n\nPlease review and e-sign this offer contract.",
  );

  const handleSave = () => {
    toast.success("Offer contract template saved!");
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <SettingsCard
        icon={FileText}
        title="Offer Letter & Communication Templates"
        description="Configure default e-signature offer contract templates and dynamic placeholders."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1.5">
              Standard Offer Contract Template
            </label>
            <Textarea
              rows={8}
              value={offerTemplate}
              onChange={(e) => setOfferTemplate(e.target.value)}
              className="bg-surface font-mono text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-ember hover:bg-ember/90 text-ember-foreground text-xs gap-1.5"
            >
              <CheckCircle2 className="size-3.5" /> Save Offer Template
            </Button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
