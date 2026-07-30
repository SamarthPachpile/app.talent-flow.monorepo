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

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "tpl-ack",
    name: "Application acknowledgement",
    category: "Screening",
    trigger: "Acknowledgement Email Sent",
    subject: "We received your application for {{role}}",
    body: `Hi {{candidate_name}},

Thanks for applying to the {{role}} position at {{company}}. Your application is now with our recruitment team and we review every submission carefully.

You can follow your progress any time from your candidate portal: {{portal_link}}

Warm regards,
{{recruiter}}
{{company}} Talent Team`,
    active: true,
    updated: "2 days ago",
  },
  {
    id: "tpl-screen",
    name: "Screening call invitation",
    category: "Screening",
    trigger: "Screening Pending",
    subject: "Quick screening call — {{role}}",
    body: `Hi {{candidate_name}},

Your profile looks like a strong match for {{role}}. I'd love to set up a 20 minute screening call to walk through your experience and answer your questions.

Please pick a slot that works for you: {{interview_link}}

Best,
{{recruiter}}`,
    active: true,
    updated: "6 days ago",
  },
  {
    id: "tpl-interview",
    name: "Interview confirmation",
    category: "Interview",
    trigger: "Calendar Invite Sent",
    subject: "Your interview for {{role}} is confirmed",
    body: `Hi {{candidate_name}},

Your interview for {{role}} is confirmed for {{interview_date}}.

Join here: {{interview_link}}

Please have your ID handy and join a couple of minutes early. If anything changes, reply to this email.

Best,
{{recruiter}}`,
    active: true,
    updated: "Yesterday",
  },
  {
    id: "tpl-reminder",
    name: "Interview reminder (24h)",
    category: "Interview",
    trigger: "Reminder Sent",
    subject: "Reminder: interview tomorrow at {{interview_date}}",
    body: `Hi {{candidate_name}},

A quick reminder about your {{role}} interview tomorrow, {{interview_date}}.

Join link: {{interview_link}}

See you then,
{{recruiter}}`,
    active: true,
    updated: "1 week ago",
  },
  {
    id: "tpl-offer",
    name: "Offer letter release",
    category: "Offer",
    trigger: "Offer Sent",
    subject: "Your offer from {{company}}",
    body: `Hi {{candidate_name}},

We're delighted to offer you the {{role}} position at {{company}}.

Review and sign your offer letter securely here: {{offer_link}}

The offer is open for 7 days. Any questions at all, just reply to this email.

Congratulations,
{{recruiter}}`,
    active: true,
    updated: "3 days ago",
  },
  {
    id: "tpl-docs",
    name: "Document request",
    category: "Onboarding",
    trigger: "Documents Requested",
    subject: "Action needed: upload your onboarding documents",
    body: `Hi {{candidate_name}},

Welcome aboard! Before your first day we need a few documents uploaded to your portal: {{portal_link}}

- Government ID
- Educational certificates
- Previous employment proof

Thanks,
{{recruiter}}`,
    active: true,
    updated: "5 days ago",
  },
  {
    id: "tpl-reject",
    name: "Regret — after interview",
    category: "Rejection",
    trigger: "Feedback Submitted",
    subject: "Update on your {{role}} application",
    body: `Hi {{candidate_name}},

Thank you for the time you gave us during the {{role}} process. After careful consideration we've decided to move ahead with another candidate for this role.

We'd genuinely like to stay in touch for future openings.

With appreciation,
{{recruiter}}`,
    active: false,
    updated: "2 weeks ago",
  },
];

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

export const AUTOMATION_RULES: AutomationRule[] = [
  {
    id: "au-1",
    when: "Application Received",
    then: "Send “Application acknowledgement”",
    channel: "Email",
    delay: "Immediately",
    active: true,
  },
  {
    id: "au-2",
    when: "Resume Parsed",
    then: "Auto-assign recruiter by role & workload",
    channel: "In-app",
    delay: "Immediately",
    active: true,
  },
  {
    id: "au-3",
    when: "Shortlisted",
    then: "Notify hiring manager for interview slots",
    channel: "Slack",
    delay: "Immediately",
    active: true,
  },
  {
    id: "au-4",
    when: "Calendar Invite Sent",
    then: "Send “Interview reminder (24h)”",
    channel: "Email",
    delay: "24h before interview",
    active: true,
  },
  {
    id: "au-5",
    when: "Interview Completed",
    then: "Chase interviewer for feedback",
    channel: "Email",
    delay: "After 24h",
    active: true,
  },
  {
    id: "au-6",
    when: "Offer Sent",
    then: "Escalate to HR if offer not viewed",
    channel: "In-app",
    delay: "After 72h",
    active: false,
  },
  {
    id: "au-7",
    when: "Documents Requested",
    then: "Remind candidate about pending documents",
    channel: "SMS",
    delay: "Every 48h",
    active: true,
  },
];

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "Hiring Manager" | "Interviewer" | "HR Ops";
  status: "Active" | "Invited";
};

export const TEAM: TeamMember[] = [
  { id: "u1", name: "Priya Nair", email: "priya@northwind.co", role: "Recruiter", status: "Active" },
  { id: "u2", name: "Dan Whitfield", email: "dan@northwind.co", role: "Recruiter", status: "Active" },
  { id: "u3", name: "Amara Osei", email: "amara@northwind.co", role: "Hiring Manager", status: "Active" },
  { id: "u4", name: "Tom Becker", email: "tom@northwind.co", role: "HR Ops", status: "Active" },
  { id: "u5", name: "Lena Fischer", email: "lena@northwind.co", role: "Interviewer", status: "Invited" },
  { id: "u6", name: "Ravi Menon", email: "ravi@northwind.co", role: "Admin", status: "Active" },
];

export const ROLE_PERMISSIONS: { role: TeamMember["role"]; can: string[] }[] = [
  { role: "Admin", can: ["Everything", "Manage settings", "Manage users", "Delete records"] },
  { role: "Recruiter", can: ["Move stages", "Send templates", "Schedule interviews", "Create offers"] },
  { role: "Hiring Manager", can: ["View own reqs", "Approve candidates", "Submit feedback"] },
  { role: "Interviewer", can: ["View assigned interviews", "Submit feedback"] },
  { role: "HR Ops", can: ["Verify documents", "Run onboarding", "Create employee record"] },
];
