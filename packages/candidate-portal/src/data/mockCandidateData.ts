import {
  CandidatePortalState,
  LaptopOption,
  AccessoryOption,
  OnboardingStage,
  AppliedJob,
  AvailableJob,
  StageId,
} from "../types/candidate";
import type { CandidateDocument, CompanyDocument } from "@talent-flow/api";

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

export const DEFAULT_APPLIED_JOBS: AppliedJob[] = [
  {
    id: "job-1",
    jobCode: "REQ-AM-019",
    jobTitle: "Agile Manager Amsterdam",
    location: "Amsterdam",
    country: "Netherlands",
    appliedDate: "01/03/2019",
    status: "Active Job",
    interviewDate: "01/03/2019 18:35",
    department: "Project Management",
    employmentType: "Full-time",
    salaryRange: "₹18,50,000 - ₹24,00,000",
    companyName: "iSmartRecruit",
    description:
      "Oversee agile sprint cadences, cross-functional squad roadmaps, and stakeholder alignment for enterprise software delivery.",
    requirements: [
      "5+ years agile coaching or Scrum Master experience",
      "CSM or PMI-ACP certification",
      "Proven track record running scaled agile teams in SaaS environments",
    ],
    recruiterNotes:
      "Initial screening completed. Next round scheduled with Netherlands regional director.",
  },
  {
    id: "job-2",
    jobCode: "REQ-ND-022",
    jobTitle: "Nodejs Devloper",
    location: "India",
    country: "India",
    appliedDate: "-",
    status: "Active Job",
    interviewDate: "-",
    department: "Backend Engineering",
    employmentType: "Full-time",
    salaryRange: "₹18,00,000 - ₹26,00,000",
    companyName: "iSmartRecruit",
    description:
      "Design high-throughput microservices, event streaming architecture, and PostgreSQL / Redis caching backends with Node.js and TypeScript.",
    requirements: [
      "4+ years backend Node.js & Express / NestJS",
      "Experience with PostgreSQL, Kafka, and Redis caching",
      "Solid understanding of REST and GraphQL APIs",
    ],
    recruiterNotes: "Resume under technical lead review.",
  },
  {
    id: "job-3",
    jobCode: "REQ-ITA-031",
    jobTitle: "Information Technology Auditor (IT Auditor)",
    location: "Brazil",
    country: "Brazil",
    appliedDate: "-",
    status: "Active Job",
    interviewDate: "-",
    department: "Compliance & Security",
    employmentType: "Full-time",
    salaryRange: "₹14,00,000 - ₹19,00,000",
    companyName: "iSmartRecruit",
    description:
      "Audit IT infrastructure, SOC 2 compliance controls, access security protocols, and cloud vulnerability assessment frameworks.",
    requirements: [
      "CISA, CISSP or equivalent security auditing credentials",
      "Strong knowledge of ISO 27001, SOC 2 Type II, and GDPR compliance standards",
      "Experience with AWS and Google Cloud security posture auditing",
    ],
    recruiterNotes: "Submitted for compliance director review.",
  },
  {
    id: "job-4",
    jobCode: "REQ-AND-044",
    jobTitle: "Lead Android Developer",
    location: "Melbourn",
    country: "Australia",
    appliedDate: "-",
    status: "Active Job",
    interviewDate: "-",
    department: "Mobile Engineering",
    employmentType: "Full-time",
    salaryRange: "₹22,00,000 - ₹28,00,000",
    companyName: "iSmartRecruit",
    description:
      "Lead Android mobile applications development using Kotlin, Jetpack Compose, Coroutines, and clean architectural principles.",
    requirements: [
      "6+ years native Android development with Kotlin & Jetpack Compose",
      "Experience publishing and maintaining apps with 1M+ active users",
      "Deep understanding of MVVM, Clean Architecture, and offline-first data sync",
    ],
    recruiterNotes: "Technical screening pending manager slot booking.",
  },
  {
    id: "job-5",
    jobCode: "REQ-PHP-055",
    jobTitle: "PHP Devloper",
    location: "Central France",
    country: "France",
    appliedDate: "-",
    status: "Active Job",
    interviewDate: "-",
    department: "Web Development",
    employmentType: "Contract",
    salaryRange: "₹12,00,000 - ₹16,00,000",
    companyName: "iSmartRecruit",
    description:
      "Maintain modern PHP 8.x Laravel core microservices, database schemas, third-party webhook integrations, and RESTful APIs.",
    requirements: [
      "3+ years with PHP 8+ and Laravel / Symfony",
      "MySQL query optimization and database indexing",
      "Dockerized development workflow and CI/CD pipelines",
    ],
    recruiterNotes: "Application received. Verification in progress.",
  },
  {
    id: "job-6",
    jobCode: "REQ-SF-088",
    jobTitle: "Senior Staff Fullstack Engineer",
    location: "San Francisco, CA",
    country: "United States",
    appliedDate: "08/07/2026",
    status: "Active Job",
    interviewDate: "18/07/2026 11:00",
    department: "Core Platform Architecture",
    employmentType: "Full-time",
    salaryRange: "₹28,00,000 - ₹36,00,000",
    companyName: "iSmartRecruit",
    description:
      "Architect and scale multi-tenant SaaS frontend architecture, real-time sync pipelines, and high-volume APIs.",
    requirements: [
      "8+ years software engineering experience with React, TypeScript, and Node.js",
      "Proven architecture skills in large monorepo systems and cloud services",
      "Strong communication and mentorship background",
    ],
    recruiterNotes: "Passed all 3 interview rounds. Offer letter extended and signed.",
  },
  {
    id: "job-7",
    jobCode: "REQ-BER-091",
    jobTitle: "Senior React / TypeScript Engineer",
    location: "Berlin",
    country: "Germany",
    appliedDate: "15/06/2026",
    status: "Active Job",
    interviewDate: "22/06/2026 14:00",
    department: "Frontend Architecture",
    employmentType: "Full-time",
    salaryRange: "₹20,00,000 - ₹27,00,000",
    companyName: "iSmartRecruit",
    description:
      "Build blazing-fast React applications with TypeScript, TailwindCSS, state management, and modern component systems.",
    requirements: [
      "5+ years modern frontend development with React and TypeScript",
      "Deep understanding of web performance, accessibility, and responsive design",
    ],
    recruiterNotes: "Round 2 technical coding review completed.",
  },
  {
    id: "job-8",
    jobCode: "REQ-LON-103",
    jobTitle: "DevOps & Cloud Infrastructure Specialist",
    location: "London",
    country: "United Kingdom",
    appliedDate: "02/05/2026",
    status: "Active Job",
    interviewDate: "-",
    department: "Infrastructure & Platform",
    employmentType: "Full-time",
    salaryRange: "₹22,00,000 - ₹30,00,000",
    companyName: "iSmartRecruit",
    description:
      "Manage Kubernetes clusters, Terraform infrastructure as code, CI/CD pipelines, and cloud security monitoring.",
    requirements: [
      "4+ years with AWS / GCP, Kubernetes, Docker, and Terraform",
      "Strong scripting skills in Python or Bash",
    ],
    recruiterNotes: "Profile submitted for hiring team review.",
  },
];

export const OPEN_POSITIONS_CATALOG: AvailableJob[] = [
  {
    id: "avail-1",
    title: "Principal Cloud Solutions Architect",
    department: "Infrastructure",
    location: "Bengaluru, KA (Remote)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Lead / Staff",
    salaryRange: "₹35,00,000 - ₹45,00,000",
    postedDate: "3 days ago",
    description:
      "Lead enterprise cloud architecture across AWS and GCP multi-region clusters with zero-downtime reliability.",
    requirements: [
      "10+ years software and systems architecture",
      "Deep expertise in Kubernetes, service mesh, and infrastructure as code",
      "Experience with SOC2, ISO27001 enterprise compliance",
    ],
    benefits: [
      "Unlimited PTO",
      "Comprehensive Health/Dental/Vision",
      "Provident Fund Match 6%",
      "₹1,50,000 Home Office Stipend",
    ],
    skills: ["AWS", "Kubernetes", "Terraform", "Go", "Distributed Systems"],
  },
  {
    id: "avail-2",
    title: "Senior Product Designer (Design Systems)",
    department: "Product Design",
    location: "Bengaluru (Hybrid)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹20,00,000 - ₹26,00,000",
    postedDate: "Just now",
    description:
      "Shape our cross-platform design token architecture, Figma component ecosystem, and interaction standards.",
    requirements: [
      "5+ years product and design systems experience",
      "Mastery of Figma, auto-layout, design tokens, and tokens-to-code pipelines",
      "Track record delivering cohesive enterprise UX",
    ],
    benefits: ["Flexible remote work", "Learning allowance ₹1,00,000/yr", "Private Health Care"],
    skills: ["Figma", "Design Systems", "UI/UX", "Accessibility", "Design Tokens"],
  },
  {
    id: "avail-3",
    title: "Senior Frontend Engineer (React & TypeScript)",
    department: "Frontend Engineering",
    location: "Pune, MH (Remote)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹22,00,000 - ₹28,00,000",
    postedDate: "1 week ago",
    description:
      "Craft modular, accessible, and ultra-smooth web applications in React 19, TypeScript, and modern styling frameworks.",
    requirements: [
      "5+ years building production web apps in React & TypeScript",
      "Deep understanding of state machines, bundle optimization, and Web Vitals",
      "Passion for clean code and component-driven development",
    ],
    benefits: ["30 Vacation Days", "Annual Tech Allowance", "Stock Options Grant"],
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Performance"],
  },
  {
    id: "avail-4",
    title: "AI / ML Integration Engineer",
    department: "AI & Innovation",
    location: "Hyderabad, TS",
    country: "India",
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹25,00,000 - ₹34,00,000",
    postedDate: "4 days ago",
    description:
      "Build intelligent resume parsing, automated semantic matching, and LLM-powered candidate workflow pipelines.",
    requirements: [
      "4+ years backend and machine learning application integration",
      "Experience with OpenAI / Gemini APIs, LangChain, vector databases (Pinecone / pgvector)",
      "Python and TypeScript proficiency",
    ],
    benefits: ["Performance Bonus", "Health & Wellness Insurance", "Conference Travel Budget"],
    skills: ["Python", "OpenAI / Gemini", "LangChain", "Vector DBs", "FastAPI"],
  },
  {
    id: "avail-5",
    title: "Staff Security & Compliance Specialist",
    department: "Security & Legal",
    location: "Mumbai, MH (Remote)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Lead / Staff",
    salaryRange: "₹24,00,000 - ₹30,00,000",
    postedDate: "2 weeks ago",
    description:
      "Drive continuous automated security auditing, GDPR compliance workflows, penetration testing, and zero-trust identity architectures.",
    requirements: [
      "7+ years enterprise cybersecurity and data compliance",
      "In-depth knowledge of GDPR, HIPAA, and SOC2 requirements",
      "Experience with cloud security posture management tools",
    ],
    benefits: ["Flexible Schedule", "Parental Leave 6 months", "Public Transit Pass"],
    skills: [
      "GDPR",
      "SOC2",
      "Cloud Security",
      "Identity & Access Management",
      "Penetration Testing",
    ],
  },
  {
    id: "avail-6",
    title: "Principal Backend Architect (Node.js & Go)",
    department: "Backend Engineering",
    location: "Bengaluru, KA (Hybrid)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Lead / Staff",
    salaryRange: "₹30,00,000 - ₹40,00,000",
    postedDate: "1 day ago",
    description:
      "Architect high-throughput event-driven microservices, GraphQL federated gateways, and real-time syncing pipelines.",
    requirements: [
      "8+ years architecting distributed microservices in Node.js and Go",
      "Expertise in Redis caching, PostgreSQL sharding, and Kafka streaming",
      "Proven leadership in engineering reliability and zero-downtime migrations",
    ],
    benefits: ["Full Medical & Dental", "Provident Fund Matching", "Annual Technology Grant"],
    skills: ["Node.js", "Go", "PostgreSQL", "Kafka", "GraphQL", "Redis"],
  },
  {
    id: "avail-7",
    title: "Lead DevOps & SRE Engineer",
    department: "Infrastructure",
    location: "Gurugram, HR (Remote)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Lead / Staff",
    salaryRange: "₹26,00,000 - ₹34,00,000",
    postedDate: "5 days ago",
    description:
      "Scale our global multi-cloud infrastructure with Terraform, automated canary deployments, and Prometheus observability.",
    requirements: [
      "6+ years Site Reliability Engineering and DevOps practice",
      "Extensive production experience with Kubernetes operators, Helm, and ArgoCD",
      "Experience implementing incident response rotations and chaos engineering",
    ],
    benefits: ["Remote Work Budget", "Health Insurance", "28 Days PTO"],
    skills: ["Kubernetes", "Terraform", "ArgoCD", "Prometheus", "CI/CD", "AWS"],
  },
  {
    id: "avail-8",
    title: "Staff Machine Learning Research Scientist",
    department: "AI & Innovation",
    location: "Bengaluru, KA (Hybrid)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Lead / Staff",
    salaryRange: "₹38,00,000 - ₹50,00,000",
    postedDate: "Just now",
    description:
      "Pioneer next-generation foundation models for candidate skill ontology matching, predictive talent analytics, and agentic orchestration.",
    requirements: [
      "PhD or MS in Computer Science, Machine Learning, or Computational Linguistics",
      "Track record publishing in NeurIPS, ICML, ACL or shipping commercial generative AI models",
      "Expertise with PyTorch, CUDA kernel optimizations, and fine-tuning reasoning LLMs",
    ],
    benefits: ["Research Stipend", "Relocation Support", "Comprehensive Healthcare"],
    skills: ["PyTorch", "Transformers", "LLMs", "NLP", "CUDA", "Vector Search"],
  },
  {
    id: "avail-9",
    title: "Director of Technical Product Management",
    department: "Product",
    location: "Bengaluru, KA",
    country: "India",
    type: "Full-time",
    experienceLevel: "Executive",
    salaryRange: "₹40,00,000 - ₹52,00,000",
    postedDate: "3 days ago",
    description:
      "Drive product roadmap, enterprise CRM API integrations, and product strategy across candidate and hiring portal squads.",
    requirements: [
      "8+ years product management experience in B2B SaaS or TalentTech",
      "Exceptional customer empathy, data-driven prioritization, and developer platform intuition",
      "Demonstrated ability leading high-caliber PM and engineering pods",
    ],
    benefits: ["Executive Equity Package", "Flexible PTO", "Full Family Health Plan"],
    skills: ["Product Strategy", "B2B SaaS", "API Ecosystems", "Agile Roadmap", "Data Analytics"],
  },
  {
    id: "avail-10",
    title: "Senior QA Automation & Test Architect",
    department: "Quality Engineering",
    location: "Pune, MH (Remote)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹18,00,000 - ₹24,00,000",
    postedDate: "1 week ago",
    description:
      "Design and maintain end-to-end automated testing frameworks with Playwright, Cypress, and synthetic performance testing suites.",
    requirements: [
      "5+ years automated quality engineering experience",
      "Proficiency with Playwright / Cypress, TypeScript, and CI test matrices",
      "Experience running automated accessibility (WCAG 2.1 AA) audits",
    ],
    benefits: ["Wellness Allowance", "Home Office Fund", "Provident Fund Matching"],
    skills: ["Playwright", "Cypress", "TypeScript", "CI/CD", "Accessibility", "Jest"],
  },
  {
    id: "avail-11",
    title: "Enterprise Solutions Consultant",
    department: "Sales & Solutions",
    location: "Mumbai, MH (Hybrid)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹22,00,000 - ₹30,00,000",
    postedDate: "6 days ago",
    description:
      "Partner with Fortune 500 talent leaders to architect and demo custom workforce orchestration and onboarding automation workflows.",
    requirements: [
      "4+ years technical pre-sales, solutions engineering, or tech consulting experience",
      "Superb executive presentation skills and hands-on API integration understanding",
      "Ability to translate complex technical architectures into strategic business ROI",
    ],
    benefits: ["Uncapped Commission", "Flexible Hybrid Work", "Dental/Vision Coverage"],
    skills: ["Solutions Architecture", "Executive Presentations", "APIs", "B2B SaaS", "CRM"],
  },
  {
    id: "avail-12",
    title: "Senior Data Platform Engineer",
    department: "Data & Analytics",
    location: "Hyderabad, TS (Hybrid)",
    country: "India",
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹26,00,000 - ₹35,00,000",
    postedDate: "2 days ago",
    description:
      "Build real-time analytical event streams, DBT transformation pipelines, and Snowflake data warehouses for talent intelligence.",
    requirements: [
      "5+ years data engineering experience with Snowflake, DBT, and Apache Spark / Kafka",
      "Proficiency in SQL optimization, Python, and data governance frameworks",
      "Experience with modern data orchestration and streaming tools",
    ],
    benefits: ["Flexible Hours", "Hybrid Work Environment", "Health Checkups"],
    skills: ["Snowflake", "dbt", "SQL", "Python", "Kafka", "Data Modeling"],
  },
];

export function createDefaultCandidateState(
  fullName: string = "Alex Rivera",
  email: string = "alex.rivera@gmail.com",
): CandidatePortalState {
  return createCandidatePortalStateFromDoc({ fullName, email });
}

export function createCandidatePortalStateFromDoc(
  candDoc: Partial<CandidateDocument>,
  company?: Partial<CompanyDocument> | null,
): CandidatePortalState {
  const baseName = candDoc.fullName || "Candidate";
  const baseEmail = candDoc.email || "candidate@example.com";
  const basePhone = candDoc.phone || "";
  const baseAvatar = candDoc.avatarUrl || "";
  const baseRole = candDoc.targetRole || "Software Engineer";
  const baseCompany =
    company?.name || candDoc.registeredCompanies?.[0]?.companyName || "TalentFlow Network";
  const baseStageId = (candDoc.currentStageId as StageId) || "application";

  return {
    candidate: {
      id: candDoc.id || "cand-" + baseEmail.replace(/[^a-z0-9]/g, ""),
      name: baseName,
      email: baseEmail,
      phone: basePhone,
      avatarUrl: baseAvatar,
      roleTitle: baseRole,
      department: candDoc.industry || "Engineering & Technology",
      companyName: baseCompany,
      companyLogo: "⚡",
      location: candDoc.country ? `${candDoc.country} (Remote)` : "Remote",
      targetStartDate: "2026-09-01",
      currentStageId: baseStageId,
      recruiter: {
        name: "Talent Acquisition",
        role: "Recruitment Specialist",
        email: "recruiter@" + (company?.domain || "talentflow.io"),
        avatarUrl: "",
        phone: "+1 (555) 019-2831",
      },
      hiringManager: {
        name: "Engineering Lead",
        role: "Hiring Manager",
        email: "hiring@" + (company?.domain || "talentflow.io"),
        avatarUrl: "",
      },
    },
    stages: DEFAULT_ONBOARDING_STAGES.map((st) => {
      if (st.id === baseStageId) {
        return { ...st, status: "in_progress" as const };
      }
      return st;
    }),
    appliedJobs: DEFAULT_APPLIED_JOBS,
    application: {
      jobId: "APP-" + (candDoc.id || "001").substring(0, 8).toUpperCase(),
      jobTitle: baseRole,
      appliedDate: candDoc.createdAt
        ? new Date(candDoc.createdAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      resumeFileName: candDoc.resumeFileName || `${baseName.replace(/\s+/g, "_")}_Resume.pdf`,
      resumeUrl: candDoc.resumeUrl || "#",
      experienceYears: parseInt(String(candDoc.experienceYears || "4"), 10) || 4,
      portfolioUrl: candDoc.portfolioUrl || "",
      githubUrl: candDoc.githubUrl || "",
      statusHistory: [
        {
          status: "Submitted",
          date: candDoc.createdAt
            ? new Date(candDoc.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          note: "Application submitted via candidate portal.",
        },
      ],
    },
    interviews: [
      {
        id: "int-1",
        roundName: "Technical Deep-Dive",
        interviewerName: "Lead Engineer",
        interviewerRole: "Principal Architect",
        interviewerAvatar: "",
        date: "2026-08-25",
        timeSlot: "14:00 - 15:00 UTC",
        durationMinutes: 60,
        type: "Technical Architecture",
        meetingUrl: "https://meet.google.com/xyz-tf-room",
        status: "scheduled",
        notesForCandidate: "Please prepare to walk through system architecture diagrams.",
      },
    ],
    offer: {
      offerId: "OFF-2026-001",
      positionTitle: baseRole,
      department: candDoc.industry || "Engineering & Technology",
      baseSalaryYearly: 140000,
      signOnBonus: 10000,
      equityShares: 5000,
      equityVesting: "4-year vesting with 1-year cliff",
      healthInsurance: "Comprehensive Platinum Medical, Dental, and Vision coverage",
      ptoDays: 25,
      remoteStipend: 1500,
      pdfUrl: "#",
      status: "pending",
    },
    backgroundCheck: {
      id: "bg-001",
      provider: "Checkr Enterprise",
      status: "submitted",
      submittedAt: "2026-08-10",
      documents: [
        {
          id: "doc-1",
          name: "Government ID",
          type: "Government ID",
          status: "verified",
          uploadedAt: "2026-08-10",
        },
      ],
      ssnLast4: "8821",
      consentAccepted: true,
    },
    hardware: {
      selectedLaptopId: candDoc.hardwarePreferences?.laptop || "macbook-pro-16",
      selectedAccessories: candDoc.hardwarePreferences?.accessories || [
        "acc-4k-monitor",
        "acc-anc-headphones",
      ],
      shippingAddress: {
        street: "123 Innovation Way",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: candDoc.country || "United States",
      },
      deliveryInstructions: "Leave with front desk / reception if unavailable",
      carrier: "FedEx Express",
      trackingNumber: "FEDEX-TF-991204",
      shipmentStatus: "provisioning",
      estimatedDeliveryDate: "2026-08-28",
      itSetupCompleted: true,
      unboxingNotes: [
        "Remove security seals",
        "Connect to power adapter",
        "Follow SSO enrollment prompt",
      ],
    },
    credentials: {
      corporateEmail: baseEmail,
      ssoUsername: baseEmail.split("@")[0] || "candidate",
      slackInviteSent: true,
      googleWorkspaceActive: true,
      oktaProvisioned: true,
      twoFactorSetupCompleted: true,
      passwordCreated: true,
      temporaryPasswordExpiry: "2026-09-15",
    },
    dayOne: {
      buddy: {
        name: "Alex Rivera",
        role: "Senior Staff Mentor",
        email: "buddy@talentflow.io",
        avatarUrl: "",
        slackHandle: "@alex.rivera",
        welcomeNote: "Welcome aboard! Excited to build together.",
      },
      firstDaySchedule: [
        {
          id: "s1",
          time: "09:30 AM",
          title: "Welcome & IT Setup",
          hostName: "IT Support",
          hostRole: "Systems Engineer",
          meetingType: "Google Meet",
        },
        {
          id: "s2",
          time: "11:00 AM",
          title: "Engineering 1-on-1 Kickoff",
          hostName: "Lead Engineer",
          hostRole: "Engineering Manager",
          meetingType: "Virtual Zoom",
        },
      ],
      checklist: [
        {
          id: "c1",
          title: "Complete Company Security & Privacy Training",
          category: "Legal & Compliance",
          duration: "30 min",
          completed: true,
        },
        {
          id: "c2",
          title: "Setup 1Password Vault & Hardware Security Key",
          category: "IT Config",
          duration: "15 min",
          completed: true,
        },
        {
          id: "c3",
          title: "Attend 9:30 AM Team Welcome Standup",
          category: "Team Introduction",
          duration: "45 min",
          completed: false,
        },
        {
          id: "c4",
          title: "1-on-1 Kickoff Sync with Hiring Manager",
          category: "Orientation",
          duration: "30 min",
          completed: false,
        },
        {
          id: "c5",
          title: "Clone Team Repositories & Run Local Build",
          category: "IT Config",
          duration: "45 min",
          completed: false,
        },
      ],
    },
    notifications: [
      {
        id: "n-1",
        title: "Welcome to your Candidate Portal",
        message: `Welcome ${baseName}! Track your applications, interview schedules, and onboarding roadmaps here.`,
        timestamp: "Just now",
        read: false,
        stageId: "application",
      },
    ],
  };
}

export const emptyCandidatePortalState: CandidatePortalState = createCandidatePortalStateFromDoc(
  {},
);

export const MOCK_CANDIDATES: Record<string, CandidatePortalState> = {
  default: emptyCandidatePortalState,
};
