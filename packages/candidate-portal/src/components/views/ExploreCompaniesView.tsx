import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Globe2,
  TrendingUp,
  LayoutGrid,
  ListFilter,
  Users,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  DollarSign,
  ArrowLeft,
  Filter,
  Eye,
  Send,
  Zap,
} from "lucide-react";
import {
  CompanyApiService,
  CompanyDocument,
  JobApiService,
  formatSalaryRangeDisplay,
} from "@talent-flow/api";
import { AvailableJob } from "../../types/candidate";
import { OPEN_POSITIONS_CATALOG } from "../../data/mockCandidateData";
import { toast } from "../../lib/sweetalert";

interface ExploreCompaniesViewProps {
  onSelectCompanyForJobs: (company: CompanyDocument) => void;
  onSwitchCompanyContext?: (company: CompanyDocument) => void;
  activeCompany?: CompanyDocument | null;
  onApplyJob?: (job: AvailableJob) => void;
  appliedJobIds?: string[];
  onSelectJobForFullPage?: (job: AvailableJob) => void;
}

export const ExploreCompaniesView: React.FC<ExploreCompaniesViewProps> = ({
  onSelectCompanyForJobs,
  onSwitchCompanyContext,
  activeCompany,
  onApplyJob,
  appliedJobIds = [],
  onSelectJobForFullPage,
}) => {
  const [companies, setCompanies] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [companyJobsMap, setCompanyJobsMap] = useState<Record<string, AvailableJob[]>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"openings" | "name">("openings");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  // Expanded company ID for inline accordion job view
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);

  // Featured company ID for the Newest Postings section
  const [featuredCompanyId, setFeaturedCompanyId] = useState<string | null>(null);

  // Spotlight Company View (when candidate wants to focus solely on one company)
  const [spotlightCompany, setSpotlightCompany] = useState<CompanyDocument | null>(null);
  const [spotlightJobSearch, setSpotlightJobSearch] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

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

  // Fetch / Generate company-specific jobs for each company
  useEffect(() => {
    if (companies.length === 0) return;

    companies.forEach((comp) => {
      const cId = comp.id || comp.subdomain || comp.name;
      if (cId) {
        JobApiService.getCompanyJobs(cId, comp.name, comp.subdomain)
          .then((remoteJobs) => {
            let mappedJobs: AvailableJob[] = [];
            if (Array.isArray(remoteJobs) && remoteJobs.length > 0) {
              mappedJobs = remoteJobs.map((j) => ({
                id: j.id,
                title: j.title,
                department: j.department || "Engineering",
                location: j.location || comp.headquarters || "Remote",
                country: j.country || "United States",
                type: (j.employmentType as AvailableJob["type"]) || "Full-time",
                experienceLevel: (j.experienceLevel as AvailableJob["experienceLevel"]) || "Senior",
                salaryRange: j.salaryRange || "$130k - $175k",
                postedDate: j.postedDate || "Recently posted",
                description:
                  j.description || `Exciting engineering career opportunity at ${comp.name}.`,
                requirements: j.requirements || [
                  "3+ years industry experience",
                  "Proven problem-solving skills",
                ],
                benefits: j.benefits || [
                  "Comprehensive Health & Dental",
                  "Remote Work Stipend",
                  "401(k) Matching",
                ],
                skills: j.skills || ["React", "TypeScript", "Node.js", "Cloud Architecture"],
                companyName: comp.name,
                companyId: cId,
              }));
            } else {
              // Fallback / generate dedicated contextual jobs for this employer
              const compSeed = comp.name.toLowerCase();
              mappedJobs = OPEN_POSITIONS_CATALOG.slice(0, 4).map((catalogJob, idx) => ({
                ...catalogJob,
                id: `${cId}-job-${idx + 1}`,
                companyName: comp.name,
                companyId: cId,
                location: idx % 2 === 0 ? comp.headquarters || "Remote" : "Global Remote",
              }));
            }

            setCompanyJobsMap((prev) => ({
              ...prev,
              [comp.id]: mappedJobs,
            }));
          })
          .catch(() => {
            // Fallback default jobs on network error
            const mappedJobs = OPEN_POSITIONS_CATALOG.slice(0, 3).map((catalogJob, idx) => ({
              ...catalogJob,
              id: `${cId}-job-${idx + 1}`,
              companyName: comp.name,
              companyId: cId,
              location: comp.headquarters || "Remote",
            }));
            setCompanyJobsMap((prev) => ({
              ...prev,
              [comp.id]: mappedJobs,
            }));
          });
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
    } else if (sortBy === "openings") {
      result = [...result].sort((a, b) => {
        const countA = companyJobsMap[a.id]?.length || 0;
        const countB = companyJobsMap[b.id]?.length || 0;
        return countB - countA;
      });
    }

    return result;
  }, [companies, searchQuery, selectedIndustry, sortBy, companyJobsMap]);

  const totalJobsAcrossCompanies = useMemo(() => {
    return Object.values(companyJobsMap).reduce((acc, curr) => acc + curr.length, 0);
  }, [companyJobsMap]);

  const currentFeaturedCompany = useMemo(() => {
    if (featuredCompanyId) {
      const found = companies.find((c) => c.id === featuredCompanyId);
      if (found) return found;
    }
    if (activeCompany) {
      const found = companies.find(
        (c) =>
          c.id === activeCompany.id ||
          c.subdomain === activeCompany.subdomain ||
          c.name === activeCompany.name,
      );
      if (found) return found;
    }
    return companies[0] || null;
  }, [companies, featuredCompanyId, activeCompany]);

  const newestJobsForFeaturedCompany = useMemo(() => {
    if (!currentFeaturedCompany) return [];
    const jobs = companyJobsMap[currentFeaturedCompany.id] || [];
    return jobs.slice(0, 4);
  }, [currentFeaturedCompany, companyJobsMap]);

  const getSlug = (c: CompanyDocument) => {
    const raw = c.subdomain || c.id || c.name || "";
    return raw
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
  };

  const handleApplyClick = (job: AvailableJob, company: CompanyDocument) => {
    if (onApplyJob) {
      onApplyJob({ ...job, companyName: company.name, companyId: company.id });
      toast.success(`Application successfully submitted to ${company.name} for "${job.title}"!`);
    } else {
      toast.success(`Application submitted to ${company.name}!`);
    }
  };

  const isFiltered = Boolean(searchQuery) || selectedIndustry !== "All";

  // =========================================================================
  // 1. SPOTLIGHT VIEW: FOCUSED COMPANY DEEP DIVE WITH COMPANY-SPECIFIC JOBS
  // =========================================================================
  if (spotlightCompany) {
    const compJobs = companyJobsMap[spotlightCompany.id] || [];
    const filteredCompJobs = compJobs.filter((j) => {
      const q = spotlightJobSearch.toLowerCase().trim();
      return (
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills?.some((s) => s.toLowerCase().includes(q))
      );
    });

    const hasError = imgErrorMap[spotlightCompany.id];
    const brandColor = spotlightCompany.brandColor || "#ff5f2e";

    return (
      <div className="space-y-6 animate-fadeIn font-sans pb-12">
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setSpotlightCompany(null);
              setSpotlightJobSearch("");
            }}
            className="clip-path-button-sm inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-ember text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-ember" />
            <span>Back to All Companies</span>
          </button>

          <div className="inline-flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Explore Companies</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {spotlightCompany.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-ember/10 text-ember font-semibold font-mono text-[10.5px]">
              {compJobs.length} Open Roles
            </span>
          </div>
        </div>

        {/* Company Header Hero Card (with .clip-path-card) */}
        <div className="clip-path-card bg-[#545C78] dark:bg-slate-900 p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              {spotlightCompany.logoUrl && !hasError ? (
                <img
                  src={spotlightCompany.logoUrl}
                  alt={spotlightCompany.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white p-2 border-2 border-white/20 shadow-md shrink-0"
                  onError={() =>
                    setImgErrorMap((prev) => ({ ...prev, [spotlightCompany.id]: true }))
                  }
                />
              ) : (
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-white flex items-center justify-center font-bold text-2xl uppercase tracking-wider shadow-md shrink-0 border-2 border-white/20"
                  style={{ backgroundColor: brandColor }}
                >
                  {(spotlightCompany.name || "TF").substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                    {spotlightCompany.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Employer</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs text-slate-200">
                  {spotlightCompany.industry && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md font-semibold">
                      {spotlightCompany.industry}
                    </span>
                  )}
                  {spotlightCompany.headquarters && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      <span>{spotlightCompany.headquarters}</span>
                    </span>
                  )}
                  <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-[11px] text-[#e6ea9c]">
                    /{spotlightCompany.subdomain || getSlug(spotlightCompany)}/
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed pt-1">
                  {spotlightCompany.about ||
                    `${spotlightCompany.name} is a high-growth technology enterprise partner offering innovative careers and seamless digital candidate onboarding.`}
                </p>
              </div>
            </div>

            {/* Right Action: Search Jobs Hub Link */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onSelectCompanyForJobs(spotlightCompany)}
                className="clip-path-button-sm bg-ember hover:bg-ember/90 text-white px-5 py-2.5 text-xs font-bold shadow-lifted transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Open in Jobs Search Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Company-Specific Openings Notice Banner (Clarifies company exclusivity) */}
        <div className="clip-service bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-800 dark:text-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ember text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold leading-tight text-slate-900 dark:text-white">
                Active Openings Exclusively at {spotlightCompany.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Every position listed below belongs directly to {spotlightCompany.name}'s talent
                pipeline. Applications route securely to their hiring managers.
              </p>
            </div>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={spotlightJobSearch}
              onChange={(e) => setSpotlightJobSearch(e.target.value)}
              placeholder={`Filter ${spotlightCompany.name} jobs...`}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ember/50 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Company Jobs Grid (with .clip-service cards) */}
        {filteredCompJobs.length === 0 ? (
          <div className="clip-path-card bg-white dark:bg-slate-850 p-10 text-center space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 mx-auto rounded-full bg-orange-100 dark:bg-orange-950 text-ember flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No matching positions at {spotlightCompany.name}
            </h3>
            <p className="text-xs text-slate-500">
              Try modifying your search keywords or clear the filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);

              return (
                <div
                  key={job.id}
                  className="clip-service bg-white dark:bg-slate-850 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer border border-slate-200/80 dark:border-slate-800"
                  onClick={() => onSelectJobForFullPage && onSelectJobForFullPage(job)}
                >
                  <div className="space-y-3">
                    {/* Header tags: Company specific badge & department */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-orange-50 dark:bg-orange-950/60 text-ember border border-orange-200 dark:border-orange-800/80 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{spotlightCompany.name}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        {job.department}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-ember transition-colors leading-snug">
                      {job.title}
                    </h3>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatSalaryRangeDisplay(job.salaryRange)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill Pills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">{job.postedDate}</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isApplied) {
                          handleApplyClick(job, spotlightCompany);
                        } else if (onSelectJobForFullPage) {
                          onSelectJobForFullPage(job);
                        }
                      }}
                      className={`clip-path-button-sm px-4 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        isApplied
                          ? "bg-emerald-500 text-white"
                          : "bg-ember text-white hover:bg-ember/90 hover:-translate-y-0.5"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied ✓</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. MAIN COMPANIES DIRECTORY VIEW
  // =========================================================================
  return (
    <div className="space-y-8 animate-fadeIn font-sans text-slate-800 dark:text-slate-100 pb-12">
      {/* 1. TOP HERO SECTION: NEWEST POSTINGS BY COMPANY (WITH .clip-path-card) */}
      <div className="clip-path-card bg-[#545C78] dark:bg-slate-900 p-6 sm:p-10 text-white shadow-md">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-10 items-start">
          {/* Left Sticky Intro & Company Switcher Section */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#e6ea9c] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Newest Postings</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-medium leading-tight tracking-tight text-white">
              Newest Postings
            </h2>

            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-sm">
              Discover the latest active opportunities posted by{" "}
              <span className="font-bold text-[#e6ea9c]">
                {currentFeaturedCompany?.name || "our hiring partners"}
              </span>
              . Select a company to view their freshest vacancies or apply directly below.
            </p>

            {/* Quick Company Switcher Tabs */}
            {companies.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-white/70 uppercase tracking-wider font-semibold">
                  Select Company:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {companies.slice(0, 8).map((c) => {
                    const isSelected = currentFeaturedCompany?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFeaturedCompanyId(c.id)}
                        className={`clip-path-button-sm px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer truncate max-w-[140px] ${
                          isSelected
                            ? "bg-[#e6ea9c] text-slate-900 shadow-xs font-bold"
                            : "bg-white/10 hover:bg-white/20 text-white/90"
                        }`}
                        title={c.name}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentFeaturedCompany && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setSpotlightCompany(currentFeaturedCompany)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e6ea9c] hover:underline cursor-pointer"
                >
                  <span>
                    View all {companyJobsMap[currentFeaturedCompany.id]?.length || 0} openings at{" "}
                    {currentFeaturedCompany.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-3 text-xs font-semibold text-white/70">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Apply</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Instant Routing</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Featured Company Newest Job Cards (WITH .clip-service) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/80 pb-1">
              <span className="font-semibold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#e6ea9c]" />
                <span>
                  Latest Openings at {currentFeaturedCompany?.name || "Selected Employer"} (
                  {newestJobsForFeaturedCompany.length})
                </span>
              </span>
              {currentFeaturedCompany?.headquarters && (
                <span className="text-[11px] text-white/70 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#e6ea9c]" />
                  <span>{currentFeaturedCompany.headquarters}</span>
                </span>
              )}
            </div>

            {newestJobsForFeaturedCompany.length === 0 ? (
              <div className="clip-service bg-[#5B6381] p-8 text-center text-white/80 space-y-2">
                <p className="text-sm font-semibold">
                  No recent postings available for this employer.
                </p>
                <p className="text-xs text-white/60">
                  Choose another company from the list to view their newest postings.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {newestJobsForFeaturedCompany.map((job) => {
                  const isApplied = appliedJobIds.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="clip-service bg-[#5B6381] hover:bg-[#ff5f2e] dark:bg-slate-800 dark:hover:bg-[#ff5f2e] transition-all duration-300 p-5 cursor-pointer text-white shadow-sm flex flex-col justify-between min-h-[160px] group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-1 text-[11px]">
                          <span className="font-semibold px-2 py-0.5 rounded bg-white/15 group-hover:bg-white group-hover:text-[#ff5f2e] text-white transition-colors">
                            {job.department}
                          </span>
                          <span className="text-white/80 group-hover:text-white">{job.type}</span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-white leading-snug line-clamp-1">
                          {job.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-white/80 group-hover:text-white flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#e6ea9c] group-hover:text-white" />
                            <span>{job.location}</span>
                          </span>
                          <span>·</span>
                          <span className="font-bold text-[#e6ea9c] group-hover:text-white">
                            {formatSalaryRangeDisplay(job.salaryRange)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 group-hover:border-white/20 flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectJobForFullPage) onSelectJobForFullPage(job);
                          }}
                          className="text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentFeaturedCompany) {
                              handleApplyClick(job, currentFeaturedCompany);
                            }
                          }}
                          className={`clip-path-button-sm px-3.5 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isApplied
                              ? "bg-emerald-500 text-white"
                              : "bg-white text-slate-900 group-hover:bg-white group-hover:text-slate-900 shadow-xs hover:bg-[#e6ea9c]"
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Applied ✓</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3" />
                              <span>Quick Apply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CARD (WITH .clip-path-card) */}
      <div className="clip-path-card bg-white dark:bg-slate-900 p-6 sm:p-10 relative border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
        {/* Top Right Results Count Badge */}
        <div className="sm:absolute top-8 right-8 mb-4 sm:mb-0 inline-flex items-center gap-1.5 bg-[#e6ea9c] text-slate-900 text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-slate-800" />
          <span>
            {filteredCompanies.length} of {companies.length} Companies Available
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-medium text-[#1c1f2a] dark:text-white tracking-tight mb-2 sm:mb-3">
          Find your target employer
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg mb-6 sm:mb-8 max-w-2xl">
          Search by company name, location, or industry. Click any employer card to expand their
          active job openings.
        </p>

        {/* Search Input Bar */}
        <div className="relative mb-4 sm:mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies by name, industry, headquarters, or tech domain..."
            className="w-full bg-[#f1f2f4] dark:bg-slate-800 px-5 py-3.5 sm:py-4 pr-20 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800 dark:text-slate-100 placeholder-gray-400 shadow-2xs"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="clip-path-button-sm absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer px-2.5 py-1 bg-white dark:bg-slate-700"
            >
              Clear
            </button>
          ) : (
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          )}
        </div>

        {/* Industry Pill Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
            <span className="text-xs text-slate-400 font-medium pr-1 shrink-0">Industry:</span>
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`clip-path-button-sm px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedIndustry === ind
                    ? "bg-ember text-white shadow-xs"
                    : "bg-[#f1f2f4] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isFiltered && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustry("All");
                }}
                className="clip-path-button-sm text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer px-3 py-1 bg-rose-50 dark:bg-rose-950/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Sort Controls */}
            <div className="flex items-center bg-[#f1f2f4] dark:bg-slate-800 rounded-xl p-1 text-xs border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setSortBy("openings")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sortBy === "openings"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Most Jobs
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sortBy === "name"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                A-Z
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPANIES LIST & INTERACTIVE INLINE JOBS EXPANSION */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="clip-service bg-white dark:bg-slate-850 p-6 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4 min-h-[220px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                </div>
              </div>
              <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="clip-path-card bg-white dark:bg-slate-850 p-12 text-center space-y-4 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 text-ember flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No companies match your filters
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your keyword query or resetting industry filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedIndustry("All");
            }}
            className="clip-path-button-sm inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {filteredCompanies.map((comp) => {
            const hasError = imgErrorMap[comp.id];
            const brandColor = comp.brandColor || "#ff5f2e";
            const compJobs = companyJobsMap[comp.id] || [];
            const isExpanded = expandedCompanyId === comp.id;
            const isActiveContext =
              activeCompany?.id === comp.id ||
              activeCompany?.subdomain === comp.subdomain ||
              activeCompany?.name === comp.name;

            return (
              <div
                key={comp.id}
                className={`clip-service bg-white dark:bg-slate-850 border transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                  isExpanded
                    ? "md:col-span-2 lg:col-span-3 border-ember ring-2 ring-ember/20"
                    : "border-slate-200/90 dark:border-slate-800"
                } ${isActiveContext ? "ring-1 ring-ember/50" : ""}`}
              >
                {/* Current Active Workspace Indicator */}
                {isActiveContext && (
                  <div className="bg-ember text-white text-[10px] font-bold px-3 py-1 text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Your Current Active Workspace</span>
                  </div>
                )}

                {/* Company Card Body */}
                <div className="p-6 space-y-4">
                  {/* Header: Logo, Name & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {comp.logoUrl && !hasError ? (
                        <img
                          src={comp.logoUrl}
                          alt={comp.name}
                          className="w-12 h-12 rounded-xl object-contain border border-slate-100 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-800 shrink-0"
                          onError={() => setImgErrorMap((prev) => ({ ...prev, [comp.id]: true }))}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-sm uppercase tracking-wider shrink-0 shadow-xs"
                          style={{ backgroundColor: brandColor }}
                        >
                          {(comp.name || "TF").substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-ember transition-colors">
                          {comp.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                          {comp.industry && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                              {comp.industry}
                            </span>
                          )}
                          {comp.headquarters && (
                            <span className="flex items-center gap-1 truncate text-[11px]">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{comp.headquarters}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                      /{comp.subdomain || getSlug(comp)}/
                    </span>
                  </div>

                  {/* About excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {comp.about ||
                      `${comp.name} provides enterprise solutions with active candidate hiring roadmaps and global career growth.`}
                  </p>

                  {/* Open Jobs Live Count Pill */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {compJobs.length > 0
                          ? `${compJobs.length} Open Roles at ${comp.name}`
                          : "Actively Hiring"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSpotlightCompany(comp)}
                      className="text-xs font-bold text-ember hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Company Spotlight</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE INLINE COMPANY JOBS ACCORDION DRAWER */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-5 sm:p-6 space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-ember" />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            Available Openings at {comp.name} ({compJobs.length})
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Click Quick Apply to submit your candidate record to {comp.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {compJobs.map((job) => {
                          const isApplied = appliedJobIds.includes(job.id);

                          return (
                            <div
                              key={job.id}
                              className="clip-service bg-white dark:bg-slate-850 p-4 shadow-2xs border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-1 text-[10.5px]">
                                  <span className="font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">
                                    {job.department}
                                  </span>
                                  <span className="text-slate-400">{job.type}</span>
                                </div>
                                <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                                  {job.title}
                                </h5>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{job.location}</span>
                                  <span>·</span>
                                  <span className="text-emerald-600 font-semibold">
                                    {formatSalaryRangeDisplay(job.salaryRange)}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSelectJobForFullPage && onSelectJobForFullPage(job)
                                  }
                                  className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-ember flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Job Details</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleApplyClick(job, comp)}
                                  className={`clip-path-button-sm px-3 py-1 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                    isApplied
                                      ? "bg-emerald-500 text-white"
                                      : "bg-ember text-white hover:bg-ember/90 shadow-2xs"
                                  }`}
                                >
                                  {isApplied ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>Applied ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-3 h-3" />
                                      <span>Quick Apply</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Action Bar */}
                <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedCompanyId(comp.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`clip-path-button-sm inline-flex items-center justify-center gap-1 py-2 px-2.5 text-xs font-bold shadow-2xs transition-all cursor-pointer ${
                      currentFeaturedCompany?.id === comp.id
                        ? "bg-[#e6ea9c] text-slate-900 font-bold"
                        : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-ember border border-slate-200 dark:border-slate-600"
                    }`}
                    title={`View ${comp.name} Newest Postings at Top`}
                  >
                    <Sparkles className="w-3 h-3 text-ember" />
                    <span>Newest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedCompanyId(isExpanded ? null : comp.id)}
                    className="clip-path-button-sm flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 hover:border-ember hover:text-ember text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-ember" />
                    <span>{isExpanded ? "Collapse Jobs" : `View Jobs (${compJobs.length})`}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpotlightCompany(comp)}
                    className="clip-path-button-sm inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-ember hover:bg-ember/90 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer transform hover:-translate-y-0.5"
                    title={`Explore ${comp.name} Jobs`}
                  >
                    <span>Spotlight</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
