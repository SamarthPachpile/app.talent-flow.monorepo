import React, { useState } from "react";
import {
  Linkedin,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Zap,
  ExternalLink,
  Link2,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ConnectorsHubProps {
  onFetchCandidates: (source: "LinkedIn" | "Google Sheets") => void;
  interactionsCount: number;
}

export const ConnectorsHub: React.FC<ConnectorsHubProps> = ({
  onFetchCandidates,
  interactionsCount,
}) => {
  const [linkedinConnected, setLinkedinConnected] = useState(true);
  const [sheetsConnected, setSheetsConnected] = useState(true);
  const [sheetUrl, setSheetUrl] = useState(
    "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqN567/edit",
  );
  const [lastSyncLinkedIn, setLastSyncLinkedIn] = useState("Just now");
  const [lastSyncSheets, setLastSyncSheets] = useState("10 mins ago");

  const handleToggleLinkedIn = () => {
    const next = !linkedinConnected;
    setLinkedinConnected(next);
    toast.success(
      next ? "LinkedIn Recruiter Connector Enabled" : "LinkedIn Recruiter Connector Disconnected",
    );
  };

  const handleToggleSheets = () => {
    const next = !sheetsConnected;
    setSheetsConnected(next);
    toast.success(
      next
        ? "Google Sheets Candidate Importer Enabled"
        : "Google Sheets Candidate Importer Disconnected",
    );
  };

  const handleTriggerFetchLinkedIn = () => {
    setLastSyncLinkedIn("Just now");
    onFetchCandidates("LinkedIn");
    toast.success("Fetched 2 new candidates from LinkedIn Connector into Pipeline Board!");
  };

  const handleTriggerFetchSheets = () => {
    setLastSyncSheets("Just now");
    onFetchCandidates("Google Sheets");
    toast.success("Imported 2 new candidates from Google Sheet into Pipeline Board!");
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase font-semibold">
            Candidate Connectors & Sourcing
          </p>
          <h1 className="text-3xl font-display text-foreground mt-1">
            Multi-Channel Candidate Connectors
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Connect external sourcing channels to automatically pull candidate applications into
            your 28-stage pipeline board.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-surface border border-border px-3 py-1.5 rounded-lg font-medium text-foreground flex items-center gap-1.5">
            <Zap className="size-3.5 text-ember" />
            <span>
              Total Connector Imports: <strong>{interactionsCount}</strong>
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LinkedIn Candidate Sourcing Connector */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-ember/40 transition-colors">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-blue-600/10 text-blue-600 font-bold">
                  <Linkedin className="size-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl text-foreground">
                    LinkedIn Candidate Connector
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Automated Applicant & Sourcing Sync
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleLinkedIn}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  linkedinConnected
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {linkedinConnected ? "Connected" : "Disabled"}
              </button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Pulls candidate profiles, resume links, and application status directly from LinkedIn
              Recruiter into your intake micro-stages.
            </p>

            <div className="mt-4 space-y-2 bg-surface p-3 rounded-lg border border-border text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Linked Account:</span>
                <span className="font-medium text-foreground">acme-recruiter-pro@linkedin.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sync Status:</span>
                <span className="font-medium text-success flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Active ({lastSyncLinkedIn})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Pipeline Stage:</span>
                <span className="font-mono text-ember font-semibold">
                  Stage 1: Application Received
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground">
              Static Connector (Future API Integration Ready)
            </span>
            <button
              onClick={handleTriggerFetchLinkedIn}
              disabled={!linkedinConnected}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-xs shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Fetch Candidates from LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Google Sheets Candidate Importer Connector */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-ember/40 transition-colors">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-emerald-600/10 text-emerald-600 font-bold">
                  <FileSpreadsheet className="size-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl text-foreground">
                    Google Sheets Candidate Importer
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Spreadsheet Rows to Pipeline Candidates
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleSheets}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  sheetsConnected
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {sheetsConnected ? "Connected" : "Disabled"}
              </button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Sync candidates from shared Google Sheets. Automatically maps columns for Name, Email,
              Role, Location, and Recruiter.
            </p>

            <div className="mt-4 space-y-2 bg-surface p-3 rounded-lg border border-border text-xs">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  Target Google Sheet URL:
                </label>
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full bg-card border border-input rounded px-2.5 py-1 text-[11px] font-mono text-foreground focus:outline-none"
                />
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Column Mapping:</span>
                <span className="font-mono text-foreground text-[11px]">
                  Col A: Name | Col B: Email | Col C: Role
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sync:</span>
                <span className="font-medium text-foreground">{lastSyncSheets}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
            <span className="text-[11px] text-muted-foreground">
              Static Connector (Future API Integration Ready)
            </span>
            <button
              onClick={handleTriggerFetchSheets}
              disabled={!sheetsConnected}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-xs shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="size-3.5" />
              <span>Import Candidates from Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
