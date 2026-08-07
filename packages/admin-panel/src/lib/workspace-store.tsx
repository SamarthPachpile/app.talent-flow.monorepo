/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { STAGES, type Stage, stageIndex } from "./ats-data";
import {
  COMPANIES,
  SEED_APPROVALS,
  SEED_AUDIT,
  SEED_INTERVIEWS,
  SEED_OFFERS,
  TENANT_CANDIDATES,
  meetLink,
  nowStamp,
  type Approval,
  type AuditEntry,
  type Company,
  type Interview,
  type Offer,
  type OfferStatus,
  type TenantCandidate,
} from "./workspace-data";

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${seq++}`;

type Ctx = {
  companies: Company[];
  companyId: string;
  company: Company;
  setCompanyId: (id: string) => void;
  candidates: TenantCandidate[];
  allCandidates: TenantCandidate[];
  offers: Offer[];
  interviews: Interview[];
  approvals: Approval[];
  audit: AuditEntry[];
  advanceCandidate: (id: string, actor?: string) => void;
  setCandidateStage: (id: string, stage: Stage, actor: string, note?: string) => void;
  createOffer: (input: Omit<Offer, "id" | "companyId" | "status">) => void;
  moveOffer: (id: string, status: OfferStatus, note?: string) => void;
  scheduleInterview: (input: Omit<Interview, "id" | "companyId" | "status">) => void;
  sendReminder: (id: string) => void;
  completeInterview: (id: string) => void;
  decideApproval: (id: string, status: "approved" | "rejected", note: string) => void;
  requestApproval: (input: Omit<Approval, "id" | "companyId" | "status" | "requestedOn">) => void;
};

const WorkspaceContext = createContext<Ctx | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState(COMPANIES[0]?.id || "");
  const [candidates, setCandidates] = useState<TenantCandidate[]>(TENANT_CANDIDATES);
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [interviews, setInterviews] = useState<Interview[]>(SEED_INTERVIEWS);
  const [approvals, setApprovals] = useState<Approval[]>(SEED_APPROVALS);
  const [audit, setAudit] = useState<AuditEntry[]>(SEED_AUDIT);

  const log = useCallback(
    (entry: Omit<AuditEntry, "id" | "at" | "companyId"> & { companyId?: string }) => {
      setAudit((prev) => [{ id: uid("aud"), at: nowStamp(), companyId, ...entry }, ...prev]);
    },
    [companyId],
  );

  const setCandidateStage = useCallback(
    (id: string, stage: Stage, actor: string, note?: string) => {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                stage,
                blocked: undefined,
                history: [...c.history, { stage, at: nowStamp(), actor, note }],
              }
            : c,
        ),
      );
    },
    [],
  );

  const advanceCandidate = useCallback(
    (id: string, actor = "Recruiter") => {
      const c = candidates.find((x) => x.id === id);
      if (!c) return;
      const next = STAGES[Math.min(stageIndex(c.stage) + 1, STAGES.length - 1)];
      setCandidateStage(id, next, actor);
      log({
        candidateId: id,
        candidateName: c.name,
        actor,
        action: `Stage advanced to ${next}`,
        channel: "Manual",
      });
    },
    [candidates, log, setCandidateStage],
  );

  const createOffer = useCallback<Ctx["createOffer"]>(
    (input) => {
      const offer: Offer = { ...input, id: uid("off"), companyId, status: "generated" };
      setOffers((prev) => [offer, ...prev]);
      setCandidateStage(input.candidateId, "Offer Generated", "Recruiter");
      log({
        candidateId: input.candidateId,
        candidateName: input.candidateName,
        actor: "Recruiter",
        action: "Offer generated",
        detail: `${input.role} · ${input.salary} · start ${input.startDate}`,
        channel: "System",
      });
    },
    [companyId, log, setCandidateStage],
  );

  const moveOffer = useCallback<Ctx["moveOffer"]>(
    (id, status, note) => {
      const offer = offers.find((o) => o.id === id);
      if (!offer) return;
      const signatureId =
        status === "accepted" ? `sig-${Math.random().toString(16).slice(2, 8)}` : offer.signatureId;
      setOffers((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status,
                signatureId,
                signedAt: status === "accepted" ? nowStamp() : o.signedAt,
              }
            : o,
        ),
      );
      const map: Record<string, { stage?: Stage; action: string; detail: string }> = {
        sent: {
          stage: "Offer Sent",
          action: "Offer sent",
          detail: `Signature request delivered to ${offer.signerEmail}`,
        },
        viewed: {
          stage: "Offer Viewed",
          action: "Offer viewed",
          detail: "Secure offer link opened by candidate",
        },
        accepted: {
          stage: "Offer Accepted",
          action: "Offer accepted",
          detail: `E-signature ${signatureId} captured`,
        },
        declined: { action: "Offer declined", detail: note ?? "Candidate declined the offer" },
      };
      const m = map[status];
      if (!m) return;
      if (m.stage) setCandidateStage(offer.candidateId, m.stage, "Automation");
      log({
        candidateId: offer.candidateId,
        candidateName: offer.candidateName,
        actor: status === "sent" ? "Recruiter" : offer.candidateName,
        action: m.action,
        detail: m.detail,
        channel: "E-signature",
      });
    },
    [log, offers, setCandidateStage],
  );

  const scheduleInterview = useCallback<Ctx["scheduleInterview"]>(
    (input) => {
      const link = meetLink();
      const eventId = `gcal_${Math.random().toString(16).slice(2, 10)}`;
      const interview: Interview = {
        ...input,
        id: uid("int"),
        companyId,
        status: "invited",
        meetLink: link,
        calendarEventId: eventId,
      };
      setInterviews((prev) => [interview, ...prev]);
      setCandidateStage(input.candidateId, "Interview Requested", "Recruiter");
      log({
        candidateId: input.candidateId,
        candidateName: input.candidateName,
        actor: "Recruiter",
        action: "Interview Requested",
        detail: `${input.date} ${input.time} (${input.timezone}) · panel ${input.panel.join(", ")}`,
        channel: "System",
      });
      setCandidateStage(input.candidateId, "Calendar Invite Sent", "Automation");
      log({
        candidateId: input.candidateId,
        candidateName: input.candidateName,
        actor: "Automation",
        action: "Calendar Invite Sent",
        detail: `Google Calendar event ${eventId} created with Google Meet link ${link}`,
        channel: "Calendar",
      });
    },
    [companyId, log, setCandidateStage],
  );

  const sendReminder = useCallback(
    (id: string) => {
      const it = interviews.find((i) => i.id === id);
      if (!it) return;
      setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status: "reminded" } : i)));
      setCandidateStage(it.candidateId, "Reminder Sent", "Automation");
      log({
        candidateId: it.candidateId,
        candidateName: it.candidateName,
        actor: "Automation",
        action: "Reminder Sent",
        detail: `Reminder email sent for ${it.date} ${it.time} (${it.timezone})`,
        channel: "Email",
      });
    },
    [interviews, log, setCandidateStage],
  );

  const completeInterview = useCallback(
    (id: string) => {
      const it = interviews.find((i) => i.id === id);
      if (!it) return;
      setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status: "completed" } : i)));
      setCandidateStage(it.candidateId, "Interview Completed", "Recruiter");
      log({
        candidateId: it.candidateId,
        candidateName: it.candidateName,
        actor: "Recruiter",
        action: "Interview Completed",
        detail: `Panel: ${it.panel.join(", ")}`,
        channel: "Manual",
      });
    },
    [interviews, log, setCandidateStage],
  );

  const requestApproval = useCallback<Ctx["requestApproval"]>(
    (input) => {
      setApprovals((prev) => [
        { ...input, id: uid("apr"), companyId, status: "pending", requestedOn: nowStamp() },
        ...prev,
      ]);
      log({
        candidateId: input.candidateId,
        candidateName: input.candidateName,
        actor: "Recruiter",
        action: `${input.approverRole} approval requested`,
        detail: input.summary,
        channel: "System",
      });
    },
    [companyId, log],
  );

  const decideApproval = useCallback<Ctx["decideApproval"]>(
    (id, status, note) => {
      const ap = approvals.find((a) => a.id === id);
      if (!ap) return;
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status, decisionNote: note, decidedOn: nowStamp() } : a,
        ),
      );
      if (status === "approved") setCandidateStage(ap.candidateId, ap.nextStage, ap.approver, note);
      log({
        candidateId: ap.candidateId,
        candidateName: ap.candidateName,
        actor: `${ap.approver} (${ap.approverRole})`,
        action: status === "approved" ? ap.nextStage : `${ap.approverRole} rejected`,
        detail: note || undefined,
        channel: "Manual",
      });
    },
    [approvals, log, setCandidateStage],
  );

  const value = useMemo<Ctx>(() => {
    const scoped = <T extends { companyId: string }>(rows: T[]) =>
      rows.filter((r) => r.companyId === companyId);
    return {
      companies: COMPANIES,
      companyId,
      company:
        COMPANIES.find((c) => c.id === companyId) ??
        COMPANIES[0] ??
        ({
          id: "",
          name: "",
          short: "",
          industry: "",
          plan: "Starter",
          timezone: "",
          openRoles: 0,
        } as Company),
      setCompanyId,
      candidates: scoped(candidates),
      allCandidates: candidates,
      offers: scoped(offers),
      interviews: scoped(interviews),
      approvals: scoped(approvals),
      audit: scoped(audit),
      advanceCandidate,
      setCandidateStage,
      createOffer,
      moveOffer,
      scheduleInterview,
      sendReminder,
      completeInterview,
      decideApproval,
      requestApproval,
    };
  }, [
    advanceCandidate,
    approvals,
    audit,
    candidates,
    companyId,
    completeInterview,
    createOffer,
    decideApproval,
    interviews,
    moveOffer,
    offers,
    requestApproval,
    scheduleInterview,
    sendReminder,
    setCandidateStage,
  ]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
