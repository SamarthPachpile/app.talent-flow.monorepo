import React, { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Globe2,
  ShieldCheck,
  Building2,
  Activity,
  Layers,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  CalendarClock,
  ClipboardCheck,
  FileSignature,
  Settings,
  Sparkles,
  Zap,
  ChevronRight,
  Database,
  BarChart3,
  Cpu,
  Server,
  Sliders,
  RefreshCw,
  Radio,
  ShieldAlert,
  Terminal,
  Clock,
  TrendingUp,
} from "lucide-react";

export function AdminHomePage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "companies" | "audit" | "security">(
    "pipeline",
  );

  // Parallax scroll hooks
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0.2]);
  const bgGlowY = useTransform(heroScroll, [0, 1], [0, -80]);

  // SLA Calculator State
  const [candidateVolume, setCandidateVolume] = useState<number>(500);
  const [recruiterCount, setRecruiterCount] = useState<number>(20);

  // SLA calculation derived state
  const computedSlaRate = Math.min(99.8, 92 + (recruiterCount / candidateVolume) * 200).toFixed(1);
  const averageResolutionTime = Math.max(
    1.5,
    8.5 - recruiterCount / (candidateVolume / 100),
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative overflow-x-clip">
      {/* Top Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ember z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-card/95 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="grid size-9 place-items-center rounded-lg bg-ember text-sm font-bold text-ember-foreground shadow-xs cursor-pointer"
            >
              TF
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  TalentFlow Admin Suite
                </span>
                <span className="rounded bg-ember/15 border border-ember/30 px-2 py-0.5 text-[10px] font-semibold text-ember animate-pulse">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Global Enterprise Workforce Governance
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Platform Features
            </a>
            <a href="#showcase" className="hover:text-foreground transition-colors">
              Interactive Showcase
            </a>
            <a href="#sla-simulator" className="hover:text-foreground transition-colors">
              SLA Simulator
            </a>
            <a href="#security" className="hover:text-foreground transition-colors">
              Security & Compliance
            </a>
            <a href="#stats" className="hover:text-foreground transition-colors">
              Metrics
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/admin-panel/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-ember px-4 py-2 text-xs font-semibold text-ember-foreground shadow-xs hover:bg-ember/90 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Lock className="size-3.5" />
              <span>Admin Dashboard</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Live Operational System Telemetry Bar (NEW ADDON COMPONENT) */}
      <div className="bg-surface/80 border-b border-border py-2 px-6 text-[11px] font-mono text-muted-foreground backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-success font-semibold">
              <Radio className="size-3 animate-ping" /> REAL-TIME TELEMETRY
            </span>
            <span className="hidden sm:inline border-r border-border h-3" />
            <span>
              Replica Node: <strong className="text-foreground">us-east-1a (Active)</strong>
            </span>
            <span className="hidden md:inline border-r border-border h-3" />
            <span className="hidden md:inline">
              Latency: <strong className="text-ember">2.8ms</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Audit Buffer: <strong className="text-foreground">0 Pending</strong>
            </span>
            <span className="border-r border-border h-3" />
            <span>
              RLS Isolation: <strong className="text-success">ENFORCED</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section with Parallax Background & Multi-Layer Glass Components */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-surface/60 to-background py-20 md:py-32"
      >
        {/* Ambient Grid Pattern & Radial Glow Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f9731615,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800e_1px,transparent_1px),linear-gradient(to_bottom,#8080800e_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <motion.div
          style={{ y: bgGlowY }}
          className="absolute -top-40 right-1/4 size-96 rounded-full bg-ember/10 blur-3xl pointer-events-none"
        />

        {/* Floating Parallax Cards (Left & Right) */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-8 hidden xl:block p-4 rounded-2xl bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-ember/15 text-ember shadow-inner">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Global Audit Stream</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                1,400 event transactions/sec
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Audit Latency</span>
            <span className="text-success font-semibold font-mono">&lt; 2.4ms</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-8 hidden xl:block p-4 rounded-2xl bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/15 text-success shadow-inner">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Subnet Whitelist Active</p>
              <p className="text-[10px] text-success font-medium">100% IP SLA Approved</p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground font-mono">192.168.1.0/24</span>
            <span className="text-ember font-bold">SUBNET VERIFIED</span>
          </div>
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto max-w-7xl px-6 relative z-10"
        >
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-xs font-semibold text-ember shadow-xs backdrop-blur-md"
            >
              <Globe2 className="size-3.5 animate-spin-slow" />
              <span>Multi-Tenant Enterprise ATS Governance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
            >
              Centralized Pipeline Governance &{" "}
              <span className="bg-gradient-to-r from-ember via-amber-500 to-orange-400 bg-clip-text text-transparent">
                Enterprise CRM
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Monitor candidate pipelines across all client company workspaces, enforce micro-stage
              SLA compliance, track candidate interaction audit trails, and manage multi-tenant
              talent acquisition in real time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Link
                to="/admin-panel/login"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-ember px-7 py-4 text-sm font-semibold text-ember-foreground shadow-lifted hover:bg-ember/90 transition-all transform hover:-translate-y-1 hover:shadow-ember/20 hover:shadow-2xl cursor-pointer active:scale-95"
              >
                <ShieldCheck className="size-4" />
                <span>Launch Admin Control Center</span>
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="#showcase"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 backdrop-blur-md px-7 py-4 text-sm font-semibold text-foreground hover:bg-accent transition-all hover:scale-105 active:scale-95"
              >
                <span>View Platform Showcase</span>
              </a>
            </motion.div>

            {/* Embedded Live System Governance Control Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 max-w-3xl mx-auto"
            >
              <div className="bg-card/70 border border-border/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="size-2.5 rounded-full bg-success animate-ping" />
                    <span className="text-xs font-mono font-bold text-foreground">
                      SUPER_ADMIN_CONSOLE_v2.4
                    </span>
                  </div>
                  <span className="text-[10px] bg-ember/15 text-ember border border-ember/30 px-2 py-0.5 rounded font-mono font-semibold">
                    SYSTEM OPERATOR MODE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-surface/80 p-3 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground text-[10px]">
                      Global Micro-Stage SLA
                    </span>
                    <p className="font-bold text-foreground font-mono">98.4% Compliant</p>
                    <div className="h-1.5 bg-card rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-success w-[98.4%] rounded-full" />
                    </div>
                  </div>

                  <div className="bg-surface/80 p-3 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground text-[10px]">
                      Active Enterprise Tenants
                    </span>
                    <p className="font-bold text-foreground font-mono">104 Companies</p>
                    <span className="text-[10px] text-success">All Workspaces Segregated</span>
                  </div>

                  <div className="bg-surface/80 p-3 rounded-xl border border-border/60 space-y-1">
                    <span className="text-muted-foreground text-[10px]">Live Audit Stream</span>
                    <p className="font-bold text-ember font-mono">Zero Backlog</p>
                    <span className="text-[10px] text-muted-foreground">Postgres RLS Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick stats banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="stats"
              className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border/60 max-w-4xl mx-auto text-left"
            >
              <div className="space-y-1 p-3.5 rounded-xl bg-card/40 border border-border/40 hover:border-ember/40 transition-all">
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground">28</p>
                <p className="text-xs text-muted-foreground font-medium">Micro-Stages Monitored</p>
              </div>
              <div className="space-y-1 p-3.5 rounded-xl bg-card/40 border border-border/40 hover:border-ember/40 transition-all">
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground">100+</p>
                <p className="text-xs text-muted-foreground font-medium">Company Workspaces</p>
              </div>
              <div className="space-y-1 p-3.5 rounded-xl bg-card/40 border border-border/40 hover:border-ember/40 transition-all">
                <p className="font-display text-3xl md:text-4xl font-bold text-ember">&lt;10ms</p>
                <p className="text-xs text-muted-foreground font-medium">Real-Time Audit Sync</p>
              </div>
              <div className="space-y-1 p-3.5 rounded-xl bg-card/40 border border-border/40 hover:border-ember/40 transition-all">
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  99.99%
                </p>
                <p className="text-xs text-muted-foreground font-medium">Platform Availability</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Core Platform Capabilities */}
      <section id="features" className="py-20 bg-background border-b border-border relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Engineered for System Operators
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Everything Needed to Govern Multi-Tenant Recruitment
            </h2>
            <p className="text-sm text-muted-foreground">
              A comprehensive administrative command layer providing complete visibility and
              security across every candidate touchpoint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Globe2}
              title="Global Pipeline Board"
              description="Unified 28 micro-stage CRM board aggregating all candidates from all onboarded enterprise workspaces in a single pane."
              delay={0.0}
            />
            <FeatureCard
              icon={Building2}
              title="Multi-Company Workspace Management"
              description="Inspect individual company pipelines, open positions, recruiter assignments, and domain settings effortlessly."
              delay={0.1}
            />
            <FeatureCard
              icon={Activity}
              title="Real-Time Audit & Interactions Feed"
              description="Immutable audit trail capturing stage transitions, candidate notes, interview bookings, and recruiter actions."
              delay={0.2}
            />
            <FeatureCard
              icon={ClipboardCheck}
              title="SLA & Bottleneck Alerting"
              description="Automatic detection of stuck candidates and delayed screening phases with configurable escalation workflows."
              delay={0.3}
            />
            <FeatureCard
              icon={Lock}
              title="Restricted IP Subnet Access"
              description="Enterprise security authorization with passkey verification, IP subnet whitelisting, and role permissions."
              delay={0.4}
            />
            <FeatureCard
              icon={FileSignature}
              title="Offer & Contract Governance"
              description="Centralized oversight of generated offer letters, signature statuses, compensation bands, and approval chains."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Interactive SLA & Pipeline Velocity Simulator (NEW ADDON COMPONENT) */}
      <section id="sla-simulator" className="py-20 bg-surface/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Interactive Operator Tool
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Micro-Stage SLA & Bottleneck Simulator
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust candidate volume and recruiter allocations to simulate real-time SLA compliance
              rates and bottleneck resolution velocity.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lifted grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Users className="size-4 text-ember" /> Active Candidate Load
                  </span>
                  <span className="text-ember font-mono">{candidateVolume} Candidates</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={candidateVolume}
                  onChange={(e) => setCandidateVolume(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-ember"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Cpu className="size-4 text-ember" /> Assigned Recruiter & Operator Seats
                  </span>
                  <span className="text-ember font-mono">{recruiterCount} Recruiters</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={recruiterCount}
                  onChange={(e) => setRecruiterCount(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-ember"
                />
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-ember" /> Automated SLA Governance Rule
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When screening SLA threshold exceeds 48 hours, TalentFlow auto-reassigns stalled
                  candidate records to available recruitment leads and issues Slack alerts.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                key={computedSlaRate}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface p-6 rounded-2xl border border-border text-center space-y-2 shadow-xs"
              >
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Simulated SLA Compliance
                </p>
                <p className="font-display text-4xl font-bold text-success">{computedSlaRate}%</p>
                <span className="text-[10px] bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded font-medium inline-block">
                  Target &gt;95%
                </span>
              </motion.div>

              <motion.div
                key={averageResolutionTime}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface p-6 rounded-2xl border border-border text-center space-y-2 shadow-xs"
              >
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Avg Stage Resolution
                </p>
                <p className="font-display text-4xl font-bold text-ember">
                  {averageResolutionTime} hrs
                </p>
                <span className="text-[10px] bg-ember/15 text-ember border border-ember/30 px-2 py-0.5 rounded font-medium inline-block">
                  Fast Automation
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase Section */}
      <section id="showcase" className="py-20 bg-surface/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-semibold tracking-widest text-ember uppercase">
                Platform Deep-Dive
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">
                Explore the Admin Control Modules
              </h2>
            </div>

            {/* Showcase Tabs */}
            <div className="flex flex-wrap gap-2 bg-card p-1.5 rounded-xl border border-border">
              <button
                onClick={() => setActiveTab("pipeline")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "pipeline"
                    ? "bg-ember text-ember-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Global Board
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "companies"
                    ? "bg-ember text-ember-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Company Directory
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "audit"
                    ? "bg-ember text-ember-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Audit Feed
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "security"
                    ? "bg-ember text-ember-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                IP & Security
              </button>
            </div>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lifted">
            <AnimatePresence mode="wait">
              {activeTab === "pipeline" && (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-ember/15 text-ember">
                        <Layers className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Global 28 Micro-Stage Board
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Track candidate velocity across pre-screening, interview, offer, and
                          day-one phases.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/admin-panel/login"
                      className="text-xs font-semibold text-ember hover:underline flex items-center gap-1"
                    >
                      Open Board View <ChevronRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <ShowcaseColumn
                      title="Application Phase"
                      count="18 Candidates"
                      badge="Stage 1-4"
                      color="bg-blue-500/10 text-blue-500"
                    />
                    <ShowcaseColumn
                      title="Screening & Tech"
                      count="12 Candidates"
                      badge="Stage 5-12"
                      color="bg-amber-500/10 text-amber-500"
                    />
                    <ShowcaseColumn
                      title="Exec & Offer"
                      count="7 Candidates"
                      badge="Stage 13-20"
                      color="bg-emerald-500/10 text-emerald-500"
                    />
                    <ShowcaseColumn
                      title="Onboarding Ready"
                      count="5 Candidates"
                      badge="Stage 21-28"
                      color="bg-purple-500/10 text-purple-500"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "companies" && (
                <motion.div
                  key="companies"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-ember/15 text-ember">
                        <Building2 className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Onboarded Client Workspaces
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Manage active enterprise tenants, seat allocations, and connector
                          integrations.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/admin-panel/companies"
                      className="text-xs font-semibold text-ember hover:underline flex items-center gap-1"
                    >
                      Manage Companies <ChevronRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CompanyPreviewCard
                      name="Acme Corporation"
                      plan="Enterprise"
                      positions={14}
                      candidates={42}
                      domain="acme.talentflow.hub"
                    />
                    <CompanyPreviewCard
                      name="Starlight Dynamics"
                      plan="Growth Plan"
                      positions={8}
                      candidates={19}
                      domain="starlight.talentflow.hub"
                    />
                    <CompanyPreviewCard
                      name="Nexus Robotics"
                      plan="Enterprise"
                      positions={22}
                      candidates={68}
                      domain="nexus.talentflow.hub"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "audit" && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-ember/15 text-ember">
                        <Activity className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Immutable Interaction Log
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Full transparency into candidate movements, recruiter updates, and API
                          imports.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-ember font-semibold">
                      Sync Speed: &lt;10ms
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <AuditLogItem
                      time="09:14:22"
                      actor="Sarah Jenkins (Acme Admin)"
                      action="Advanced candidate Amara Okonkwo to 'Background Check'"
                      channel="System ATS"
                    />
                    <AuditLogItem
                      time="08:52:10"
                      actor="LinkedIn Connector"
                      action="Imported 4 candidate resumes into duplicate check stage"
                      channel="LinkedIn API"
                    />
                    <AuditLogItem
                      time="08:30:05"
                      actor="Wei Zhang (Candidate)"
                      action="Signed e-offer contract contract_v4.pdf"
                      channel="Candidate Portal"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-ember/15 text-ember">
                        <Lock className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Restricted Security & Subnet Protection
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Automated IP verification, passkey sessions, and role-based ACLs.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-success/15 text-success font-semibold text-xs border border-success/30">
                      SUBNET APPROVED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="bg-surface p-4 rounded-xl border border-border space-y-2">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <ShieldCheck className="size-4 text-success" />
                        Client IP Authorization
                      </p>
                      <p className="text-muted-foreground">
                        Whitelisted subnet:{" "}
                        <span className="font-mono text-foreground">192.168.1.0/24</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        All unauthorized login attempts outside corporate subnets require MFA
                        verification.
                      </p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-border space-y-2">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Database className="size-4 text-ember" />
                        Data Isolation Guarantee
                      </p>
                      <p className="text-muted-foreground font-mono">
                        Row-Level Security (RLS) Active
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Tenant candidate records are cryptographically segregated per company
                        workspace.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="py-20 bg-background relative">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-ember/10 border border-ember/30 rounded-3xl p-10 md:p-14 text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ember/5 via-transparent to-ember/5 pointer-events-none" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Ready to Govern Your Enterprise Hiring Pipelines?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Access the TalentFlow System Operator Board to view global candidate micro-stages,
              company workspace controls, and live audit logs.
            </p>
            <div className="pt-2">
              <Link
                to="/admin-panel/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ember px-8 py-4 text-sm font-semibold text-ember-foreground shadow-lifted hover:bg-ember/90 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Lock className="size-4" />
                <span>Enter Admin Panel Dashboard</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="grid size-6 place-items-center rounded bg-ember text-[10px] font-bold text-ember-foreground">
              TF
            </div>
            <span className="font-semibold text-foreground">TalentFlow Admin Suite</span>
            <span>· Enterprise Workforce Governance v2.4</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/admin-panel/login" className="hover:text-foreground transition-colors">
              Admin Dashboard
            </Link>
            <Link to="/admin-panel/companies" className="hover:text-foreground transition-colors">
              Company Directory
            </Link>
            <Link to="/admin-panel/settings" className="hover:text-foreground transition-colors">
              Settings & Team
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-ember transition-all space-y-3 group cursor-pointer"
    >
      <div className="size-11 rounded-xl bg-ember/10 border border-ember/20 text-ember grid place-items-center group-hover:bg-ember group-hover:text-ember-foreground transition-colors">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function ShowcaseColumn({
  title,
  count,
  badge,
  color,
}: {
  title: string;
  count: string;
  badge: string;
  color: string;
}) {
  return (
    <div className="bg-surface p-4 rounded-xl border border-border space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${color}`}>{badge}</span>
        <span className="text-[11px] text-muted-foreground font-mono">{count}</span>
      </div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="space-y-1.5 pt-2">
        <div className="h-2 bg-card rounded-full overflow-hidden">
          <div className="h-full bg-ember w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CompanyPreviewCard({
  name,
  plan,
  positions,
  candidates,
  domain,
}: {
  name: string;
  plan: string;
  positions: number;
  candidates: number;
  domain: string;
}) {
  return (
    <div className="bg-surface p-4 rounded-xl border border-border space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground text-sm">{name}</h4>
        <span className="text-[10px] bg-ember/15 text-ember px-2 py-0.5 rounded font-semibold">
          {plan}
        </span>
      </div>
      <p className="text-[11px] font-mono text-muted-foreground">{domain}</p>
      <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
        <span>{positions} Open Roles</span>
        <span className="font-semibold text-foreground">{candidates} Candidates</span>
      </div>
    </div>
  );
}

function AuditLogItem({
  time,
  actor,
  action,
  channel,
}: {
  time: string;
  actor: string;
  action: string;
  channel: string;
}) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-[11px]">{time}</span>
        <span className="font-semibold text-foreground">{actor}:</span>
        <span className="text-muted-foreground truncate max-w-md">{action}</span>
      </div>
      <span className="text-[10px] bg-card px-2 py-0.5 rounded border border-border text-foreground">
        {channel}
      </span>
    </div>
  );
}
