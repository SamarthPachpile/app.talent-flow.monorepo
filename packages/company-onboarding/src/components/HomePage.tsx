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
  BarChart3,
  Bot,
  Star,
  Play,
  Workflow,
  Calculator,
  ChevronDown,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSelectPlan: (planId: "starter" | "growth" | "enterprise") => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onSignIn, onSelectPlan }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "sourcing" | "pipeline" | "compliance">("all");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(10);
  const [monthlyHires, setMonthlyHires] = useState<number>(25);

  // Calculated ROI values
  const hoursSavedPerMonth = teamSize * 38;
  const annualSavingsDollars = Math.round(hoursSavedPerMonth * 12 * 45);
  const daysSavedInTime2Fill = Math.min(18, Math.round(monthlyHires * 0.45));

  // Parallax Scroll Hooks
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], [0, 90]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0.2]);

  const stats = [
    { label: "Onboarded Enterprise Clients", value: "550+", change: "+24% this quarter" },
    { label: "Candidates Tracked", value: "1.4M+", change: "28 micro-stages" },
    { label: "Average Time-to-Hire Saved", value: "68%", change: "Automated workflow" },
    { label: "System SLA Uptime", value: "99.99%", change: "Multi-tenant isolated" },
  ];

  const clients = [
    { name: "Acme Corporation", logo: "AC", industry: "SaaS & Enterprise Tech" },
    { name: "Northwind Tech", logo: "NW", industry: "Cloud Security" },
    { name: "Halcyon Health", logo: "HH", industry: "Digital Healthcare" },
    { name: "Meridian Logistics", logo: "ML", industry: "Global Supply Chain" },
    { name: "Apex Bio Labs", logo: "AB", industry: "Pharma & Research" },
    { name: "CyberGrid Systems", logo: "CG", industry: "Fintech Infrastructure" },
  ];

  const features = [
    {
      icon: Layers,
      category: "pipeline",
      title: "28 Micro-Stage Hiring Engine",
      description:
        "Track candidate movement from initial intake through screening, panel interviews, approvals, e-signature offers, and laptop assignment.",
    },
    {
      icon: Linkedin,
      category: "sourcing",
      title: "Direct LinkedIn Sourcing Connector",
      description:
        "Fetch profiles, recruiter notes, and candidate applications directly from LinkedIn into your company pipeline with one click.",
    },
    {
      icon: FileSpreadsheet,
      category: "sourcing",
      title: "Google Sheets Candidate Importer",
      description:
        "Seamlessly sync candidate rows from shared team spreadsheets into structured micro-stage candidate records with intelligent field mapping.",
    },
    {
      icon: ShieldCheck,
      category: "compliance",
      title: "Isolated Multi-Tenant Architecture",
      description:
        "Every onboarded company receives a dedicated, isolated workspace with custom subdomains, custom branding, and role-based permissions.",
    },
    {
      icon: Bot,
      category: "pipeline",
      title: "Automated Stage Progression",
      description:
        "Trigger calendar invites, automated approval requests, reminder notifications, and e-signature contracts automatically as candidates advance.",
    },
    {
      icon: BarChart3,
      category: "compliance",
      title: "Real-Time Interaction Audit Trail",
      description:
        "Full visibility into every recruiter action, candidate stage update, connector import event, and offer signature for total compliance.",
    },
  ];

  const faqs = [
    {
      q: "How fast can our company onboard and launch our workspace?",
      a: "Our automated onboarding wizard completes full workspace setup—including custom subdomain allocation, branding configuration, and recruiter invitations—in under 2 minutes.",
    },
    {
      q: "How do the LinkedIn and Google Sheets connectors function?",
      a: "The LinkedIn connector syncs candidate profile cards directly into your Stage 1 intake. The Google Sheets connector auto-maps column headers to candidate fields with automatic duplicate checking.",
    },
    {
      q: "Is candidate data segregated between enterprise tenants?",
      a: "Yes. Every onboarded company is provisioned with cryptographically isolated database Row-Level Security (RLS) and custom SSL subdomains.",
    },
  ];

  const filteredFeatures =
    activeTab === "all" ? features : features.filter((f) => f.category === activeTab);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-ember selection:text-ember-foreground font-sans flex flex-col relative overflow-x-clip">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ember z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Top Portfolio Navigation Header (Graviton Capsule Style) */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-[1400px]">
        <div className="clip-path-nav-sm bg-background/95 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] border border-border/60">
          <div className="flex items-center justify-between pl-5 pr-2 sm:pl-7 sm:pr-3 py-2.5">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer">
              <motion.span
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="grid size-9 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-xs text-xs shrink-0"
              >
                TF
              </motion.span>
              <div className="flex flex-col leading-none">
                <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  TalentFlow<sup className="text-[10px] top-0 ml-0.5 font-bold text-ember">®</sup>
                </span>
                <span className="text-10px text-muted-foreground mt-0.5 font-medium">
                  Enterprise Candidate OS
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-muted-foreground">
              <a href="#about" className="hover:text-ember transition-colors">
                Who We Are
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
            </nav>

            {/* Right Side Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                <Globe className="w-3.5 h-3.5" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <button
                onClick={onSignIn}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="clip-path-button-sm bg-ember text-ember-foreground px-6 py-2.5 text-xs font-semibold hover:bg-ember/90 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
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
            className="hidden max-lg:block fixed top-[70px] left-3 right-3 z-[9999] border border-border/60 bg-background/95 backdrop-blur-xl rounded-xl shadow-xl p-4 space-y-3"
          >
            <div className="flex flex-col gap-2.5 text-xs font-medium">
              <a
                href="#about"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-accent text-foreground"
              >
                Who We Are
              </a>
              <a
                href="#features"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-accent text-foreground"
              >
                Features & Connectors
              </a>
              <a
                href="#roi-calculator"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-accent text-foreground"
              >
                ROI Calculator
              </a>
              <a
                href="#clients"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-accent text-foreground"
              >
                Clients
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-accent text-foreground"
              >
                Pricing
              </a>
            </div>

            <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onSignIn();
                }}
                className="p-2 rounded-lg bg-muted text-xs font-medium w-1/2 text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onGetStarted();
                }}
                className="clip-path-button-sm bg-ember text-ember-foreground w-1/2 py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Parallax Background & Glass Components */}
      <section
        ref={heroRef}
        className="relative pt-35 pb-28 px-6 overflow-hidden border-b border-border bg-linear-to-b from-background via-surface/90 to-background"
      >
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={bg_img_companies}
            alt="Enterprise Talent Operations Background"
            className="w-full h-100vh object-cover"
          />
        </div>

        {/* Floating Parallax Badges (Left & Right) */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-25 left-8 hidden lg:flex items-center gap-3.5 p-4 rounded-2xl bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="p-2.5 rounded-xl bg-ember/15 text-ember shadow-inner">
            <Linkedin className="size-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span>LinkedIn Sourcing Connector</span>
              <span className="size-2 rounded-full bg-success animate-ping" />
            </div>
            <p className="text-10px text-ember font-mono mt-0.5">+14 Candidates Syncing</p>
            <p className="text-10px text-muted-foreground mt-1">Direct Recruiter Import Active</p>
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [10, -20, 10], rotate: [0, 2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-124 right-8 hidden lg:flex items-center gap-3.5 p-4 rounded-2xl bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="p-2.5 rounded-xl bg-success/15 text-success shadow-inner">
            <FileSpreadsheet className="size-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span>Google Sheets Connector</span>
              <span className="size-2 rounded-full bg-success animate-ping" />
            </div>
            <p className="text-10px text-success font-mono mt-0.5">+100 Rows Synced</p>
            <p className="text-10px text-muted-foreground mt-1">Intelligent Field Mapping Active</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-8 hidden lg:flex items-center gap-3.5 p-4 rounded-2xl bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="p-2.5 rounded-xl bg-success/15 text-success shadow-inner">
            <FileSpreadsheet className="size-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-foreground">Google Sheets Importer</p>
            <p className="text-10px text-success font-semibold mt-0.5">Row 42 Auto-Mapped</p>
            <p className="text-10px text-muted-foreground mt-1">Intelligent Field Auto-Detect</p>
          </div>
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ember/30 bg-ember/10 text-ember text-xs font-semibold mb-6 shadow-xs backdrop-blur-md"
          >
            <Sparkles className="size-3.5" />
            <span>Introducing Multi-Tenant Company Onboarding & Connector Sync</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-7xl font-bold leading-[1.05] text-foreground max-w-5xl mx-auto tracking-tight"
          >
            The Candidate Operating System Built For{" "}
            <span className="bg-linear-to-r from-ember via-amber-500 to-orange-400 bg-clip-text text-transparent">
              Modern Enterprise Companies.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Empower your HR & recruiting team with isolated workspace subdomains, 28 micro-stage
            pipeline tracking, instant LinkedIn & Google Sheets sourcing, and automated hiring
            workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-ember text-ember-foreground font-semibold text-sm shadow-lifted hover:bg-ember/90 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-ember/20 active:scale-95"
            >
              <span>Onboard Your Company</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("pricing");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-border bg-card/80 backdrop-blur-md hover:bg-accent text-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play className="size-3.5 text-ember fill-ember" />
              <span>Explore Plans & Pricing</span>
            </button>
          </motion.div>

          {/* Interactive Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="bg-card/50 border border-border/80 rounded-xl p-5 text-left shadow-xs hover:border-ember/40 transition-all hover:bg-card/80"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                  {s.value}
                </p>
                <span className="inline-block mt-2 text-11px text-success font-medium bg-success/10 px-2 py-0.5 rounded">
                  {s.change}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Live Product Preview Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-14 max-w-5xl mx-auto rounded-2xl border border-border/80 bg-card/75 shadow-2xl backdrop-blur-xl p-4 sm:p-6 overflow-hidden text-left relative"
          >
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-destructive/60 inline-block" />
                <span className="size-3 rounded-full bg-warning/60 inline-block" />
                <span className="size-3 rounded-full bg-success/60 inline-block" />
                <span className="text-xs font-mono text-muted-foreground ml-2">
                  acme.talentflow.hub / pipeline-board
                </span>
              </div>
              <span className="text-xs bg-success/15 text-success border border-success/30 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-success animate-ping" /> Live Connected
                Workspace
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface/80 rounded-xl p-4 border border-border/60">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                  <span>Intake & Screening</span>
                  <span className="bg-accent px-2 py-0.5 rounded text-10px">6 Candidates</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-card p-3 rounded-md border border-border shadow-xs">
                    <p className="text-xs font-medium">Amara Okonkwo</p>
                    <p className="text-11px text-muted-foreground">Senior Backend Engineer</p>
                    <div className="mt-2 flex items-center justify-between text-10px">
                      <span className="text-ember font-semibold">Stage 4: Resume Parsed</span>
                      <span className="bg-ember/15 text-ember px-1.5 py-0.5 rounded">High</span>
                    </div>
                  </div>
                  <div className="bg-card p-3 rounded-md border border-border shadow-xs">
                    <p className="text-xs font-medium font-sans">Julien Barre</p>
                    <p className="text-11px text-muted-foreground">Product Designer</p>
                    <div className="mt-2 flex items-center justify-between text-10px">
                      <span className="text-muted-foreground">Stage 7: Screening</span>
                      <span className="text-muted-foreground">Standard</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface/80 rounded-xl p-4 border border-border/60">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                  <span>Interview & Approvals</span>
                  <span className="bg-accent px-2 py-0.5 rounded text-10px">4 Candidates</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-card p-3 rounded-md border border-border shadow-xs">
                    <p className="text-xs font-medium">Hana Kobayashi</p>
                    <p className="text-11px text-muted-foreground">Engineering Manager</p>
                    <div className="mt-2 flex items-center justify-between text-10px">
                      <span className="text-success font-semibold">Stage 15: Invite Sent</span>
                      <span className="bg-success/10 text-success px-1.5 py-0.5 rounded">
                        Scheduled
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface/80 rounded-xl p-4 border border-border/60">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-3">
                  <span>Offers & Onboarding</span>
                  <span className="bg-accent px-2 py-0.5 rounded text-10px">5 Candidates</span>
                </div>
                <div className="space-y-2.5">
                  <div className="bg-card p-3 rounded-md border border-border shadow-xs">
                    <p className="text-xs font-medium">Wei Zhang</p>
                    <p className="text-11px text-muted-foreground">Staff Architect</p>
                    <div className="mt-2 flex items-center justify-between text-10px">
                      <span className="text-success font-semibold">Stage 24: Offer Signed</span>
                      <span className="bg-success/15 text-success px-1.5 py-0.5 rounded">
                        E-Signed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Who We Are & About Us */}
      <section id="about" className="py-20 bg-surface border-y border-border px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
                Who We Are · About Us
              </p>
              <h2 className="font-display text-4xl sm:text-5xl leading-tight text-foreground mt-2">
                Reimagining Talent Acquisition Operations for Global Companies.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                TalentFlow Hub was founded with a singular purpose: to eliminate friction between
                candidate sourcing, recruiter tracking, hiring manager approvals, and post-offer
                onboarding.
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Unlike generic legacy CRMs, our platform provides every onboarded enterprise with an
                isolated workspace, customizable hiring micro-stages, and instant connectors for
                LinkedIn and Google Sheets.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border">
                  <ShieldCheck className="size-5 text-ember shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Isolated Workspaces</h4>
                    <p className="text-11px text-muted-foreground mt-0.5">
                      Strict data boundary per company account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border">
                  <Workflow className="size-5 text-ember shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Connector Engine</h4>
                    <p className="text-11px text-muted-foreground mt-0.5">
                      Fetch candidates from LinkedIn & Sheets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-xl border border-border shadow-xs"
              >
                <div className="size-10 rounded-lg bg-ember/15 flex items-center justify-center text-ember font-bold mb-4">
                  01
                </div>
                <h3 className="text-lg font-display text-foreground">Onboard & Customize</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Create company profile, assign subdomain, select module features, and configure
                  branding colors in under 2 minutes.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-xl border border-border shadow-xs"
              >
                <div className="size-10 rounded-lg bg-ember/15 flex items-center justify-center text-ember font-bold mb-4">
                  02
                </div>
                <h3 className="text-lg font-display text-foreground">Connect Sourcing</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Link LinkedIn Recruiter and Google Sheets to automatically push candidates into
                  your intake micro-stages.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-xl border border-border shadow-xs"
              >
                <div className="size-10 rounded-lg bg-ember/15 flex items-center justify-center text-ember font-bold mb-4">
                  03
                </div>
                <h3 className="text-lg font-display text-foreground">Track 28 Stages</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Advance candidates through intake, screening, interviews, approvals, offers,
                  e-signatures, and IT setup.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-card p-6 rounded-xl border border-border shadow-xs"
              >
                <div className="size-10 rounded-lg bg-ember/15 flex items-center justify-center text-ember font-bold mb-4">
                  04
                </div>
                <h3 className="text-lg font-display text-foreground">Admin Control</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Supervisors inspect real-time company interactions, audit logs, and candidate
                  status across all teams.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Connectors Showcase */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
              Features & Connectors
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mt-2">
              Everything Your Hiring Team Needs to Scale.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Powerful tools engineered for recruiters, hiring managers, and company administrators.
            </p>

            <div className="mt-6 inline-flex items-center bg-surface p-1 rounded-lg border border-border gap-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "all"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Features
              </button>
              <button
                onClick={() => setActiveTab("sourcing")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "sourcing"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sourcing Connectors
              </button>
              <button
                onClick={() => setActiveTab("pipeline")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "pipeline"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pipeline Board
              </button>
              <button
                onClick={() => setActiveTab("compliance")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "compliance"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Enterprise & Audit
              </button>
            </div>
          </div>

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
                  className="bg-card p-6 rounded-xl border border-border shadow-xs hover:border-ember/50 transition-all hover:-translate-y-1"
                >
                  <div className="size-10 rounded-lg bg-ember/10 flex items-center justify-center text-ember mb-4">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-display text-foreground">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Enterprise ROI Calculator Component (NEW ADDON COMPONENT) */}
      <section id="roi-calculator" className="py-20 px-6 border-y border-border bg-surface/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Interactive ROI Tool
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Calculate Your Company Time & Cost Savings
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust team size and monthly hire targets to project annual administrative hours saved
              and cost reduction.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lifted max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Users className="size-4 text-ember" /> Recruiting & HR Team Size
                  </span>
                  <span className="text-ember font-mono">{teamSize} Members</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-ember"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Building2 className="size-4 text-ember" /> Monthly Planned Hires
                  </span>
                  <span className="text-ember font-mono">{monthlyHires} Hires / mo</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={monthlyHires}
                  onChange={(e) => setMonthlyHires(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-ember"
                />
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Calculator className="size-4 text-ember" /> Projected Efficiency Metric
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Based on 28 micro-stage automated progression, e-signature dispatch, and automatic
                  LinkedIn/Google Sheets connector sync.
                </p>
              </div>
            </div>

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
                <p className="font-display text-4xl font-bold text-success">
                  ${annualSavingsDollars.toLocaleString()}
                </p>
                <span className="text-10px bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded font-medium inline-block">
                  Recruiter Overhead
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
                <p className="font-display text-4xl font-bold text-ember">
                  {hoursSavedPerMonth} hrs
                </p>
                <span className="text-10px bg-ember/15 text-ember border border-ember/30 px-2 py-0.5 rounded font-medium inline-block">
                  -{daysSavedInTime2Fill} Days Time-to-Fill
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients & Testimonials */}
      <section id="clients" className="py-20 bg-surface border-y border-border px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-semibold">
            Trusted By Industry Leaders
          </p>
          <h2 className="font-display text-4xl text-foreground mt-2">
            Companies Growing With TalentFlow
          </h2>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((c, i) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={i}
                className="bg-card p-4 rounded-xl border border-border text-center shadow-xs flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="size-10 rounded-full bg-accent text-accent-foreground font-bold text-xs flex items-center justify-center mb-2">
                  {c.logo}
                </span>
                <p className="text-xs font-semibold text-foreground truncate w-full">{c.name}</p>
                <p className="text-10px text-muted-foreground truncate w-full">{c.industry}</p>
              </motion.div>
            ))}
          </div>

          {/* Testimonial Quote */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="mt-14 max-w-3xl mx-auto bg-card p-8 rounded-2xl border border-border shadow-sm text-left"
          >
            <div className="flex items-center gap-1 text-warning mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-warning" />
              ))}
            </div>
            <p className="font-display text-xl leading-relaxed text-foreground">
              "TalentFlow Hub changed our candidate pipeline completely. Moving from disjointed
              tools to a single 28-stage board with instant LinkedIn and Google Sheets candidate
              sourcing cut our recruiter administrative overhead by 70%."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="size-10 rounded-full bg-ember text-ember-foreground font-bold text-xs flex items-center justify-center">
                SJ
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Sarah Jenkins</p>
                <p className="text-11px text-muted-foreground">
                  VP of People & HR, Acme Corporation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
            Simple Transparent Pricing
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground mt-2">
            Select Your Company Plan
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Onboard your company today and unlock your dedicated candidate workspace.
          </p>

          <div className="mt-6 inline-flex items-center bg-surface p-1 rounded-lg border border-border gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "annually"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              <span>Annually</span>
              <span className="bg-success/15 text-success text-10px px-1.5 py-0.5 rounded font-semibold">
                Save 20%
              </span>
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Starter */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card p-6 rounded-xl border border-border shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-2xl text-foreground">Starter Workspace</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For early-stage startups and small teams.
                </p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ${billingCycle === "annually" ? 299 : 349}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Up to 5 Recruiter & Admin Seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>28 Micro-Stage Pipeline Board</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Google Sheets Candidate Importer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Standard Email Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan("starter")}
                className="mt-8 w-full py-2.5 rounded-lg border border-border bg-surface hover:bg-accent text-foreground text-xs font-semibold transition-colors cursor-pointer"
              >
                Choose Starter
              </button>
            </motion.div>

            {/* Growth (Popular) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card p-6 rounded-xl border-2 border-ember shadow-lifted flex flex-col justify-between relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ember text-ember-foreground text-10px font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="font-display text-2xl text-foreground">Growth Enterprise</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For scaling organizations and HR departments.
                </p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ${billingCycle === "annually" ? 899 : 999}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Up to 25 Recruiter & Admin Seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>LinkedIn + Google Sheets Connectors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Automated E-Signatures & Offers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Custom Subdomain & Branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>24/7 Priority Support & SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan("growth")}
                className="mt-8 w-full py-2.5 rounded-lg bg-ember text-ember-foreground hover:bg-ember/90 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Choose Growth
              </button>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card p-6 rounded-xl border border-border shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-2xl text-foreground">Custom Enterprise</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For large-scale global corporations.
                </p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">
                    ${billingCycle === "annually" ? 1999 : 2299}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Unlimited Seats & Hiring Managers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Dedicated Single-Tenant Infrastructure</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Custom REST API & Webhooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span>Dedicated HR Success Account Manager</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan("enterprise")}
                className="mt-8 w-full py-2.5 rounded-lg border border-border bg-surface hover:bg-accent text-foreground text-xs font-semibold transition-colors cursor-pointer"
              >
                Contact Sales & Choose
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enterprise FAQ Accordion Component (NEW ADDON COMPONENT) */}
      <section className="py-20 px-6 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Company Onboarding FAQ
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-xs text-foreground flex items-center justify-between gap-4 cursor-pointer hover:bg-surface/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform ${openFaq === idx ? "rotate-180 text-ember" : ""}`}
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
        buttonText="Get Started"
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
          { label: "ROI Calculator", href: "#calculator" },
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
