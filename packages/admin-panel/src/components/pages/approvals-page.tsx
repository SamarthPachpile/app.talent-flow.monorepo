import { useState } from "react";
import { ClipboardCheck, ThumbsDown, ThumbsUp, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppNav } from "@/components/layout/app-nav";
import { SettingsCard } from "@/components/settings/settings-card";
import { AuditTrail } from "@/components/ats/audit-trail";
import { useWorkspace } from "@/lib/workspace-store";
import type { ApprovalRole } from "@/lib/workspace-data";
import { AdminLoginPage } from "@/components/admin-login-page";

export function ApprovalsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem("talentflow_admin_auth");
  });

  const { approvals, candidates, audit, decideApproval, requestApproval, company } = useWorkspace();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [candidateId, setCandidateId] = useState("");
  const [approverRole, setApproverRole] = useState<ApprovalRole>("Hiring Manager");

  const approvalAudit = audit.filter(
    (a) =>
      a.action.includes("approval") ||
      a.action.includes("Approved") ||
      a.action.includes("rejected"),
  );

  function raise() {
    const c = candidates.find((x) => x.id === candidateId);
    if (!c) {
      toast.error("Pick a candidate");
      return;
    }
    requestApproval({
      candidateId: c.id,
      candidateName: c.name,
      role: c.role,
      approverRole,
      approver: approverRole === "Hiring Manager" ? c.hiringManager : "Grace Oyelaran",
      summary: `Approval requested from ${approverRole} for ${c.name} (${c.role}), currently at ${c.stage}.`,
      nextStage: approverRole === "Hiring Manager" ? "Hiring Manager Approved" : "HR Approved",
    });
    toast.success(`${approverRole} approval requested`);
    setCandidateId("");
  }

  const queues: { key: ApprovalRole; label: string }[] = [
    { key: "Hiring Manager", label: "Hiring Manager" },
    { key: "HR", label: "HR" },
  ];

  if (!isAuthenticated) {
    return <AdminLoginPage onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNav onLogout={() => setIsAuthenticated(false)} />
      <header className="border-b border-border bg-surface px-6 py-6">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase font-semibold">
          {company.name} · Approval engine
        </p>
        <h1 className="mt-1 text-4xl leading-none font-display font-semibold">Approvals</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Hiring Manager and HR review pending actions, record a decision with notes, and an
          approval automatically triggers the next lifecycle stage.
        </p>
      </header>

      <div className="grid gap-6 px-6 py-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <SettingsCard
            icon={UserPlus}
            title="Raise an approval request"
            description="Route a candidate to the Hiring Manager or HR queue."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Candidate</Label>
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {c.stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Approver</Label>
                <Select
                  value={approverRole}
                  onValueChange={(v) => setApproverRole(v as ApprovalRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-5">
              <Button onClick={raise}>
                <ClipboardCheck className="size-4" /> Request approval
              </Button>
            </div>
          </SettingsCard>

          <Tabs defaultValue="Hiring Manager">
            <TabsList>
              {queues.map((q) => (
                <TabsTrigger key={q.key} value={q.key}>
                  {q.label} (
                  {
                    approvals.filter((a) => a.approverRole === q.key && a.status === "pending")
                      .length
                  }
                  )
                </TabsTrigger>
              ))}
            </TabsList>
            {queues.map((q) => (
              <TabsContent key={q.key} value={q.key} className="mt-4 space-y-3">
                {approvals.filter((a) => a.approverRole === q.key).length === 0 && (
                  <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    Nothing in the {q.label} queue.
                  </p>
                )}
                {approvals
                  .filter((a) => a.approverRole === q.key)
                  .map((a) => (
                    <article key={a.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {a.candidateName} · {a.role}
                          </p>
                          <p className="mt-1 max-w-xl text-xs text-muted-foreground">{a.summary}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Approver {a.approver} · requested {a.requestedOn} · unlocks{" "}
                            {a.nextStage}
                          </p>
                        </div>
                        <Badge
                          className={
                            a.status === "approved"
                              ? "bg-ember text-ember-foreground"
                              : a.status === "rejected"
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-warning text-warning-foreground"
                          }
                        >
                          {a.status}
                        </Badge>
                      </div>

                      {a.status === "pending" ? (
                        <div className="mt-3 space-y-2">
                          <Textarea
                            value={notes[a.id] ?? ""}
                            onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })}
                            placeholder="Decision note (visible in the audit log)"
                            rows={2}
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                decideApproval(a.id, "approved", notes[a.id] ?? "");
                                toast.success(`${a.nextStage} — lifecycle advanced`);
                              }}
                            >
                              <ThumbsUp className="size-3.5" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                decideApproval(a.id, "rejected", notes[a.id] ?? "");
                                toast("Decision recorded: rejected");
                              }}
                            >
                              <ThumbsDown className="size-3.5" /> Reject
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 rounded-md bg-surface px-3 py-2 text-xs text-muted-foreground">
                          {a.status === "approved" ? "Approved" : "Rejected"} {a.decidedOn}
                          {a.decisionNote ? ` — ${a.decisionNote}` : ""}
                        </p>
                      )}
                    </article>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <AuditTrail title="Approval audit log" entries={approvalAudit} />
      </div>
    </div>
  );
}
