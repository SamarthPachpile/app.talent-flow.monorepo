/**
 * Graviton IT Solutions Corporate & Marketing Text Constants
 * Contains all static text for homepage hero, about us, services, industries, careers, and footer.
 */

export const GRAVITON_PORTAL_TEXTS = {
  meta: {
    brandName: "Graviton IT Solutions",
    tagline: "Accelerating Enterprise Digital Transformation & Intelligent Engineering",
    slogan: "Smart. Bold. Human.",
    established: "2018",
    headquarters: "San Francisco, CA & Global Hubs",
  },

  nav: {
    home: "Home",
    about: "About Us",
    services: "Services",
    industries: "Industries",
    insights: "Insights",
    careers: "Careers",
    contact: "Contact Us",
    ecosystemPortals: "Ecosystem Portals",
    candidatePortal: "Candidate Portal",
    companyWorkspace: "Employer Workspace",
    adminSuite: "Super Admin",
  },

  hero: {
    badge: "Enterprise Engineering & Cloud Excellence",
    headlineMain: "Architecting the Next Era of Digital Enterprise Intelligence",
    subHeadline:
      "We partner with global industry leaders to engineer resilient cloud platforms, deploy production-grade AI systems, and transform complex business architectures.",
    primaryCta: "Explore Our Solutions",
    secondaryCta: "Join Our Team",
    watchReel: "Watch Showreel",
  },

  about: {
    hero: {
      badge: "About Graviton",
      title: "Pioneering Intelligent Technology Solutions for Global Leaders",
      subtitle:
        "Founded with a mission to eliminate friction between technology and business outcomes through zero-distance engineering.",
    },
    mission: {
      title: "Our Mission",
      description:
        "To empower organizations worldwide by building robust, ethical, and scalable digital foundations that drive exponential human potential.",
    },
    vision: {
      title: "Our Vision",
      description:
        "A connected global enterprise ecosystem where technology accelerates sustainable innovation with zero compromise on security or speed.",
    },
    values: [
      {
        title: "Zero Distance to Value",
        desc: "We place our senior engineering architects directly at the center of client challenges without bureaucratic layers.",
      },
      {
        title: "Radical Engineering Integrity",
        desc: "We build systems designed to endure, adhering to uncompromising standards of quality, security, and performance.",
      },
      {
        title: "Human-Centric Innovation",
        desc: "Technology is a multiplier for human ingenuity. We prioritize empathy, accessibility, and intuitive design in everything we ship.",
      },
      {
        title: "Relentless Continuous Evolution",
        desc: "We challenge legacy dogmas, constantly adopting modern distributed architectures, AI paradigms, and clean methodologies.",
      },
    ],
    stats: [
      { value: "500+", label: "Global Enterprise Clients" },
      { value: "25+", label: "Countries Served Worldwide" },
      { value: "99.4%", label: "Client Retention Rate" },
      { value: "2,500+", label: "Elite Engineers & Consultants" },
    ],
  },

  services: {
    badge: "Our Capabilities",
    title: "Full-Spectrum Digital & Cloud Transformation Services",
    subtitle:
      "From legacy modernization to real-time AI agents, we deliver end-to-end technical excellence.",
    list: [
      {
        id: "cloud-transformation",
        title: "Cloud Infrastructure & SRE",
        description:
          "Multi-cloud architecture, automated Kubernetes orchestration, FinOps optimization, and 99.999% site reliability engineering.",
        icon: "Cloud",
      },
      {
        id: "ai-systems",
        title: "Enterprise AI & Machine Learning",
        description:
          "Custom Large Language Model (LLM) fine-tuning, retrieval-augmented generation (RAG), and autonomous agent pipelines.",
        icon: "Brain",
      },
      {
        id: "custom-software",
        title: "Modern Enterprise Software Architecture",
        description:
          "Domain-driven microservices, reactive frontend architectures, distributed systems, and real-time streaming engines.",
        icon: "Code",
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity & Zero-Trust Governance",
        description:
          "End-to-end threat modeling, automated DevSecOps pipelines, identity governance, and SOC2 / ISO27001 certification compliance.",
        icon: "ShieldAlert",
      },
      {
        id: "data-engineering",
        title: "Data Engineering & Real-Time Analytics",
        description:
          "Modern data stack implementations, real-time lakehouses, Apache Kafka streaming, and executive BI dashboards.",
        icon: "Database",
      },
      {
        id: "digital-workplace",
        title: "TalentFlow Workspace & HR Modernization",
        description:
          "Next-gen candidate onboarding ecosystems, automated ATS orchestration, and intelligent talent acquisition workflows.",
        icon: "Sparkles",
      },
    ],
  },

  careers: {
    hero: {
      badge: "Life at Graviton",
      title: "Build the Future with World-Class Engineers",
      subtitle:
        "Join a globally distributed team of passionate problem solvers tackling the most ambitious challenges in modern software engineering.",
      searchPlaceholder: "Search by job title, skill (e.g. React, Kubernetes, AI), or location...",
    },
    whyJoin: {
      title: "Five Reasons You'll Thrive at Graviton",
      reasons: [
        {
          number: "01",
          title: "High-Impact Engineering",
          description:
            "Work on mission-critical distributed systems serving millions of daily active enterprise users.",
        },
        {
          number: "02",
          title: "Remote-First Flexibility",
          description:
            "Work from anywhere with asynchronous autonomy, home office stipends, and flexible hours.",
        },
        {
          number: "03",
          title: "Continuous Learning Budget",
          description:
            "Annual $3,000 personal development stipend for conferences, certifications, and technical courses.",
        },
        {
          number: "04",
          title: "Top-Tier Workstation Setup",
          description:
            "Choose your customized M3 Max MacBook Pro or high-spec Linux machine with dual 4K monitors on day one.",
        },
        {
          number: "05",
          title: "Transparent Growth Tracks",
          description:
            "Clear individual contributor (IC) and engineering leadership paths with bi-annual compensation reviews.",
        },
      ],
    },
    recruitmentProcess: {
      title: "Our Transparent 5-Step Hiring Process",
      subtitle:
        "No trick questions, no endless loops. We value your time with a structured and respectful interview journey.",
      steps: [
        {
          step: 1,
          title: "Resume & Portfolio Review",
          desc: "Our technical recruiting leads review your background within 48 business hours.",
        },
        {
          step: 2,
          title: "Technical Discovery Call",
          desc: "A 30-minute conversation discussing your past engineering projects and aspirations.",
        },
        {
          step: 3,
          title: "Practical System Design / Coding Session",
          desc: "A collaborative 60-minute session solving a realistic architectural problem with our senior engineers.",
        },
        {
          step: 4,
          title: "Culture & Values Alignment",
          desc: "Meet engineering leadership to discuss team dynamics, working style, and growth expectations.",
        },
        {
          step: 5,
          title: "Official Offer & Onboarding Roadmap",
          desc: "Receive your competitive offer package and gain instant access to your TalentFlow Candidate Portal.",
        },
      ],
    },
    faqs: [
      {
        question: "What is Graviton's remote work policy?",
        answer:
          "We are 100% remote-first! You can work from anywhere within your registered tax country, and we provide coworking space memberships and home office stipends.",
      },
      {
        question: "What hardware and equipment do new hires receive?",
        answer:
          "Every full-time team member selects their dream setup during candidate onboarding—including Apple M3 MacBook Pros or Lenovo ThinkPad P-Series, 4K monitors, and ergonomic accessories.",
      },
      {
        question: "How does the interview scheduling work?",
        answer:
          "All interviews are scheduled directly through our automated candidate calendar based on your personal timezone availability.",
      },
      {
        question: "How soon do I receive feedback after an interview?",
        answer:
          "We guarantee written feedback and status updates within 48 hours following every interview round.",
      },
    ],
  },

  footer: {
    description:
      "Graviton IT Solutions is a premier digital engineering and enterprise consulting firm building resilient cloud systems and intelligent platforms for Fortune 500 enterprises.",
    columns: {
      solutions: "Solutions",
      company: "Company",
      portals: "Ecosystem Portals",
      legal: "Legal & Privacy",
    },
    newsletter: {
      title: "Subscribe to Engineering Insights",
      subtitle:
        "Get monthly technical deep-dives on distributed systems, AI architectures, and cloud engineering.",
      placeholder: "Enter your email address...",
      button: "Subscribe",
    },
    copyrightNotice: `© ${new Date().getFullYear()} Graviton IT Solutions Inc. All rights reserved.`,
  },
} as const;
