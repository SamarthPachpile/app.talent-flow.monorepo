/**
 * Candidate Portal Text Constants
 * Contains all static UI copy, hero titles, auth texts, roadmap stages, wizard steps, and option labels.
 */

export const CANDIDATE_PORTAL_TEXTS = {
  meta: {
    portalName: "Candidate Portal",
    title: "Candidate Onboarding & Roadmap Hub",
    tagline:
      "Track your application lifecycle from offer letter acceptance to Day One equipment delivery.",
    badge: "Personalized Candidate Workspace",
  },

  companySelector: {
    badge: "Enterprise Talent Ecosystem",
    title: "Candidate Access Hub",
    subtitle:
      "Select your prospective employer portal to view active job applications, complete onboarding roadmaps, and submit profile details.",
    searchPlaceholder: "Search by company name, subdomain, or industry...",
    stats: {
      workspaces: "Enterprise Workspaces",
      activeRoles: "Live Job Openings",
      onboardingRoadmaps: "Personalized Roadmaps",
      satisfaction: "Candidate Satisfaction",
    },
    ctaEmployer: {
      title: "Are you an Employer?",
      subtitle: "Set up a branded company career hub and streamline candidate onboarding.",
      button: "Register Company Workspace",
    },
    filterAll: "All Companies",
    noResults: "No companies found matching your search criteria.",
  },

  auth: {
    loginTitle: "Candidate Sign In",
    loginSubtitle: "Sign in to access your candidate roadmap and application status",
    signupTitle: "Candidate Registration",
    signupSubtitle: "Create candidate profile & access onboarding roadmap",
    googleSignIn: "Sign in with Google",
    googleSignUp: "Sign up with Google",
    emailDivider: "or continue with email",
    fields: {
      fullName: "Legal Full Name",
      fullNamePlaceholder: "e.g. Alex Rivera",
      mobile: "Mobile Number",
      mobilePlaceholder: "+1 (555) 000-0000",
      email: "Personal Email Address",
      emailPlaceholder: "alex.rivera@example.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "••••••••",
      country: "Country of Residence",
      termsCheckbox: "I agree to the Terms of Service and Privacy Policy",
    },
    switchModeToSignup: "New candidate? Sign Up",
    switchModeToLogin: "Already have an account? Sign In",
    switchCompanyBtn: "Switch Company",
    backToCompanies: "Available Companies",
    fillDemoCandidate: "Fill Test Candidate Credentials",
    verificationModal: {
      title: "Verify Your Email Address",
      instructionPrefix: "We have sent a 6-digit security verification code to",
      instructionSuffix: "Please enter the code below to activate your candidate profile.",
      resendCode: "Resend Code",
      codeSent: "New code sent to your email!",
      verifyBtn: "Verify & Enter Portal",
      changeEmail: "Change Email Address",
    },
    leftHero: {
      badge: "Verified Enterprise Candidate Portal",
      mainHeading: "Empowering Your Career Journey from Offer to Day One",
      subHeading:
        "Experience seamless digital onboarding with automated milestones, verified offer letters, instant hardware selection, and direct IT provisioning.",
      features: [
        {
          title: "Real-Time Application Tracking",
          desc: "Transparent 7-stage roadmap keeping you informed at every milestone.",
        },
        {
          title: "Digital Offer E-Signing",
          desc: "Legally binding electronic signature and instant benefits breakdown.",
        },
        {
          title: "Direct Hardware Provisioning",
          desc: "Select your preferred laptop, monitors, and ergonomic workstation accessories.",
        },
        {
          title: "Automated Day-1 Credentials",
          desc: "Corporate SSO, VPN, email, and repository access configured before your first day.",
        },
      ],
      testimonial: {
        quote:
          "The onboarding experience was exceptionally fast and clear. I received my customized MacBook Pro two days before my start date!",
        author: "Alex Rivera",
        role: "Senior Full Stack Engineer",
      },
    },
  },

  wizard: {
    badge: "Mandatory One-Time Setup",
    title: "Candidate Onboarding Setup Wizard",
    subtitle:
      "Please complete your candidate profile information to configure your onboarding roadmap and payroll credentials.",
    steps: [
      {
        id: 1,
        title: "Personal Information",
        description: "Legal identity, contact details, and emergency contacts.",
      },
      {
        id: 2,
        title: "Experience & Education",
        description: "Professional background, degrees, and portfolio links.",
      },
      {
        id: 3,
        title: "Work Style & Preferences",
        description: "Remote setup, preferred timezone, and language proficiencies.",
      },
      {
        id: 4,
        title: "Hardware & Equipment",
        description: "Select workstation laptop, dual displays, and peripherals.",
      },
      {
        id: 5,
        title: "Review & Finalize",
        description: "Verify submitted data and launch candidate dashboard.",
      },
    ],
    buttons: {
      previous: "Previous Step",
      next: "Save & Continue",
      complete: "Complete Setup & Enter Dashboard",
    },
  },

  dashboard: {
    nav: {
      roadmap: "My Roadmap",
      jobList: "Job Opportunities",
      companyOverview: "Company Overview",
      profile: "Candidate Profile",
      settings: "Account Settings",
      gdpr: "Data Privacy & GDPR",
      helpdesk: "Help & Support",
    },
    hero: {
      welcomeBack: "Welcome back,",
      targetStartDate: "Target Start Date:",
      daysRemaining: "days remaining until Day One",
      overallProgress: "Overall Onboarding Progress",
      assignedRecruiter: "Assigned Talent Lead",
      assignedManager: "Hiring Manager",
    },
  },

  stages: {
    stage1: {
      id: "application",
      name: "Application Submitted",
      title: "Application Received & Verified",
      description:
        "Your resume, technical portfolio, and initial screening assessment are in review.",
      status: "completed",
    },
    stage2: {
      id: "interview",
      name: "Screening & Interviews",
      title: "Technical & Cultural Interview Rounds",
      description: "Track upcoming panel interviews, take-home tasks, and interviewer feedback.",
      status: "completed",
    },
    stage3: {
      id: "offer",
      name: "Official Offer Letter",
      title: "Compensation & Benefits Package",
      description:
        "Review your formal employment agreement, equity terms, and complete digital e-signature.",
      status: "in_progress",
    },
    stage4: {
      id: "background_check",
      name: "Background Verification",
      title: "Identity & Education Verification",
      description:
        "Secure automated background check via SOC2/ISO certified verification providers.",
      status: "pending",
    },
    stage5: {
      id: "hardware",
      name: "Hardware & Equipment",
      title: "Workstation & Peripherals Provisioning",
      description:
        "Select your preferred primary machine, 4K monitors, and ergonomic home office kit.",
      status: "pending",
    },
    stage6: {
      id: "credentials",
      name: "Credentials & Security",
      title: "Corporate SSO & Access Provisioning",
      description:
        "Corporate Google Workspace / Microsoft 365, VPN access, and security key setup.",
      status: "pending",
    },
    stage7: {
      id: "day_one",
      name: "Day 1 Welcome",
      title: "Orientation & First Day Checklist",
      description: "Orientation schedule, team buddy assignment, and first week roadmap.",
      status: "pending",
    },
  },

  hardwareOptions: {
    laptops: [
      {
        id: "mbp-m3-max",
        name: 'Apple MacBook Pro 16"',
        specs: "Apple M3 Max (14-Core CPU, 30-Core GPU), 36GB RAM, 1TB SSD",
        category: "macOS",
        badge: "Recommended for Engineering",
      },
      {
        id: "mbp-m3-pro",
        name: 'Apple MacBook Pro 14"',
        specs: "Apple M3 Pro (12-Core CPU, 18-Core GPU), 18GB RAM, 512GB SSD",
        category: "macOS",
        badge: "Lightweight & Powerful",
      },
      {
        id: "thinkpad-x1",
        name: "Lenovo ThinkPad X1 Carbon Gen 12",
        specs: "Intel Core Ultra 7 155H, 32GB LPDDR5x, 1TB NVMe, OLED 2.8K",
        category: "Windows / Linux",
        badge: "Enterprise Business",
      },
      {
        id: "dell-xps-15",
        name: "Dell XPS 15 (9530)",
        specs: "Intel Core i7-13700H, NVIDIA RTX 4060, 32GB RAM, 1TB SSD, 3.5K OLED",
        category: "Windows / Linux",
        badge: "High Performance",
      },
    ],
    monitors: [
      {
        id: "dell-ultrasharp-27",
        name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
        specs: "IPS Black, 98% DCI-P3, 90W Power Delivery",
      },
      {
        id: "lg-ultrafine-32",
        name: 'LG UltraFine 32" 4K Ergo Display (32UN880-B)',
        specs: "HDR10, USB-C, Ergonomic C-Clamp Arm Stand",
      },
    ],
    accessories: [
      "Apple Magic Keyboard with Touch ID & Numeric Keypad",
      "Logitech MX Master 3S Wireless Ergonomic Mouse",
      "Logitech MX Mechanical Wireless Keyboard",
      "Sony WH-1000XM5 Active Noise Cancelling Headphones",
      "CalDigit TS4 Thunderbolt 4 Docking Station",
      "Ergonomic Memory Foam Wrist Rest & Desk Mat",
    ],
  },

  gdpr: {
    title: "Data Privacy & GDPR Rights",
    description:
      "You have complete control over your personal data under global GDPR & CCPA privacy standards.",
    rights: [
      {
        title: "Right to Access (Article 15)",
        desc: "You can download a complete JSON export of all personal data held in your candidate record.",
      },
      {
        title: "Right to Rectification (Article 16)",
        desc: "You can update or rectify any inaccurate personal details directly in candidate settings.",
      },
      {
        title: "Right to Erasure (Article 17)",
        desc: "Request permanent anonymization or deletion of your candidate record after hiring completion.",
      },
      {
        title: "Right to Restriction (Article 18)",
        desc: "Pause automated processing of your application while a data dispute is under review.",
      },
    ],
    exportButton: "Export My Candidate Data (JSON)",
    deleteRequestButton: "Request Account Deletion",
  },
} as const;
