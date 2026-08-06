import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  FileText,
  Laptop,
  Key,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Star,
  ChevronRight,
  Clock,
  Truck,
  HeartHandshake,
  PenTool,
  Monitor,
  Headphones,
  Check,
  ChevronDown,
  Info,
  PackageCheck,
} from "lucide-react";

interface CandidateHomePageProps {
  onSignIn: () => void;
  onExploreDashboard?: () => void;
  isAuthenticated?: boolean;
}

export const CandidateHomePage: React.FC<CandidateHomePageProps> = ({
  onSignIn,
  onExploreDashboard,
  isAuthenticated = false,
}) => {
  const [selectedRoadmapStage, setSelectedRoadmapStage] = useState<string>("3");
  const [selectedLaptop, setSelectedLaptop] = useState<"macbook" | "thinkpad">("macbook");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(["monitor", "keyboard"]);
  const [typedSignature, setTypedSignature] = useState<string>("Amara Okonkwo");
  const [isSignedDemo, setIsSignedDemo] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Parallax Scroll Hooks
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], [0, 80]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0.2]);

  const roadmapStages = [
    {
      id: "1",
      name: "Application",
      desc: "Resume parsing & initial intake check",
      icon: FileText,
      previewText: "Resume parsed instantly with AI field mapping & salary expectations match.",
    },
    {
      id: "2",
      name: "Interviews",
      desc: "Panel, technical & hiring manager calls",
      icon: Calendar,
      previewText: "Automated 1-click Google Calendar / MS Teams booking with interviewers.",
    },
    {
      id: "3",
      name: "Offer Contract",
      desc: "Digital e-signature & compensation package",
      icon: HeartHandshake,
      previewText: "Legally binding e-signature contract with compensation & equity breakdown.",
    },
    {
      id: "4",
      name: "Background Check",
      desc: "Secure identity & document verification",
      icon: ShieldCheck,
      previewText: "Fast secure document uploads & Checkr automated identity status.",
    },
    {
      id: "5",
      name: "Hardware Setup",
      desc: "Select laptop & IT gear with FedEx tracking",
      icon: Laptop,
      previewText: "Customize laptop, dual 4K monitors & peripherals with live FedEx tracking.",
    },
    {
      id: "6",
      name: "Credentials",
      desc: "Access Google Workspace, Slack & SSO",
      icon: Key,
      previewText: "Pre-provisioned corporate email, Slack invite & Okta SSO credentials.",
    },
    {
      id: "7",
      name: "Day One Ready",
      desc: "Team orientation & first week schedule",
      icon: UserCheck,
      previewText: "Welcome buddy assignment, 1st week meeting agenda & team org chart.",
    },
  ];

  const toggleAccessory = (accId: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(accId) ? prev.filter((a) => a !== accId) : [...prev, accId],
    );
  };

  const faqs = [
    {
      q: "How soon do I receive my offer letter after passing interview stages?",
      a: "As soon as executive approval is completed, your official offer letter is generated instantly on your candidate portal with 1-click digital e-signature capabilities.",
    },
    {
      q: "How does IT hardware shipping work?",
      a: "During Stage 5, you choose your laptop specification and work accessories. Your gear is assembled, pre-configured by IT, and shipped via FedEx Express with real-time tracking numbers.",
    },
    {
      q: "Is my personal candidate data secure?",
      a: "Yes. TalentFlow Hub uses row-level cryptographic database isolation and SOC2 Type II compliance to ensure your records and uploaded documents remain 100% confidential.",
    },
  ];

  const activeStageObj =
    roadmapStages.find((s) => s.id === selectedRoadmapStage) || roadmapStages[2];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative overflow-x-clip">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ember z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-card/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.span
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="grid size-9 place-items-center rounded-lg bg-ember text-ember-foreground font-bold shadow-xs text-sm cursor-pointer"
            >
              TF
            </motion.span>
            <div className="leading-tight">
              <span className="font-display text-xl font-bold text-foreground tracking-tight">
                TalentFlow Candidate Hub
              </span>
              <span className="text-[10px] block text-muted-foreground uppercase tracking-widest font-semibold">
                Candidate Portal
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted-foreground">
            <a href="#roadmap" className="hover:text-foreground transition-colors">
              7-Stage Roadmap
            </a>
            <a href="#interactive-gear" className="hover:text-foreground transition-colors">
              Hardware Configurator
            </a>
            <a href="#esign-demo" className="hover:text-foreground transition-colors">
              E-Sign Demo
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Candidate Features
            </a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">
              Placed Candidates
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={isAuthenticated ? onExploreDashboard || onSignIn : onSignIn}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-ember text-ember-foreground hover:bg-ember/90 shadow-card transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <UserCheck className="size-3.5" />
              <span>{isAuthenticated ? "Open Candidate Dashboard" : "Candidate Sign In"}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax Background & Glass Cards */}
      <section
        ref={heroRef}
        className="relative pt-20 pb-28 px-6 overflow-hidden border-b border-border bg-gradient-to-b from-background via-surface/60 to-background"
      >
        {/* Ambient Grid Pattern & Radial Glow Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f9731615,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800e_1px,transparent_1px),linear-gradient(to_bottom,#8080800e_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Floating Parallax Badges (Left & Right) */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-8 hidden lg:flex items-center gap-3.5 p-4 rounded-2xl bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="p-2.5 rounded-xl bg-success/15 text-success shadow-inner">
            <PackageCheck className="size-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span>FedEx Express Shipment</span>
              <span className="size-2 rounded-full bg-success animate-ping" />
            </div>
            <p className="text-[10px] text-success font-mono mt-0.5">Track: FX-9823419082-US</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Delivering Tomorrow by 10:30 AM
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-8 hidden lg:flex items-center gap-3.5 p-4 rounded-2xl bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl max-w-xs"
        >
          <div className="p-2.5 rounded-xl bg-ember/15 text-ember shadow-inner">
            <HeartHandshake className="size-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-foreground">Digital Offer Contract</p>
            <p className="text-[10px] text-ember font-semibold mt-0.5">E-Signed in 20 Seconds</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              PDF Verification Stamp Approved
            </p>
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
            <span>Total Transparency in Your Job Application & Onboarding</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-foreground max-w-5xl mx-auto tracking-tight"
          >
            Your Transparent Career Journey,{" "}
            <span className="bg-gradient-to-r from-ember via-amber-500 to-orange-400 bg-clip-text text-transparent">
              From First Interview to Day One.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal"
          >
            No more waiting in the dark. View your real-time 7-stage roadmap, e-sign offer contracts
            digitally, select your work equipment, and communicate directly with your hiring team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onSignIn}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-ember text-ember-foreground font-semibold text-sm shadow-lifted hover:bg-ember/90 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-ember/20 active:scale-95"
            >
              <UserCheck className="size-4" />
              <span>Access My Candidate Portal</span>
              <ArrowRight className="size-4" />
            </button>
          </motion.div>

          {/* Embedded Live Candidate Roadmap Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 max-w-3xl mx-auto"
          >
            <div className="bg-card/75 border border-border/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl text-left space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-ember text-ember-foreground font-bold text-xs grid place-items-center">
                    AO
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Amara Okonkwo · Candidate Portal
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Senior Backend Engineer · Acme Corporation
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-success/15 text-success border border-success/30 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-success animate-ping" /> Stage 3 of 7:
                  Offer Accepted
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-medium">
                    7-Stage Roadmap Completion
                  </span>
                  <span className="text-ember font-bold">43% Completed</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "43%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-ember to-amber-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
          >
            <div className="bg-card/50 border border-border/80 rounded-xl p-5 shadow-xs hover:border-ember/40 transition-all hover:bg-card/80">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Roadmap Stages
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">
                7 Stages
              </p>
              <p className="text-[11px] text-success font-medium mt-1">Application to Day 1</p>
            </div>
            <div className="bg-card/50 border border-border/80 rounded-xl p-5 shadow-xs hover:border-ember/40 transition-all hover:bg-card/80">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Contract E-Sign
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">
                1-Click
              </p>
              <p className="text-[11px] text-success font-medium mt-1">Legally Binding PDF</p>
            </div>
            <div className="bg-card/50 border border-border/80 rounded-xl p-5 shadow-xs hover:border-ember/40 transition-all hover:bg-card/80">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                IT Equipment
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold text-ember mt-1">
                FedEx Tracked
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">Laptop & accessories</p>
            </div>
            <div className="bg-card/50 border border-border/80 rounded-xl p-5 shadow-xs hover:border-ember/40 transition-all hover:bg-card/80">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Candidate Support
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">
                24/7 Helpdesk
              </p>
              <p className="text-[11px] text-success font-medium mt-1">Direct Recruiter Chat</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 7-Stage Interactive Roadmap Section */}
      <section id="roadmap" className="py-20 px-6 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Step-By-Step Guidance
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              The 7-Stage Candidate Onboarding Roadmap
            </h2>
            <p className="text-sm text-muted-foreground">
              Every candidate follows a structured, transparent timeline with full visibility into
              current stage requirements.
            </p>
          </div>

          {/* Interactive Roadmap Stage Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 mb-8">
            {roadmapStages.map((stg) => {
              const Icon = stg.icon;
              const isSelected = selectedRoadmapStage === stg.id;
              return (
                <motion.button
                  key={stg.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedRoadmapStage(stg.id)}
                  className={`bg-card border rounded-xl p-4 text-center space-y-2 shadow-xs transition-all cursor-pointer text-left ${
                    isSelected
                      ? "border-ember ring-2 ring-ember/30 bg-ember/5"
                      : "border-border hover:border-ember/50"
                  }`}
                >
                  <div
                    className={`size-9 rounded-lg grid place-items-center mx-auto transition-colors ${
                      isSelected ? "bg-ember text-ember-foreground" : "bg-ember/10 text-ember"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
                    Stage {stg.id}
                  </span>
                  <h3 className="text-xs font-semibold text-foreground leading-tight text-center">
                    {stg.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-normal text-center">
                    {stg.desc}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Live Stage Inspection Drawer Component (NEW ADDON COMPONENT) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRoadmapStage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-lifted max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold bg-ember/15 text-ember border border-ember/30 px-2.5 py-0.5 rounded-full uppercase">
                  Stage {activeStageObj.id} Deep-Dive Preview
                </span>
                <h3 className="text-xl font-display font-bold text-foreground">
                  {activeStageObj.name}
                </h3>
                <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                  {activeStageObj.previewText}
                </p>
              </div>
              <button
                onClick={onSignIn}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>View Full Stage Details</span>
                <ChevronRight className="size-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Hardware Configurator Component (NEW ADDON COMPONENT) */}
      <section id="interactive-gear" className="py-20 px-6 border-b border-border bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Interactive Equipment Preview
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Customize Your Work Hardware Setup
            </h2>
            <p className="text-sm text-muted-foreground">
              Test drive our hardware selection experience available during Stage 5 of candidate
              onboarding.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lifted grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Left Options */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-3">
                  1. Select Primary Laptop
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedLaptop("macbook")}
                    className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                      selectedLaptop === "macbook"
                        ? "border-ember bg-ember/10 font-semibold"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Laptop className="size-5 text-ember" />
                    <p className="text-xs text-foreground">Apple MacBook Pro 16"</p>
                    <p className="text-[10px] text-muted-foreground">M3 Max · 36GB RAM</p>
                  </button>

                  <button
                    onClick={() => setSelectedLaptop("thinkpad")}
                    className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                      selectedLaptop === "thinkpad"
                        ? "border-ember bg-ember/10 font-semibold"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Laptop className="size-5 text-ember" />
                    <p className="text-xs text-foreground">Lenovo ThinkPad Z16</p>
                    <p className="text-[10px] text-muted-foreground">AMD Ryzen 9 · 32GB RAM</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-3">
                  2. Select Peripherals & Accessories
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => toggleAccessory("monitor")}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      selectedAccessories.includes("monitor")
                        ? "border-ember bg-ember/5 text-foreground"
                        : "border-border bg-surface text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="size-4 text-ember" />
                      <span>Dell UltraSharp 34" Curved 4K Monitor</span>
                    </div>
                    {selectedAccessories.includes("monitor") && (
                      <Check className="size-4 text-ember" />
                    )}
                  </div>

                  <div
                    onClick={() => toggleAccessory("keyboard")}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      selectedAccessories.includes("keyboard")
                        ? "border-ember bg-ember/5 text-foreground"
                        : "border-border bg-surface text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Key className="size-4 text-ember" />
                      <span>Keychron Mechanical Keyboard & MX Master 3S Mouse</span>
                    </div>
                    {selectedAccessories.includes("keyboard") && (
                      <Check className="size-4 text-ember" />
                    )}
                  </div>

                  <div
                    onClick={() => toggleAccessory("headphones")}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      selectedAccessories.includes("headphones")
                        ? "border-ember bg-ember/5 text-foreground"
                        : "border-border bg-surface text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Headphones className="size-4 text-ember" />
                      <span>Bose QuietComfort Noise-Canceling Headphones</span>
                    </div>
                    {selectedAccessories.includes("headphones") && (
                      <Check className="size-4 text-ember" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Equipment Package Summary */}
            <div className="lg:col-span-6 bg-surface p-6 rounded-xl border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Your IT Gear Package
                </span>
                <span className="text-[10px] font-bold bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded">
                  FedEx Express Ready
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Machine Choice:</span>
                  <span className="font-semibold text-foreground">
                    {selectedLaptop === "macbook"
                      ? 'MacBook Pro 16" (M3 Max)'
                      : "Lenovo ThinkPad Z16"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accessories:</span>
                  <span className="font-semibold text-foreground">
                    {selectedAccessories.length} Selected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Est. Delivery:</span>
                  <span className="font-semibold text-ember font-mono">Tomorrow by 10:30 AM</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <button
                  onClick={onSignIn}
                  className="w-full py-3 rounded-xl bg-ember text-ember-foreground text-xs font-semibold shadow-xs hover:bg-ember/90 transition-colors cursor-pointer"
                >
                  Confirm Choice in Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive E-Sign Contract Demo Widget (NEW ADDON COMPONENT) */}
      <section id="esign-demo" className="py-20 px-6 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              1-Click Contract Demo
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Try the E-Signature Experience
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign your mock contract below to experience how seamless offer acceptance is in
              TalentFlow.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lifted max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-ember/15 text-ember">
                  <PenTool className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Employment Agreement — Acme Corp
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Position: Senior Software Engineer · Base: $185,000/yr
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-surface px-2.5 py-1 rounded border border-border text-muted-foreground">
                REF: DOC-99214
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border text-xs leading-relaxed text-muted-foreground space-y-2">
              <p>
                "By typing your legal full name below, you agree to accept the terms of employment
                with Acme Corporation as outlined in the official compensation and benefits
                schedule."
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Type Your Full Name to Sign:
                </label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => {
                    setTypedSignature(e.target.value);
                    setIsSignedDemo(false);
                  }}
                  placeholder="Type full legal name..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:border-ember font-serif italic"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsSignedDemo(true)}
                  disabled={!typedSignature.trim()}
                  className="px-6 py-3 rounded-xl bg-ember text-ember-foreground text-xs font-semibold shadow-xs hover:bg-ember/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <PenTool className="size-4" />
                  <span>Test E-Sign Contract</span>
                </button>

                {isSignedDemo && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xs font-semibold text-success bg-success/15 border border-success/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-4" /> Contract E-Signed & Verified!
                  </motion.span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section id="features" className="py-20 px-6 border-b border-border bg-surface/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Candidate Portal Capabilities
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Everything Designed for Your Peace of Mind
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-3 hover:border-ember/50 transition-all"
            >
              <div className="size-11 rounded-xl bg-ember/15 text-ember grid place-items-center">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                1-Click Offer Contract E-Signing
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review your salary, equity, benefits, and start date details. E-sign your official
                employment agreement with instant confirmation and PDF download.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-3 hover:border-ember/50 transition-all"
              id="hardware"
            >
              <div className="size-11 rounded-xl bg-ember/15 text-ember grid place-items-center">
                <Laptop className="size-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                IT Hardware Selection & FedEx Tracking
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose your preferred work machine (MacBook Pro / ThinkPad), external monitor, and
                peripheral accessories with real-time FedEx shipment tracking.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-3 hover:border-ember/50 transition-all"
            >
              <div className="size-11 rounded-xl bg-ember/15 text-ember grid place-items-center">
                <MessageSquare className="size-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Direct Recruiter & Helpdesk Messaging
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need to reschedule an interview or ask a question about benefits? Reach your
                assigned talent acquisition lead directly through candidate chat.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest text-ember uppercase">
            Candidate Feedback
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-12">
            Loved by Newly Hired Engineers & Designers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-1 text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-warning" />
                ))}
              </div>
              <p className="text-xs text-foreground leading-relaxed italic font-display text-base">
                "The TalentFlow candidate portal made my hiring experience so seamless. I knew
                exactly where I stood in the pipeline, signed my offer in 20 seconds, and selected
                my MacBook Pro which arrived 2 days before my start date!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="size-9 rounded-full bg-ember text-ember-foreground font-bold text-xs grid place-items-center">
                  AO
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Amara Okonkwo</p>
                  <p className="text-[11px] text-muted-foreground">
                    Senior Backend Engineer · Placed at Acme Corp
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-1 text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-warning" />
                ))}
              </div>
              <p className="text-xs text-foreground leading-relaxed italic font-display text-base">
                "Having direct visibility into my background check status and Day 1 orientation
                schedule took away all pre-job anxiety. Best candidate onboarding experience I've
                had!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="size-9 rounded-full bg-ember text-ember-foreground font-bold text-xs grid place-items-center">
                  WZ
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Wei Zhang</p>
                  <p className="text-[11px] text-muted-foreground">
                    Staff Architect · Placed at Acme Corp
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion Component (NEW ADDON COMPONENT) */}
      <section className="py-20 px-6 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Common Questions
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Candidate Portal FAQ
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
      <section className="py-16 bg-surface border-t border-border px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-display text-4xl font-bold text-foreground">
            Ready to Access Your Application Status?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Log in to view your personalized application timeline, offer contract, equipment
            delivery, and day-one checklist.
          </p>
          <div>
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-ember text-ember-foreground font-semibold text-sm shadow-lifted hover:bg-ember/90 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <UserCheck className="size-4" />
              <span>Sign In to Candidate Portal</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 px-6 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded bg-ember text-[10px] font-bold text-ember-foreground">
              TF
            </span>
            <span className="font-semibold text-foreground">TalentFlow Candidate Hub</span>
            <span>· Transparent Onboarding Suite</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onSignIn}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Candidate Sign In
            </button>
            <a href="#roadmap" className="hover:text-foreground transition-colors">
              Roadmap
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#hardware" className="hover:text-foreground transition-colors">
              IT Setup
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
