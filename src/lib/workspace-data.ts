// Mock data for the CROTON IT SOLUTIONS recruitment operations dashboard.
// Multi-tenant: every record is scoped to a client company. No backend yet —
// this mirrors the shape the real database tables will follow.

import { CANDIDATES, type Candidate, type Stage } from "./ats-data";

export const OPERATOR = {
  name: "CROTON IT SOLUTIONS",
  tagline: "Recruitment operations platform",
  supportEmail: "operations@crotonitsolutions.com",
};

export type Company = {
  id: string;
  name: string;
  short: string;
  industry: string;
  plan: "Starter" | "Growth" | "Enterprise";
  timezone: string;
  openRoles: number;
};

export const COMPANIES: Company[] = [
  {
    id: "co-northwind",
    name: "Northwind Technologies",
    short: "NW",
    industry: "SaaS",
    plan: "Enterprise",
    timezone: "Europe/London",
    openRoles: 12,
  },
  {
    id: "co-halcyon",
    name: "Halcyon Health",
    short: "HH",
    industry: "Healthcare",
    plan: "Growth",
    timezone: "Europe/Lisbon",
    openRoles: 6,
  },
  {
    id: "co-meridian",
    name: "Meridian Logistics",
    short: "ML",
    industry: "Supply chain",
    plan: "Starter",
    timezone: "Asia/Singapore",
    openRoles: 4,
  },
];

/** Deterministically scope the seeded candidates across client companies. */
export type TenantCandidate = Candidate & { companyId: string };

export const TENANT_CANDIDATES: TenantCandidate[] = CANDIDATES.map((c, i) => ({
  ...c,
  companyId: COMPANIES[i % COMPANIES.length].id,
}));

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

export type OfferStatus =
  | "draft"
  | "generated"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined";

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

export const SEED_OFFERS: Offer[] = [
  {
    id: "off-2201",
    companyId: "co-northwind",
    candidateId: "c-1048",
    candidateName: "Oscar Nilsen",
    role: "Account Executive",
    salary: "€96,000",
    bonus: "20% OTE",
    startDate: "01 Sep 2026",
    location: "Oslo · Onsite",
    status: "sent",
    signerEmail: "oscar.nilsen@mail.com",
    expiresOn: "14 Aug 2026",
  },
  {
    id: "off-2202",
    companyId: "co-halcyon",
    candidateId: "c-1053",
    candidateName: "Wei Zhang",
    role: "Engineering Manager",
    salary: "SGD 210,000",
    bonus: "15%",
    startDate: "15 Aug 2026",
    location: "Singapore · Onsite",
    status: "accepted",
    signerEmail: "wei.zhang@mail.com",
    signatureId: "sig-8f21ac",
    signedAt: "24 Jul 2026 · 09:14",
    expiresOn: "26 Jul 2026",
  },
  {
    id: "off-2203",
    companyId: "co-meridian",
    candidateId: "c-1047",
    candidateName: "Leila Farouk",
    role: "Data Analyst",
    salary: "$74,000",
    bonus: "10%",
    startDate: "22 Aug 2026",
    location: "Cairo · Remote",
    status: "draft",
    signerEmail: "leila.farouk@mail.com",
    expiresOn: "20 Aug 2026",
  },
];

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

export const SEED_INTERVIEWS: Interview[] = [
  {
    id: "int-3301",
    companyId: "co-halcyon",
    candidateId: "c-1045",
    candidateName: "Hana Kobayashi",
    role: "Engineering Manager",
    panel: ["Tom Ellis", "Dan Whitfield"],
    date: "05 Aug 2026",
    time: "10:00",
    durationMins: 60,
    timezone: "Asia/Tokyo",
    status: "invited",
    meetLink: "https://meet.google.com/hkq-mnvt-payload",
    calendarEventId: "gcal_7fa10c2b",
  },
  {
    id: "int-3302",
    companyId: "co-northwind",
    candidateId: "c-1044",
    candidateName: "Ethan Cole",
    role: "Senior Backend Engineer",
    panel: ["Tom Ellis"],
    date: "07 Aug 2026",
    time: "15:30",
    durationMins: 45,
    timezone: "Europe/London",
    status: "requested",
  },
];

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

export const SEED_APPROVALS: Approval[] = [
  {
    id: "apr-4401",
    companyId: "co-northwind",
    candidateId: "c-1046",
    candidateName: "Marcus Bell",
    role: "Product Designer",
    approverRole: "Hiring Manager",
    approver: "Rae Lindqvist",
    requestedOn: "28 Jul 2026",
    status: "pending",
    summary: "Panel feedback submitted — 4.4/5 average. Requesting approval to move to offer.",
    nextStage: "Hiring Manager Approved",
  },
  {
    id: "apr-4402",
    companyId: "co-meridian",
    candidateId: "c-1047",
    candidateName: "Leila Farouk",
    role: "Data Analyst",
    approverRole: "HR",
    approver: "Grace Oyelaran",
    requestedOn: "27 Jul 2026",
    status: "pending",
    summary: "Hiring manager approved. HR to confirm band, budget and headcount before offer.",
    nextStage: "HR Approved",
  },
  {
    id: "apr-4403",
    companyId: "co-halcyon",
    candidateId: "c-1054",
    candidateName: "Camille Roy",
    role: "QA Engineer",
    approverRole: "Hiring Manager",
    approver: "Tom Ellis",
    requestedOn: "22 Jul 2026",
    status: "approved",
    decisionNote: "Strong automation depth. Approved to proceed.",
    decidedOn: "23 Jul 2026",
    summary: "Interview completed, feedback in. Approval to progress the candidate.",
    nextStage: "Hiring Manager Approved",
  },
];

export const SEED_AUDIT: AuditEntry[] = [
  {
    id: "aud-1",
    companyId: "co-halcyon",
    candidateId: "c-1053",
    candidateName: "Wei Zhang",
    at: "24 Jul 2026 · 09:14",
    actor: "Wei Zhang",
    action: "Offer accepted",
    detail: "E-signature sig-8f21ac captured · IP 103.21.44.9",
    channel: "E-signature",
  },
  {
    id: "aud-2",
    companyId: "co-halcyon",
    candidateId: "c-1053",
    candidateName: "Wei Zhang",
    at: "23 Jul 2026 · 18:02",
    actor: "Wei Zhang",
    action: "Offer viewed",
    detail: "Secure link opened from Singapore",
    channel: "E-signature",
  },
  {
    id: "aud-3",
    companyId: "co-northwind",
    candidateId: "c-1048",
    candidateName: "Oscar Nilsen",
    at: "22 Jul 2026 · 11:40",
    actor: "Priya Nair",
    action: "Offer sent",
    detail: "Signature request delivered to oscar.nilsen@mail.com",
    channel: "E-signature",
  },
  {
    id: "aud-4",
    companyId: "co-halcyon",
    candidateId: "c-1045",
    candidateName: "Hana Kobayashi",
    at: "21 Jul 2026 · 08:15",
    actor: "Automation",
    action: "Calendar Invite Sent",
    detail: "Google Calendar event gcal_7fa10c2b created with Google Meet link",
    channel: "Calendar",
  },
];

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
