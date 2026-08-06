import {
  CandidatePortalState,
  LaptopOption,
  AccessoryOption,
  OnboardingStage,
} from "../types/candidate";

export const DEFAULT_ONBOARDING_STAGES: OnboardingStage[] = [
  {
    id: "application",
    stepNumber: 1,
    title: "Application & Resume Review",
    shortTitle: "Application",
    description: "Application submitted and verified by Talent Acquisition team.",
    category: "Recruitment",
    status: "completed",
    estimatedTime: "Completed",
    completedAt: "2026-07-10T14:30:00Z",
  },
  {
    id: "interview",
    stepNumber: 2,
    title: "Technical & Culture Interviews",
    shortTitle: "Interviews",
    description: "Completed 3 interview rounds with engineering leads and hiring manager.",
    category: "Recruitment",
    status: "completed",
    estimatedTime: "Completed",
    completedAt: "2026-07-18T16:00:00Z",
  },
  {
    id: "offer",
    stepNumber: 3,
    title: "Offer Letter & Contract Agreement",
    shortTitle: "Offer Letter",
    description: "Formal offer e-signed and confirmed with HR operations.",
    category: "Legal & Compliance",
    status: "completed",
    estimatedTime: "Completed",
    completedAt: "2026-07-22T10:15:00Z",
    actionRequiredText: "Signed & Accepted",
  },
  {
    id: "background_check",
    stepNumber: 4,
    title: "Background Check & Verification",
    shortTitle: "Background Check",
    description: "Checkr Enterprise verification initiated and cleared.",
    category: "Legal & Compliance",
    status: "completed",
    estimatedTime: "Completed",
    completedAt: "2026-07-25T11:45:00Z",
  },
  {
    id: "hardware_setup",
    stepNumber: 5,
    title: "IT Laptop & Workstation Dispatch",
    shortTitle: "Hardware Setup",
    description: "Select engineering workstation laptop and accessories for dispatch.",
    category: "IT Equipment",
    status: "in_progress",
    estimatedTime: "20 mins",
    actionRequiredText: "Action Required: Select Gear",
  },
  {
    id: "credentials",
    stepNumber: 6,
    title: "SSO & Corporate Access Provisioning",
    shortTitle: "Credentials",
    description: "Corporate Google Workspace, Okta SSO, and Slack account activation.",
    category: "IT Equipment",
    status: "pending",
    estimatedTime: "Upcoming",
  },
  {
    id: "day_one",
    stepNumber: 7,
    title: "Day 1 Orientation & Buddy Sync",
    shortTitle: "Day 1 Orientation",
    description: "Welcome orientation schedule, team introductions, and onboarding buddy sync.",
    category: "Day 1 Orientation",
    status: "pending",
    estimatedTime: "Upcoming",
  },
];

export const LAPTOP_CATALOG: LaptopOption[] = [
  {
    id: "macbook-pro-16",
    brand: "Apple",
    name: 'MacBook Pro 16"',
    specs: "16-core CPU · 40-core GPU · 48GB Unified Memory · 1TB SSD",
    storage: "1TB NVMe SSD",
    ram: "48GB",
    chip: "Apple M3 Max",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    badge: "Recommended for Staff Engineers",
  },
  {
    id: "macbook-air-15",
    brand: "Apple",
    name: 'MacBook Air 15"',
    specs: "8-core CPU · 10-core GPU · 24GB Unified Memory · 512GB SSD",
    storage: "512GB NVMe SSD",
    ram: "24GB",
    chip: "Apple M3",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
    badge: "Ultra Portable",
  },
  {
    id: "dell-xps-16",
    brand: "Dell",
    name: "Dell XPS 16 Developer Edition",
    specs: "Intel Core Ultra 9 · RTX 4070 8GB · 32GB LPDDR5x · 1TB SSD · 4K OLED Touch",
    storage: "1TB PCIe Gen4 SSD",
    ram: "32GB",
    chip: "Intel Core Ultra 9 185H",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    badge: "Linux / Windows Powerhouse",
  },
  {
    id: "thinkpad-x1",
    brand: "Lenovo",
    name: "ThinkPad X1 Carbon Gen 12",
    specs: "Intel Core Ultra 7 · Intel Arc Graphics · 32GB RAM · 1TB SSD · 2.8K OLED 120Hz",
    storage: "1TB PCIe SSD",
    ram: "32GB",
    chip: "Intel Core Ultra 7 155H",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    badge: "Enterprise Standard",
  },
];

export const ACCESSORY_CATALOG: AccessoryOption[] = [
  {
    id: "studio-display",
    category: "Display",
    name: 'Apple Studio Display 27" 5K',
    description: "5K Retina Display, 600 nits, 12MP Ultra Wide Camera, Spatial Audio system",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "mx-master-3s",
    category: "Input",
    name: "Logitech MX Master 3S Wireless Mouse",
    description: "8K DPI track-anywhere sensor, MagSpeed quiet clicks, ergonomic thumb wheel",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "keychron-q1",
    category: "Input",
    name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    description:
      "QMK/VIA custom wireless mechanical keyboard, CNC aluminum body, Gateron Jupiter switches",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "sony-wh1000xm5",
    category: "Audio",
    name: "Sony WH-1000XM5 Noise Canceling Headphones",
    description:
      "Industry-leading noise canceling headphones with 8 microphones & Auto NC Optimizer",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "desk-monitor-arm",
    category: "Desk",
    name: "Heavy-Duty Dual Monitor Arm Mount",
    description:
      "Full motion gas spring desk mount for up to 32-inch monitors with cable management",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500&q=80",
  },
];

export function createDefaultCandidateState(
  fullName: string = "Alex Rivera",
  email: string = "alex.rivera@gmail.com",
): CandidatePortalState {
  return {
    candidate: {
      id: email.toLowerCase().replace(/[^a-z0-9]/g, "") || "cand-alex",
      name: fullName,
      email: email,
      phone: "+1 (555) 234-5678",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      roleTitle: "Senior Staff Fullstack Engineer",
      department: "Core Platform Architecture",
      companyName: "TalentFlow Inc.",
      companyLogo: "⚡",
      location: "San Francisco, CA (Remote)",
      targetStartDate: "2026-08-17",
      currentStageId: "hardware_setup",
      recruiter: {
        name: "Elena Rostova",
        role: "Lead Technical Recruiter",
        email: "elena.rostova@talentflow.io",
        avatarUrl:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
        phone: "+1 (555) 892-1049",
      },
      hiringManager: {
        name: "Marcus Vance",
        role: "VP of Engineering",
        email: "marcus.vance@talentflow.io",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      },
    },
    stages: [...DEFAULT_ONBOARDING_STAGES],
    application: {
      jobId: "REQ-2026-9810",
      jobTitle: "Senior Staff Fullstack Engineer",
      appliedDate: "2026-07-08",
      resumeFileName: "Alex_Rivera_Senior_Fullstack_2026.pdf",
      resumeUrl: "#",
      experienceYears: 8,
      portfolioUrl: "https://alexrivera.dev",
      githubUrl: "https://github.com/alexrivera-dev",
      statusHistory: [
        {
          status: "Submitted",
          date: "2026-07-08",
          note: "Application & resume received via candidate portal.",
        },
        {
          status: "Recruiter Screen",
          date: "2026-07-12",
          note: "Passed initial technical recruiter screening with Elena.",
        },
        {
          status: "Technical Assessment Passed",
          date: "2026-07-18",
          note: "System Architecture panel completed with flying colors.",
        },
        {
          status: "Offer Extended",
          date: "2026-07-20",
          note: "Official offer extended by VP of Engineering Marcus Vance.",
        },
      ],
    },
    interviews: [
      {
        id: "int-1",
        roundName: "Round 1: Recruiter Technical Screening",
        interviewerName: "Elena Rostova",
        interviewerRole: "Lead Technical Recruiter",
        interviewerAvatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
        date: "2026-07-12",
        timeSlot: "10:00 AM - 10:45 AM PST",
        durationMinutes: 45,
        type: "Hiring Manager Sync",
        meetingUrl: "https://meet.google.com/abc-defg-hij",
        status: "passed",
        notesForCandidate:
          "Strong communication, deep React monorepo & TypeScript backend experience.",
      },
      {
        id: "int-2",
        roundName: "Round 2: System Design & Monorepo Architecture",
        interviewerName: "David Kim",
        interviewerRole: "Principal Systems Architect",
        interviewerAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
        date: "2026-07-15",
        timeSlot: "02:00 PM - 03:30 PM PST",
        durationMinutes: 90,
        type: "Technical Architecture",
        meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
        status: "passed",
        notesForCandidate:
          "Designed scalable multi-tenant Firestore schema and realtime sync layer.",
      },
      {
        id: "int-3",
        roundName: "Round 3: Executive Leadership Sync",
        interviewerName: "Marcus Vance",
        interviewerRole: "VP of Engineering",
        interviewerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
        date: "2026-07-18",
        timeSlot: "11:00 AM - 12:00 PM PST",
        durationMinutes: 60,
        type: "Culture & Values",
        meetingUrl: "https://meet.google.com/exec-sync-990",
        status: "passed",
        notesForCandidate: "Great alignment with engineering principles and team leadership.",
      },
    ],
    offer: {
      offerId: "OFFER-2026-8819",
      positionTitle: "Senior Staff Fullstack Engineer",
      department: "Core Platform Architecture",
      baseSalaryYearly: 185000,
      signOnBonus: 25000,
      equityShares: 12000,
      equityVesting: "4 years (1-year cliff, 25% annual vesting)",
      healthInsurance: "Premium Tier 1 Healthcare (Medical, Vision, Dental 100% covered)",
      ptoDays: 25,
      remoteStipend: 2500,
      pdfUrl: "#",
      status: "accepted",
      signedAt: "2026-07-22T10:15:00Z",
      signedName: fullName,
    },
    backgroundCheck: {
      id: "CHK-99201-US",
      provider: "Checkr Enterprise",
      status: "clear",
      submittedAt: "2026-07-23T09:00:00Z",
      clearedAt: "2026-07-25T11:45:00Z",
      ssnLast4: "4892",
      consentAccepted: true,
      documents: [
        {
          id: "doc-1",
          name: "Government Issued Passport / Driver License",
          type: "Government ID",
          status: "verified",
          uploadedAt: "2026-07-23T09:30:00Z",
        },
        {
          id: "doc-2",
          name: "W-4 Employee Withholding Certificate 2026",
          type: "Tax W-4 / I-9",
          status: "verified",
          uploadedAt: "2026-07-23T10:15:00Z",
        },
        {
          id: "doc-3",
          name: "Proof of Residential Address",
          type: "Address Proof",
          status: "verified",
          uploadedAt: "2026-07-23T10:20:00Z",
        },
      ],
    },
    hardware: {
      selectedLaptopId: "macbook-pro-16",
      selectedAccessories: ["studio-display", "mx-master-3s", "sony-wh1000xm5"],
      shippingAddress: {
        street: "450 Mission Street, Suite 1200",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "United States",
      },
      deliveryInstructions: "Please leave at front reception desk or call candidate on arrival.",
      carrier: "FedEx Express",
      trackingNumber: "FX-9823419082-US",
      shipmentStatus: "shipped",
      estimatedDeliveryDate: "Tomorrow by 10:30 AM",
      itSetupCompleted: false,
      unboxingNotes: [
        "Unbox MacBook Pro 16 and connect to power outlet.",
        "Turn on device and select your preferred language.",
        "Connect to your home Wi-Fi network and launch Okta Verify.",
      ],
    },
    credentials: {
      corporateEmail: `${email.split("@")[0]}@talentflow.io`,
      ssoUsername: email.split("@")[0],
      slackInviteSent: true,
      googleWorkspaceActive: true,
      oktaProvisioned: true,
      twoFactorSetupCompleted: false,
      passwordCreated: false,
      temporaryPasswordExpiry: "48 hours remaining",
    },
    dayOne: {
      buddy: {
        name: "Samantha Wright",
        role: "Senior Staff Frontend Engineer",
        email: "samantha.wright@talentflow.io",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
        slackHandle: "@sam_wright",
        welcomeNote:
          "Hey Alex! Super excited to welcome you to the Core Platform squad! I'll be your onboarding buddy to help you set up dev environments, clear roadblocks, and introduce you to everyone.",
      },
      firstDaySchedule: [
        {
          id: "sch-1",
          time: "09:00 AM - 09:30 AM PST",
          title: "Welcome & Onboarding Kickoff",
          hostName: "Elena Rostova",
          hostRole: "Talent Ops Lead",
          meetingType: "Google Meet",
        },
        {
          id: "sch-2",
          time: "10:00 AM - 11:00 AM PST",
          title: "IT Security & SSO Credential Setup",
          hostName: "Marcus Vance",
          hostRole: "VP of Engineering",
          meetingType: "Virtual Zoom",
        },
        {
          id: "sch-3",
          time: "01:30 PM - 02:30 PM PST",
          title: "Onboarding Buddy Coffee Chat & Architecture Walkthrough",
          hostName: "Samantha Wright",
          hostRole: "Senior Staff Engineer",
          meetingType: "Google Meet",
        },
      ],
      checklist: [
        {
          id: "task-1",
          title: "Complete Okta 2FA enrollment on personal mobile device",
          category: "IT Config",
          duration: "10 mins",
          completed: false,
        },
        {
          id: "task-2",
          title: "Join #welcome-team and #dev-engineering Slack channels",
          category: "Team Introduction",
          duration: "5 mins",
          completed: false,
        },
        {
          id: "task-3",
          title: "Sign Direct Deposit payroll form in candidate portal",
          category: "HR Forms",
          duration: "15 mins",
          completed: false,
        },
      ],
    },
    notifications: [
      {
        id: "n-1",
        title: "Hardware Dispatch Update",
        message: "FedEx Express tracking number generated for your MacBook Pro 16 setup.",
        timestamp: "10 mins ago",
        read: false,
        stageId: "hardware_setup",
      },
      {
        id: "n-2",
        title: "Background Check Cleared",
        message: "Checkr Enterprise completed your background check with status CLEAR.",
        timestamp: "2 hours ago",
        read: true,
        stageId: "background_check",
      },
      {
        id: "n-3",
        title: "Offer E-Signature Confirmed",
        message: "Your e-signed offer contract has been stored in HR repository.",
        timestamp: "1 day ago",
        read: true,
        stageId: "offer",
      },
    ],
  };
}

export const emptyCandidatePortalState: CandidatePortalState = createDefaultCandidateState(
  "Alex Rivera",
  "alex.rivera@gmail.com",
);

export const MOCK_CANDIDATES: Record<string, CandidatePortalState> = {
  alex: createDefaultCandidateState("Alex Rivera", "alex.rivera@gmail.com"),
  sarah: {
    ...createDefaultCandidateState("Sarah Chen", "sarah.chen@designhub.io"),
    candidate: {
      ...createDefaultCandidateState("Sarah Chen", "sarah.chen@designhub.io").candidate,
      roleTitle: "Lead UX Product Designer",
      department: "Product Design & Experience",
      currentStageId: "offer",
      avatarUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
    },
    stages: DEFAULT_ONBOARDING_STAGES.map((s) =>
      s.id === "offer"
        ? { ...s, status: "action_required" as const, actionRequiredText: "Signature Required" }
        : s.id === "background_check" || s.id === "hardware_setup"
          ? { ...s, status: "pending" as const }
          : s,
    ),
    offer: {
      ...createDefaultCandidateState("Sarah Chen", "sarah.chen@designhub.io").offer,
      positionTitle: "Lead UX Product Designer",
      department: "Product Design & Experience",
      baseSalaryYearly: 165000,
      signOnBonus: 15000,
      equityShares: 8500,
      status: "pending",
      signedAt: undefined,
      signedName: undefined,
    },
  },
};
