// Mock data for the GRAVITON IT SOLUTIONS recruitment operations dashboard.
// Multi-tenant: every record is scoped to a client company. No backend yet —
// this mirrors the shape the real database tables will follow.

import { CANDIDATES, type Candidate, type Stage } from "./ats-data";

export const OPERATOR = {
  name: "GRAVITON IT SOLUTIONS",
  tagline: "Recruitment operations platform",
  supportEmail: "operations@gravitonitsolutions.com",
};

export type Company = {
  id: string;
  name: string;
  short: string;
  industry: string;
  plan: "Starter" | "Growth" | "Enterprise";
  timezone: string;
  openRoles: number;
  subdomain?: string;
  size?: string;
  adminEmail?: string;
  onboardedAt?: string;
  connectors?: { linkedin: boolean; googleSheets: boolean };
  totalCandidates?: number;
  status?: "Active" | "Pending Setup" | "Suspended";
};

export const COMPANIES: Company[] = [];

/** Deterministically scope the seeded candidates across client companies. */
export type TenantCandidate = Candidate & { companyId: string };

export const TENANT_CANDIDATES: TenantCandidate[] = [];

export type AuditEntry = {
  id: string;
  companyId: string;
  candidateId: string;
  candidateName: string;
  at: string;
  actor: string;
  action: string;
  detail?: string;
  channel: "System" | "Email" | "Calendar" | "E-signature" | "Manual";
};

export type OfferStatus = "draft" | "generated" | "sent" | "viewed" | "accepted" | "declined";

export const OFFER_FLOW: { status: OfferStatus; label: string; stage: Stage }[] = [
  { status: "generated", label: "Offer generated", stage: "Offer Generated" },
  { status: "sent", label: "Offer sent for signature", stage: "Offer Sent" },
  { status: "viewed", label: "Offer viewed by candidate", stage: "Offer Viewed" },
  { status: "accepted", label: "Offer accepted & signed", stage: "Offer Accepted" },
];

export type Offer = {
  id: string;
  companyId: string;
  candidateId: string;
  candidateName: string;
  role: string;
  salary: string;
  bonus: string;
  startDate: string;
  location: string;
  status: OfferStatus;
  signerEmail: string;
  signatureId?: string;
  signedAt?: string;
  expiresOn: string;
};

export const SEED_OFFERS: Offer[] = [];

export type InterviewStatus = "requested" | "invited" | "reminded" | "completed";

export type Interview = {
  id: string;
  companyId: string;
  candidateId: string;
  candidateName: string;
  role: string;
  panel: string[];
  date: string;
  time: string;
  durationMins: number;
  timezone: string;
  status: InterviewStatus;
  meetLink?: string;
  calendarEventId?: string;
};

export const SEED_INTERVIEWS: Interview[] = [];

export type ApprovalRole = "Hiring Manager" | "HR";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export type Approval = {
  id: string;
  companyId: string;
  candidateId: string;
  candidateName: string;
  role: string;
  approverRole: ApprovalRole;
  approver: string;
  requestedOn: string;
  status: ApprovalStatus;
  summary: string;
  decisionNote?: string;
  decidedOn?: string;
  nextStage: Stage;
};

export const SEED_APPROVALS: Approval[] = [];

export const SEED_AUDIT: AuditEntry[] = [];

export function nowStamp() {
  const d = new Date();
  return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${d
    .toTimeString()
    .slice(0, 5)}`;
}

export function meetLink() {
  const seg = () => Math.random().toString(36).slice(2, 6);
  return `https://meet.google.com/${seg()}-${seg()}-${seg()}`;
}
