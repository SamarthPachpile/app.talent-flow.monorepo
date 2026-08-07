// Graviton local knowledge base for the in-app chatbot.
// Pure data + a deterministic matcher — no external AI calls.

export type KBEntry = {
  id: string;
  // High-signal keywords (lowercased, no punctuation). Multi-word phrases score higher.
  keywords: string[];
  // Optional natural-language question variants used to boost matches.
  questions?: string[];
  answer: string;
  // Optional follow-up suggestions shown after this answer.
  followups?: string[];
  // Boost for very common topics so they win close matches.
  weight?: number;
};

export const KB: KBEntry[] = [
  // ───────────────────────── Company ─────────────────────────
  {
    id: "what-is-graviton",
    keywords: [
      "graviton",
      "what is graviton",
      "about graviton",
      "who are you",
      "company",
      "tapasys",
    ],
    questions: ["What is Graviton?", "Who is Graviton?", "Tell me about Graviton"],
    weight: 1.2,
    answer:
      "**Graviton** is a CRM consultancy and applied-AI partner — part of the **Tapasys Group**. " +
      "We help revenue, marketing, and service teams turn customer data into measurable growth through " +
      "CRM strategy, implementation, RevOps automation, and AI built directly into the workflows your teams already use.",
    followups: [
      "What services do you offer?",
      "Which CRM platforms do you work with?",
      "Where are you located?",
    ],
  },
  {
    id: "office-location",
    keywords: [
      "office",
      "located",
      "location",
      "address",
      "where",
      "based",
      "pune",
      "headquarters",
      "hq",
      "city",
      "country",
      "india",
    ],
    questions: ["Where is Graviton located?", "What's your office address?"],
    answer:
      "Our office is in **Pune, India**:\n\n" +
      "Nyati Hermitage, Dr. Homi Bhabha Rd, Ram Nagar, Bavdhan, Pune, Maharashtra 411021.\n\n" +
      "We work with clients globally — visit the **Contact** page to schedule a meeting.",
  },
  {
    id: "industries",
    keywords: [
      "industry",
      "industries",
      "sectors",
      "verticals",
      "who do you serve",
      "clients",
      "saas",
      "financial services",
      "fintech",
      "banking",
      "healthcare",
      "manufacturing",
      "retail",
      "ecommerce",
      "real estate",
      "education",
      "edtech",
    ],
    questions: ["What industries do you serve?", "Which sectors do you work in?"],
    answer:
      "We work across:\n\n" +
      "- **SaaS & Tech** — product-led growth, usage-based revenue\n" +
      "- **Financial Services & Fintech** — KYC-aware CRM, advisor desks\n" +
      "- **Healthcare & Life Sciences** — patient 360, HIPAA-aware data flows\n" +
      "- **Manufacturing & Distribution** — dealer/partner CRM, field service\n" +
      "- **Retail & E-commerce** — loyalty, omnichannel customer 360\n" +
      "- **Real Estate** — lead-to-booking pipelines\n" +
      "- **Education & EdTech** — admissions and lifecycle CRM",
  },

  // ───────────────────────── Services ─────────────────────────
  {
    id: "services-overview",
    keywords: [
      "services",
      "what do you do",
      "what do you offer",
      "offerings",
      "capabilities",
      "expertise",
    ],
    questions: ["What services does Graviton offer?", "What can you help with?"],
    weight: 1.2,
    answer:
      "Graviton delivers four core service tracks:\n\n" +
      "1. **CRM Strategy & Consulting** — platform selection, customer-360 architecture, RevOps blueprints\n" +
      "2. **Implementation & Migration** — Salesforce, HubSpot, Zoho, Microsoft Dynamics rollouts and re-platforming\n" +
      "3. **Applied AI** — copilots, predictive lead scoring, conversation intelligence, agentic workflows\n" +
      "4. **Data & Analytics** — pipelines, dashboards (Tableau, Power BI), governance and reporting",
    followups: [
      "Tell me about CRM implementation",
      "How does AI fit into CRM?",
      "Do you do data migrations?",
    ],
  },
  {
    id: "crm-strategy",
    keywords: [
      "strategy",
      "consulting",
      "advisory",
      "blueprint",
      "roadmap",
      "platform selection",
      "revops",
      "rev ops",
    ],
    answer:
      "Our **CRM Strategy & Consulting** practice covers:\n\n" +
      "- Current-state assessment and pain-point mapping\n" +
      "- Platform selection (Salesforce vs HubSpot vs Zoho vs Dynamics)\n" +
      "- Customer-360 data architecture\n" +
      "- RevOps process design (lead → opportunity → renewal)\n" +
      "- Adoption, change-management and governance plans\n\n" +
      "Most engagements start with a 2–4 week discovery sprint that produces a phased roadmap.",
  },
  {
    id: "implementation",
    keywords: [
      "implementation",
      "implement",
      "rollout",
      "deploy",
      "deployment",
      "setup",
      "configure",
      "build out",
    ],
    questions: ["Do you implement CRM systems?", "How do you implement Salesforce?"],
    answer:
      "We run **CRM implementations** end-to-end:\n\n" +
      "- Discovery & blueprinting\n" +
      "- Object/data model design\n" +
      "- Configuration, custom objects, flows and Apex/serverless when needed\n" +
      "- Integrations with marketing, finance, support and product systems\n" +
      "- UAT, training, hypercare and post-go-live optimization\n\n" +
      "Typical mid-size rollouts land in **8–16 weeks**.",
  },
  {
    id: "migration",
    keywords: [
      "migration",
      "migrate",
      "data migration",
      "move data",
      "switch crm",
      "replatform",
      "re-platform",
    ],
    questions: [
      "How do you handle CRM data migration?",
      "Can you migrate from one CRM to another?",
    ],
    answer:
      "**CRM migrations** are where most projects fail. Our playbook:\n\n" +
      "1. Profile & cleanse source data (dedupe, normalize, enrich)\n" +
      "2. Build a field-by-field mapping with owner sign-off\n" +
      "3. Stage in a sandbox; run iterative test loads\n" +
      "4. Cut-over plan with rollback, then dual-run for a defined window\n\n" +
      "Common pitfalls we prevent: silent attachment loss, broken activity history, " +
      "ID-mismatch on related records, and timezone/date drift.",
  },
  {
    id: "integration",
    keywords: [
      "integration",
      "integrate",
      "connect",
      "api",
      "middleware",
      "mulesoft",
      "zapier",
      "webhook",
    ],
    questions: ["Can you integrate CRM with other tools?"],
    answer:
      "Yes — we integrate CRM with marketing automation, ERPs, billing, support, data warehouses and product analytics. " +
      "We use the right tool for the job: native connectors, **iPaaS** (Workato, MuleSoft, Boomi), serverless functions, " +
      "or direct API + webhook patterns. Every integration ships with monitoring, retries and an idempotency strategy.",
  },
  {
    id: "automation",
    keywords: ["automation", "automate", "workflow", "process", "playbook", "sequence"],
    answer:
      "We automate the repetitive work that drains revenue teams: lead routing and assignment, " +
      "follow-up cadences, renewal alerts, contract generation, approvals, hand-offs between sales/CS, " +
      "and data-quality enforcement. Built natively in your CRM where possible, escalated to iPaaS or code only when needed.",
  },
  {
    id: "analytics",
    keywords: [
      "analytics",
      "dashboard",
      "reporting",
      "tableau",
      "power bi",
      "powerbi",
      "looker",
      "bi",
    ],
    questions: ["Do you build dashboards?", "What BI tools do you use?"],
    answer:
      "We build executive and operational dashboards in **Tableau, Power BI, Looker** and native CRM analytics " +
      "(Salesforce CRM Analytics, HubSpot Reports). Typical outputs: pipeline health, forecast accuracy, " +
      "cohort retention, CAC/LTV, rep productivity, and customer-360 views combining CRM + product + finance data.",
  },
  {
    id: "data-engineering",
    keywords: [
      "data",
      "data engineering",
      "pipeline",
      "warehouse",
      "snowflake",
      "bigquery",
      "redshift",
      "etl",
      "elt",
    ],
    answer:
      "Our data team builds the pipelines that make CRM analytics trustworthy: ELT into **Snowflake / BigQuery / Redshift**, " +
      "modelling in **dbt**, reverse-ETL back into CRM with **Hightouch / Census**, and governance via clear ownership, " +
      "freshness SLAs and tested transformations.",
  },

  // ───────────────────────── Platforms ─────────────────────────
  {
    id: "salesforce",
    keywords: [
      "salesforce",
      "sfdc",
      "sales cloud",
      "service cloud",
      "marketing cloud",
      "experience cloud",
    ],
    questions: ["Do you work with Salesforce?", "What can you do in Salesforce?"],
    weight: 1.1,
    answer:
      "Yes — **Salesforce** is one of our core platforms. We deliver **Sales Cloud, Service Cloud, " +
      "Marketing Cloud / Account Engagement, Experience Cloud, CPQ** and **CRM Analytics**. " +
      "Strengths: deepest customization, mature ecosystem, AppExchange. Best for mid-market and enterprise " +
      "with complex processes.",
  },
  {
    id: "hubspot",
    keywords: ["hubspot", "hub spot", "marketing hub", "sales hub", "service hub"],
    answer:
      "**HubSpot** is excellent for fast time-to-value, marketing-led growth, and teams that want one unified " +
      "platform across marketing, sales and service without heavy admin overhead. We implement Marketing Hub, " +
      "Sales Hub, Service Hub, Operations Hub and Content Hub.",
  },
  {
    id: "zoho",
    keywords: ["zoho", "zoho one", "zoho crm"],
    answer:
      "**Zoho CRM** offers strong functionality at a low TCO and works well for SMBs and growing mid-market teams. " +
      "We design and roll out Zoho One bundles where the wider Zoho suite (Books, Desk, Campaigns, Analytics) adds value.",
  },
  {
    id: "dynamics",
    keywords: ["dynamics", "microsoft dynamics", "d365", "dynamics 365"],
    answer:
      "**Microsoft Dynamics 365** is a strong fit for enterprises already invested in the Microsoft stack " +
      "(Azure, Power Platform, Teams, Fabric). We deliver Sales, Customer Service and Marketing modules " +
      "and extend with Power Automate / Power Apps.",
  },
  {
    id: "salesforce-vs-hubspot",
    keywords: [
      "salesforce vs hubspot",
      "hubspot vs salesforce",
      "compare salesforce hubspot",
      "which crm",
      "which is better",
      "salesforce or hubspot",
      "compare crm",
    ],
    questions: [
      "Salesforce vs HubSpot — which fits us?",
      "Should I pick Salesforce or HubSpot?",
      "Which CRM is better?",
    ],
    weight: 1.3,
    answer:
      "Short answer: **process complexity** and **scale** decide.\n\n" +
      "- Pick **HubSpot** if you want fast setup, a marketing-led motion, simple-to-moderate sales process, " +
      "  and you value low admin overhead.\n" +
      "- Pick **Salesforce** if you have complex sales/service processes, multiple business units, " +
      "  heavy customization or compliance needs, or you're already enterprise-scale.\n\n" +
      "We run a **2-week selection sprint** that scores both against your real requirements, data and budget. " +
      "Click **Talk to Sales** to start one.",
  },
  {
    id: "platform-comparison",
    keywords: [
      "compare platforms",
      "platform comparison",
      "salesforce hubspot zoho",
      "crm comparison",
    ],
    answer:
      "Quick lens for the four we implement most:\n\n" +
      "- **Salesforce** — most powerful & customizable; best for enterprise complexity.\n" +
      "- **HubSpot** — fastest to value; best for marketing-led, mid-market.\n" +
      "- **Zoho** — best TCO; best for SMB and lean teams that want a wider business suite.\n" +
      "- **Dynamics 365** — best when you're a Microsoft shop already running Power Platform / Azure.\n\n" +
      "We help you pick objectively in a discovery sprint.",
  },

  // ───────────────────────── AI in CRM ─────────────────────────
  {
    id: "ai-in-crm",
    keywords: [
      "ai",
      "applied ai",
      "ai in crm",
      "artificial intelligence",
      "machine learning",
      "ml",
      "where can ai",
      "ai use cases",
      "copilot",
      "agent",
      "agentic",
    ],
    questions: ["Where can AI add value in my CRM?", "What can AI do for our CRM?"],
    weight: 1.3,
    answer:
      "The highest-ROI AI use cases inside CRM today:\n\n" +
      "- **Predictive lead & opportunity scoring** — focus reps on what will close\n" +
      "- **Conversation intelligence** — call/email summaries, next-best-action, risk flags\n" +
      "- **Sales & service copilots** — draft replies, summarize accounts, surface answers from your KB\n" +
      "- **Forecast intelligence** — pipeline anomaly detection, forecast roll-ups\n" +
      "- **Churn & expansion prediction** for CS teams\n" +
      "- **Agentic workflows** — agents that resolve common tickets, qualify leads, or update records autonomously\n\n" +
      "We start with one well-scoped use case that has measurable value, then scale.",
    followups: [
      "How long does an AI pilot take?",
      "Is our data ready for AI?",
      "What is agentic AI?",
    ],
  },
  {
    id: "lead-scoring",
    keywords: ["lead scoring", "predictive scoring", "score leads", "qualification", "icp"],
    answer:
      "We build **predictive lead-scoring** models trained on your historical conversion data. " +
      "Outputs flow back into the CRM as a score plus the top contributing factors so reps know **why**. " +
      "Most clients see double-digit lift in conversion rate by re-prioritizing the same pipeline.",
  },
  {
    id: "copilots",
    keywords: [
      "copilot",
      "co-pilot",
      "assistant",
      "ai assistant",
      "sales copilot",
      "service copilot",
    ],
    answer:
      "**Copilots** sit inside the CRM (or your service console) and: summarize accounts and conversations, " +
      "draft outbound emails and replies, recommend next steps, retrieve answers from your internal knowledge, " +
      "and update records hands-free. We build them on your stack of choice — Salesforce Einstein, HubSpot Breeze, " +
      "or custom on top of OpenAI/Anthropic/open models.",
  },
  {
    id: "conversation-intelligence",
    keywords: [
      "conversation intelligence",
      "call intelligence",
      "gong",
      "chorus",
      "transcripts",
      "call summary",
    ],
    answer:
      "**Conversation intelligence** turns every sales call and support interaction into structured data: " +
      "summary, action items, sentiment, risk signals, competitor mentions and coaching moments — all written back " +
      "to the right CRM record. We integrate Gong/Chorus or build custom pipelines on top of Whisper + LLMs.",
  },
  {
    id: "agentic-ai",
    keywords: ["agentic", "agentic ai", "ai agent", "autonomous", "agent workflow"],
    answer:
      "**Agentic AI** means agents that take multi-step actions on your behalf — qualify a lead, resolve a tier-1 " +
      "ticket, prep a renewal pack, or update CRM hygiene — under guardrails you control. " +
      "We design agents with explicit tools, audit logs and human-in-the-loop checkpoints so they're safe to roll out.",
  },
  {
    id: "ai-readiness",
    keywords: ["ai readiness", "ready for ai", "data ready", "data quality", "prepare for ai"],
    questions: ["Is our data ready for AI?", "How do we prepare for AI?"],
    answer:
      "AI is only as good as the data underneath. We assess **6 readiness dimensions**: data completeness, " +
      "freshness, ownership, security/compliance, identity resolution and process maturity. " +
      "A 2-week readiness sprint produces a scorecard plus a prioritized fix list — usually enough to unblock the first AI use case.",
  },

  // ───────────────────────── Pricing & Engagement ─────────────────────────
  {
    id: "pricing",
    keywords: [
      "pricing",
      "price",
      "cost",
      "rates",
      "fees",
      "how much",
      "budget",
      "quote",
      "estimate",
    ],
    questions: ["How much do you charge?", "What does it cost?", "Can I get a quote?"],
    weight: 1.2,
    answer:
      "Pricing depends on scope, platform and timeline. We offer:\n\n" +
      "- **Fixed-fee discovery sprints** (2–4 weeks)\n" +
      "- **Time & materials** for ongoing build\n" +
      "- **Outcome-based / managed services** for steady-state RevOps and AI ops\n\n" +
      "For a custom quote, hit **Talk to Sales** or visit the **Contact** page — we'll respond within one business day.",
    followups: ["How long does implementation take?", "Where are you located?"],
  },
  {
    id: "timeline",
    keywords: [
      "timeline",
      "how long",
      "duration",
      "weeks",
      "months",
      "schedule",
      "go live",
      "go-live",
    ],
    questions: ["How long does a CRM implementation take?", "What's a typical timeline?"],
    weight: 1.2,
    answer:
      "Rough timelines:\n\n" +
      "- **Discovery sprint:** 2–4 weeks\n" +
      "- **Greenfield SMB CRM:** 6–10 weeks\n" +
      "- **Mid-market implementation:** 8–16 weeks\n" +
      "- **Enterprise / multi-cloud rollout:** 4–9 months in phased releases\n" +
      "- **AI pilot (one use case):** 4–8 weeks to production\n\n" +
      "We push for an early production milestone in 30–45 days so value lands fast.",
  },
  {
    id: "engagement-model",
    keywords: [
      "engagement",
      "engagement model",
      "how do you work",
      "process",
      "methodology",
      "approach",
    ],
    answer:
      "Our engagement model is small senior teams running short, outcome-led sprints:\n\n" +
      "1. **Discovery** — current-state, KPIs, prioritized roadmap\n" +
      "2. **Design** — data model, processes, UX walkthroughs\n" +
      "3. **Build** — iterative, demoed every 1–2 weeks\n" +
      "4. **Launch** — UAT, training, hypercare\n" +
      "5. **Optimize** — adoption metrics, continuous improvement\n\n" +
      "You'll have one named delivery lead from kickoff to go-live.",
  },
  {
    id: "support",
    keywords: [
      "support",
      "managed services",
      "ams",
      "post go live",
      "post-go-live",
      "ongoing",
      "maintenance",
    ],
    answer:
      "After go-live we offer **managed services / AMS**: SLA-backed admin support, enhancement backlog, " +
      "release management, integration monitoring and quarterly business reviews. Most clients keep us on " +
      "for steady-state RevOps and to ship the next round of automation/AI.",
  },
  {
    id: "roi",
    keywords: ["roi", "value", "business case", "kpi", "metrics", "outcomes"],
    answer:
      "We frame every engagement around 3–5 measurable KPIs — for example: pipeline coverage, win rate, " +
      "lead response time, CSAT, ticket deflection, forecast accuracy, or rep productivity. " +
      "Baselines are captured in discovery, then re-measured 60/90 days post go-live to prove ROI.",
  },
  {
    id: "security-compliance",
    keywords: ["security", "compliance", "gdpr", "hipaa", "soc2", "iso", "privacy", "governance"],
    answer:
      "We implement CRM and AI with security and compliance built in: role-based access, field-level security, " +
      "audit trails, data residency considerations, and AI guardrails (PII redaction, prompt filtering, audit logs). " +
      "We've worked under **GDPR, HIPAA-aware** and **SOC 2** programs.",
  },

  // ───────────────────────── Contact & meta ─────────────────────────
  {
    id: "contact",
    keywords: [
      "contact",
      "talk to sales",
      "sales",
      "demo",
      "meeting",
      "call",
      "email",
      "reach you",
      "get in touch",
    ],
    questions: ["How do I contact you?", "Can I book a demo?"],
    weight: 1.1,
    answer:
      "The fastest path:\n\n" +
      "- Click the **Talk to Sales** button in the header\n" +
      "- Or visit the **Contact** page and send us a note — we reply within one business day\n\n" +
      "We can run a 30-minute discovery call to scope what you need.",
  },
  {
    id: "careers",
    keywords: [
      "career",
      "careers",
      "job",
      "jobs",
      "hiring",
      "work at graviton",
      "open roles",
      "apply",
      "vacancy",
      "vacancies",
      "recruitment",
    ],
    answer:
      "We're a small senior team and hire selectively for CRM consultants, solution architects, " +
      "data engineers and applied-AI engineers. Check the **Careers** page for current openings, " +
      "or send us a note via **Contact**.",
  },
  {
    id: "tapasys",
    keywords: ["tapasys", "tapasys group", "parent company", "subsidiary"],
    answer:
      "Graviton is part of the **Tapasys Group** — a family of focused B2B technology and consulting brands. " +
      "Being part of the group gives us access to deeper engineering, data and design capabilities when projects need them.",
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    answer:
      "Hi! I'm **Graviton AI** — your guide to our CRM and applied-AI services. " +
      "Ask me about CRM platforms, implementation timelines, AI use cases, pricing, or anything else.",
    followups: [
      "What does Graviton do?",
      "Salesforce vs HubSpot?",
      "How long does implementation take?",
    ],
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "thx", "appreciate"],
    answer: "You're welcome! Anything else you'd like to know about CRM, AI or how we work?",
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see you", "later", "cya"],
    answer:
      "Thanks for stopping by — when you're ready, hit **Talk to Sales** and we'll take it from there.",
  },
];

// ───────────────────────── Synonyms / phrase normalization ─────────────────────────
// Map of "alias" → "canonical phrase" applied before tokenization. This lets users
// rephrase common terms (sf, sfdc, "ms dynamics", "AI/ML"…) and still match.
const SYNONYMS: Array<[RegExp, string]> = [
  // Platform aliases
  [/\bsfdc\b|\bsales\s*force\b|\bsf\b/gi, "salesforce"],
  [/\bhub\s*spot\b|\bhs\b/gi, "hubspot"],
  [/\bms\s*dynamics\b|\bd\s*365\b|\bdynamics\s*365\b/gi, "dynamics"],
  [/\bms\s*crm\b|\bmicrosoft\s*crm\b/gi, "dynamics"],
  [/\bzoho\s*crm\b/gi, "zoho"],

  // CRM / general
  [/\bcustomer\s*relationship\s*management\b/gi, "crm"],
  [/\brevenue\s*operations\b/gi, "revops"],
  [/\bgo[- ]?to[- ]?market\b/gi, "gtm"],

  // AI aliases
  [/\bartificial\s*intelligence\b/gi, "ai"],
  [/\bmachine\s*learning\b/gi, "ml"],
  [/\bgen(?:erative)?\s*ai\b/gi, "ai"],
  [/\bllm[s]?\b|\blarge\s*language\s*model[s]?\b/gi, "ai"],
  [/\bchat\s*bot[s]?\b/gi, "copilot"],
  [/\bvirtual\s*agent[s]?\b/gi, "agent"],

  // Common phrasings
  [/\bhow\s+much\s+(?:does|will|would)\s+it\s+cost\b/gi, "pricing"],
  [/\bhow\s+much\s+do\s+you\s+charge\b/gi, "pricing"],
  [/\bget\s+in\s+touch\b|\breach\s+(?:out|you)\b|\btalk\s+to\s+(?:sales|someone)\b/gi, "contact"],
  [/\bbook\s+(?:a\s+)?(?:demo|meeting|call)\b/gi, "demo"],
  [/\bmove\s+(?:from|to)\s+\w+\b/gi, "migration"],
  [/\bset\s+up\b/gi, "setup"],
  [/\bjob\s+openings?\b|\bopen\s+positions?\b/gi, "careers"],
  [/\bwhere\s+are\s+you\s+(?:based|located)\b/gi, "location"],
];

function normalize(text: string): string {
  let out = " " + text.toLowerCase() + " ";
  for (const [pat, repl] of SYNONYMS) {
    out = out.replace(pat, repl);
  }
  return out.trim();
}

// ───────────────────────── Matcher ─────────────────────────

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "do",
  "does",
  "for",
  "from",
  "has",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "its",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "should",
  "so",
  "some",
  "than",
  "that",
  "the",
  "to",
  "us",
  "was",
  "we",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "you",
  "your",
  "can",
  "could",
  "would",
  "tell",
  "about",
  "please",
  "give",
  "want",
  "like",
]);

function tokenize(text: string): string[] {
  return normalize(text)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function scoreEntry(query: string, qTokens: Set<string>, entry: KBEntry): number {
  const qLower = normalize(query);
  let score = 0;

  // Phrase / multi-word keyword bonus (very strong signal).
  for (const kw of entry.keywords) {
    const kwLower = normalize(kw);
    if (kwLower.includes(" ") && qLower.includes(kwLower)) {
      score += 8 * kwLower.split(" ").length;
    }
  }

  // Question-variant phrase match.
  for (const q of entry.questions ?? []) {
    const ql = normalize(q);
    if (qLower === ql) score += 25;
    else if (qLower.includes(ql) || ql.includes(qLower)) score += 12;
  }

  // Token overlap on keywords (single-token keywords get full credit).
  for (const kw of entry.keywords) {
    const kwTokens = tokenize(kw);
    const perTok = kwTokens.length === 1 ? 5 : 3;
    for (const tok of kwTokens) {
      if (qTokens.has(tok)) score += perTok;
    }
  }

  // Token overlap on question variants.
  for (const q of entry.questions ?? []) {
    for (const tok of tokenize(q)) {
      if (qTokens.has(tok)) score += 1.5;
    }
  }

  return score * (entry.weight ?? 1);
}

export type MatchResult = {
  answer: string;
  matched: boolean;
  /** "high" = confident, "low" = ambiguous (multiple suggestions), "none" = no match */
  confidence: "high" | "low" | "none";
  followups: string[];
  topId?: string;
  /** Top candidate ids when confidence is "low". */
  candidates?: { id: string; question: string }[];
  /** Numeric debug score for the test page. */
  score?: number;
};

function representativeQuestion(entry: KBEntry): string {
  return entry.questions?.[0] ?? entry.keywords[0];
}

export function answerQuestion(rawQuery: string): MatchResult {
  const query = (rawQuery || "").trim();
  if (!query) {
    return {
      matched: false,
      confidence: "none",
      answer:
        "Ask me anything about Graviton, CRM platforms, implementation timelines, AI in CRM, or pricing.",
      followups: ["What does Graviton do?", "Salesforce vs HubSpot?", "Pricing?"],
    };
  }

  const tokens = new Set(tokenize(query));
  const scored = KB.map((entry) => ({ entry, score: scoreEntry(query, tokens, entry) })).sort(
    (a, b) => b.score - a.score,
  );

  const best = scored[0];
  const second = scored[1];
  const third = scored[2];

  // Confident match.
  // Lower threshold for very short queries (1–2 meaningful tokens).
  const threshold = tokens.size <= 2 ? 4 : 6;
  // Ambiguous threshold — there's *some* signal but not a clear winner.
  const ambiguousThreshold = tokens.size <= 2 ? 2 : 3;

  if (best && best.score >= threshold) {
    let answer = best.entry.answer;
    // If second-best is close, append a short "related" pointer.
    if (
      second &&
      second.score >= 4 &&
      second.score >= best.score * 0.7 &&
      second.entry.id !== best.entry.id
    ) {
      const relatedQ = second.entry.questions?.[0];
      if (relatedQ) {
        answer += `\n\n_Related: ${relatedQ}_`;
      }
    }
    return {
      matched: true,
      confidence: "high",
      answer,
      followups: best.entry.followups ?? [],
      topId: best.entry.id,
      score: best.score,
    };
  }

  // Ambiguous — show clarifying question with top candidates.
  if (best && best.score >= ambiguousThreshold) {
    const cands = [best, second, third]
      .filter((c) => c && c.score >= ambiguousThreshold * 0.6)
      .map((c) => ({ id: c!.entry.id, question: representativeQuestion(c!.entry) }));

    logUnmatched(query, "low", best.score);

    return {
      matched: false,
      confidence: "low",
      score: best.score,
      topId: best.entry.id,
      answer:
        "I want to make sure I answer the right thing. **Did you mean one of these?** " +
        "Pick a suggestion below — or rephrase and I'll try again.",
      followups: cands.map((c) => c.question),
      candidates: cands,
    };
  }

  // Weak/no match → graceful fallback that still feels relevant.
  logUnmatched(query, "none", best?.score ?? 0);
  return {
    matched: false,
    confidence: "none",
    score: best?.score ?? 0,
    answer:
      "I don't have a specific answer for that yet. Could you tell me a bit more — " +
      "are you asking about a **CRM platform**, an **AI use case**, **pricing/timeline**, or **how to contact us**?\n\n" +
      "Here are popular topics I can help with:",
    followups: [
      "What does Graviton do?",
      "Salesforce vs HubSpot — which fits us?",
      "How long does CRM implementation take?",
      "Where can AI add value in my CRM?",
    ],
  };
}

// ───────────────────────── Telemetry (client-side only) ─────────────────────────
// Logs unmatched / low-confidence queries to localStorage so the dataset can be
// improved over time. Exposed as `getUnmatchedLog` / `clearUnmatchedLog` /
// `exportUnmatchedLog` for the chatbot test page.

export type UnmatchedLogEntry = {
  ts: string;
  query: string;
  confidence: "low" | "none";
  topScore: number;
};

const LOG_KEY = "graviton_kb_unmatched_v1";
const LOG_LIMIT = 500;

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function logUnmatched(query: string, confidence: "low" | "none", topScore: number) {
  if (!isBrowser()) return;
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    const log: UnmatchedLogEntry[] = raw ? JSON.parse(raw) : [];
    log.push({
      ts: new Date().toISOString(),
      query,
      confidence,
      topScore: Number(topScore.toFixed(2)),
    });
    if (log.length > LOG_LIMIT) log.splice(0, log.length - LOG_LIMIT);
    window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    // ignore quota / serialization errors
  }
}

export function getUnmatchedLog(): UnmatchedLogEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearUnmatchedLog() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LOG_KEY);
}

export function exportUnmatchedLog(): string {
  const log = getUnmatchedLog();
  const header = "timestamp,confidence,top_score,query\n";
  const rows = log.map((e) => {
    const safe = `"${e.query.replace(/"/g, '""')}"`;
    return `${e.ts},${e.confidence},${e.topScore},${safe}`;
  });
  return header + rows.join("\n");
}
