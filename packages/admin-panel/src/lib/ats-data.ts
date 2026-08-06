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

export const CANDIDATES: Candidate[] = [];

export const RECRUITERS: string[] = [];
export const ROLES: string[] = [];
