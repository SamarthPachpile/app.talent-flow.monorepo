import { OnboardingState } from "../types/onboarding";

export function getDefaultOnboardingState(
  initialCompanyName?: string,
  initialEmail?: string,
  initialAdminName?: string,
): OnboardingState {
  const compName = initialCompanyName || "";
  const cleanSlug = compName ? compName.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const domain = cleanSlug ? `${cleanSlug}.com` : "";
  const email = initialEmail || (domain ? `admin@${domain}` : "");
  const now = new Date();
  const fourteenDaysLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const companyUuid =
    "comp-" +
    Math.random().toString(36).substring(2, 11) +
    "-" +
    Math.random().toString(36).substring(2, 6);
  const workspaceUuid = "ws-" + Math.random().toString(36).substring(2, 11);
  const tenantUuid =
    "tenant-" + (cleanSlug || "workspace") + "-" + Math.floor(1000 + Math.random() * 9000);
  const adminUserUuid = "usr-admin-" + Math.random().toString(36).substring(2, 8);
  const apiKey =
    "tf_live_sk_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  return {
    currentStep: 1,
    isCompleted: false,

    profile: {
      name: compName,
      legalName: compName ? `${compName} Private Limited` : "",
      subdomain: cleanSlug,
      domain: domain,
      industry: "Technology & Software",
      size: "51-200 Employees",
      logoUrl: "",
      coverImageUrl: "",
      gstNumber: "",
      panNumber: "",
      cinNumber: "",
      registrationNumber: "",
      website: domain ? `https://www.${domain}` : "",
      linkedin: cleanSlug ? `https://linkedin.com/company/${cleanSlug}` : "",
      about: compName ? `${compName} enterprise workspace.` : "",
      yearFounded: new Date().getFullYear().toString(),
      employeeCount: "",
      headOfficeAddress: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      timezone: "UTC",
      businessHours: "09:00 AM - 06:00 PM",
      brandColor: "#6366f1",
      headquarters: "",
    },

    admin: {
      fullName: initialAdminName || "",
      workEmail: email,
      phone: "",
      jobTitle: "Super Admin",
      billingEmail: email,
    },

    plan: {
      id: "growth",
      name: "Growth Enterprise Plan",
      priceMonthly: 899,
      priceAnnually: 749,
      billingCycle: "annually",
      seatLimit: 50,
    },

    modules: {
      ats: true,
      interviewScheduler: true,
      candidatePortal: true,
      onboardingChecklist: true,
      itAssetManagement: true,
      documentESign: true,
      automationEngine: true,
    },

    officeLocations: {
      headOffice: {
        address: "Suite 400, Financial District Tower, Innovation Way",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400051",
      },
      branchOffices: [
        {
          id: "loc-1",
          name: "Bengaluru Tech Park Hub",
          address: "7th Floor, Cyber Towers, Outer Ring Road",
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
          pincode: "560103",
          capacity: 85,
        },
        {
          id: "loc-2",
          name: "Delhi NCR Regional Center",
          address: "DLF Cyber City, Tower B, Phase II",
          city: "Gurugram",
          state: "Haryana",
          country: "India",
          pincode: "122002",
          capacity: 40,
        },
      ],
      remoteLocations: {
        enabled: true,
        allowedCountries: [
          "India",
          "United States",
          "Singapore",
          "United Kingdom",
          "United Arab Emirates",
        ],
      },
      workingHours: "09:00 AM - 06:00 PM (Flexible Shift Windows Allowed)",
      holidayCalendar: "Standard Corporate Holiday Calendar (14 Paid Public Holidays)",
    },

    hrTeam: [
      {
        id: "team-1",
        name: initialAdminName || "Company Admin",
        email: email,
        designation: "Super Admin",
        department: "Executive Management",
        role: "Super Admin",
        permissions: [
          "Super Admin",
          "Full Workspace Access",
          "Manage System & Users",
          "Approve Offers",
          "Payroll Sync",
          "Security & Compliance Settings",
        ],
        status: "Active",
      },
    ],

    teamInvites: [],

    departments: [
      "Engineering",
      "HR",
      "Sales",
      "Marketing",
      "Finance",
      "Operations",
      "Support",
      "Legal",
      "Administration",
    ],

    jobTitles: [
      "Software Engineer",
      "Senior Software Engineer",
      "QA Engineer",
      "DevOps",
      "HR Executive",
      "Recruiter",
      "Manager",
      "Intern",
    ],

    recruitmentWorkflow: [
      {
        id: "stg-1",
        name: "Application Received",
        color: "#64748b",
        slaHours: 24,
        description: "Candidate submitted resume",
      },
      {
        id: "stg-2",
        name: "Resume Screening",
        color: "#3b82f6",
        slaHours: 48,
        description: "AI & Recruiter review",
      },
      {
        id: "stg-3",
        name: "Shortlisted",
        color: "#0284c7",
        slaHours: 48,
        description: "Approved for evaluation",
      },
      {
        id: "stg-4",
        name: "Assessment",
        color: "#8b5cf6",
        slaHours: 72,
        description: "Coding & Skill Test",
      },
      {
        id: "stg-5",
        name: "Technical Interview",
        color: "#ec4899",
        slaHours: 48,
        description: "Deep technical discussion",
      },
      {
        id: "stg-6",
        name: "Manager Round",
        color: "#f59e0b",
        slaHours: 48,
        description: "Leadership & Team fit",
      },
      {
        id: "stg-7",
        name: "HR Round",
        color: "#10b981",
        slaHours: 24,
        description: "Culture, expectations & salary",
      },
      {
        id: "stg-8",
        name: "Offer Approval",
        color: "#d97706",
        slaHours: 24,
        description: "Executive compensation approval",
      },
      {
        id: "stg-9",
        name: "Offer Released",
        color: "#059669",
        slaHours: 120,
        description: "Offer letter dispatched",
      },
      {
        id: "stg-10",
        name: "Offer Accepted",
        color: "#16a34a",
        slaHours: 24,
        description: "Signed offer received",
      },
      {
        id: "stg-11",
        name: "Preboarding",
        color: "#6366f1",
        slaHours: 168,
        description: "BGC & Document verification",
      },
      {
        id: "stg-12",
        name: "Joined",
        color: "#22c55e",
        slaHours: 0,
        description: "First day onboarding active",
      },
    ],

    candidateDocuments: {
      Resume: { enabled: true, required: true },
      Photo: { enabled: true, required: true },
      PAN: { enabled: true, required: true },
      Aadhaar: { enabled: true, required: true },
      Passport: { enabled: true, required: false },
      Degree: { enabled: true, required: true },
      ExperienceLetter: { enabled: true, required: true },
      SalarySlips: { enabled: true, required: true },
      RelievingLetter: { enabled: true, required: true },
      Others: { enabled: true, required: false },
    },

    interviewSettings: {
      types: ["Online", "Offline", "Hybrid"],
      platform: "Google Meet",
      customPlatformUrl: "https://meet.google.com/xyz-abc-def",
      durationMinutes: "45",
      feedbackFormEnabled: true,
      scorecardTemplates: [
        "Technical Deep Dive",
        "System Architecture",
        "Cultural Fit & Leadership",
        "Executive Round",
      ],
    },

    emailConfig: {
      recruitmentEmail: `careers@${domain}`,
      replyEmail: `recruitment-noreply@${domain}`,
      careerEmail: `jobs@${domain}`,
      provider: "Google Workspace",
      autoEmails: {
        applicationReceived: true,
        interviewInvite: true,
        rejectionNotice: true,
        offerReleased: true,
      },
    },

    careerPortal: {
      url: `https://gravitonitsolutions.com/candidates-portal/${cleanSlug}`,
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
      primaryColor: "#6366f1",
      secondaryColor: "#f97316",
      bannerUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      aboutCompany: `Join ${compName} and shape the future of technology with a passionate team of innovators.`,
      socialLinks: {
        linkedin: `https://linkedin.com/company/${cleanSlug}`,
        twitter: `https://twitter.com/${cleanSlug}`,
        glassdoor: `https://glassdoor.com/Reviews/${cleanSlug}`,
        instagram: `https://instagram.com/${cleanSlug}_life`,
      },
      applicationFormFields: {
        requireCoverLetter: false,
        requirePortfolio: true,
        requireNoticePeriod: true,
        requireCurrentCtc: true,
        requireExpectedCtc: true,
      },
      privacyPolicy: `https://${domain}/privacy-policy`,
      terms: `https://${domain}/terms-of-service`,
    },

    candidateExperience: {
      progressTracker: true,
      applicationTimeline: true,
      recruiterContact: true,
      liveStatus: true,
      interviewTimeline: true,
      offerTracker: true,
      onboardingTracker: true,
    },

    itSetup: {
      laptopWorkflow: true,
      emailCreation: true,
      idCard: true,
      accessCard: true,
      vpn: true,
      github: true,
      jira: true,
      slack: true,
      teams: true,
      googleWorkspace: true,
      ms365: true,
    },

    notificationPreferences: {
      channels: {
        email: true,
        sms: true,
        whatsapp: true,
        push: true,
      },
      events: {
        applicationSubmitted: true,
        interviewScheduled: true,
        interviewReminder: true,
        offerReleased: true,
        documentsPending: true,
        joiningReminder: true,
        laptopReady: true,
      },
    },

    approvalMatrix: {
      jobApproval: { approverRole: "Hiring Manager", requiredCount: 1 },
      interviewApproval: { approverRole: "Lead Tech", requiredCount: 1 },
      offerApproval: { approverRole: "HR Admin", requiredCount: 1 },
      salaryApproval: { approverRole: "Finance", requiredCount: 1 },
      laptopApproval: { approverRole: "IT Admin", requiredCount: 1 },
      joiningApproval: { approverRole: "HR Admin", requiredCount: 1 },
    },

    integrations: {
      googleCalendar: true,
      outlook: true,
      slack: true,
      msTeams: true,
      zoom: true,
      googleMeet: true,
      github: true,
      jira: true,
      payroll: true,
    },

    userInvitations: {
      bulkEmails: "",
      csvFile: null,
      invitesSent: false,
      sentInvitesList: [],
    },

    systemMetadata: {
      companyId: companyUuid,
      workspaceId: workspaceUuid,
      tenantId: tenantUuid,
      subscriptionPlan: "Enterprise Trial (14 Days)",
      trialStartDate: now.toISOString(),
      trialEndDate: fourteenDaysLater.toISOString(),
      accountStatus: "Trial",
      companySlug: cleanSlug,
      verifiedDomainStatus: "Verified",
      emailVerificationStatus: true,
      phoneVerificationStatus: true,
      primaryAdminUserId: adminUserUuid,
      workspaceCreationTimestamp: now.toISOString(),
      lastLoginTimestamp: now.toISOString(),
      lastActivityTimestamp: now.toISOString(),
      ipAddress: "103.21.244.102 (TLS 1.3 Encrypted)",
      defaultTimezone: "Asia/Kolkata",
      defaultCurrency: "INR",
      defaultLanguage: "en-US",
      featureFlags: {
        ats: true,
        aiScreening: true,
        candidatePortal: true,
        itProvisioning: true,
        eSignOffers: true,
        whatsappNotifications: true,
        auditLogs: true,
      },
      auditLogInitialized: true,
      apiKey: apiKey,
      defaultRoleTemplates: {
        "HR Admin": ["All Modules", "User Roles", "Billing & Compliance", "Offer Approvals"],
        Recruiter: [
          "Job Posting",
          "Candidate Pipeline",
          "Interview Scheduling",
          "Offer Generation",
        ],
        "Hiring Manager": ["Applicant Review", "Interview Scorecards", "Stage Approvals"],
        Finance: ["Salary Matrix", "Offer Audit", "Payroll Connectors"],
        "IT Admin": ["Hardware Requisition", "Email Provisioning", "Access Cards", "SSO"],
        Operations: ["Welcome Kits", "Onboarding Checklist", "Asset Tracking"],
      },
    },
  };
}
