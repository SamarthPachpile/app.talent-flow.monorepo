import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Filter,
  Radio,
  Menu,
  X,
  ShieldCheck,
  RotateCcw,
  LayoutGrid,
  ListFilter,
  Check,
  Lock,
} from "lucide-react";
import { CompanyApiService, CompanyDocument, JobApiService } from "@talent-flow/api";
import CTASection from "./CTASection";
import { Footer } from "./Footer";

interface CandidateCompanySelectorProps {
  onSelectCompany: (company: CompanyDocument) => void;
  onRegisterCandidature?: () => void;
}

export const CandidateCompanySelector: React.FC<CandidateCompanySelectorProps> = ({
  onSelectCompany,
  onRegisterCandidature,
}) => {
  const [companies, setCompanies] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobCountMap, setJobCountMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy] = useState<"name" | "recent">("name");
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Subscribe to MongoDB Atlas 'companies' collection in real-time with Redis cloud caching
    const unsubscribe = CompanyApiService.subscribeToAvailableCompanies(
      (list) => {
        if (isMounted) {
          setCompanies(list);
          setLoading(false);
        }
      },
      () => {
        if (isMounted) setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Dynamically load active job openings count for each registered company
  useEffect(() => {
    if (companies.length === 0) return;

    companies.forEach((comp) => {
      const cId = comp.id || comp.subdomain || comp.name;
      if (cId) {
        JobApiService.getCompanyJobs(cId, comp.name, comp.subdomain)
          .then((jobs) => {
            if (Array.isArray(jobs)) {
              const activeCount = jobs.filter((j) => j.status === "Active").length;
              setJobCountMap((prev) => ({ ...prev, [comp.id]: activeCount }));
            }
          })
          .catch(() => {});
      }
    });
  }, [companies]);

  const industries = useMemo(() => {
    const list = Array.from(new Set(companies.map((c) => c.industry).filter(Boolean))) as string[];
    return ["All", ...list];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    let result = companies.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.subdomain?.toLowerCase().includes(q) ||
        c.domain?.toLowerCase().includes(q) ||
        c.headquarters?.toLowerCase().includes(q) ||
        c.about?.toLowerCase().includes(q) ||
        c.industry?.toLowerCase().includes(q);

      const matchesIndustry = selectedIndustry === "All" || c.industry === selectedIndustry;

      return matchesSearch && matchesIndustry;
    });

    if (sortBy === "name") {
      result = [...result].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [companies, searchQuery, selectedIndustry, sortBy]);

  const getSlug = (c: CompanyDocument) => {
    const raw = c.subdomain || c.id || c.name || "";
    return raw
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
  };

  const handleRegisterCandidature = () => {
    if (onRegisterCandidature) {
      onRegisterCandidature();
    } else if (companies.length > 0) {
      onSelectCompany(companies[0]);
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/candidates-portal/login";
      }
    }
  };

  const faqs = [
    {
      q: "How do I access my specific company candidate portal?",
      a: "Click on your employer's company card from the directory below or navigate directly to /candidates-portal/<company_slug>/login. You can sign in using your registered candidate email address.",
    },
    {
      q: "Can I track multiple applications across different companies?",
      a: "Yes! Each company workspace is securely isolated with custom subdomains. You can log into individual company portals to monitor your respective stage progress, interview invites, and offer letters.",
    },
    {
      q: "How does offer letter signing and Day 1 onboarding work?",
      a: "When a hiring manager releases your offer letter, you will receive a secure portal notification. You can inspect your full CTC compensation breakdown, e-sign the contract digitally, and choose your work laptop.",
    },
    {
      q: "Is my candidate profile and personal data secure?",
      a: "Yes. All resume files, credentials, and verification records are stored with AES-256 cryptographic encryption and compliant with GDPR / SOC2 data privacy standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col selection:bg-ember/20 relative overflow-x-clip">
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
                  Candidate Discovery & Portal
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-muted-foreground">
              <a href="#companies" className="hover:text-ember transition-colors">
                Available Portals
              </a>
              <a href="#how-it-works" className="hover:text-ember transition-colors">
                Candidate Journey
              </a>
              <a href="#security" className="hover:text-ember transition-colors">
                Privacy & Data Security
              </a>
              <a href="#faq" className="hover:text-ember transition-colors">
                Help & FAQ
              </a>
            </nav>

            {/* Right Side Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="/companies"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Employer Portal
              </a>

              <button
                onClick={handleRegisterCandidature}
                className="clip-path-button-sm bg-ember text-ember-foreground px-6 py-2.5 text-xs font-semibold hover:bg-ember/90 shadow-lifted transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              >
                <Users className="size-3.5" />
                <span>Register Candidature</span>
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
                href="#companies"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Available Portals</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Candidate Journey</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#security"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Privacy & Security</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
              <a
                href="#faq"
                onClick={() => setMobileNavOpen(false)}
                className="p-2.5 rounded-xl hover:bg-accent text-foreground flex items-center justify-between"
              >
                <span>Help & FAQ</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </a>
            </div>

            <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
              <a
                href="/companies"
                className="py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold text-center text-foreground hover:bg-accent"
              >
                Employer Portal
              </a>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  handleRegisterCandidature();
                }}
                className="w-full clip-path-button-sm bg-ember text-ember-foreground py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Users className="size-3.5" />
                <span>Register Candidature</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-6 overflow-hidden border-b border-border bg-linear-to-b from-background via-surface/60 to-background">
        <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-10">
          <img
            src="/assets/hero-bg.jpg"
            alt="Candidate Discovery Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ember/10 border border-ember/30 text-ember text-xs font-semibold shadow-xs"
          >
            <Sparkles className="size-3.5" />
            <span>Next-Gen Candidate Career Hub & Portal Discovery</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-foreground"
          >
            Your Fast-Track Career &{" "}
            <span className="bg-linear-to-r from-ember via-amber-500 to-orange-400 bg-clip-text text-transparent">
              Onboarding Hub.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Access your employer's dedicated portal to track 28 micro-stages in real time, view
            scheduled interviews, e-sign offer contracts, and configure Day 1 hardware.
          </motion.p>

          {/* Search & Filter Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 max-w-2xl mx-auto space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name, industry, subdomain, or location..."
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-card shadow-lifted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember/40 focus:border-ember transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 size-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Industry Filter Chips */}
            {industries.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-muted-foreground mr-1 flex items-center gap-1">
                  <Filter className="size-3 text-ember" /> Categories:
                </span>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedIndustry === ind
                        ? "bg-ember text-ember-foreground shadow-xs scale-105"
                        : "bg-surface text-muted-foreground hover:bg-accent border border-border"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left"
          >
            <div className="p-3.5 rounded-xl bg-card/80 border border-border shadow-xs">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Available Portals
              </p>
              <p className="text-xl font-bold text-foreground font-display mt-0.5">
                {companies.length} Workspaces
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-card/80 border border-border shadow-xs">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Stage Visibility
              </p>
              <p className="text-xl font-bold text-foreground font-display mt-0.5">
                28 Micro-Stages
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-card/80 border border-border shadow-xs">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Offer E-Signatures
              </p>
              <p className="text-xl font-bold text-success font-display mt-0.5">100% Digital</p>
            </div>
            <div className="p-3.5 rounded-xl bg-card/80 border border-border shadow-xs">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Data Privacy
              </p>
              <p className="text-xl font-bold text-ember font-display mt-0.5">GDPR Encrypted</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          COMPANY PORTALS DIRECTORY GRID & LIST VIEW
         ========================================================================= */}
      <main id="companies" className="flex-1 max-w-6xl mx-auto px-6 py-14 w-full space-y-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <span>Verified Company Portals</span>
              <span className="text-xs bg-ember/15 text-ember font-mono px-2.5 py-0.5 rounded-full font-semibold">
                {filteredCompanies.length}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any company card to access its candidate onboarding workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-success font-semibold bg-success/10 px-3 py-1 rounded-full border border-success/20">
              <Radio className="size-3 text-success animate-pulse" />
              <span>Realtime Live Sync</span>
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface p-1 rounded-lg border border-border gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List View"
              >
                <ListFilter className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Companies Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-60 rounded-3xl border border-border bg-card p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-12 bg-muted rounded-xl w-full mt-6" />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 grid place-items-center mx-auto">
              <Building2 className="size-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">
              No Companies Registered Yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              When an enterprise completes workspace onboarding, its candidate portal will appear
              here automatically in real time.
            </p>
            <div className="pt-2">
              <button
                onClick={handleRegisterCandidature}
                className="px-5 py-2.5 rounded-xl bg-ember text-ember-foreground text-xs font-semibold shadow-xs hover:bg-ember/90 transition-all inline-flex items-center gap-2"
              >
                <Users className="size-4" />
                <span>Register Candidature</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
            <Building2 className="size-12 mx-auto text-muted-foreground/60" />
            <h3 className="text-base font-bold text-foreground">
              No companies match "{searchQuery}"
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Try searching with another keyword or reset your industry category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedIndustry("All");
              }}
              className="text-xs text-ember font-bold hover:underline flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Search Filters</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCompanies.map((c) => {
                const slug = getSlug(c);
                const color = c.brandColor || "#f97316";

                return (
                  <motion.div
                    key={c.id || slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onSelectCompany(c)}
                    className="group bg-card border border-border hover:border-ember/50 rounded-3xl p-6 shadow-sm hover:shadow-lifted transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Color Accent Ribbon */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
                      style={{ backgroundColor: color }}
                    />

                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const rawC = c as unknown as Record<string, unknown>;
                            const profile = rawC.profile as Record<string, unknown> | undefined;
                            const fullState = rawC.fullOnboardingState as
                              Record<string, unknown> | undefined;
                            const fullProfile = fullState?.profile as
                              Record<string, unknown> | undefined;

                            const logoSrc =
                              c.logoUrl ||
                              (typeof rawC.logo === "string" ? rawC.logo : undefined) ||
                              (typeof profile?.logoUrl === "string"
                                ? profile.logoUrl
                                : undefined) ||
                              (typeof profile?.logo === "string" ? profile.logo : undefined) ||
                              (typeof fullProfile?.logoUrl === "string"
                                ? fullProfile.logoUrl
                                : undefined) ||
                              (typeof fullProfile?.logo === "string"
                                ? fullProfile.logo
                                : undefined) ||
                              "";
                            const hasErr = imgErrorMap[c.id || slug];

                            if (logoSrc && !hasErr) {
                              return (
                                <img
                                  src={logoSrc}
                                  alt={c.name}
                                  onError={() =>
                                    setImgErrorMap((prev) => ({ ...prev, [c.id || slug]: true }))
                                  }
                                  className="h-11 w-auto max-w-[130px] object-contain shrink-0 rounded-lg"
                                />
                              );
                            }

                            return (
                              <div
                                className="size-12 rounded-2xl grid place-items-center text-white font-bold text-base shadow-xs shrink-0"
                                style={{ backgroundColor: color }}
                              >
                                {c.name ? c.name.substring(0, 2).toUpperCase() : "TF"}
                              </div>
                            );
                          })()}
                          <div>
                            <h3 className="text-base font-display font-bold text-foreground group-hover:text-ember transition-colors">
                              {c.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                              /candidates-portal/{slug}/
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="size-3" /> Active
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {c.about ||
                          `Official candidate onboarding and recruitment tracking portal for ${c.name}.`}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground border-t border-border/50">
                        <span className="inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-border">
                          <Briefcase className="size-3 text-ember" />
                          {c.industry || "Technology"}
                        </span>
                        {jobCountMap[c.id] !== undefined && (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold">
                            <span>
                              {jobCountMap[c.id]} Open {jobCountMap[c.id] === 1 ? "Role" : "Roles"}
                            </span>
                          </span>
                        )}
                        {c.headquarters && (
                          <span className="inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-border">
                            <MapPin className="size-3 text-ember" />
                            {c.headquarters}
                          </span>
                        )}
                        {c.size && (
                          <span className="inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-border">
                            <Users className="size-3 text-ember" />
                            {c.size}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-ember group-hover:translate-x-0.5 transition-transform">
                      <span>Explore Jobs & Apply</span>
                      <span className="flex items-center gap-1 font-mono">
                        /login <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredCompanies.map((c) => {
              const slug = getSlug(c);
              const color = c.brandColor || "#f97316";

              return (
                <div
                  key={c.id || slug}
                  onClick={() => onSelectCompany(c)}
                  className="group bg-card border border-border hover:border-ember/50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="size-11 rounded-xl grid place-items-center text-white font-bold text-sm shadow-xs shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {c.name ? c.name.substring(0, 2).toUpperCase() : "TF"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground group-hover:text-ember transition-colors">
                          {c.name}
                        </h3>
                        <span className="text-[10px] bg-success/15 text-success font-bold px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                        {jobCountMap[c.id] !== undefined && jobCountMap[c.id] > 0 && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {jobCountMap[c.id]} Open {jobCountMap[c.id] === 1 ? "Job" : "Jobs"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                        <span>{c.industry || "Enterprise Tech"}</span>
                        {c.headquarters && <span>• {c.headquarters}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    <span className="text-xs font-mono text-muted-foreground">
                      /candidates-portal/{slug}/
                    </span>
                    <button className="px-4 py-2 rounded-xl bg-ember text-ember-foreground text-xs font-semibold flex items-center gap-1.5 shadow-xs group-hover:bg-ember/90">
                      <span>Explore Jobs</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* =========================================================================
          HOW CANDIDATE PORTAL WORKS (4-STAGE ROADMAP)
         ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-surface border-y border-border px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="text-xs tracking-[0.2em] text-ember uppercase font-semibold">
              Candidate Experience Journey
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
              How TalentFlow Powers Your Career
            </h2>
            <p className="text-sm text-muted-foreground">
              A transparent, automated recruitment process that keeps you in control every step of
              the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-card p-6 rounded-3xl border border-border shadow-xs space-y-3">
              <div className="size-11 rounded-2xl bg-ember/15 flex items-center justify-center text-ember font-bold shadow-inner">
                01
              </div>
              <h3 className="font-bold text-base text-foreground font-display">1-Click Portal</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log in via your employer's custom subdomain or auto-sync your candidate record from
                LinkedIn & Google Sheets.
              </p>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border shadow-xs space-y-3">
              <div className="size-11 rounded-2xl bg-ember/15 flex items-center justify-center text-ember font-bold shadow-inner">
                02
              </div>
              <h3 className="font-bold text-base text-foreground font-display">28-Stage Kanban</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real-time tracking through resume parsing, technical panels, hiring manager
                approvals, and scorecard feedback.
              </p>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border shadow-xs space-y-3">
              <div className="size-11 rounded-2xl bg-ember/15 flex items-center justify-center text-ember font-bold shadow-inner">
                03
              </div>
              <h3 className="font-bold text-base text-foreground font-display">
                Digital Offer E-Sign
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review interactive CTC compensation packages, benefits, and sign your employment
                contract digitally.
              </p>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border shadow-xs space-y-3">
              <div className="size-11 rounded-2xl bg-ember/15 flex items-center justify-center text-ember font-bold shadow-inner">
                04
              </div>
              <h3 className="font-bold text-base text-foreground font-display">IT & Day One</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose your workstation hardware (MacBook Pro / Dell XPS), submit background docs,
                and receive Day 1 credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CANDIDATE DATA PRIVACY & ISOLATION PILLAR
         ========================================================================= */}
      <section id="security" className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-lifted">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success text-xs font-semibold">
                <ShieldCheck className="size-3.5" />
                <span>Enterprise Data Privacy & GDPR Compliant</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Your Candidate Information is 100% Isolated & Encrypted.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                TalentFlow enforces strict cryptographic database isolation between employers. Your
                resumes, salary history, offer contracts, and identity documents are accessible only
                to authorized recruiters at your specific prospective employer.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Check className="size-4 text-success" />
                  <span>AES-256 Cloud Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Check className="size-4 text-success" />
                  <span>Zero Cross-Tenant Sharing</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Check className="size-4 text-success" />
                  <span>Legally Binding E-Signatures</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Check className="size-4 text-success" />
                  <span>GDPR Candidate Data Rights</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surface p-6 rounded-2xl border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-ember/15 text-ember flex items-center justify-center font-bold">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Private Workspace Access</h4>
                  <p className="text-[10px] text-muted-foreground">
                    Secured by MongoDB & Node.js REST API
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need to delete your data or revoke access? Candidate profiles include built-in GDPR
                data export and privacy deletion requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CANDIDATE FAQ ACCORDION
         ========================================================================= */}
      <section id="faq" className="py-20 px-6 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold tracking-widest text-ember uppercase">
              Candidate Help Center
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

      {/* CTA Section (Reusing Graviton CTASection) */}
      <CTASection
        buttonText="Register Candidature"
        onButtonClick={handleRegisterCandidature}
        headingLine1="Let’s start"
        headingLine2="engineering impact"
        headingHighlight="together."
        subtext="Track your application progress in real time, e-sign offer contracts, and complete pre-boarding across verified employer workspaces."
      />

      {/* Footer */}
      <Footer
        onContactClick={handleRegisterCandidature}
        linksCol1={[
          { label: "Available Portals", href: "#companies" },
          { label: "Candidate Journey", href: "#how-it-works" },
          { label: "Security & Privacy", href: "#security" },
          { label: "Employer Portal", href: "/companies" },
        ]}
        linksCol2={[
          { label: "Register Candidature", href: "#", onClick: handleRegisterCandidature },
          { label: "Admin CRM", href: "/admin-panel" },
          { label: "Help & FAQ", href: "#faq" },
        ]}
      />
    </div>
  );
};
