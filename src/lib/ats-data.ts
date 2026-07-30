// Mock data for the ATS pipeline. No backend yet — this is the shape the
// real database will follow later.

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
  | "intake"
  | "screening"
  | "interview"
  | "approval"
  | "offer"
  | "verification"
  | "onboarding";

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

export type Priority = "standard" | "high" | "urgent";

export type StageEvent = {
  stage: Stage;
  at: string;
  actor: string;
  note?: string;
};

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
  priority: Priority;
  blocked?: string;
  tags: string[];
  history: StageEvent[];
};

function history(stage: Stage, actor: string): StageEvent[] {
  const upto = STAGES.slice(0, stageIndex(stage) + 1) as Stage[];
  return upto.map((s, i) => ({
    stage: s,
    at: `Day ${i + 1}`,
    actor: i < 5 ? "Automation" : actor,
  }));
}

export const CANDIDATES: Candidate[] = [
  {
    id: "c-1041",
    name: "Amara Okonkwo",
    initials: "AO",
    role: "Senior Backend Engineer",
    department: "Engineering",
    location: "Lagos · Remote",
    source: "Referral",
    email: "amara.okonkwo@mail.com",
    appliedOn: "12 Jul 2026",
    recruiter: "Priya Nair",
    hiringManager: "Tom Ellis",
    stage: "Duplicate Check",
    priority: "high",
    tags: ["Go", "Kubernetes"],
    history: history("Duplicate Check", "Priya Nair"),
  },
  {
    id: "c-1042",
    name: "Julien Barre",
    initials: "JB",
    role: "Product Designer",
    department: "Design",
    location: "Paris · Hybrid",
    source: "Careers site",
    email: "julien.barre@mail.com",
    appliedOn: "14 Jul 2026",
    recruiter: "Priya Nair",
    hiringManager: "Rae Lindqvist",
    stage: "Resume Parsed",
    priority: "standard",
    tags: ["Figma", "Design systems"],
    history: history("Resume Parsed", "Priya Nair"),
  },
  {
    id: "c-1043",
    name: "Sofia Marchetti",
    initials: "SM",
    role: "Data Analyst",
    department: "Analytics",
    location: "Milan · Onsite",
    source: "LinkedIn",
    email: "sofia.marchetti@mail.com",
    appliedOn: "09 Jul 2026",
    recruiter: "Dan Whitfield",
    hiringManager: "Nadia Haq",
    stage: "Screening Pending",
    priority: "urgent",
    blocked: "Screening call not booked for 4 days",
    tags: ["SQL", "dbt"],
    history: history("Screening Pending", "Dan Whitfield"),
  },
  {
    id: "c-1044",
    name: "Ethan Cole",
    initials: "EC",
    role: "Senior Backend Engineer",
    department: "Engineering",
    location: "Austin · Remote",
    source: "Agency",
    email: "ethan.cole@mail.com",
    appliedOn: "02 Jul 2026",
    recruiter: "Priya Nair",
    hiringManager: "Tom Ellis",
    stage: "Shortlisted",
    priority: "high",
    tags: ["Rust", "Distributed systems"],
    history: history("Shortlisted", "Priya Nair"),
  },
  {
    id: "c-1045",
    name: "Hana Kobayashi",
    initials: "HK",
    role: "Engineering Manager",
    department: "Engineering",
    location: "Tokyo · Hybrid",
    source: "Referral",
    email: "hana.kobayashi@mail.com",
    appliedOn: "28 Jun 2026",
    recruiter: "Dan Whitfield",
    hiringManager: "Tom Ellis",
    stage: "Calendar Invite Sent",
    priority: "standard",
    tags: ["Leadership", "Platform"],
    history: history("Calendar Invite Sent", "Dan Whitfield"),
  },
  {
    id: "c-1046",
    name: "Marcus Bell",
    initials: "MB",
    role: "Product Designer",
    department: "Design",
    location: "London · Hybrid",
    source: "Careers site",
    email: "marcus.bell@mail.com",
    appliedOn: "24 Jun 2026",
    recruiter: "Priya Nair",
    hiringManager: "Rae Lindqvist",
    stage: "Feedback Submitted",
    priority: "standard",
    tags: ["Prototyping", "Research"],
    history: history("Feedback Submitted", "Priya Nair"),
  },
  {
    id: "c-1047",
    name: "Leila Farouk",
    initials: "LF",
    role: "Data Analyst",
    department: "Analytics",
    location: "Cairo · Remote",
    source: "LinkedIn",
    email: "leila.farouk@mail.com",
    appliedOn: "18 Jun 2026",
    recruiter: "Dan Whitfield",
    hiringManager: "Nadia Haq",
    stage: "Hiring Manager Approved",
    priority: "high",
    blocked: "Waiting on HR approval since Monday",
    tags: ["Python", "Looker"],
    history: history("Hiring Manager Approved", "Dan Whitfield"),
  },
  {
    id: "c-1048",
    name: "Oscar Nilsen",
    initials: "ON",
    role: "Account Executive",
    department: "Sales",
    location: "Oslo · Onsite",
    source: "Agency",
    email: "oscar.nilsen@mail.com",
    appliedOn: "11 Jun 2026",
    recruiter: "Priya Nair",
    hiringManager: "Grace Oyelaran",
    stage: "Offer Sent",
    priority: "urgent",
    tags: ["Enterprise", "SaaS"],
    history: history("Offer Sent", "Priya Nair"),
  },
  {
    id: "c-1049",
    name: "Priyanka Rao",
    initials: "PR",
    role: "QA Engineer",
    department: "Engineering",
    location: "Bengaluru · Remote",
    source: "Referral",
    email: "priyanka.rao@mail.com",
    appliedOn: "05 Jun 2026",
    recruiter: "Dan Whitfield",
    hiringManager: "Tom Ellis",
    stage: "Documents Uploaded",
    priority: "standard",
    tags: ["Playwright", "Automation"],
    history: history("Documents Uploaded", "Dan Whitfield"),
  },
  {
    id: "c-1050",
    name: "Tobias Kruger",
    initials: "TK",
    role: "Account Executive",
    department: "Sales",
    location: "Berlin · Hybrid",
    source: "Careers site",
    email: "tobias.kruger@mail.com",
    appliedOn: "30 May 2026",
    recruiter: "Priya Nair",
    hiringManager: "Grace Oyelaran",
    stage: "Laptop Assigned",
    priority: "standard",
    tags: ["Mid-market"],
    history: history("Laptop Assigned", "Priya Nair"),
  },
  {
    id: "c-1051",
    name: "Nora Duarte",
    initials: "ND",
    role: "People Operations Lead",
    department: "People",
    location: "Lisbon · Hybrid",
    source: "Referral",
    email: "nora.duarte@mail.com",
    appliedOn: "22 May 2026",
    recruiter: "Dan Whitfield",
    hiringManager: "Grace Oyelaran",
    stage: "Joining Confirmed",
    priority: "high",
    tags: ["HRIS", "Onboarding"],
    history: history("Joining Confirmed", "Dan Whitfield"),
  },
  {
    id: "c-1052",
    name: "Idris Mensah",
    initials: "IM",
    role: "Support Specialist",
    department: "Support",
    location: "Accra · Remote",
    source: "Careers site",
    email: "idris.mensah@mail.com",
    appliedOn: "16 Jul 2026",
    recruiter: "Priya Nair",
    hiringManager: "Nadia Haq",
    stage: "Acknowledgement Email Sent",
    priority: "standard",
    tags: ["Zendesk"],
    history: history("Acknowledgement Email Sent", "Priya Nair"),
  },
  {
    id: "c-1053",
    name: "Wei Zhang",
    initials: "WZ",
    role: "Engineering Manager",
    department: "Engineering",
    location: "Singapore · Onsite",
    source: "LinkedIn",
    email: "wei.zhang@mail.com",
    appliedOn: "07 Jun 2026",
    recruiter: "Dan Whitfield",
    hiringManager: "Tom Ellis",
    stage: "Offer Accepted",
    priority: "high",
    tags: ["Scaling teams"],
    history: history("Offer Accepted", "Dan Whitfield"),
  },
  {
    id: "c-1054",
    name: "Camille Roy",
    initials: "CR",
    role: "QA Engineer",
    department: "Engineering",
    location: "Montreal · Remote",
    source: "Agency",
    email: "camille.roy@mail.com",
    appliedOn: "20 Jun 2026",
    recruiter: "Priya Nair",
    hiringManager: "Tom Ellis",
    stage: "Interview Completed",
    priority: "standard",
    tags: ["Cypress", "API testing"],
    history: history("Interview Completed", "Priya Nair"),
  },
  {
    id: "c-1055",
    name: "Diego Alvarez",
    initials: "DA",
    role: "Support Specialist",
    department: "Support",
    location: "Bogotá · Remote",
    source: "Referral",
    email: "diego.alvarez@mail.com",
    appliedOn: "01 Jun 2026",
    recruiter: "Dan Whitfield",
    hiringManager: "Nadia Haq",
    stage: "Verification Complete",
    priority: "standard",
    tags: ["Bilingual"],
    history: history("Verification Complete", "Dan Whitfield"),
  },
];

export const RECRUITERS = ["Priya Nair", "Dan Whitfield"];
export const ROLES = Array.from(new Set(CANDIDATES.map((c) => c.role)));
