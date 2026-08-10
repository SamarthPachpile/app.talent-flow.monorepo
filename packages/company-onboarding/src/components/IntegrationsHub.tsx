import React from "react";
import { OnboardingState } from "../types/onboarding";
import { toast } from "sonner";

interface IntegrationsProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
}

export const IntegrationsHub: React.FC<IntegrationsProps> = ({ state, setState }) => {
  const toggle = (key: keyof typeof state.integrations) => {
    setState((prev) => {
      const next = !prev.integrations[key];
      toast.info(`${key} integration ${next ? "enabled" : "disabled"}`);
      return {
        ...prev,
        integrations: { ...prev.integrations, [key]: next },
      };
    });
  };

  const integrationsList = [
    {
      key: "googleWorkspace" as const,
      name: "Google Workspace",
      category: "Calendar & Meet",
      description:
        "Auto-sync interviewer availability and auto-generate Google Meet video links for candidate interviews.",
      status: state.integrations.googleWorkspace,
    },
    {
      key: "slack" as const,
      name: "Slack HR Bot",
      category: "Messaging & Alerts",
      description:
        "Notify recruiters in real-time when new applications arrive or when hiring manager approvals are needed.",
      status: state.integrations.slack,
    },
    {
      key: "msTeams" as const,
      name: "Microsoft Teams",
      category: "Video Conferencing",
      description: "Create MS Teams meeting links for enterprise interviewing pipelines.",
      status: state.integrations.msTeams,
    },
    {
      key: "customSmtp" as const,
      name: "Custom Corporate Email (SMTP)",
      category: "Email Delivery",
      description:
        "Dispatch offer letters, candidate emails, and onboarding reminders directly from your corporate email domain.",
      status: state.integrations.customSmtp,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-6 animate-fadeIn">
      <div>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Connectors & Ecosystem
        </p>
        <h1 className="mt-1 text-4xl leading-none font-display text-foreground">
          Integrations & Connectors Hub
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect your organization's existing tools to streamline candidate scheduling,
          communication, and document workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationsList.map((item) => (
          <div
            key={item.key}
            className={`bg-card p-6 rounded-xl border transition-colors flex flex-col justify-between shadow-sm ${
              item.status ? "border-ember/50 bg-surface/40" : "border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-10px font-semibold text-muted-foreground uppercase tracking-wider bg-surface border border-border px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-display text-foreground mt-2">{item.name}</h3>
                </div>
                <div
                  className={`size-2.5 rounded-full ${item.status ? "bg-success" : "bg-muted-foreground/40"}`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span
                className={`text-xs font-medium ${item.status ? "text-success" : "text-muted-foreground"}`}
              >
                {item.status ? "Connected & Verified" : "Not Configured"}
              </span>
              <button
                onClick={() => toggle(item.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  item.status
                    ? "border border-input bg-background hover:bg-accent text-foreground"
                    : "bg-ember text-ember-foreground hover:bg-ember/90 shadow-sm"
                }`}
              >
                {item.status ? "Disconnect" : "Connect Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
