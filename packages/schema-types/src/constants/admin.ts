/**
 * Super Admin Panel Text Constants
 * Contains all static copy for platform governance, multi-tenant audits, approval workflows, and settings.
 */

export const ADMIN_PORTAL_TEXTS = {
  meta: {
    portalName: "Super Admin Suite",
    title: "TalentFlow Monorepo Governance & Admin Suite",
    tagline:
      "Cross-tenant orchestration, global enterprise compliance, and executive approval management.",
    badge: "Platform Super Admin Command Center",
    version: "v2.5.0-enterprise",
  },

  auth: {
    loginTitle: "Platform Admin Sign In",
    loginSubtitle: "Sign in with elevated administrator credentials to manage platform workspaces",
    securityNotice: "Authorized Personnel Only • Zero-Trust Session Auditing Active",
    fields: {
      username: "Admin Username / Key",
      usernamePlaceholder: "admin@talentflow.internal",
      password: "Master Access Password",
      passwordPlaceholder: "••••••••",
      turnstile: "Platform Security Verification",
    },
    loginBtn: "Authenticate & Access Command Center",
    fillDemoAdmin: "Fill Test Admin Credentials",
    backToHome: "Return to Home",
    leftHero: {
      badge: "Platform Command Center",
      mainHeading: "Enterprise Monorepo Multi-Tenant Governance",
      subHeading:
        "Real-time orchestration across all client workspaces, candidate portals, executive approvals, and system-wide SLA monitoring.",
      features: [
        {
          title: "Multi-Tenant Architecture",
          desc: "Full operational visibility and tenant partitioning across all registered enterprises.",
        },
        {
          title: "Global Compliance & Audit Trail",
          desc: "Immutable logs tracking all administrative actions, data exports, and status changes.",
        },
        {
          title: "Cross-Workspace ATS Orchestration",
          desc: "Centralized control over hiring pipelines, offer letter templates, and background verifications.",
        },
        {
          title: "Automated SLA Monitoring",
          desc: "Proactive alerting for onboarding blockers, pending approvals, and system uptime.",
        },
      ],
    },
  },

  nav: {
    dashboard: "Dashboard Overview",
    companies: "Onboarded Enterprises",
    interviews: "Interviews & Panels",
    approvals: "Executive Approvals",
    offers: "Offer Letters & Comp",
    settings: "System Settings",
  },

  dashboard: {
    kpis: {
      totalCompanies: "Total Onboarded Enterprises",
      activeApplications: "Active Job Applications",
      pendingApprovals: "Pending Executive Approvals",
      pendingOffers: "Pending Offer Letters",
      systemUptime: "System Health & Uptime",
      monthlyThroughput: "Monthly Onboarding Throughput",
    },
    quickActions: {
      title: "Command Center Quick Actions",
      addCompany: "Onboard New Enterprise",
      reviewApprovals: "Review Pending Approvals",
      issueOffer: "Generate Offer Template",
      exportAudit: "Export System Audit Log",
    },
    recentActivityTitle: "Platform Live Event Stream",
  },

  companiesPage: {
    title: "Onboarded Enterprises & Workspaces",
    subtitle:
      "Manage multi-tenant company configurations, domain mappings, subscription tiers, and active seats.",
    searchPlaceholder: "Search enterprises by name, subdomain, or admin email...",
    tableHeaders: {
      company: "Company Name & Subdomain",
      plan: "Subscription Plan",
      size: "Company Size",
      activeCandidates: "Active Candidates",
      status: "Workspace Status",
      createdAt: "Onboarded Date",
      actions: "Actions",
    },
  },

  approvalsPage: {
    title: "Executive Approval Workflows",
    subtitle:
      "Review compensation exceptions, headcount requisitions, and enterprise offer authorizations.",
    filters: {
      all: "All Requests",
      pending: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
    },
    tableHeaders: {
      candidate: "Candidate Name",
      company: "Company",
      role: "Position",
      compPackage: "Total Comp Package",
      requestedBy: "Requested By",
      status: "Approval Status",
      actions: "Actions",
    },
  },

  offersPage: {
    title: "Global Offer Letter Generation",
    subtitle:
      "Standardized enterprise offer templates with automated statutory legal clauses and dynamic token replacement.",
    templateBadge: "Legally Certified Templates",
  },

  settings: {
    title: "Platform System Settings",
    subtitle:
      "Configure global automation rules, compliance thresholds, email SMTP relays, and administrator team RBAC.",
    sections: {
      general: "General Platform Config",
      automation: "Workflow Automations & Triggers",
      guidelines: "Statutory Compliance Guidelines",
      team: "Admin Team & Role-Based Access",
      templates: "Contract & Offer Letter Templates",
    },
  },
} as const;
