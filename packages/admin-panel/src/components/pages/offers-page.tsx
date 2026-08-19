import { useMemo, useState } from "react";
import { FileSignature, Send, Eye, PenLine, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AppNav } from "../layout/app-nav";
import { SettingsCard } from "../settings/settings-card";
import { AuditTrail } from "../ats/audit-trail";
import { useWorkspace } from "../../lib/workspace-store";
import { OFFER_FLOW, type Offer } from "../../lib/workspace-data";
import { Footer } from "../Footer";

const statusTone: Record<Offer["status"], string> = {
  draft: "bg-muted text-muted-foreground",
  generated: "bg-accent text-accent-foreground",
  sent: "bg-warning text-warning-foreground",
  viewed: "bg-warning text-warning-foreground",
  accepted: "bg-ember text-ember-foreground",
  declined: "bg-destructive text-destructive-foreground",
};

export function OffersPage() {
  const { candidates, offers, audit, createOffer, moveOffer, company } = useWorkspace();
  const eligible = useMemo(
    () => candidates.filter((c) => !offers.some((o) => o.candidateId === c.id)),
    [candidates, offers],
  );

  const [candidateId, setCandidateId] = useState("");
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("10%");
  const [startDate, setStartDate] = useState("");
  const [expiresOn, setExpiresOn] = useState("");

  const offerAudit = audit.filter((a) =>
    ["Offer generated", "Offer sent", "Offer viewed", "Offer accepted", "Offer declined"].includes(
      a.action,
    ),
  );

  function generate() {
    const c = candidates.find((x) => x.id === candidateId);
    if (!c || !salary || !startDate) {
      toast.error("Pick a candidate and fill salary and start date");
      return;
    }
    createOffer({
      candidateId: c.id,
      candidateName: c.name,
      role: c.role,
      salary,
      bonus,
      startDate,
      location: c.location,
      signerEmail: c.email,
      expiresOn: expiresOn || startDate,
    });
    toast.success(`Offer generated for ${c.name}`);
    setCandidateId("");
    setSalary("");
    setStartDate("");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <header className="border-b border-border bg-surface px-6 py-6">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {company.name} · Offer management
        </p>
        <h1 className="mt-1 text-4xl leading-none">Offers & e-signature</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Generate an offer, send it for signature, and watch the lifecycle move through Offer
          Generated → Sent → Viewed → Accepted. Every step writes an audit entry.
        </p>
      </header>

      <div className="grid gap-6 px-6 py-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <SettingsCard
            icon={FileSignature}
            title="Generate an offer"
            description="Creates the offer letter and moves the candidate to Offer Generated."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Candidate</Label>
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligible.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {c.role} ({c.stage})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Base salary</Label>
                <Input
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="£85,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonus">Bonus / OTE</Label>
                <Input id="bonus" value={bonus} onChange={(e) => setBonus(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start date</Label>
                <Input
                  id="start"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="01 Sep 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp">Offer expires</Label>
                <Input
                  id="exp"
                  value={expiresOn}
                  onChange={(e) => setExpiresOn(e.target.value)}
                  placeholder="14 Aug 2026"
                />
              </div>
            </div>
            <div className="mt-5">
              <Button onClick={generate}>
                <FileSignature className="size-4" /> Generate offer
              </Button>
            </div>
          </SettingsCard>

          <SettingsCard
            icon={ShieldCheck}
            title="Offer pipeline"
            description="Advance each offer through the signature flow."
          >
            <div className="space-y-3">
              {offers.length === 0 && (
                <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  No offers for {company.name} yet.
                </p>
              )}
              {offers.map((o) => {
                const idx = OFFER_FLOW.findIndex((f) => f.status === o.status);
                const next = OFFER_FLOW[idx + 1];
                return (
                  <article key={o.id} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{o.candidateName}</p>
                        <p className="text-xs text-muted-foreground">
                          {o.role} · {o.salary} + {o.bonus} · starts {o.startDate}
                        </p>
                        <p className="mt-1 text-11px text-muted-foreground">
                          Signer {o.signerEmail} · expires {o.expiresOn}
                          {o.signatureId ? ` · signature ${o.signatureId}` : ""}
                        </p>
                      </div>
                      <Badge className={statusTone[o.status]}>{o.status}</Badge>
                    </div>

                    <ol className="mt-3 flex flex-wrap gap-1.5">
                      {OFFER_FLOW.map((f, i) => (
                        <li
                          key={f.status}
                          className={`rounded-full border px-2.5 py-1 text-11px ${
                            i <= idx
                              ? "border-ember/40 bg-ember/10 text-foreground"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {f.label}
                        </li>
                      ))}
                    </ol>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {o.status === "draft" && (
                        <Button size="sm" variant="outline" onClick={() => moveOffer(o.id, "sent")}>
                          <Send className="size-3.5" /> Send for signature
                        </Button>
                      )}
                      {next && o.status !== "draft" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            moveOffer(o.id, next.status);
                            toast.success(`${o.candidateName}: ${next.label}`);
                          }}
                        >
                          {next.status === "sent" && <Send className="size-3.5" />}
                          {next.status === "viewed" && <Eye className="size-3.5" />}
                          {next.status === "accepted" && <PenLine className="size-3.5" />}
                          {next.label}
                        </Button>
                      )}
                      {o.status === "accepted" && (
                        <p className="text-xs text-muted-foreground">
                          Signed {o.signedAt} — candidate moved to Offer Accepted.
                        </p>
                      )}
                      {o.status !== "accepted" && o.status !== "declined" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            moveOffer(o.id, "declined");
                            toast("Offer marked declined");
                          }}
                        >
                          Mark declined
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </SettingsCard>
        </div>

        <AuditTrail title="Offer audit log" entries={offerAudit} />
      </div>

      <Footer
        linksCol1={[
          { label: "Admin Pipeline", href: "/admin-panel/dashboard" },
          { label: "Onboarded Companies", href: "/admin-panel/companies" },
          { label: "Offers Central", href: "/admin-panel/offers" },
          { label: "Approvals Flow", href: "/admin-panel/approvals" },
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
