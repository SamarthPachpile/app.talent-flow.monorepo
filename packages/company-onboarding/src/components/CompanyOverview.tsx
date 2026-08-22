import React from "react";
import { OnboardingState } from "../types/onboarding";
import { CheckCircle2, Clock, Users, ExternalLink, ShieldCheck, Globe } from "lucide-react";

interface OverviewProps {
  state: OnboardingState;
  setActiveTab: (tab: string) => void;
}

export const CompanyOverview: React.FC<OverviewProps> = ({ state, setActiveTab }) => {
  const checklist = [
    {
      title: "Company Identity Profile",
      done: Boolean(state.profile.name && state.profile.subdomain),
      tab: "settings",
    },
    {
      title: "Primary Admin Contact",
      done: Boolean(state.admin.fullName && state.admin.workEmail),
      tab: "team",
    },
    {
      title: "Corporate Integrations (Google/Slack)",
      done: state.integrations.googleWorkspace || state.integrations.slack,
      tab: "connectors",
    },
    { title: "Team Invites & Roles", done: state.teamInvites.length > 0, tab: "team" },
    { title: "Recruitment Pipeline", done: true, tab: "pipeline" },
  ];

  const completedCount = checklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 animate-fadeIn font-sans">
      {/* Top Banner Header Card */}
      <div className="border border-border bg-surface p-6 sm:p-8 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Company Workspace Overview
            </p>
            <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-semibold text-foreground">
              {state.profile.subdomain
                ? `${state.profile.subdomain}.talentflow.hub`
                : "Active Workspace"}
            </span>
          </div>
          <h1 className="mt-2 text-4xl leading-none font-display text-foreground">
            {state.profile.name || "Company Workspace"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Welcome to the TalentFlow Company Workspace. Monitor your recruitment pipeline,
            configure security policies, and manage active talent management modules.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Setup Status</span>
            <div className="size-8 rounded-md bg-accent flex items-center justify-center text-foreground">
              <CheckCircle2 className="size-4 text-success" />
            </div>
          </div>
          <p className="font-display text-3xl leading-none text-foreground mt-3">
            {progressPercent}%
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">
            {completedCount} of {checklist.length} configuration items
          </p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Workspace Status</span>
            <div className="size-8 rounded-md bg-accent flex items-center justify-center text-foreground">
              <ShieldCheck className="size-4 text-ember" />
            </div>
          </div>
          <p className="font-display text-2xl leading-none text-success mt-3 font-semibold">
            Active Workspace
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">Full Admin Access Enabled</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Invited Team</span>
            <div className="size-8 rounded-md bg-accent flex items-center justify-center text-foreground">
              <Users className="size-4 text-ember" />
            </div>
          </div>
          <p className="font-display text-3xl leading-none text-foreground mt-3">
            {state.teamInvites.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">Active team members</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Subdomain SSL</span>
            <div className="size-8 rounded-md bg-accent flex items-center justify-center text-foreground">
              <Globe className="size-4 text-ember" />
            </div>
          </div>
          <p className="font-display text-2xl leading-none text-success mt-3 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" /> Active TLS/SSL
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 font-mono">
            {state.profile.subdomain || "company"}.talentflow.hub
          </p>
        </div>
      </div>

      {/* Checklist & Module Status Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding Checklist */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl leading-none font-display text-foreground">
              Workspace Configuration Checklist
            </h2>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{checklist.length} Complete
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab(item.tab)}
                className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  item.done
                    ? "bg-surface border-border hover:bg-accent/50"
                    : "bg-card border-border hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center ${
                      item.done
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <Clock className="size-3.5" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}
                  >
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-ember font-medium">
                  <span>Manage</span>
                  <ExternalLink className="size-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Modules Card */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <h2 className="text-xl leading-none font-display text-foreground mb-1">
              Enabled Modules
            </h2>
            <p className="text-xs text-muted-foreground">
              Modules configured for your company portal. Toggle anytime in company settings.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              { name: "ATS CRM & Pipeline", active: state.modules.ats },
              { name: "Interview Scheduler", active: state.modules.interviewScheduler },
              { name: "Candidate Portal", active: state.modules.candidatePortal },
              { name: "Employee Onboarding", active: state.modules.onboardingChecklist },
              { name: "IT Hardware & Assets", active: state.modules.itAssetManagement },
              { name: "Document E-Signature", active: state.modules.documentESign },
            ].map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border text-xs"
              >
                <span className="text-foreground font-medium">{m.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold text-11px ${
                    m.active
                      ? "bg-success/15 text-success border border-success/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.active ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
