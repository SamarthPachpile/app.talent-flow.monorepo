import bg_img_companies from "../../public/assets/hero-bg.jpg";
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Users,
  Layers,
  FileSpreadsheet,
  Linkedin,
  Star,
  Play,
  Workflow,
  Calculator,
  ChevronDown,
  Globe,
  Menu,
  X,
  Laptop,
  Clock,
  TrendingUp,
  FileCheck,
  Check,
  Calendar,
} from "lucide-react";
import CTASection from "./CTASection";
import { Footer } from "./Footer";

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSelectPlan: (planId: "starter" | "growth" | "enterprise") => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onSignIn, onSelectPlan }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<
    "all" | "sourcing" | "pipeline" | "compliance" | "onboarding"
  >("all");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Live Pipeline Simulator Tab
  const [demoStage, setDemoStage] = useState<"sourcing" | "interview" | "offer" | "hardware">(
    "sourcing",
  );

  // ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(12);
  const [monthlyHires, setMonthlyHires] = useState<number>(30);
  const [avgSalaryK, setAvgSalaryK] = useState<number>(110);

  // Calculated ROI values
  const hoursSavedPerMonth = teamSize * 36;
  const annualSavingsDollars = Math.round(hoursSavedPerMonth * 12 * 48 + monthlyHires * 450);
  const daysSavedInTime2Fill = Math.min(21, Math.round(monthlyHires * 0.52));
  const velocityMultiplier = (1 + (teamSize * 0.12 + monthlyHires * 0.05) / 10).toFixed(1);

  // Parallax Scroll Hooks
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], [0, 80]);
  const heroOpacity = useTransform(heroScroll, [0, 0.9], [1, 0.25]);

  const stats = [
    {
      label: "Active Enterprise Workspaces",
      value: "580+",
      change: "+28% YoY Growth",
      icon: Building2,
    },
    {
      label: "Candidates Processed",
      value: "1.6M+",
      change: "28 Micro-Stages Live",
      icon: Users,
    },
    {
      label: "Average Time-to-Fill Saved",
      value: "68%",
      change: "Automated Workflows",
      icon: Clock,
    },
    {
      label: "Multi-Tenant Isolation SLA",
      value: "99.99%",
      change: "Cryptographic RLS",
      icon: ShieldCheck,
    },
  ];

  const clients = [
    {
      name: "Acme Corporation",
      logo: "AC",
      industry: "Enterprise SaaS",
      metric: "65% faster hiring cycles",
    },
    {
      name: "Northwind Cloud",
      logo: "NW",
      industry: "Cybersecurity",
      metric: "120+ hires in 6 months",
    },
    {
      name: "Halcyon Health",
      logo: "HH",
      industry: "Digital MedTech",
      metric: "Zero compliance errors",
    },
    {
      name: "Meridian Logistics",
      logo: "ML",
      industry: "Global Supply Chain",
      metric: "Automated candidate sync",
    },
    {
      name: "Apex Bio Labs",
      logo: "AB",
      industry: "Pharma & Research",
      metric: "Paperless offer letters",
    },
    {
      name: "CyberGrid Systems",
      logo: "CG",
      industry: "Fintech Infrastructure",
      metric: "Unified recruiter tracking",
    },
  ];

  const features = [
    {
      icon: Layers,
      category: "pipeline",
      title: "28 Micro-Stage Kanban Engine",
      badge: "Pipeline",
      description:
        "Track candidates across granular micro-stages from resume parsing and interviewer scheduling to approvals, e-signature offers, and hardware delivery.",
      benefits: [
        "Drag & drop stage advancement",
        "Configurable stage exit criteria",
        "Auto-triggered status emails",
      ],
    },
    {
      icon: Linkedin,
      category: "sourcing",
      title: "LinkedIn Recruiter Connector",
      badge: "Sourcing",
      description:
        "Ingest candidate profiles, recruiter notes, and active applications directly from LinkedIn with 1-click import into Stage 1 intake.",
      benefits: [
        "Instant profile parsing",
        "Duplicate candidate detection",
        "Direct recruiter attribution",
      ],
    },
    {
      icon: FileSpreadsheet,
      category: "sourcing",
      title: "Google Sheets Live Importer",
      badge: "Sourcing",
      description:
        "Sync candidate sheets and referral rosters into structured micro-stage records with intelligent column auto-detection and live sync.",
      benefits: [
        "Custom field mapping engine",
        "Real-time row updates",
        "Bulk CSV / Excel import support",
      ],
    },
    {
      icon: ShieldCheck,
      category: "compliance",
      title: "Cryptographic Multi-Tenancy",
      badge: "Security",
      description:
        "Every onboarded company receives an isolated database tenant, custom branded subdomains, strict RBAC controls, and SOC2 / GDPR compliance.",
      benefits: [
        "Row-Level Security (RLS)",
        "Custom subdomains (company.hub)",
        "Dedicated audit logs",
      ],
    },
    {
      icon: FileCheck,
      category: "onboarding",
      title: "Automated E-Signatures & Offers",
      badge: "Offers",
      description:
        "Generate dynamic offer letters with customizable CTC breakdowns, approval matrices, and legally binding digital signatures in seconds.",
      benefits: [
        "Visual CTC salary builder",
        "Multi-approver sign-off chains",
        "Audit-stamped PDF generation",
      ],
    },
    {
      icon: Laptop,
      category: "onboarding",
      title: "IT & Hardware Provisioning",
      badge: "Day One",
      description:
        "Empower new hires to choose laptops (M3 MacBook Pro / Dell XPS), accessories, and receive IT setup credentials before Day 1.",
      benefits: [
        "Pre-boarding equipment portal",
        "FedEx / UPS tracking integration",
        "Automated workspace provisioning",
      ],
    },
  ];

  const faqs = [
    {
      q: "How fast can our company onboard and launch our workspace?",
      a: "Our automated onboarding wizard completes full workspace setup—including custom subdomain allocation, brand color theming, module activation, and recruiter invitations—in under 2 minutes.",
    },
    {
      q: "How do the LinkedIn and Google Sheets sourcing connectors work?",
      a: "The LinkedIn connector pushes candidate profiles directly into your Stage 1 intake. The Google Sheets connector auto-detects column headers and maps names, emails, roles, and notes with automated duplicate verification.",
    },
    {
      q: "Is our candidate data completely isolated from other tenant companies?",
      a: "Yes. Every onboarded company is provisioned with cryptographically isolated database Row-Level Security (RLS), isolated candidate indexes, custom SSL subdomains, and dedicated recruiter permission boundaries.",
    },
    {
      q: "Can we configure custom approval workflows and CTC breakdown structures?",
      a: "Absolutely. TalentFlow provides a built-in CTC salary breakdown editor, multi-level hiring manager approval matrices, and customizable offer contract templates.",
    },
    {
      q: "What does the candidate experience look like during onboarding?",
      a: "Candidates log in through their company-branded portal to monitor their 28-stage progression in real time, view scheduled interviews, sign offer contracts electronically, and choose their work laptop.",
    },
  ];

  const filteredFeatures =
    activeFeatureTab === "all" ? features : features.filter((f) => f.category === activeFeatureTab);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-ember selection:text-ember-foreground font-sans flex flex-col relative overflow-x-clip">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ember z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Top Floating Header Navigation */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-[1400px]">
        <div className="clip-path-nav-sm bg-background/90 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] border border-border/70">
          <div className="flex items-center justify-between pl-5 pr-2 sm:pl-7 sm:pr-3 py-2.5">
            {/* Brand Logo */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <motion.span
                whileHover={{ rotate: 8, scale: 1.08 }}
                className="grid size-9 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-xs text-xs shrink-0"
              >
                TF
              </motion.span>
              <div className="flex flex-col leading-none">
                <span className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-ember transition-colors">
                  TalentFlow<sup className="text-[10px] top-0 ml-0.5 font-bold text-ember">®</sup>
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                  Enterprise Candidate OS
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-muted-foreground">
              <a href="#about" className="hover:text-ember transition-colors">
                Architecture
              </a>
              <a href="#pipeline-demo" className="hover:text-ember transition-colors">
                Live Simulator
              </a>
              <a href="#features" className="hover:text-ember transition-colors">
                Features & Connectors
              </a>
              <a href="#roi-calculator" className="hover:text-ember transition-colors">
                ROI Calculator
              </a>
              <a href="#clients" className="hover:text-ember transition-colors">
                Clients
              </a>
              <a href="#pricing" className="hover:text-ember transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-ember transition-colors">
                FAQ
              </a>
            </nav>

            {/* Right Side Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                <Globe className="w-3.5 h-3.5 text-ember" />
                <span>Global</span>
              </button>

              <button
                onClick={onSignIn}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="clip-path-button-sm bg-ember text-ember-foreground px-6 py-2.5 text-xs font-semibold hover:bg-ember/90 shadow-lifted hover:shadow-ember/25 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Onboard Workspace</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="hidden max-lg:flex w-10 h-10 items-center justify-center text-foreground hover:text-ember transition-colors cursor-pointer"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hidden max-lg:block fixed top-[70px] left-3 right-3 z-[9999] border border-border/70 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 space-y-4"
          >
            <div className="flex flex-col gap-2.5 text-xs font-medium">
              <a
                href="#about"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Architecture</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#pipeline-demo"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Live Simulator</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#features"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Features & Connectors</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#roi-calculator"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>ROI Calculator</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Pricing</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#faq"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>FAQ</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onSignIn();
                }}
                className="py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold w-1/2 text-center text-foreground hover:bg-accent"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onGetStarted();
                }}
                className="clip-path-button-sm bg-ember text-ember-foreground w-1/2 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 overflow-hidden border-b border-border bg-linear-to-b from-background via-surface/60 to-background"
      >
        {/* Background Image & Overlay Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={bg_img_companies}
            alt="Enterprise Talent Operations Background"
            className="w-full h-full object-cover opacity-20 dark:opacity-10 scale-105"
          />
          <div className="absolute inset-0 bg-radial-gradient from-ember/5 via-transparent to-background" />
        </div>

        {/* Floating Interactive Badge (Left) */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 left-8 hidden xl:flex items-center gap-3.5 p-4 rounded-2xl bg-card/85 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="p-2.5 rounded-xl bg-ember/15 text-ember shadow-inner">
            <Linkedin className="size-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span>LinkedIn Sourcing Sync</span>
              <span className="size-2 rounded-full bg-success animate-ping" />
            </div>
            <p className="text-[11px] text-ember font-mono mt-0.5">+18 Candidates Ingested</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Stage 1 Auto-Screening Active
            </p>
          </div>
        </motion.div>

        {/* Floating Interactive Badge (Right) */}
        <motion.div
          animate={{ y: [12, -14, 12], rotate: [0, -1.5, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-8 hidden xl:flex items-center gap-3.5 p-4 rounded-2xl bg-card/85 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="p-2.5 rounded-xl bg-success/15 text-success shadow-inner">
            <FileSpreadsheet className="size-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span>Google Sheets Connector</span>
              <span className="size-2 rounded-full bg-success animate-ping" />
            </div>
            <p className="text-[11px] text-success font-mono mt-0.5">140+ Rows Auto-Mapped</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Duplicate Checking Enabled</p>
          </div>
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ember/30 bg-ember/10 text-ember text-xs font-semibold mb-6 shadow-xs backdrop-blur-md"
          >
            <Sparkles className="size-3.5" />
            <span>Next-Gen Multi-Tenant Candidate Operating System</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-ember text-ember-foreground font-bold">
              v2.4
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] text-foreground max-w-5xl mx-auto tracking-tight"
          >
            The Candidate Operating System Built For{" "}
            <span className="bg-linear-to-r from-ember via-amber-500 to-orange-400 bg-clip-text text-transparent">
              Modern Enterprise Companies.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Empower your recruitment team with dedicated company subdomains, 28 micro-stage Kanban
            tracking, automated offer e-signatures, LinkedIn & Sheets sourcing, and IT equipment
            dispatch.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-ember text-ember-foreground font-semibold text-sm shadow-lifted hover:bg-ember/90 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-ember/25 active:scale-95"
            >
              <span>Onboard Your Company (2-Min Setup)</span>
              <ArrowRight className="size-4" />
            </button>

            <a
              href="#pipeline-demo"
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-border bg-card/85 backdrop-blur-md hover:bg-accent text-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-ember/40 active:scale-95"
            >
              <Play className="size-3.5 text-ember fill-ember" />
              <span>Explore Interactive Simulator</span>
            </a>
          </motion.div>

          {/* Metric KPI Counter Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-card/75 border border-border/80 rounded-2xl p-5 text-left shadow-xs hover:border-ember/40 transition-all hover:bg-card hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {s.label}
                    </p>
                    <Icon className="size-4 text-ember opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                    {s.value}
                  </p>
                  <span className="inline-block mt-2 text-[11px] text-success font-medium bg-success/10 px-2 py-0.5 rounded-md">
                    {s.change}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================================================
          INTERACTIVE LIVE PIPELINE SIMULATOR (HIGH VALUE FEATURE SPOTLIGHT)
         ========================================================================= */}
      <section
        id="pipeline-demo"
        className="py-20 px-6 bg-surface/50 border-b border-border relative"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
              Live Product Experience
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
              Experience the 28 Micro-Stage Engine
            </h2>
            <p className="text-sm text-muted-foreground">
              Click through the interactive workflow tabs below to simulate how candidates advance
              from initial sourcing to Day One laptop delivery.
            </p>
          </div>

          {/* Interactive Stage Tab Selectors */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            <button
              onClick={() => setDemoStage("sourcing")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                demoStage === "sourcing"
                  ? "bg-ember text-ember-foreground shadow-lifted scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Linkedin className="size-3.5" />
              <span>1. Sourcing & Intake</span>
            </button>

            <button
              onClick={() => setDemoStage("interview")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                demoStage === "interview"
                  ? "bg-ember text-ember-foreground shadow-lifted scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Calendar className="size-3.5" />
              <span>2. Panel & Approvals</span>
            </button>

            <button
              onClick={() => setDemoStage("offer")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                demoStage === "offer"
                  ? "bg-ember text-ember-foreground shadow-lifted scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <FileCheck className="size-3.5" />
              <span>3. Offers & E-Sign</span>
            </button>

            <button
              onClick={() => setDemoStage("hardware")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                demoStage === "hardware"
                  ? "bg-ember text-ember-foreground shadow-lifted scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Laptop className="size-3.5" />
              <span>4. IT & Day One</span>
            </button>
          </div>

          {/* Simulator Canvas */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Header Simulator Window Bar */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-destructive/60 inline-block" />
                <span className="size-3 rounded-full bg-warning/60 inline-block" />
                <span className="size-3 rounded-full bg-success/60 inline-block" />
                <span className="text-xs font-mono text-muted-foreground ml-2">
                  acme.talentflow.hub / pipeline / stage-tracker
                </span>
              </div>
              <span className="text-xs bg-success/15 text-success border border-success/30 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-success animate-ping" /> Realtime Tenant
                Workspace
              </span>
            </div>

            {/* Dynamic Stage Content Renderer */}
            <AnimatePresence mode="wait">
              {demoStage === "sourcing" && (
                <motion.div
                  key="sourcing"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-5"
                >
                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <Linkedin className="size-3.5 text-ember" /> LinkedIn Ingestion
                      </span>
                      <span className="bg-ember/15 text-ember px-2 py-0.5 rounded text-[10px]">
                        Stage 1
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <p className="text-xs font-bold text-foreground">Amara Okonkwo</p>
                      <p className="text-[11px] text-muted-foreground">Staff Cloud Engineer</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-ember font-semibold">Resume Auto-Parsed</span>
                        <span className="bg-success/15 text-success px-1.5 py-0.5 rounded">
                          98% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <FileSpreadsheet className="size-3.5 text-success" /> Google Sheets Sync
                      </span>
                      <span className="bg-success/15 text-success px-2 py-0.5 rounded text-[10px]">
                        Stage 3
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <p className="text-xs font-bold text-foreground">Marcus Vance</p>
                      <p className="text-[11px] text-muted-foreground">Product Design Lead</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-muted-foreground">Row 84 Synced</span>
                        <span className="bg-accent text-foreground px-1.5 py-0.5 rounded">
                          Referral
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                        <span>Recruiter Actions</span>
                        <span className="text-muted-foreground text-[10px]">Instant Trigger</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Incoming candidates automatically get screened against minimum requirements
                        and assigned to the designated hiring manager.
                      </p>
                    </div>
                    <button
                      onClick={() => setDemoStage("interview")}
                      className="mt-4 w-full py-2 rounded-lg bg-ember text-ember-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-ember/90 transition-colors"
                    >
                      <span>Simulate Stage Advance</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {demoStage === "interview" && (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-5"
                >
                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span>Technical Architecture Panel</span>
                      <span className="bg-sky-500/15 text-sky-500 px-2 py-0.5 rounded text-[10px]">
                        Stage 12
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <p className="text-xs font-bold text-foreground">Hana Kobayashi</p>
                      <p className="text-[11px] text-muted-foreground">VP of Infrastructure</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-sky-500 font-semibold">Calendar Invite Synced</span>
                        <span className="bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded">
                          Score 4.8 / 5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span>Hiring Manager Approval</span>
                      <span className="bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded text-[10px]">
                        Stage 18
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <p className="text-xs font-bold text-foreground">Executive Committee</p>
                      <p className="text-[11px] text-muted-foreground">Compensation Review</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-success font-semibold">3 of 3 Approved</span>
                        <span className="bg-success/15 text-success px-1.5 py-0.5 rounded">
                          Signed Off
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                        <span>Scorecard Automation</span>
                        <span className="text-muted-foreground text-[10px]">Realtime RLS</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Interviewer feedback is compiled into structured metrics, eliminating bias
                        and preparing the contract dispatch package.
                      </p>
                    </div>
                    <button
                      onClick={() => setDemoStage("offer")}
                      className="mt-4 w-full py-2 rounded-lg bg-ember text-ember-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-ember/90 transition-colors"
                    >
                      <span>Proceed to Offer Stage</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {demoStage === "offer" && (
                <motion.div
                  key="offer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-5"
                >
                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span>CTC Breakdown Matrix</span>
                      <span className="bg-success/15 text-success px-2 py-0.5 rounded text-[10px]">
                        Stage 23
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-1.5 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Base Salary:</span>
                        <span className="font-semibold text-foreground">$165,000 / yr</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Performance Bonus:</span>
                        <span className="font-semibold text-foreground">$25,000</span>
                      </div>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-border font-bold">
                        <span className="text-foreground">Total CTC:</span>
                        <span className="text-success">$190,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span>Digital E-Signature</span>
                      <span className="bg-success/15 text-success px-2 py-0.5 rounded text-[10px]">
                        Stage 25
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <p className="text-xs font-bold text-foreground">Contract Signed</p>
                      <p className="text-[11px] text-muted-foreground">
                        SHA-256 Audit Trail Confirmed
                      </p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-success font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Legally Binding
                        </span>
                        <span className="text-muted-foreground font-mono">10:42 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                        <span>Post-Offer Automation</span>
                        <span className="text-muted-foreground text-[10px]">Instant Trigger</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Once the offer is signed, background check verifications initiate and the
                        hardware selection portal unlocks for the candidate.
                      </p>
                    </div>
                    <button
                      onClick={() => setDemoStage("hardware")}
                      className="mt-4 w-full py-2 rounded-lg bg-ember text-ember-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-ember/90 transition-colors"
                    >
                      <span>Simulate Hardware Dispatch</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {demoStage === "hardware" && (
                <motion.div
                  key="hardware"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-5"
                >
                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span>Selected Equipment</span>
                      <span className="bg-ember/15 text-ember px-2 py-0.5 rounded text-[10px]">
                        Stage 27
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-1.5">
                      <p className="text-xs font-bold text-foreground">Apple MacBook Pro 16"</p>
                      <p className="text-[11px] text-muted-foreground">M3 Max / 36GB Unified RAM</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-ember font-semibold">IT Asset #TF-9821</span>
                        <span className="bg-ember/15 text-ember px-1.5 py-0.5 rounded">
                          Ordered
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                      <span>Delivery & Provisioning</span>
                      <span className="bg-success/15 text-success px-2 py-0.5 rounded text-[10px]">
                        Stage 28
                      </span>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <p className="text-xs font-bold text-foreground">FedEx Priority Transit</p>
                      <p className="text-[11px] text-muted-foreground">
                        Delivery: Tomorrow 10:30 AM
                      </p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-success font-semibold">Day 1 Ready</span>
                        <span className="text-muted-foreground font-mono">FX-982341</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface/80 rounded-xl p-4 border border-border flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                        <span>Onboarding Completed</span>
                        <span className="text-success text-[10px] font-bold">100% Success</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Candidate is now a fully active employee with Google Workspace, Slack, and
                        repository access configured automatically.
                      </p>
                    </div>
                    <button
                      onClick={onGetStarted}
                      className="mt-4 w-full py-2.5 rounded-lg bg-ember text-ember-foreground text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lifted hover:bg-ember/90 transition-colors"
                    >
                      <span>Onboard Your Company Now</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ARCHITECTURE & ABOUT US (4 CORE PILLARS)
         ========================================================================= */}
      <section id="about" className="py-20 bg-surface border-y border-border px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
                Architecture & Security
              </p>
              <h2 className="font-display text-3xl sm:text-5xl leading-tight text-foreground mt-2 font-bold">
                Reimagining Talent Acquisition Operations for Global Scale.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                TalentFlow was engineered to eliminate friction between initial candidate sourcing,
                recruiter tracking, hiring manager scorecards, e-signature contracts, and day-one IT
                equipment setup.
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Unlike generic legacy CRMs, our platform provides every onboarded enterprise with a
                cryptographically isolated workspace, customizable hiring micro-stages, and instant
                connectors for LinkedIn and Google Sheets.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border shadow-xs">
                  <ShieldCheck className="size-5 text-ember shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Isolated Workspaces</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Row-Level Security boundary per company account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border shadow-xs">
                  <Workflow className="size-5 text-ember shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Connector Engine</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Realtime candidate ingestion from LinkedIn & Sheets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-xs transition-all hover:border-ember/40"
              >
                <div className="size-10 rounded-xl bg-ember/15 flex items-center justify-center text-ember font-bold mb-4 shadow-inner">
                  01
                </div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Onboard & Theme
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Generate company profile, allocate subdomain, activate modules, and configure
                  branding colors in under 2 minutes.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-xs transition-all hover:border-ember/40"
              >
                <div className="size-10 rounded-xl bg-ember/15 flex items-center justify-center text-ember font-bold mb-4 shadow-inner">
                  02
                </div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Connect Sourcing
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Link LinkedIn Recruiter and Google Sheets to automatically push candidates into
                  your intake micro-stages.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-xs transition-all hover:border-ember/40"
              >
                <div className="size-10 rounded-xl bg-ember/15 flex items-center justify-center text-ember font-bold mb-4 shadow-inner">
                  03
                </div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Track 28 Stages
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Advance candidates through intake, screening, interviews, approvals, offers,
                  e-signatures, and IT setup.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-xs transition-all hover:border-ember/40"
              >
                <div className="size-10 rounded-xl bg-ember/15 flex items-center justify-center text-ember font-bold mb-4 shadow-inner">
                  04
                </div>
                <h3 className="text-base font-bold text-foreground font-display">Admin Control</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Inspect real-time company interactions, audit logs, and candidate status across
                  all hiring squads.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE MATRIX & CONNECTORS SHOWCASE
         ========================================================================= */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
              Features & Connectors
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mt-2">
              Everything Your Hiring Team Needs to Scale.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Engineered for recruiters, hiring managers, and company administrators.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 inline-flex items-center bg-surface p-1 rounded-xl border border-border gap-1 flex-wrap justify-center">
              <button
                onClick={() => setActiveFeatureTab("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFeatureTab === "all"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Features
              </button>
              <button
                onClick={() => setActiveFeatureTab("sourcing")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFeatureTab === "sourcing"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sourcing Connectors
              </button>
              <button
                onClick={() => setActiveFeatureTab("pipeline")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFeatureTab === "pipeline"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                28-Stage Kanban
              </button>
              <button
                onClick={() => setActiveFeatureTab("compliance")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFeatureTab === "compliance"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Security & Isolation
              </button>
              <button
                onClick={() => setActiveFeatureTab("onboarding")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFeatureTab === "onboarding"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Offers & IT
              </button>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-card p-6 rounded-2xl border border-border shadow-xs hover:border-ember/50 transition-all hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-11 rounded-xl bg-ember/10 flex items-center justify-center text-ember group-hover:scale-110 transition-transform">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-surface px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground font-display">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/60 space-y-1.5">
                    {feat.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-muted-foreground"
                      >
                        <Check className="size-3 text-success shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE REALTIME ROI & SAVINGS CALCULATOR
         ========================================================================= */}
      <section id="roi-calculator" className="py-20 px-6 border-y border-border bg-surface/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Interactive ROI Tool
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
              Calculate Your Company Time & Cost Savings
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust team size and monthly hire targets to project annual administrative hours saved
              and cost reduction.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-lifted max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Users className="size-4 text-ember" /> Recruiting & Talent Team Size
                  </span>
                  <span className="text-ember font-mono font-bold">{teamSize} Members</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  step="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-ember"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Building2 className="size-4 text-ember" /> Monthly Planned Hires
                  </span>
                  <span className="text-ember font-mono font-bold">{monthlyHires} Hires / mo</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={monthlyHires}
                  onChange={(e) => setMonthlyHires(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-ember"
                />
              </div>

              {/* Slider 3 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <TrendingUp className="size-4 text-ember" /> Avg. Role Compensation
                  </span>
                  <span className="text-ember font-mono font-bold">${avgSalaryK}k / yr</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="250"
                  step="5"
                  value={avgSalaryK}
                  onChange={(e) => setAvgSalaryK(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-ember"
                />
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Calculator className="size-4 text-ember" /> Projected Efficiency Multiplier
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Based on 28 micro-stage automated progression, LinkedIn connector ingestion, and
                  automated offer letter e-signing.
                </p>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                key={annualSavingsDollars}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface p-6 rounded-2xl border border-border text-center space-y-2 shadow-xs"
              >
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Est. Annual Cost Savings
                </p>
                <p className="font-display text-3xl sm:text-4xl font-bold text-success">
                  ${annualSavingsDollars.toLocaleString()}
                </p>
                <span className="text-[10px] bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded font-medium inline-block">
                  Recruiter Overhead Saved
                </span>
              </motion.div>

              <motion.div
                key={hoursSavedPerMonth}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface p-6 rounded-2xl border border-border text-center space-y-2 shadow-xs"
              >
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Hours Saved / Month
                </p>
                <p className="font-display text-3xl sm:text-4xl font-bold text-ember">
                  {hoursSavedPerMonth} hrs
                </p>
                <span className="text-[10px] bg-ember/15 text-ember border border-ember/30 px-2 py-0.5 rounded font-medium inline-block">
                  -{daysSavedInTime2Fill} Days Time-to-Fill
                </span>
              </motion.div>

              <motion.div
                key={velocityMultiplier}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="sm:col-span-2 bg-surface p-5 rounded-2xl border border-border flex items-center justify-between gap-4"
              >
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">
                    Hiring Velocity Multiplier
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Faster candidate pipeline advancement
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-display text-foreground">
                    {velocityMultiplier}x
                  </span>
                  <span className="text-[10px] text-success font-semibold block">
                    Faster Hiring
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLIENTS & VERIFIED TESTIMONIALS
         ========================================================================= */}
      <section id="clients" className="py-20 bg-surface border-y border-border px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-semibold">
            Trusted By High-Growth Engineering & Talent Teams
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-foreground mt-2 font-bold">
            Companies Scaling With TalentFlow
          </h2>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((c, i) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={i}
                className="bg-card p-4 rounded-2xl border border-border text-center shadow-xs flex flex-col items-center justify-center cursor-pointer hover:border-ember/40 transition-all"
              >
                <span className="size-10 rounded-xl bg-accent text-accent-foreground font-bold text-xs flex items-center justify-center mb-2 shadow-inner">
                  {c.logo}
                </span>
                <p className="text-xs font-bold text-foreground truncate w-full">{c.name}</p>
                <p className="text-[10px] text-muted-foreground truncate w-full mt-0.5">
                  {c.industry}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Testimonial Quote */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="mt-14 max-w-3xl mx-auto bg-card p-8 rounded-3xl border border-border shadow-lifted text-left relative overflow-hidden"
          >
            <div className="flex items-center gap-1 text-warning mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="font-display text-lg sm:text-xl leading-relaxed text-foreground font-medium">
              "TalentFlow transformed our talent operations entirely. Moving from disconnected
              spreadsheets to a dedicated 28-stage micro-pipeline with instant LinkedIn sourcing and
              automated e-signatures cut our average time-to-hire by 68%."
            </p>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/60">
              <div className="size-11 rounded-xl bg-ember text-ember-foreground font-bold text-xs flex items-center justify-center shadow-xs">
                SJ
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Sarah Jenkins</p>
                <p className="text-[11px] text-muted-foreground">
                  VP of People & Talent Acquisition, Acme Corporation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          PRICING PLANS SECTION
         ========================================================================= */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
            Simple Transparent Plans
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mt-2">
            Select Your Company Workspace Plan
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Onboard your company today and unlock your dedicated candidate workspace in minutes.
          </p>

          {/* Billing Cycle Switch */}
          <div className="mt-8 inline-flex items-center bg-surface p-1 rounded-xl border border-border gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "annually"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              <span>Annually</span>
              <span className="bg-success/15 text-success text-[10px] px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Starter Plan */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card p-7 rounded-3xl border border-border shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Starter Workspace
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For early-stage startups and small hiring squads.
                </p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ${billingCycle === "annually" ? 299 : 349}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Up to 5 Recruiter & Admin Seats</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>28 Micro-Stage Pipeline Board</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Google Sheets Candidate Importer</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Standard Email Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan("starter")}
                className="mt-8 w-full py-3 rounded-xl border border-border bg-surface hover:bg-accent text-foreground text-xs font-semibold transition-colors cursor-pointer"
              >
                Choose Starter Plan
              </button>
            </motion.div>

            {/* Growth Plan (Popular) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card p-7 rounded-3xl border-2 border-ember shadow-lifted flex flex-col justify-between relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ember text-ember-foreground text-[10px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Most Popular
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Growth Enterprise
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For scaling organizations and HR departments.
                </p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ${billingCycle === "annually" ? 899 : 999}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Up to 25 Recruiter & Admin Seats</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>LinkedIn + Google Sheets Connectors</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Automated E-Signatures & Offers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Custom Subdomain & Brand Theme</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>24/7 Priority Support & SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan("growth")}
                className="mt-8 w-full py-3 rounded-xl bg-ember text-ember-foreground hover:bg-ember/90 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Choose Growth Plan
              </button>
            </motion.div>

            {/* Custom Enterprise */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card p-7 rounded-3xl border border-border shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Custom Enterprise
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For large-scale global corporations.
                </p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ${billingCycle === "annually" ? 1999 : 2299}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Unlimited Seats & Hiring Managers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Dedicated Single-Tenant Infrastructure</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Custom Webhooks & REST API Access</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Dedicated HR Success Account Manager</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan("enterprise")}
                className="mt-8 w-full py-3 rounded-xl border border-border bg-surface hover:bg-accent text-foreground text-xs font-semibold transition-colors cursor-pointer"
              >
                Contact Sales & Choose
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ACCORDION FAQ SECTION
         ========================================================================= */}
      <section id="faq" className="py-20 px-6 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Company Workspace FAQ
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-xs sm:text-sm text-foreground flex items-center justify-between gap-4 cursor-pointer hover:bg-surface/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform ${
                      openFaq === idx ? "rotate-180 text-ember" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        buttonText="Onboard Your Company Now"
        onButtonClick={onGetStarted}
        headingLine1="Let's start"
        headingLine2="engineering impact"
        headingHighlight="together."
        subtext="Empower your talent operations with intelligent micro-stage workflows, LinkedIn connectors, automated background checks, and end-to-end recruitment architecture."
      />

      {/* Footer */}
      <Footer
        onContactClick={onGetStarted}
        linksCol1={[
          { label: "Onboard Company", href: "#", onClick: onGetStarted },
          { label: "Features & Stages", href: "#features" },
          { label: "ROI Calculator", href: "#roi-calculator" },
          { label: "Pricing Plans", href: "#pricing" },
        ]}
        linksCol2={[
          { label: "Sign In", href: "#", onClick: onSignIn },
          { label: "Candidate Portal", href: "/candidates-portal" },
          { label: "Admin CRM", href: "/admin-panel" },
        ]}
      />
    </div>
  );
};
