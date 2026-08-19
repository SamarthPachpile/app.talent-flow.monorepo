import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Users, Building2, Globe2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { AppNav } from "../components/layout/app-nav";
import { CandidateCard } from "../components/ats/candidate-card";
import { CandidateDrawer } from "../components/ats/candidate-drawer";
import { useWorkspace } from "../lib/workspace-store";
import { PHASES, RECRUITERS, ROLES, STAGES, phaseOfStage } from "../lib/ats-data";
import { COMPANIES, OPERATOR } from "../lib/workspace-data";
import { AdminLoginPage } from "../components/admin-login-page";
import { Footer } from "../components/Footer";

// @ts-expect-error TanStack router route id type sync
export const Route = createFileRoute("/admin-panel/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Panel Dashboard — Global ATS Pipeline Board" },
      { name: "description", content: "Overview of all candidates and client company workspaces." },
    ],
  }),
  component: DashboardPage,
});

export function DashboardPage() {
  const { allCandidates, advanceCandidate } = useWorkspace();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [recruiter, setRecruiter] = useState("all");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("talentflow_admin_auth");
  });

  const filtered = useMemo(
    () =>
      allCandidates.filter((c) => {
        const q = query.trim().toLowerCase();
        const comp = COMPANIES.find((compItem) => compItem.id === c.companyId);
        const compName = comp ? comp.name.toLowerCase() : "";
        const matchQ =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.stage.toLowerCase().includes(q) ||
          compName.includes(q);
        const matchComp = selectedCompanyFilter === "all" || c.companyId === selectedCompanyFilter;
        return (
          matchQ &&
          matchComp &&
          (role === "all" || c.role === role) &&
          (recruiter === "all" || c.recruiter === recruiter)
        );
      }),
    [allCandidates, query, role, recruiter, selectedCompanyFilter],
  );

  const selected = allCandidates.find((c) => c.id === selectedId) ?? null;
  const blocked = filtered.filter((c) => c.blocked).length;

  if (!isAuthenticated) {
    return <AdminLoginPage onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNav onLogout={() => setIsAuthenticated(false)} />
      <header className="border-b border-border bg-surface">
        <div className="px-6 py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase font-semibold">
                  {OPERATOR.name} · Global CRM Operations
                </p>
                <span className="bg-ember/15 text-ember border border-ember/30 text-10px px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Globe2 className="size-3" /> Route: /admin-panel/dashboard
                </span>
              </div>
              <h1 className="mt-1 text-4xl leading-none font-display text-foreground font-semibold">
                Global Pipeline Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Overview of all candidates using your CRM portal across all onboarded enterprise
                companies.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Stat label="Total Candidates" value={filtered.length} />
              <Stat label="Onboarded Companies" value={COMPANIES.length} />
              <Stat label="Needs Attention" value={blocked} accent />
              <Stat label="Micro-stages" value={STAGES.length} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candidate, role, stage or company"
                className="bg-card pl-9 text-xs"
              />
            </div>

            <Select value={selectedCompanyFilter} onValueChange={setSelectedCompanyFilter}>
              <SelectTrigger className="w-56 bg-card text-xs">
                <Building2 className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Company filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Companies ({allCandidates.length} Candidates)
                </SelectItem>
                {COMPANIES.map((comp) => {
                  const count = allCandidates.filter((cand) => cand.companyId === comp.id).length;
                  return (
                    <SelectItem key={comp.id} value={comp.id}>
                      {comp.name} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-48 bg-card text-xs">
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
              <SelectTrigger className="w-48 bg-card text-xs">
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

      <main data-lenis-prevent className="board-scroll overflow-x-auto px-6 py-6">
        <div className="flex min-w-max gap-4">
          {PHASES.map((phase) => {
            const items = filtered.filter((c) => phaseOfStage(c.stage).id === phase.id);
            return (
              <section key={phase.id} className="flex w-72 shrink-0 flex-col">
                <div className="rounded-t-lg border border-b-0 border-border bg-surface px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-display font-semibold leading-none text-foreground">
                      {phase.label}
                    </h2>
                    <Badge variant="secondary" className="tabular-nums text-xs">
                      {items.length}
                    </Badge>
                  </div>
                  <p className="mt-1 text-11px text-muted-foreground">{phase.hint}</p>
                  <p className="mt-2 text-10px tracking-wide text-muted-foreground uppercase font-semibold">
                    {phase.stages.length} stages
                  </p>
                </div>
                <div className="stage-rail h-px bg-border" />
                <div className="flex flex-1 flex-col gap-3 rounded-b-lg border border-t-0 border-border bg-surface/40 p-3">
                  {items.length === 0 ? (
                    <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      No candidates here
                    </p>
                  ) : (
                    items.map((c) => {
                      const companyObj = COMPANIES.find((item) => item.id === c.companyId);
                      return (
                        <div key={c.id} className="relative">
                          {companyObj && (
                            <div className="mb-1 flex items-center justify-between px-1">
                              <span className="text-10px font-mono text-ember font-semibold truncate">
                                {companyObj.name}
                              </span>
                              <span className="text-9px bg-accent px-1.5 py-0.2 rounded text-muted-foreground">
                                {companyObj.short}
                              </span>
                            </div>
                          )}
                          <CandidateCard candidate={c} onOpen={(cand) => setSelectedId(cand.id)} />
                        </div>
                      );
                    })
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
        onAdvance={(id) => advanceCandidate(id)}
      />

      <Footer
        linksCol1={[
          { label: "Admin Pipeline", href: "/admin-panel/dashboard" },
          { label: "Onboarded Companies", href: "/admin-panel/companies" },
          { label: "Interviews Control", href: "/admin-panel/interviews" },
          { label: "Offers Central", href: "/admin-panel/offers" },
        ]}
        linksCol2={[
          { label: "Company Portal", href: "/companies" },
          { label: "Candidate Portal", href: "/candidates-portal" },
          { label: "Admin Settings", href: "/admin-panel/settings" },
        ]}
      />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p
        className={`font-display text-3xl font-bold leading-none ${accent && value > 0 ? "text-ember" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
