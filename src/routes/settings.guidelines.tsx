import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PHASES } from "@/lib/ats-data";
import { SettingsCard } from "@/components/settings/settings-card";

export const Route = createFileRoute("/settings/guidelines")({
  head: () => ({
    meta: [
      { title: "Guidelines — How the Hiring Panel Works" },
      {
        name: "description",
        content:
          "Step-by-step guide to the hiring panel: the daily recruiter flow, the seven phases and 28 micro-stages, and the rules every user should follow.",
      },
      { property: "og:title", content: "Guidelines — How the Hiring Panel Works" },
      {
        property: "og:description",
        content: "The daily flow, the 28 micro-stages and the house rules for the hiring panel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Guidelines,
});

const FLOW = [
  {
    title: "1 · Applications land on the board",
    body: "Every application creates a candidate card in the Intake phase. Resumes are parsed and duplicates flagged automatically, so you start with clean data.",
  },
  {
    title: "2 · Assign and screen",
    body: "Pick up unassigned cards, open the drawer and review the parsed profile. Move the card to Screening Complete once you've had the call, then shortlist or regret.",
  },
  {
    title: "3 · Interview",
    body: "Request slots, send the invite and let the reminder automation handle the chasing. After the session, make sure the scorecard is submitted before you advance the stage.",
  },
  {
    title: "4 · Approvals and offer",
    body: "Hiring manager approves first, then HR. Only then does the offer get generated and sent. Track view and acceptance events straight on the card.",
  },
  {
    title: "5 · Verification and onboarding",
    body: "Request documents, verify them, then hand over to HR Ops for asset allocation, account creation and the employee record.",
  },
];

const RULES = [
  "Advance the stage only when the real-world action has actually happened — the board is the source of truth.",
  "Never email candidates outside the panel; use templates so history and merge data stay intact.",
  "Anything red on a card is blocked and past its SLA — clear those first each morning.",
  "Write feedback in the scorecard, not in notes, so approvals have an audit trail.",
  "Rejections always go through a template, at the earliest honest moment.",
];

function Guidelines() {
  return (
    <div className="space-y-6">
      <SettingsCard
        icon={BookOpen}
        title="How the panel works"
        description="The daily flow, start to finish."
      >
        <ol className="space-y-5">
          {FLOW.map((s) => (
            <li key={s.title}>
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </SettingsCard>

      <SettingsCard
        title="The seven phases"
        description="28 micro-stages, grouped. Each column on the pipeline board is one phase."
      >
        <ul className="space-y-4">
          {PHASES.map((p) => (
            <li key={p.id}>
              <p className="text-sm font-medium text-foreground">{p.label}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.stages.map((s) => (
                  <Badge key={s} variant="outline" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </SettingsCard>

      <SettingsCard title="House rules" description="Keep the pipeline trustworthy.">
        <ul className="space-y-2.5">
          {RULES.map((r) => (
            <li key={r} className="flex gap-3 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="max-w-2xl leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      </SettingsCard>
    </div>
  );
}
