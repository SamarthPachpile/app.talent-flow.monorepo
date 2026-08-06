import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  Radio,
} from "lucide-react";
import { CompanyApiService, CompanyDocument } from "@talent-flow/api";

interface CandidateCompanySelectorProps {
  onSelectCompany: (company: CompanyDocument) => void;
  onCompanyOnboardingLink?: () => void;
}

export const CandidateCompanySelector: React.FC<CandidateCompanySelectorProps> = ({
  onSelectCompany,
  onCompanyOnboardingLink,
}) => {
  const [companies, setCompanies] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Subscribe to Firestore 'companies' collection in real-time
    const unsubscribe = CompanyApiService.subscribeToAvailableCompanies(
      (list) => {
        if (isMounted) {
          setCompanies(list);
          setLoading(false);
        }
      },
      (err) => {
        console.warn("Realtime listener error in CandidateCompanySelector:", err);
        if (isMounted) {
          setLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const industries = [
    "All",
    ...Array.from(new Set(companies.map((c) => c.industry).filter(Boolean))),
  ];

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.industry || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.headquarters || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subdomain || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustry === "All" ||
      (c.industry || "").toLowerCase() === selectedIndustry.toLowerCase();

    return matchesSearch && matchesIndustry;
  });

  const getSlug = (c: CompanyDocument) => {
    const raw = c.subdomain || c.id || c.name || "";
    return raw.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col selection:bg-ember/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-card/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.span
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="grid size-9 place-items-center rounded-lg bg-ember text-ember-foreground font-bold shadow-xs text-sm"
            >
              TF
            </motion.span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                TalentFlow Hub
                <span className="bg-ember/10 text-ember border border-ember/20 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  Candidates Portal
                </span>
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Select your company to log in to your candidate dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onCompanyOnboardingLink && (
              <button
                onClick={onCompanyOnboardingLink}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-accent transition-colors"
              >
                <Building2 className="size-3.5 text-ember" />
                <span>Register Company</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-14 px-6 overflow-hidden border-b border-border/60 bg-gradient-to-b from-card via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ember/10 border border-ember/20 text-ember text-xs font-semibold"
          >
            <Sparkles className="size-3.5" />
            <span>Multi-Tenant Candidate Login Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-foreground"
          >
            Select Your Company Portal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-muted-foreground max-w-2xl mx-auto"
          >
            Candidates log in to their specific company's portal to view applications, interview
            schedules, e-sign offer contracts, and complete hardware onboarding.
          </motion.p>

          {/* Search & Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 max-w-xl mx-auto space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name, industry, or location..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card shadow-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember/40 focus:border-ember transition-all"
              />
            </div>

            {/* Industry Filter Pills */}
            {industries.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-foreground mr-1 flex items-center gap-1">
                  <Filter className="size-3" /> Filter:
                </span>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedIndustry === ind
                        ? "bg-ember text-ember-foreground shadow-xs"
                        : "bg-surface text-muted-foreground hover:bg-accent border border-border"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">
              Available Company Portals ({filteredCompanies.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Click any onboarded company to launch its candidate login page at{" "}
              <code className="text-ember font-mono font-medium">/candidates-portal/&lt;company_name&gt;/login</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-success font-medium bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
              <Radio className="size-3 text-success animate-pulse" />
              <span>Realtime Live Sync</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-full border border-border">
              {filteredCompanies.length} Portals
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl border border-border bg-card p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-10 bg-muted rounded-lg w-full mt-4" />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl p-8 space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 grid place-items-center mx-auto">
              <Building2 className="size-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">No Company Available</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              No companies have registered or enabled candidate portals in the database yet.
              When a company completes registration, its candidate portal will appear here automatically.
            </p>
            {onCompanyOnboardingLink && (
              <div className="pt-2">
                <button
                  onClick={onCompanyOnboardingLink}
                  className="px-5 py-2.5 rounded-xl bg-ember text-ember-foreground text-xs font-semibold shadow-xs hover:bg-ember/90 transition-all inline-flex items-center gap-2"
                >
                  <Building2 className="size-4" />
                  <span>Register Company Now</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 space-y-4 max-w-lg mx-auto">
            <Building2 className="size-12 mx-auto text-muted-foreground/60" />
            <h3 className="text-base font-semibold text-foreground">No companies found matching search</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Try searching with another keyword or reset your category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedIndustry("All");
              }}
              className="text-xs text-ember font-semibold hover:underline"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCompanies.map((c) => {
                const slug = getSlug(c);
                const color = c.brandColor || "#6366f1";

                return (
                  <motion.div
                    key={c.id || slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onSelectCompany(c)}
                    className="group bg-card border border-border hover:border-ember/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Color Accent Ribbon */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
                      style={{ backgroundColor: color }}
                    />

                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const logoSrc =
                              c.logoUrl ||
                              (c as any).logo ||
                              (c as any).profile?.logoUrl ||
                              (c as any).profile?.logo ||
                              (c as any).fullOnboardingState?.profile?.logoUrl ||
                              (c as any).fullOnboardingState?.profile?.logo ||
                              "";
                            const hasErr = imgErrorMap[c.id || slug];

                            if (logoSrc && !hasErr) {
                              return (
                                <img
                                  src={logoSrc}
                                  alt={c.name}
                                  onError={() => setImgErrorMap((prev) => ({ ...prev, [c.id || slug]: true }))}
                                  className="size-12 rounded-xl object-cover border border-border bg-surface p-1 shadow-xs shrink-0"
                                />
                              );
                            }

                            return (
                              <div
                                className="size-12 rounded-xl grid place-items-center text-white font-bold text-lg shadow-xs shrink-0"
                                style={{ backgroundColor: color }}
                              >
                                {c.name ? c.name.substring(0, 2).toUpperCase() : "TF"}
                              </div>
                            );
                          })()}
                          <div>
                            <h3 className="text-base font-display font-semibold text-foreground group-hover:text-ember transition-colors">
                              {c.name}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                              /candidates-portal/{slug}/
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="size-3" /> Enabled
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {c.about ||
                          `Official candidate onboarding & application portal for ${c.name}. Log in to track progress.`}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground border-t border-border/50">
                        <span className="inline-flex items-center gap-1 bg-surface px-2 py-1 rounded-md border border-border">
                          <Briefcase className="size-3 text-ember" />
                          {c.industry || "Technology"}
                        </span>
                        {c.headquarters && (
                          <span className="inline-flex items-center gap-1 bg-surface px-2 py-1 rounded-md border border-border">
                            <MapPin className="size-3 text-ember" />
                            {c.headquarters}
                          </span>
                        )}
                        {c.size && (
                          <span className="inline-flex items-center gap-1 bg-surface px-2 py-1 rounded-md border border-border">
                            <Users className="size-3 text-ember" />
                            {c.size}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-ember group-hover:translate-x-0.5 transition-transform">
                      <span>Candidate Portal Login</span>
                      <span className="flex items-center gap-1">
                        /login <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="border-t border-border bg-card/60 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-ember" />
            <span>
              Multi-tenant Cryptographic Pipeline Isolation — TalentFlow Hub Candidate Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">Route: /candidates-portal/&lt;company_name&gt;/login</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
