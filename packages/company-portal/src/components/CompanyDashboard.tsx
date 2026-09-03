import React from "react";
import { OnboardingState } from "../types/onboarding";
import { Candidate } from "./CompanyPipelineBoard";
import { CompanyDashboardLayout } from "./CompanyDashboardLayout";

interface CompanyDashboardProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  candidates: Candidate[];
  onAdvanceCandidate: (id: string) => void;
  onFetchConnectorCandidates: (source: "LinkedIn" | "Google Sheets") => void;
  interactionsLog: { id: string; at: string; actor: string; action: string; channel: string }[];
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  onLogout?: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  state,
  setState,
  candidates,
  onAdvanceCandidate,
  onFetchConnectorCandidates,
  interactionsLog,
  activeSubTab = "dashboard",
  onSelectSubTab,
  onLogout,
}) => {
  return (
    <CompanyDashboardLayout
      state={state}
      setState={setState}
      candidates={candidates}
      onAdvanceCandidate={onAdvanceCandidate}
      onFetchConnectorCandidates={onFetchConnectorCandidates}
      interactionsLog={interactionsLog}
      activeSubTab={activeSubTab}
      onSelectSubTab={onSelectSubTab}
      onLogout={onLogout}
    />
  );
};
