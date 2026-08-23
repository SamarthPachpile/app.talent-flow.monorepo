/**
 * Company Onboarding & Employer Portal Text Constants
 * Contains all static copy for workspace onboarding, dashboard metrics, pipeline stages, and settings.
 */

export const COMPANY_PORTAL_TEXTS = {
  meta: {
    portalName: "Employer Workspace",
    title: "Company Onboarding & Workspace Portal",
    tagline:
      "Streamline enterprise hiring, automated onboarding workflows, and candidate pipeline tracking.",
    badge: "Enterprise Workspace Suite",
  },

  home: {
    hero: {
      badge: "Next-Gen Enterprise ATS & Onboarding",
      title: "Transform Candidate Onboarding into a Unified Digital Experience",
      subtitle:
        "Launch your custom-branded career hub, automate 7-stage candidate roadmaps, streamline hardware provisioning, and track candidate pipeline in real time.",
      primaryCta: "Register Company Workspace",
      secondaryCta: "Sign In to Workspace",
      viewPricing: "Explore Enterprise Plans",
    },
    metrics: [
      { value: "500+", label: "Enterprises Powered" },
      { value: "99.8%", label: "Onboarding Success Rate" },
      { value: "15k+", label: "Candidates Successfully Onboarded" },
      { value: "< 48 hrs", label: "Average Time to Full Setup" },
    ],
    features: [
      {
        title: "Automated Candidate Roadmaps",
        description:
          "Guide new hires through a personalized 7-step onboarding roadmap with zero manual friction.",
        icon: "Workflow",
      },
      {
        title: "Custom Branded Portals",
        description:
          "Every employer gets a customized subdomain with dedicated colors, logo, and careers feed.",
        icon: "Globe",
      },
      {
        title: "Two-Way ATS Connectors",
        description:
          "Seamless synchronization with Greenhouse, Lever, Workday, BambooHR, and Ashby.",
        icon: "Share2",
      },
      {
        title: "Enterprise Compliance & Audit",
        description: "SOC2, GDPR, CCPA, and statutory global payroll compliance out of the box.",
        icon: "ShieldCheck",
      },
    ],
    pricing: {
      title: "Transparent Plans for Every Organization",
      subtitle: "Choose the right tier to power your recruiting pipeline and onboarding workflows.",
      plans: [
        {
          name: "Startup",
          price: "$299",
          period: "/month",
          description: "For emerging teams scaling up to 50 hires annually.",
          features: [
            "Up to 50 active onboarding roadmaps",
            "Branded candidate portal",
            "Basic ATS email connectors",
            "Standard email support",
          ],
        },
        {
          name: "Growth",
          price: "$799",
          period: "/month",
          description: "For rapidly growing mid-market companies.",
          badge: "Most Popular",
          features: [
            "Unlimited candidate onboarding roadmaps",
            "Custom subdomain & theme engine",
            "Native Greenhouse & Lever sync",
            "Automated background check integration",
            "Priority 24/7 dedicated support",
          ],
        },
        {
          name: "Enterprise",
          price: "Custom",
          period: "tailored billing",
          description: "For global enterprises requiring custom security & SLAs.",
          features: [
            "Full custom domain support with SSL",
            "Custom SSO (Okta, Azure AD, Ping)",
            "Dedicated Slack channel & Customer Success Manager",
            "Custom hardware vendor integration",
            "99.99% Enterprise Uptime SLA",
          ],
        },
      ],
    },
  },

  auth: {
    loginTitle: "Company Workspace Sign In",
    loginSubtitle: "Sign in with your enterprise work email to manage candidate pipelines",
    signupTitle: "Create Company Workspace",
    signupSubtitle: "Register your company and configure your branded onboarding portal",
    googleSignIn: "Sign in with Google Workspace",
    googleSignUp: "Register with Google Workspace",
    emailDivider: "or continue with work email",
    fields: {
      companyName: "Company Name",
      companyNamePlaceholder: "e.g. Acme Corporation",
      adminName: "Workspace Admin Full Name",
      adminNamePlaceholder: "e.g. Sarah Connor",
      email: "Enterprise Work Email",
      emailPlaceholder: "sarah@acme.com",
      phone: "Business Phone Number",
      phonePlaceholder: "+1 (555) 000-0000",
      companySize: "Organization Size",
      industry: "Industry Sector",
      country: "Primary Headquarters Country",
      password: "Create Secure Password",
      passwordPlaceholder: "••••••••",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "••••••••",
      termsCheckbox: "I agree to Enterprise Terms of Service and Data Processing Addendum (DPA)",
    },
    switchModeToSignup: "Register Company (New Account)",
    switchModeToLogin: "Sign In",
    backToHome: "Back to Company Portal",
    fillDemoCompany: "Fill Test Company Credentials",
    verificationModal: {
      title: "Verify Enterprise Work Email",
      instructionPrefix: "We have dispatched a 6-digit security authorization code to",
      instructionSuffix:
        "Enter the code to verify workspace ownership and launch your setup wizard.",
      resendCode: "Resend Code",
      verifyBtn: "Verify & Launch Workspace Wizard",
      changeEmail: "Change Work Email",
    },
    leftHero: {
      badge: "Enterprise Employer Portal",
      mainHeading: "Unified Enterprise Hiring & Onboarding Command Center",
      subHeading:
        "Deliver exceptional first impressions to candidates. Automate offer workflows, equipment selection, background checks, and compliance in one unified system.",
      features: [
        {
          title: "Branded Candidate Portals",
          desc: "Dedicated candidate-facing portal with custom branding and direct job application tracking.",
        },
        {
          title: "Real-Time Pipeline Kanban",
          desc: "Visual workflow management to advance candidates across interview and offer stages.",
        },
        {
          title: "Instant ATS & HRIS Connectors",
          desc: "Bi-directional syncing with Greenhouse, Lever, Workday, BambooHR, and Slack.",
        },
        {
          title: "Global Statutory Compliance",
          desc: "Integrated background checks, automated offer letters, and audit trails.",
        },
      ],
    },
  },

  wizard: {
    badge: "Workspace Configuration",
    title: "Company Onboarding Setup Wizard",
    subtitle:
      "Complete these steps to configure your enterprise workspace, branding parameters, and hiring pipeline stages.",
    steps: [
      {
        id: 1,
        title: "Company Profile",
        description: "Basic company identity, legal entity name, and size.",
      },
      {
        id: 2,
        title: "Subdomain & Portal Branding",
        description: "Configure unique subdomain, company logo, and brand color palette.",
      },
      {
        id: 3,
        title: "Workspace Admin & Team",
        description: "Set primary administrator contact and invite initial HR team members.",
      },
      {
        id: 4,
        title: "Hiring Workflow & Stages",
        description: "Customize the 7-stage candidate roadmap and automated notification triggers.",
      },
      {
        id: 5,
        title: "ATS & Tool Integrations",
        description: "Connect your existing applicant tracking system and Slack notifications.",
      },
      {
        id: 6,
        title: "Review & Launch",
        description: "Verify configuration and publish live company workspace.",
      },
    ],
  },

  dashboard: {
    nav: {
      overview: "Overview",
      pipeline: "Pipeline Kanban",
      candidates: "Candidates ATS",
      team: "Team & Permissions",
      integrations: "ATS Connectors",
      settings: "Workspace Settings",
    },
    kpiCards: {
      totalCandidates: "Total Active Candidates",
      offersExtended: "Offers Extended",
      onboardingInProgress: "Onboarding in Progress",
      hiredThisMonth: "Hired This Month",
      avgTimeToHire: "Average Time to Hire",
      offerAcceptanceRate: "Offer Acceptance Rate",
    },
    pipelineStages: [
      { id: "applied", label: "Applied", color: "blue" },
      { id: "screening", label: "Screening", color: "amber" },
      { id: "technical", label: "Technical Interview", color: "purple" },
      { id: "final_round", label: "Final Leadership", color: "indigo" },
      { id: "offer_extended", label: "Offer Extended", color: "orange" },
      { id: "offer_accepted", label: "Offer Accepted", color: "emerald" },
      { id: "onboarding", label: "Onboarding Active", color: "teal" },
      { id: "hired", label: "Day One Complete", color: "green" },
    ],
  },

  teamRoles: [
    {
      role: "Super Admin",
      description:
        "Full administrative access to workspace settings, billing, team management, and all candidate records.",
    },
    {
      role: "HR Manager",
      description:
        "Can manage candidate pipelines, issue offer letters, configure roadmaps, and invite team members.",
    },
    {
      role: "Recruiter",
      description:
        "Can advance candidates through pipeline stages, schedule interviews, and upload resumes.",
    },
    {
      role: "Hiring Manager",
      description:
        "Can review candidate profiles, submit interview scorecards, and approve offer requests.",
    },
    {
      role: "Interviewer",
      description:
        "Read-only access to assigned candidates and ability to submit structured interview feedback.",
    },
  ],

  connectors: [
    {
      id: "greenhouse",
      name: "Greenhouse",
      category: "ATS",
      description: "Automatically sync job openings, candidate stages, and interview scorecards.",
      status: "connected",
    },
    {
      id: "lever",
      name: "Lever",
      category: "ATS",
      description: "Import candidates directly into TalentFlow onboarding upon offer generation.",
      status: "available",
    },
    {
      id: "workday",
      name: "Workday HRIS",
      category: "HRIS",
      description: "Sync employee master data, statutory tax info, and payroll records.",
      status: "available",
    },
    {
      id: "slack",
      name: "Slack Notifications",
      category: "Communication",
      description:
        "Receive instant notifications in dedicated Slack channels when candidates accept offers.",
      status: "connected",
    },
    {
      id: "checkr",
      name: "Checkr Background Check",
      category: "Compliance",
      description:
        "Automate criminal, employment, and education verification checks for new hires.",
      status: "available",
    },
  ],
} as const;
