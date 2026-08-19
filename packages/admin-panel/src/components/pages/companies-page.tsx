import { useState, useMemo } from "react";
import {
  Building2,
  Search,
  Linkedin,
  FileSpreadsheet,
  Activity,
  Users,
  Filter,
  LayoutGrid,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AppNav } from "../layout/app-nav";
import { CandidateCard } from "../ats/candidate-card";
import { CandidateDrawer } from "../ats/candidate-drawer";
import { useWorkspace } from "../../lib/workspace-store";
import { PHASES, RECRUITERS, ROLES, phaseOfStage } from "../../lib/ats-data";
import { AdminLoginPage } from "../admin-login-page";
import { Footer } from "../Footer";

export function OnboardedCompaniesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("talentflow_admin_auth");
  });

  const { candidates, advanceCandidate, audit, companyId, setCompanyId, companies } =
    useWorkspace();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [recruiter, setRecruiter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<"board" | "interactions">("board");

  const activeCompany = useMemo(() => {
    const found = companies.find((c) => c.id === companyId) ?? companies[0];
    if (found) return found;
    return {
      id: "comp-acme",
      name: "Acme Corporation",
      short: "ACME",
      industry: "Information Technology",
      plan: "Enterprise",
      size: "500–1000",
      openRoles: 5,
      subdomain: "acme",
      adminEmail: "sarah@acmecorp.com",
      connectors: { linkedin: true, googleSheets: true },
    };
  }, [companies, companyId]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (c) =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase()) ||
        c.subdomain?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [companies, search]);

  const companyCandidates = useMemo(() => {
    return candidates.filter((c) => {
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
    });
  }, [candidates, query, role, recruiter]);

  const companyAudit = useMemo(() => {
    return audit.filter((a) => a.companyId === companyId);
  }, [audit, companyId]);

  const selectedCandidate = candidates.find((c) => c.id === selectedId) ?? null;
  const blockedCount = companyCandidates.filter((c) => c.blocked).length;

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
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase font-semibold">
                Super Admin Portal · Multi-Tenant Control
              </p>
              <h1 className="mt-1 text-4xl leading-none font-display font-semibold">
                Individual Company Pipeline Boards
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Select any onboarded company below to inspect its individual candidate board,
                micro-stage distribution, active connectors, and candidate interaction logs.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Stat label="Onboarded Companies" value={companies.length} />
              <Stat label="Selected Company Roles" value={activeCompany.openRoles || 0} />
              <Stat label="Candidates In Board" value={companyCandidates.length} accent />
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 space-y-8 max-w-7xl mx-auto">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display text-foreground">
                Select Onboarded Company ({filteredCompanies.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Click any company card to view its individual candidate pipeline board below.
              </p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company name or industry..."
                className="bg-card pl-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCompanies.map((c) => {
              const isSelected = companyId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setCompanyId(c.id)}
                  className={`bg-card border rounded-xl p-5 shadow-xs cursor-pointer transition-all flex flex-col justify-between hover:border-ember ${
                    isSelected ? "border-ember ring-2 ring-ember bg-surface/60" : "border-border"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="grid size-10 place-items-center rounded-lg bg-ember text-ember-foreground font-bold text-sm">
                        {c.short}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-10px ${
                          c.plan === "Enterprise"
                            ? "border-ember text-ember bg-ember/10"
                            : "border-success text-success bg-success/10"
                        }`}
                      >
                        {c.plan}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-display font-semibold text-foreground mt-3">
                      {c.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {c.industry} · {c.size || "Enterprise"}
                    </p>
                    <p className="text-xs font-mono text-ember font-medium mt-1">
                      talentflow.hub/candidates-portal/{c.subdomain || c.id}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Admin:</span>
                        <span className="font-medium text-foreground truncate max-w-140px">
                          {c.adminEmail || "admin@company.com"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Open Roles:</span>
                        <span className="font-medium text-foreground">
                          {c.openRoles || 0} Positions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {c.connectors?.linkedin && (
                        <span
                          className="text-blue-600 bg-blue-600/10 p-1 rounded"
                          title="LinkedIn Connector Active"
                        >
                          <Linkedin className="size-3" />
                        </span>
                      )}
                      {c.connectors?.googleSheets && (
                        <span
                          className="text-emerald-600 bg-emerald-600/10 p-1 rounded"
                          title="Google Sheets Importer Active"
                        >
                          <FileSpreadsheet className="size-3" />
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-11px font-semibold flex items-center gap-1 ${isSelected ? "text-ember" : "text-muted-foreground"}`}
                    >
                      {isSelected ? "Active Board Below" : "Select Board →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-lifted space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-ember text-ember-foreground font-bold text-lg">
                {activeCompany.short}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {activeCompany.name}
                  </h2>
                  <span className="bg-success/15 text-success border border-success/30 text-11px px-2.5 py-0.5 rounded-full font-semibold">
                    {activeCompany.plan} Plan · Active
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-mono text-ember">
                    talentflow.hub/candidates-portal/{activeCompany.subdomain || activeCompany.id}
                  </span>
                  {" · "}
                  {activeCompany.industry} · Admin:{" "}
                  {activeCompany.adminEmail || "sarah@acmecorp.com"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewTab("board")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewTab === "board"
                    ? "bg-ember text-ember-foreground shadow-xs"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" />
                <span>Candidate Pipeline Board ({companyCandidates.length})</span>
              </button>

              <button
                onClick={() => setViewTab("interactions")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewTab === "interactions"
                    ? "bg-ember text-ember-foreground shadow-xs"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Activity className="size-3.5" />
                <span>Interactions Feed ({companyAudit.length})</span>
              </button>
            </div>
          </div>

          {viewTab === "board" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search name, role or stage"
                      className="bg-surface pl-9 text-xs"
                    />
                  </div>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-48 bg-surface text-xs">
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
                    <SelectTrigger className="w-48 bg-surface text-xs">
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

                <div className="flex items-center gap-4 text-xs">
                  <span>
                    In Pipeline: <strong>{companyCandidates.length}</strong>
                  </span>
                  {blockedCount > 0 && (
                    <span className="text-ember font-semibold bg-ember/10 px-2 py-0.5 rounded">
                      Needs Attention: {blockedCount}
                    </span>
                  )}
                </div>
              </div>

              <div className="board-scroll overflow-x-auto pb-4">
                <div className="flex min-w-max gap-4">
                  {PHASES.map((phase) => {
                    const items = companyCandidates.filter(
                      (c) => phaseOfStage(c.stage).id === phase.id,
                    );
                    return (
                      <section key={phase.id} className="flex w-72 shrink-0 flex-col">
                        <div className="rounded-t-lg border border-b-0 border-border bg-surface px-3 py-3">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-display font-semibold leading-none">
                              {phase.label}
                            </h3>
                            <Badge variant="secondary" className="tabular-nums text-11px">
                              {items.length}
                            </Badge>
                          </div>
                          <p className="mt-1 text-11px text-muted-foreground">{phase.hint}</p>
                        </div>
                        <div className="stage-rail h-px bg-border" />
                        <div className="flex flex-1 flex-col gap-3 rounded-b-lg border border-t-0 border-border bg-surface/40 p-3">
                          {items.length === 0 ? (
                            <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                              No candidates
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
              </div>
            </div>
          )}

          {viewTab === "interactions" && (
            <div className="space-y-4">
              <h3 className="text-lg font-display text-foreground">
                Interaction Audit Log for {activeCompany.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Audit trail of candidate stage movements, connector candidate imports, and recruiter
                actions for this specific company.
              </p>

              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface border-b border-border text-muted-foreground font-semibold uppercase text-10px">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Actor</th>
                      <th className="p-3">Action Description</th>
                      <th className="p-3">Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {companyAudit.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-muted-foreground">
                          No audit interactions recorded for {activeCompany.name} yet.
                        </td>
                      </tr>
                    ) : (
                      companyAudit.map((entry) => (
                        <tr key={entry.id} className="hover:bg-surface/50 transition-colors">
                          <td className="p-3 text-muted-foreground font-mono text-11px">
                            {entry.at}
                          </td>
                          <td className="p-3 font-semibold text-foreground">
                            {entry.candidateName}
                          </td>
                          <td className="p-3 text-muted-foreground">{entry.actor}</td>
                          <td className="p-3 text-foreground">
                            {entry.action} {entry.detail ? `— ${entry.detail}` : ""}
                          </td>
                          <td className="p-3">
                            <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-10px font-medium">
                              {entry.channel}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <CandidateDrawer
        candidate={selectedCandidate}
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
        className={`font-display text-3xl leading-none font-bold ${accent ? "text-ember" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
