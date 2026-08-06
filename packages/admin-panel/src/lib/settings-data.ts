// Mock settings data. No backend yet — this mirrors the shape the real
// database tables will follow.

import { STAGES, type Stage } from "./ats-data";

export type EmailTemplate = {
  id: string;
  name: string;
  category: "Screening" | "Interview" | "Offer" | "Onboarding" | "Rejection";
  trigger: Stage;
  subject: string;
  body: string;
  active: boolean;
  updated: string;
};

export const TEMPLATE_VARIABLES = [
  { token: "{{candidate_name}}", description: "Candidate full name" },
  { token: "{{role}}", description: "Job title applied for" },
  { token: "{{recruiter}}", description: "Assigned recruiter" },
  { token: "{{company}}", description: "Your organisation name" },
  { token: "{{interview_date}}", description: "Scheduled interview date & time" },
  { token: "{{interview_link}}", description: "Video meeting link" },
  { token: "{{offer_link}}", description: "Secure offer letter link" },
  { token: "{{portal_link}}", description: "Candidate portal login link" },
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [];

export const TEMPLATE_CATEGORIES = [
  "Screening",
  "Interview",
  "Offer",
  "Onboarding",
  "Rejection",
] as const;

export const TRIGGER_STAGES = STAGES;

export type AutomationRule = {
  id: string;
  when: Stage;
  then: string;
  channel: "Email" | "SMS" | "In-app" | "Slack";
  delay: string;
  active: boolean;
};

export const AUTOMATION_RULES: AutomationRule[] = [];

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "Hiring Manager" | "Interviewer" | "HR Ops";
  status: "Active" | "Invited";
};

export const TEAM: TeamMember[] = [];

export const ROLE_PERMISSIONS: { role: TeamMember["role"]; can: string[] }[] = [
  { role: "Admin", can: ["Everything", "Manage settings", "Manage users", "Delete records"] },
  {
    role: "Recruiter",
    can: ["Move stages", "Send templates", "Schedule interviews", "Create offers"],
  },
  { role: "Hiring Manager", can: ["View own reqs", "Approve candidates", "Submit feedback"] },
  { role: "Interviewer", can: ["View assigned interviews", "Submit feedback"] },
  { role: "HR Ops", can: ["Verify documents", "Run onboarding", "Create employee record"] },
];
