import React from "react";
import { OnboardingState } from "../types/onboarding";
import { CompanyPipelineBoard, Candidate } from "./CompanyPipelineBoard";
import { ConnectorsHub } from "./ConnectorsHub";
import { CompanyOverview } from "./CompanyOverview";
import { CompanySettingsComponent as CompanyProfileSettings } from "./CompanySettings";
import { TeamManagement } from "./TeamManagement";

interface CompanyDashboardProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  candidates: Candidate[];
  onAdvanceCandidate: (id: string) => void;
  onFetchConnectorCandidates: (source: "LinkedIn" | "Google Sheets") => void;
  interactionsLog: { id: string; at: string; actor: string; action: string; channel: string }[];
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  state,
  setState,
  candidates,
  onAdvanceCandidate,
  onFetchConnectorCandidates,
  interactionsLog,
  activeSubTab = "pipeline",
  onSelectSubTab,
}) => {
  const currentSubTab = activeSubTab;

  const handleSubTabChange = (tab: string) => {
    if (onSelectSubTab) {
      onSelectSubTab(tab);
    }
  };

  return (
    <div className="mx-auto py-6 px-6 space-y-6 animate-fadeIn font-sans">
      {/* Main Tab Content */}
      <main>
        {currentSubTab === "pipeline" && (
          <CompanyPipelineBoard
            companyName={state.profile.name}
            candidates={candidates}
            onAdvanceCandidate={onAdvanceCandidate}
            workflowStages={state.recruitmentWorkflow}
          />
        )}

        {currentSubTab === "connectors" && (
          <ConnectorsHub
            onFetchCandidates={onFetchConnectorCandidates}
            interactionsCount={
              interactionsLog.filter(
                (l) => l.channel === "LinkedIn" || l.channel === "Google Sheets",
              ).length
            }
          />
        )}

        {currentSubTab === "interactions" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 font-sans">
            <h2 className="text-xl font-display text-foreground">
              Candidate Interactions Audit Feed
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time audit log of all candidate stage advances, connector imports, and recruiter
              actions for {state.profile.name}.
            </p>

            <div className="overflow-x-auto mt-4 border border-border rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface border-b border-border text-muted-foreground font-semibold uppercase text-10px">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor / Recruiter</th>
                    <th className="p-3">Action Description</th>
                    <th className="p-3">Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {interactionsLog.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-3 text-muted-foreground font-mono text-11px">{log.at}</td>
                      <td className="p-3 font-medium text-foreground">{log.actor}</td>
                      <td className="p-3 text-foreground">{log.action}</td>
                      <td className="p-3">
                        <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-10px font-medium">
                          {log.channel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentSubTab === "overview" && (
          <CompanyOverview state={state} setActiveTab={(tab) => handleSubTabChange(tab)} />
        )}

        {currentSubTab === "team" && <TeamManagement state={state} setState={setState} />}

        {currentSubTab === "settings" && (
          <CompanyProfileSettings state={state} setState={setState} />
        )}
      </main>
    </div>
  );
};
