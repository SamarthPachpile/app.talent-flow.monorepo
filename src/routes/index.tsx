import { useMemo, useState } from "react";
import { Search, Filter, Users } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateCard } from "@/components/ats/candidate-card";
import { CandidateDrawer } from "@/components/ats/candidate-drawer";
import {
  CANDIDATES,
  PHASES,
  RECRUITERS,
  ROLES,
  STAGES,
  type Candidate,
  phaseOfStage,
  stageIndex,
} from "@/lib/ats-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATS Pipeline Board — Hiring Lifecycle Tracker" },
      {
        name: "description",
        content:
          "Track every candidate across 28 hiring micro-stages, from application received to employee created, on one recruiter pipeline board.",
      },
      { property: "og:title", content: "ATS Pipeline Board — Hiring Lifecycle Tracker" },
      {
        property: "og:description",
        content:
          "One board for the full hiring lifecycle: screening, interviews, approvals, offers, verification and onboarding.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PipelinePage,
});

function PipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [recruiter, setRecruiter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      candidates.filter((c) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.stage.toLowerCase().includes(q);
        return matchQ && (role === "all" || c.role === role) && (recruiter === "all" || c.recruiter === recruiter);
      }),
    [candidates, query, role, recruiter],
  );

  const selected = candidates.find((c) => c.id === selectedId) ?? null;
  const blocked = filtered.filter((c) => c.blocked).length;

  function advance(id: string) {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next = STAGES[Math.min(stageIndex(c.stage) + 1, STAGES.length - 1)];
        return {
          ...c,
          stage: next,
          blocked: undefined,
          history: [
            ...c.history,
            { stage: next, at: `Day ${c.history.length + 1}`, actor: c.recruiter },
          ],
        };
      }),
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="px-6 py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Recruitment operations
              </p>
              <h1 className="mt-1 text-4xl leading-none">Pipeline board</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Every candidate, every micro-stage — from application received through to employee
                created.
              </p>
            </div>
            <div className="flex gap-6">
              <Stat label="In pipeline" value={filtered.length} />
              <Stat label="Needs attention" value={blocked} accent />
              <Stat label="Micro-stages" value={STAGES.length} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, role or stage"
                className="bg-card pl-9"
              />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-52 bg-card">
                <Filter className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={recruiter} onValueChange={setRecruiter}>
              <SelectTrigger className="w-52 bg-card">
                <Users className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Recruiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All recruiters</SelectItem>
                {RECRUITERS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="board-scroll overflow-x-auto px-6 py-6">
        <div className="flex min-w-max gap-4">
          {PHASES.map((phase) => {
            const items = filtered.filter((c) => phaseOfStage(c.stage).id === phase.id);
            return (
              <section key={phase.id} className="flex w-72 shrink-0 flex-col">
                <div className="rounded-t-lg border border-b-0 border-border bg-surface px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base leading-none">{phase.label}</h2>
                    <Badge variant="secondary" className="tabular-nums">
                      {items.length}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{phase.hint}</p>
                  <p className="mt-2 text-[10px] tracking-wide text-muted-foreground uppercase">
                    {phase.stages.length} stages
                  </p>
                </div>
                <div className="stage-rail h-px" />
                <div className="flex flex-1 flex-col gap-3 rounded-b-lg border border-t-0 border-border bg-surface/40 p-3">
                  {items.length === 0 ? (
                    <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      No candidates here
                    </p>
                  ) : (
                    items.map((c) => (
                      <CandidateCard
                        key={c.id}
                        candidate={c}
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

      <CandidateDrawer
        candidate={selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onAdvance={advance}
      />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p
        className={`font-display text-3xl leading-none ${accent && value > 0 ? "text-ember" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
