export type IndustryData = {
  quote?: { text: string; author?: string; role?: string };
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  heroImg: string;
  accent: string; // hex used for highlighted words
  feature: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    body: string;
    img: string;
  };
  transformation: {
    title: string;
    highlight: string;
    body: string;
    img: string;
  };
  capabilities: { title: string; body: string }[];
  stats: { value: string; label: string }[];
  caseStudies: { title: string; tag: string; img: string }[];
  insights: { title: string; tag: string; img: string }[];
  why: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

const baseStats = [
  { value: "15+", label: "years of experience" },
  { value: "24+", label: "global locations" },
  { value: "200+", label: "active enterprise clients" },
  { value: "1,300+", label: "domain experts on staff" },
];

const baseFaqs = [
  {
    q: "How does Croton support digital transformation in this sector?",
    a: "We combine industry domain expertise with applied AI, cloud, and data engineering to modernize platforms, products, and operating models — measured against business KPIs, not vanity metrics.",
  },
  {
    q: "What is your approach to AI and automation initiatives?",
    a: "We start with a value-first AI strategy, prove it in 8–12 week pilots, then scale the highest-ROI use cases into production with full MLOps, governance, and change-management support.",
  },
  {
    q: "How do you ensure compliance, security, and reliability?",
    a: "Every engagement ships with a security baseline aligned to industry frameworks (SOC 2, ISO 27001, sector-specific regulations) and observability built in from day one.",
  },
];

export const INDUSTRIES: IndustryData[] = [
  {
    slug: "saas-technology",
    name: "SaaS & Technology",
    tagline: "Engineering",
    intro:
      "SaaS leaders win on velocity. We help product and engineering teams ship faster, scale reliably, and embed AI into the core of their platforms — turning roadmap pressure into compounding advantage.",
    heroImg:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Product velocity",
      title: "How Top SaaS Teams ",
      titleHighlight: "Outship the Market",
      body: "We modernize delivery pipelines, retire legacy bottlenecks, and pair product squads with senior platform engineers so every sprint moves a real metric.",
      img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Cloud, and Compounding: The Engineering Behind ",
      highlight: "Modern SaaS",
      body: "From multi-tenant architecture to AI copilots inside your product, we engineer the platform foundation that lets your team move at startup speed at any scale.",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "Platform engineering",
        body: "Multi-tenant architecture, internal developer platforms, and self-serve infrastructure that unblock product teams.",
      },
      {
        title: "AI copilots in-product",
        body: "Embed LLM-powered assistants, search, and workflow agents directly into your SaaS UX.",
      },
      {
        title: "Pricing & packaging",
        body: "Usage metering, entitlement engines, and plan migrations that unlock new revenue motions.",
      },
      {
        title: "Reliability & cost",
        body: "SLO-driven SRE practices and FinOps to stop cloud spend from outpacing growth.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "Scaling a B2B SaaS to 10x usage without rewrites",
        tag: "Platform",
        img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Embedding GenAI into a workflow product",
        tag: "AI",
        img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Cutting cloud spend 38% with FinOps",
        tag: "Cost",
        img: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "From feature factory to product platform",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "GenAI inside SaaS: pricing the new copilots",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "The post-PLG playbook for enterprise SaaS",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "Engineered for scale",
        body: "Senior architects who have shipped multi-tenant SaaS at billions of requests per day.",
      },
      {
        title: "AI-native delivery",
        body: "Every squad ships with applied-AI engineers, not bolted-on prompt writers.",
      },
      {
        title: "Outcome-based teams",
        body: "We staff for KPIs — activation, retention, gross margin — not for headcount.",
      },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    tagline: "Modernizing",
    intro:
      "Financial services success hinges on technological innovation. We empower banks, insurers, and capital markets firms to innovate, modernize, and harness data and AI — accelerating digital product development to maximize revenue and customer satisfaction.",
    heroImg:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Industry leadership",
      title: "How Top Firms ",
      titleHighlight: "Thrive Amid Disruption",
      body: "We partner with the largest financial institutions to re-platform core systems, launch new digital products, and use AI responsibly across the value chain.",
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Capital, and Change: The Engineering Behind ",
      highlight: "Financial Services Transformation",
      body: "From core modernization to AI-driven underwriting, we deliver the engineering muscle that turns strategy into shipped, regulated, revenue-generating products.",
      img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "Payments modernization",
        body: "Real-time rails, ISO 20022 migration, and fraud-aware payment orchestration.",
      },
      {
        title: "Digital banking products",
        body: "Customer onboarding, mobile-first banking, and embedded finance experiences.",
      },
      {
        title: "Risk, fraud & AML",
        body: "ML-driven detection, explainable models, and regulator-ready audit trails.",
      },
      {
        title: "Wealth & insurance platforms",
        body: "Advisor cockpits, claims automation, and policy lifecycle modernization.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "Scaling a digital bank to 5M customers",
        tag: "Banking",
        img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Modernizing claims for a global insurer",
        tag: "Insurance",
        img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Real-time fraud detection at the edge",
        tag: "Risk",
        img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "The future of core banking",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "GenAI for wealth advisors",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Embedded finance: a builder's guide",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "Designed for durability",
        body: "Architectures built to outlast a single cloud, vendor, or regulatory cycle.",
      },
      {
        title: "Engineered for resilience",
        body: "Mission-critical platforms that hold up under load, fraud, and audit.",
      },
      {
        title: "Created for trust",
        body: "Privacy, compliance, and explainability baked into every model and workflow.",
      },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "healthcare-life-sciences",
    name: "Healthcare & Life Sciences",
    tagline: "Engineering health",
    intro:
      "From bedside to bench, we engineer digital health products, connected devices, and clinical platforms that improve outcomes, accelerate research, and reduce the cost of care.",
    heroImg:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Patient outcomes",
      title: "How Leading Providers ",
      titleHighlight: "Deliver Connected Care",
      body: "We build the digital backbone that lets clinicians, patients, and devices share trusted data in real time — without breaking compliance.",
      img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Care, and Cures: The Engineering Behind ",
      highlight: "Modern Healthcare",
      body: "From EHR interoperability to AI-assisted diagnostics, we ship regulated, evidence-backed software that earns clinical trust.",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "Connected medical devices",
        body: "Embedded software, device-to-cloud telemetry, and SaMD ready for FDA and CE submissions.",
      },
      {
        title: "Clinical & research platforms",
        body: "EHR/HL7/FHIR interoperability, decentralized trials, and real-world evidence pipelines.",
      },
      {
        title: "Patient experience",
        body: "Omnichannel patient apps with scheduling, telehealth, and remote monitoring.",
      },
      {
        title: "AI for diagnostics & ops",
        body: "Imaging, triage, and operations models with clinical validation pathways.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "AI triage for a national tele-health provider",
        tag: "AI",
        img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Connected insulin platform launch",
        tag: "Devices",
        img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Decentralized trial platform for top-10 pharma",
        tag: "Life Sciences",
        img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "GenAI in clinical workflows",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "FHIR at scale: lessons from the field",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "The connected-device readiness playbook",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "Clinically informed",
        body: "Teams that pair engineers with clinicians, regulatory leads, and human-factors experts.",
      },
      {
        title: "Compliance by design",
        body: "HIPAA, HITRUST, IEC 62304, and GxP woven through SDLC — not bolted on at audit time.",
      },
      {
        title: "Evidence-driven AI",
        body: "Models shipped with validation, monitoring, and clear human-in-the-loop boundaries.",
      },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    tagline: "Industry 4.0",
    intro:
      "We help manufacturers turn the factory floor into a connected, intelligent, software-defined system — unlocking throughput, quality, and resilience across the value chain.",
    heroImg:
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Smart operations",
      title: "How Industrial Leaders ",
      titleHighlight: "Build the Smart Factory",
      body: "We connect machines, MES, and ERP into a single intelligent fabric — then layer on AI to predict, optimize, and act in real time.",
      img: "https://images.unsplash.com/photo-1565017228812-08abb84f0d40?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Cobots, and Continuous Improvement: The Engineering Behind ",
      highlight: "Industry 4.0",
      body: "From digital twins to predictive maintenance, we deliver the OT/IT integration that turns plants into competitive advantages.",
      img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "Industrial IoT & edge",
        body: "Secure connectivity from PLCs and sensors to the cloud with deterministic edge compute.",
      },
      {
        title: "Digital twins",
        body: "Live models of assets, lines, and supply chains used for simulation and optimization.",
      },
      {
        title: "Predictive maintenance",
        body: "ML on vibration, thermal, and process data to cut unplanned downtime.",
      },
      {
        title: "MES & ERP modernization",
        body: "Cloud-native MES and integrations that finally make ERP data actionable on the floor.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "Predictive maintenance across 40 plants",
        tag: "AI",
        img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Digital twin for an automotive assembly line",
        tag: "Twins",
        img: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d4?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "OT/IT convergence for a global CPG",
        tag: "IIoT",
        img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "The state of the smart factory",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Edge AI on the plant floor",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "From pilot purgatory to scaled IIoT",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "OT-aware engineering",
        body: "Teams fluent in PLCs, SCADA, and industrial protocols — not just cloud.",
      },
      {
        title: "Outcome-priced pilots",
        body: "Pilots scoped to OEE, scrap rate, and downtime — measured in 90 days.",
      },
      {
        title: "Scale-ready architectures",
        body: "Reference platforms designed to roll out from one line to a global footprint.",
      },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & E-commerce",
    tagline: "Commerce reimagined",
    intro:
      "Modern retail is a software business. We engineer composable commerce platforms, AI-driven personalization, and unified customer experiences that grow basket size and lifetime value.",
    heroImg:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Customer experience",
      title: "How Modern Retailers ",
      titleHighlight: "Win Every Touchpoint",
      body: "We unify commerce, content, and customer data so every channel feels like one intelligent brand experience.",
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Carts, and Conversion: The Engineering Behind ",
      highlight: "Modern Retail",
      body: "From headless commerce to AI-powered merchandising, we deliver the platforms that let retailers iterate at the speed of trends.",
      img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "Composable commerce",
        body: "Headless storefronts, MACH architectures, and migrations off monolithic suites.",
      },
      {
        title: "Personalization & search",
        body: "Real-time recommendations, semantic search, and GenAI shopping assistants.",
      },
      {
        title: "Unified customer data",
        body: "CDPs, identity resolution, and loyalty platforms that finally see the whole customer.",
      },
      {
        title: "Store & supply tech",
        body: "POS modernization, inventory visibility, and fulfillment orchestration.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "Replatforming a top-10 global retailer to MACH",
        tag: "Commerce",
        img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "GenAI shopping assistant launch",
        tag: "AI",
        img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Unified loyalty across 30 markets",
        tag: "CX",
        img: "https://images.unsplash.com/photo-1556742400-b5b7c5121f2d?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "The composable commerce reality check",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1556742400-b5b7c5121f2d?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "GenAI in merchandising",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Loyalty programs that actually drive LTV",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "Commerce-native engineers",
        body: "Teams who have shipped at peak traffic on Black Friday and Singles' Day.",
      },
      {
        title: "Conversion-obsessed",
        body: "Every release tied to CR, AOV, and LTV — not just velocity.",
      },
      {
        title: "Composable by default",
        body: "Architectures that let merchants swap front-ends, search, and payments without rewrites.",
      },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    tagline: "PropTech, engineered",
    intro:
      "We help owners, operators, and brokerages turn buildings, portfolios, and transactions into intelligent digital products — from leasing to lifecycle.",
    heroImg:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Smart portfolios",
      title: "How Owners & Operators ",
      titleHighlight: "Unlock Portfolio Value",
      body: "We connect building systems, tenant experiences, and financial data into a single operating picture — then make it actionable with AI.",
      img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Concrete, and Cashflow: The Engineering Behind ",
      highlight: "Modern Real Estate",
      body: "From smart-building platforms to AI-driven valuation, we deliver the technology backbone for the next generation of real estate operators.",
      img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "Smart building platforms",
        body: "BMS integration, occupancy analytics, and energy optimization across portfolios.",
      },
      {
        title: "Tenant experience apps",
        body: "Access, amenities, and service requests in a single branded app.",
      },
      {
        title: "Leasing & transactions",
        body: "Digital leasing journeys, e-signature, and CRM tailored to commercial pipelines.",
      },
      {
        title: "Valuation & analytics",
        body: "AVMs, market intelligence, and portfolio dashboards for asset and investment teams.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "Smart-building rollout across 200 assets",
        tag: "PropTech",
        img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "AI valuation engine for a top REIT",
        tag: "AI",
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Tenant app for a global flex-space operator",
        tag: "CX",
        img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "The smart-building business case",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "AI in commercial real estate",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Net-zero portfolios: a tech roadmap",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "Portfolio thinking",
        body: "Solutions designed to roll out across hundreds of assets, not one flagship building.",
      },
      {
        title: "Operator-grade UX",
        body: "Apps that property teams and tenants actually use every day.",
      },
      {
        title: "ESG-ready data",
        body: "Energy, occupancy, and emissions data structured for reporting from day one.",
      },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "education",
    name: "Education",
    tagline: "Learning, reinvented",
    intro:
      "We build the platforms, content systems, and AI tutors that help institutions and edtech companies deliver personalized learning at scale.",
    heroImg:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Learner outcomes",
      title: "How Modern Institutions ",
      titleHighlight: "Personalize at Scale",
      body: "We design learning platforms that adapt to each student — combining content, analytics, and AI tutors into measurable outcomes.",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Curriculum, and Curiosity: The Engineering Behind ",
      highlight: "Modern Learning",
      body: "From LMS modernization to GenAI tutors, we deliver platforms that put learners — and educators — at the center.",
      img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "Learning platforms",
        body: "Modern LMS/LXP architectures, SSO, and integrations with SIS and content libraries.",
      },
      {
        title: "AI tutors & assessment",
        body: "Adaptive practice, GenAI tutors, and rubric-aware grading assistants.",
      },
      {
        title: "Content engineering",
        body: "Authoring tools, accessibility automation, and multi-format publishing pipelines.",
      },
      {
        title: "Analytics & retention",
        body: "Early-warning models and dashboards for advisors, faculty, and program leaders.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "AI tutor for a global higher-ed provider",
        tag: "AI",
        img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "LMS modernization for a national K-12 system",
        tag: "Platform",
        img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Retention analytics for an online university",
        tag: "Analytics",
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "The GenAI tutor question",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Designing for accessibility from day one",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Retention is an engineering problem",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "Learner-centered design",
        body: "UX informed by educators, accessibility experts, and the students themselves.",
      },
      {
        title: "Responsible AI",
        body: "Tutors and assessments shipped with guardrails, transparency, and educator oversight.",
      },
      {
        title: "Built for scale",
        body: "Platforms that perform on the first day of term, not just in the demo.",
      },
    ],
    faqs: baseFaqs,
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    tagline: "Expertise, productized",
    intro:
      "We help consulting, legal, and professional services firms turn their expertise into AI-augmented digital products — increasing leverage, margin, and client value.",
    heroImg:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop",
    accent: "#ff5a1f",
    feature: {
      eyebrow: "Practice leverage",
      title: "How Top Firms ",
      titleHighlight: "Productize Expertise",
      body: "We help partners and practice leaders turn proprietary methods into AI-powered tools that scale beyond billable hours.",
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop",
    },
    transformation: {
      title: "Code, Counsel, and Compounding Value: The Engineering Behind ",
      highlight: "Modern Professional Services",
      body: "From AI copilots for analysts to client portals that feel like products, we deliver the technology that lifts firm-wide productivity.",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80&auto=format&fit=crop",
    },
    capabilities: [
      {
        title: "AI copilots for practitioners",
        body: "Research, drafting, and review assistants tuned to firm knowledge and tone.",
      },
      {
        title: "Knowledge platforms",
        body: "Secure search and retrieval over decades of engagement IP, with access controls.",
      },
      {
        title: "Client portals & products",
        body: "Productized offerings, dashboards, and self-serve tools for engagement teams.",
      },
      {
        title: "Engagement operations",
        body: "Pricing, staffing, and delivery tooling that turns project economics around.",
      },
    ],
    stats: baseStats,
    caseStudies: [
      {
        title: "AI research copilot for a global law firm",
        tag: "AI",
        img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Productized analytics for a strategy consultancy",
        tag: "Products",
        img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "Knowledge platform for a Big-4 practice",
        tag: "Knowledge",
        img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80&auto=format&fit=crop",
      },
    ],
    insights: [
      {
        title: "From billable hours to scalable products",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "GenAI in legal: separating signal from hype",
        tag: "Blogs",
        img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&auto=format&fit=crop",
      },
      {
        title: "The productized-services playbook",
        tag: "White Papers",
        img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80&auto=format&fit=crop",
      },
    ],
    why: [
      {
        title: "Built for partners",
        body: "Stakeholder-aware delivery that respects how partners actually run a practice.",
      },
      {
        title: "IP-safe AI",
        body: "Private-tenant deployments, careful retrieval, and full auditability.",
      },
      {
        title: "Margin-aware engineering",
        body: "Solutions sized to deliver real leverage, not just a flagship pilot.",
      },
    ],
    faqs: baseFaqs,
  },
];

export const getIndustryBySlug = (slug?: string) => INDUSTRIES.find((i) => i.slug === slug);
