/* eslint-disable react-refresh/only-export-components */
import React, { useMemo, useState, useCallback } from "react";
import {
  Search,
  Filter,
  Users,
  AlertTriangle,
  ArrowUpRight,
  MapPin,
  Check,
  Circle,
  Mail,
  User,
  Building2,
  CalendarDays,
  Tag,
  X,
} from "lucide-react";

export const STAGES = [
  "Application Received",
  "Acknowledgement Email Sent",
  "Resume Uploaded",
  "Resume Parsed",
  "Duplicate Check",
  "Recruiter Assigned",
  "Screening Pending",
  "Screening Complete",
  "Shortlisted",
  "Interview Requested",
  "Calendar Invite Sent",
  "Reminder Sent",
  "Interview Completed",
  "Feedback Submitted",
  "Hiring Manager Approved",
  "HR Approved",
  "Offer Generated",
  "Offer Sent",
  "Offer Viewed",
  "Offer Accepted",
  "Documents Requested",
  "Documents Uploaded",
  "Verification Complete",
  "Onboarding Started",
  "Laptop Assigned",
  "Accounts Created",
  "Joining Confirmed",
  "Employee Created",
] as const;

export type Stage = (typeof STAGES)[number];

export type PhaseId =
  "intake" | "screening" | "interview" | "approval" | "offer" | "verification" | "onboarding";

export type Phase = {
  id: PhaseId;
  label: string;
  hint: string;
  stages: Stage[];
};

export const PHASES: Phase[] = [
  {
    id: "intake",
    label: "Intake",
    hint: "Applications landing & parsing",
    stages: STAGES.slice(0, 6) as Stage[],
  },
  {
    id: "screening",
    label: "Screening",
    hint: "Recruiter review",
    stages: STAGES.slice(6, 9) as Stage[],
  },
  {
    id: "interview",
    label: "Interview",
    hint: "Scheduling & feedback",
    stages: STAGES.slice(9, 14) as Stage[],
  },
  {
    id: "approval",
    label: "Approval",
    hint: "Hiring manager & HR",
    stages: STAGES.slice(14, 16) as Stage[],
  },
  {
    id: "offer",
    label: "Offer",
    hint: "Generation to acceptance",
    stages: STAGES.slice(16, 20) as Stage[],
  },
  {
    id: "verification",
    label: "Verification",
    hint: "Documents & checks",
    stages: STAGES.slice(20, 23) as Stage[],
  },
  {
    id: "onboarding",
    label: "Onboarding",
    hint: "IT, accounts, day one",
    stages: STAGES.slice(23, 28) as Stage[],
  },
];

export function phaseOfStage(stage: Stage): Phase {
  return PHASES.find((p) => p.stages.includes(stage)) ?? PHASES[0];
}

export function stageIndex(stage: Stage) {
  return STAGES.indexOf(stage);
}

export type Candidate = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  location: string;
  source: string;
  email: string;
  appliedOn: string;
  recruiter: string;
  hiringManager: string;
  stage: Stage;
  priority: "standard" | "high" | "urgent";
  blocked?: string;
  tags: string[];
  history: { stage: Stage; at: string; actor: string; note?: string }[];
};

export type WorkflowStageItem = {
  id: string;
  name: string;
  color?: string;
  slaHours?: number;
  description?: string;
  category?: string;
};

interface CompanyPipelineBoardProps {
  companyName: string;
  candidates: Candidate[];
  onAdvanceCandidate: (id: string) => void;
  workflowStages?: WorkflowStageItem[];
}

export const CompanyPipelineBoard: React.FC<CompanyPipelineBoardProps> = ({
  companyName,
  candidates,
  onAdvanceCandidate,
  workflowStages,
}) => {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [recruiter, setRecruiter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeStages = useMemo(() => {
    if (workflowStages && workflowStages.length > 0) {
      return workflowStages.map((stg, i) => ({
        id: stg.id || `stg-${i + 1}`,
        name: stg.name,
        color: stg.color || "#6366f1",
        slaHours: stg.slaHours ?? 24,
        description: stg.description || "Pipeline stage",
        category: stg.category || "Workflow",
      }));
    }
    return STAGES.map((name, i) => ({
      id: `stg-${i + 1}`,
      name,
      color: "#6366f1",
      slaHours: 24,
      description: "Micro-stage",
      category: "Workflow",
    }));
  }, [workflowStages]);

  const getCandidateStageIndex = useCallback(
    (candidateStage: string): number => {
      const normCand = (candidateStage || "").trim().toLowerCase();
      const exactIndex = activeStages.findIndex((s) => s.name.trim().toLowerCase() === normCand);
      if (exactIndex >= 0) return exactIndex;
      const fallbackIndex = STAGES.findIndex((s) => s.toLowerCase() === normCand);
      if (fallbackIndex >= 0 && STAGES.length > 0 && activeStages.length > 0) {
        return Math.min(
          Math.floor((fallbackIndex / STAGES.length) * activeStages.length),
          activeStages.length - 1,
        );
      }
      return 0;
    },
    [activeStages],
  );

  const roles = useMemo(() => Array.from(new Set(candidates.map((c) => c.role))), [candidates]);
  const recruiters = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.recruiter))),
    [candidates],
  );

  const filtered = useMemo(
    () =>
      candidates.filter((c) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.stage.toLowerCase().includes(q);
        return (
          matchQ &&
          (role === "all" || c.role === role) &&
          (recruiter === "all" || c.recruiter === recruiter)
        );
      }),
    [candidates, query, role, recruiter],
  );

  const selected = candidates.find((c) => c.id === selectedId) ?? null;
  const blockedCount = filtered.filter((c) => c.blocked).length;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border border-border bg-surface rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase font-semibold">
              {companyName} · Recruitment Operations
            </p>
            <h1 className="mt-1 text-4xl leading-none font-display text-foreground font-semibold">
              Pipeline board
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Candidate recruitment pipeline configured from your company setup wizard document.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="In pipeline" value={filtered.length} />
            <Stat label="Needs attention" value={blockedCount} accent />
            <Stat label="Pipeline Stages" value={activeStages.length} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search name, role or stage"
              className="w-full bg-card border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ember"
            />
          </div>

          <div className="relative w-52">
            <select
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}
              className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ember appearance-none cursor-pointer"
            >
              <option value="all">All roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative w-52">
            <select
              value={recruiter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRecruiter(e.target.value)}
              className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ember appearance-none cursor-pointer"
            >
              <option value="all">All recruiters</option>
              {recruiters.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Users className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </header>

      <main className="board-scroll overflow-x-auto py-6">
        <div className="flex min-w-max gap-4">
          {activeStages.map((stageItem, stageIdx) => {
            const items = filtered.filter((c) => getCandidateStageIndex(c.stage) === stageIdx);
            return (
              <section key={stageItem.id || stageItem.name} className="flex w-72 shrink-0 flex-col">
                <div
                  className="rounded-t-lg border border-b-0 border-border bg-surface px-3.5 py-3 shadow-2xs"
                  style={{ borderTop: `3px solid ${stageItem.color || "#6366f1"}` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stageItem.color || "#6366f1" }}
                      />
                      <h2 className="text-sm font-semibold text-foreground truncate font-display">
                        {stageItem.name}
                      </h2>
                    </div>
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-mono font-semibold shrink-0">
                      {items.length}
                    </span>
                  </div>
                  <p className="mt-1 text-11px text-muted-foreground truncate">
                    {stageItem.description || "Pipeline stage"}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-10px">
                    <span className="text-muted-foreground font-mono">
                      Stage {stageIdx + 1} of {activeStages.length}
                    </span>
                    <span className="bg-accent/80 text-accent-foreground px-1.5 py-0.5 rounded font-mono font-medium">
                      SLA: {stageItem.slaHours ?? 24}h
                    </span>
                  </div>
                </div>
                <div className="stage-rail h-px bg-border" />
                <div className="flex flex-1 flex-col gap-3 rounded-b-lg border border-t-0 border-border bg-surface/40 p-3 min-h-380px">
                  {items.length === 0 ? (
                    <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      No candidates in {stageItem.name}
                    </p>
                  ) : (
                    items.map((c) => (
                      <CandidateCard
                        key={c.id}
                        candidate={c}
                        stagesCount={activeStages.length}
                        stageIndex={getCandidateStageIndex(c.stage)}
                        onOpen={(cand) => setSelectedId(cand.id)}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Candidate Drawer Modal */}
      {selected &&
        (() => {
          const currentStageIdx = getCandidateStageIndex(selected.stage);
          const currentStageObj = activeStages[currentStageIdx] || activeStages[0];
          const isLastStage = currentStageIdx === activeStages.length - 1;

          return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
              <div className="w-full max-w-xl bg-card border-l border-border h-full flex flex-col shadow-lifted animate-in slide-in-from-right duration-200">
                <div className="border-b border-border px-6 py-5 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                      {selected.initials}
                    </span>
                    <div>
                      <h2 className="font-display text-2xl leading-tight text-foreground font-bold">
                        {selected.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {selected.role} · {selected.department}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span
                          className="border border-ember/30 bg-ember/10 text-ember px-2.5 py-0.5 rounded text-11px font-semibold flex items-center gap-1.5"
                          style={{
                            color: currentStageObj.color,
                            borderColor: `${currentStageObj.color}40`,
                            backgroundColor: `${currentStageObj.color}15`,
                          }}
                        >
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: currentStageObj.color }}
                          />
                          {currentStageObj.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-xs">
                    <Field icon={Mail} label="Email" value={selected.email} />
                    <Field icon={CalendarDays} label="Applied" value={selected.appliedOn} />
                    <Field icon={User} label="Recruiter" value={selected.recruiter} />
                    <Field icon={Building2} label="Hiring manager" value={selected.hiringManager} />
                    <Field icon={Tag} label="Source" value={selected.source} />
                    <Field icon={Tag} label="Skills" value={selected.tags.join(", ")} />
                  </dl>

                  <div className="border-t border-border pt-5">
                    <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                      Stage Lifecycle Tracker ({companyName})
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {currentStageIdx + 1} of {activeStages.length} pipeline stages complete
                    </p>

                    <ol className="mt-4 space-y-0">
                      {activeStages.map((stageItem, i) => {
                        const done = i <= currentStageIdx;
                        const isCurrent = i === currentStageIdx;
                        const event = selected.history[i];
                        return (
                          <li key={stageItem.id || stageItem.name} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <span
                                className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                                  done
                                    ? "border-ember bg-ember text-ember-foreground"
                                    : "border-border bg-background text-muted-foreground"
                                }`}
                                style={
                                  done
                                    ? {
                                        backgroundColor: stageItem.color || "#6366f1",
                                        borderColor: stageItem.color || "#6366f1",
                                      }
                                    : {}
                                }
                              >
                                {done ? (
                                  <Check className="size-3 text-white" />
                                ) : (
                                  <Circle className="size-1.5 fill-current" />
                                )}
                              </span>
                              {i < activeStages.length - 1 && (
                                <span
                                  className={`w-px flex-1 ${done ? "bg-ember/40" : "bg-border"}`}
                                />
                              )}
                            </div>
                            <div
                              className={`pb-3.5 ${i === activeStages.length - 1 ? "pb-0" : ""}`}
                            >
                              <p
                                className={`text-xs leading-5 ${
                                  isCurrent
                                    ? "font-semibold text-foreground"
                                    : done
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {stageItem.name}
                              </p>
                              <p className="text-11px text-muted-foreground">
                                {stageItem.description} ·{" "}
                                {event
                                  ? `${event.at} · ${event.actor}`
                                  : `SLA ${stageItem.slaHours ?? 24}h`}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-6 py-4">
                  <p className="text-xs text-muted-foreground">
                    {isLastStage
                      ? "Pipeline lifecycle complete"
                      : `Next: ${activeStages[currentStageIdx + 1]?.name}`}
                  </p>
                  <button
                    disabled={isLastStage}
                    onClick={() => onAdvanceCandidate(selected.id)}
                    className="px-4 py-2 rounded-lg bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Advance Stage
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p
        className={`font-display text-3xl leading-none font-bold ${accent && value > 0 ? "text-ember" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function CandidateCard({
  candidate,
  stagesCount,
  stageIndex,
  onOpen,
}: {
  candidate: Candidate;
  stagesCount: number;
  stageIndex: number;
  onOpen: (c: Candidate) => void;
}) {
  const progress = ((stageIndex + 1) / Math.max(stagesCount, 1)) * 100;

  return (
    <button
      type="button"
      onClick={() => onOpen(candidate)}
      className="group w-full rounded-lg border border-border bg-card p-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lifted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-xs font-semibold text-accent-foreground">
          {candidate.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-foreground">{candidate.name}</p>
            <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="truncate text-xs text-muted-foreground">{candidate.role}</p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-11px text-muted-foreground">
        <MapPin className="size-3" />
        <span className="truncate">{candidate.location}</span>
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="border border-border bg-surface font-normal text-11px px-2 py-0.5 rounded text-foreground">
          {candidate.stage}
        </span>
        {candidate.priority !== "standard" && (
          <span
            className={`font-normal text-10px px-1.5 py-0.5 rounded font-semibold ${
              candidate.priority === "urgent"
                ? "bg-ember text-ember-foreground"
                : "bg-warning text-warning-foreground"
            }`}
          >
            {candidate.priority}
          </span>
        )}
      </div>

      {candidate.blocked && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-destructive/10 px-2 py-1.5 text-11px text-destructive">
          <AlertTriangle className="mt-px size-3 shrink-0" />
          <span>{candidate.blocked}</span>
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-ember transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-10px tabular-nums text-muted-foreground">
          {stageIndex + 1}/{stagesCount}
        </span>
      </div>
    </button>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-xs font-medium text-foreground">{value}</dd>
    </div>
  );
}
