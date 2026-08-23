import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ArrowRight,
  Check,
  Sparkles,
  RotateCcw,
  Laptop,
  TrendingUp,
  Globe2,
  ShieldCheck,
  X,
} from "lucide-react";
import { AvailableJob } from "../../types/candidate";
import { OPEN_POSITIONS_CATALOG } from "../../data/mockCandidateData";
import { toast } from "../../lib/sweetalert";

interface SearchJobsViewProps {
  availableJobs?: AvailableJob[];
  appliedJobIds?: string[];
  onApplyJob: (job: AvailableJob) => void;
  onGoToMyApplications: () => void;
  onSelectJobForFullPage: (job: AvailableJob) => void;
  brandName?: string;
}

export const SearchJobsView: React.FC<SearchJobsViewProps> = ({
  availableJobs = OPEN_POSITIONS_CATALOG,
  appliedJobIds = [],
  onApplyJob,
  onGoToMyApplications,
  onSelectJobForFullPage,
  brandName = "Graviton",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("All");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);

  // Departments list
  const departments = useMemo(() => {
    const set = new Set<string>();
    availableJobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return ["All", ...Array.from(set)];
  }, [availableJobs]);

  // Locations list
  const locations = useMemo(() => {
    const set = new Set<string>();
    availableJobs.forEach((j) => {
      if (j.location) {
        const city = j.location.split("(")[0].trim();
        set.add(city);
      }
    });
    return ["All", ...Array.from(set)];
  }, [availableJobs]);

  // Toggle work mode
  const toggleWorkMode = (mode: string) => {
    setSelectedWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode],
    );
  };

  // Filter Jobs reactively using the "Find Your Match" controls
  const filteredJobs = useMemo(() => {
    return availableJobs.filter((job) => {
      // 1. Search Query Match
      const query = searchTerm.trim().toLowerCase();
      const matchSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        (job.country && job.country.toLowerCase().includes(query)) ||
        (job.department && job.department.toLowerCase().includes(query)) ||
        (job.description && job.description.toLowerCase().includes(query)) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(query)));

      // 2. Experience Level Match
      const matchExp =
        selectedExperience === "All" ||
        (selectedExperience === "Entry" && job.experienceLevel === "Entry") ||
        (selectedExperience === "Mid" && job.experienceLevel === "Mid-level") ||
        (selectedExperience === "Senior" && job.experienceLevel === "Senior") ||
        (selectedExperience === "Lead" &&
          (job.experienceLevel === "Lead / Staff" || job.experienceLevel === "Executive"));

      // 3. Department Match
      const matchDept = selectedDepartment === "All" || job.department === selectedDepartment;

      // 4. Location Match
      const matchLocation =
        selectedLocation === "All" ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        (job.country && job.country.toLowerCase().includes(selectedLocation.toLowerCase()));

      // 5. Work Mode Match
      const matchWorkMode =
        selectedWorkModes.length === 0 ||
        selectedWorkModes.some((mode) => {
          if (mode === "Remote")
            return (
              job.type.toLowerCase().includes("remote") ||
              job.location.toLowerCase().includes("remote")
            );
          if (mode === "Hybrid")
            return (
              job.type.toLowerCase().includes("hybrid") ||
              job.location.toLowerCase().includes("hybrid")
            );
          if (mode === "On Site")
            return (
              !job.location.toLowerCase().includes("remote") &&
              !job.location.toLowerCase().includes("hybrid")
            );
          if (mode === "Freelance")
            return (
              job.type.toLowerCase().includes("contract") ||
              job.type.toLowerCase().includes("freelance")
            );
          return true;
        });

      return matchSearch && matchExp && matchDept && matchLocation && matchWorkMode;
    });
  }, [
    availableJobs,
    searchTerm,
    selectedExperience,
    selectedDepartment,
    selectedLocation,
    selectedWorkModes,
  ]);

  const handleApplyClick = (job: AvailableJob) => {
    onApplyJob(job);
    toast.success(`Application submitted for ${job.title}!`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedExperience("All");
    setSelectedDepartment("All");
    setSelectedLocation("All");
    setSelectedWorkModes([]);
  };

  const isFiltered =
    Boolean(searchTerm) ||
    selectedExperience !== "All" ||
    selectedDepartment !== "All" ||
    selectedLocation !== "All" ||
    selectedWorkModes.length > 0;

  return (
    <div className="space-y-8 animate-fadeIn font-sans text-slate-800 dark:text-slate-100 pb-12">
      {/* =========================================================================
          1. NEWEST POSTINGS SECTION (AT TOP - WITH CLIP-PATH-CARD)
         ========================================================================= */}
      <div className="clip-path-card bg-[#545C78] dark:bg-slate-900 p-6 sm:p-10 text-white shadow-md">
        <div className="grid lg:grid-cols-[360px_1fr] gap-8 lg:gap-10 items-start">
          {/* Left Sticky Intro Section */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#e6ea9c] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Opportunities</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-medium leading-tight">Newest Postings</h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-sm">
              Discover latest career opportunities in {brandName}. Join engineering, product, and AI
              squads building for global scale.
            </p>

            <button
              onClick={onGoToMyApplications}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#e6ea9c] hover:text-white hover:underline transition-all cursor-pointer pt-2"
            >
              <span>View your submitted applications ({appliedJobIds.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Postings Cards Grid (WITH CLIP-SERVICE) */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {availableJobs.slice(0, 4).map((job) => {
                const isApplied = appliedJobIds.includes(job.id);

                return (
                  <div
                    key={job.id}
                    className="clip-service group relative bg-[#5B6381] hover:bg-[#ff5f2e] dark:bg-slate-800 dark:hover:bg-[#ff5f2e] transition-all duration-300 p-6 sm:p-7 cursor-pointer text-white shadow-sm flex flex-col justify-between min-h-[190px]"
                    onClick={() => onSelectJobForFullPage(job)}
                  >
                    <div>
                      {/* Country / Location header */}
                      <div className="flex items-center justify-between text-xs text-white/80 mb-3 uppercase tracking-wider font-semibold">
                        <span>{job.country || job.location}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                          {job.type}
                        </span>
                      </div>

                      {/* Big Job Title */}
                      <h3 className="text-lg sm:text-xl font-medium leading-snug max-w-[85%] text-white group-hover:text-white">
                        {job.title}
                      </h3>
                    </div>

                    {/* Top Right Arrow Icon */}
                    <ArrowRight className="absolute top-6 right-6 w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1.5 transition-transform" />

                    {/* Bottom Details & Apply Button */}
                    <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-xs text-white/80 font-mono">
                        {job.salaryRange || "Competitive"}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isApplied) {
                            handleApplyClick(job);
                          } else {
                            onSelectJobForFullPage(job);
                          }
                        }}
                        className={`clip-path-button-sm px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          isApplied
                            ? "bg-emerald-500 text-white"
                            : "bg-white text-slate-900 group-hover:bg-slate-900 group-hover:text-white"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Applied ✓</span>
                          </>
                        ) : (
                          <>
                            <span>Quick Apply</span>
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. "FIND YOUR MATCH" SEARCH & FILTER (WITH CLIP-PATH-CARD)
         ========================================================================= */}
      <div className="clip-path-card bg-white dark:bg-slate-900 p-6 sm:p-10 relative border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
        {/* Top Right Results Count Badge */}
        <div className="sm:absolute top-8 right-8 mb-4 sm:mb-0 inline-flex items-center gap-1.5 bg-[#e6ea9c] text-slate-900 text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-slate-800" />
          <span>
            {filteredJobs.length} of {availableJobs.length} Open positions
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-[#1c1f2a] dark:text-white tracking-tight mb-2 sm:mb-3">
          Find your match
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg mb-6 sm:mb-8 max-w-2xl">
          Explore exciting career opportunities in {brandName}. Filter by keywords, role level,
          department, or work modes below.
        </p>

        {/* Search Input Bar */}
        <div className="relative mb-4 sm:mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Skills, Job title, or Keyword..."
            className="w-full bg-[#f1f2f4] dark:bg-slate-800 px-5 py-3.5 sm:py-4 pr-20 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800 dark:text-slate-100 placeholder-gray-400 shadow-2xs"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="clip-path-button-sm absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer px-2.5 py-1 bg-white dark:bg-slate-700"
            >
              Clear
            </button>
          ) : (
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {/* Experience Filter */}
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="px-4 py-3 sm:py-3.5 bg-[#f1f2f4] dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
          >
            <option value="All">Select Experience</option>
            <option value="Entry">Entry-Level (0-2 yrs)</option>
            <option value="Mid">Mid-Level (3-5 yrs)</option>
            <option value="Senior">Senior (5-8 yrs)</option>
            <option value="Lead">Lead / Principal (8+ yrs)</option>
          </select>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 sm:py-3.5 bg-[#f1f2f4] dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
          >
            <option value="All">Select Department</option>
            {departments
              .filter((d) => d !== "All")
              .map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 sm:py-3.5 bg-[#f1f2f4] dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
          >
            <option value="All">Select Location</option>
            {locations
              .filter((l) => l !== "All")
              .map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
          </select>
        </div>

        {/* Bottom Work Mode Checkboxes & Reset Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          {/* Work Mode Checkboxes */}
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            {["Freelance", "Remote", "Hybrid", "On Site"].map((mode) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedWorkModes.includes(mode)}
                  onChange={() => toggleWorkMode(mode)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 border-gray-300"
                />
                <span className="font-medium">{mode}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="clip-path-button-sm text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer px-3 py-1 bg-rose-50 dark:bg-rose-950/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <button
              onClick={() => {
                toast.info(`Showing ${filteredJobs.length} matching vacancies`);
              }}
              className="flex items-center gap-2 text-sm sm:text-base font-semibold text-black dark:text-white group cursor-pointer"
            >
              <span>Search jobs</span>
              <span className="text-orange-500 text-lg group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips Pill Row */}
        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
            <span className="text-slate-400 font-medium">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1f2f4] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full font-medium">
                Keyword: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedExperience !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1f2f4] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full font-medium">
                Exp: {selectedExperience}
                <button
                  onClick={() => setSelectedExperience("All")}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDepartment !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1f2f4] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full font-medium">
                Dept: {selectedDepartment}
                <button
                  onClick={() => setSelectedDepartment("All")}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedLocation !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1f2f4] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full font-medium">
                Loc: {selectedLocation}
                <button
                  onClick={() => setSelectedLocation("All")}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedWorkModes.map((mode) => (
              <span
                key={mode}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1f2f4] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full font-medium"
              >
                {mode}
                <button
                  onClick={() => toggleWorkMode(mode)}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          3. MATCHING JOBS GRID (WITH CLIP-SERVICE CORNERS)
         ========================================================================= */}
      {filteredJobs.length === 0 ? (
        <div className="clip-path-card bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No open positions match your search criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching with different keywords, removing work-mode restrictions, or resetting
              the department dropdown.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="clip-path-button-sm px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                onClick={() => onSelectJobForFullPage(job)}
                className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top metadata row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {job.department || "Engineering"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {job.postedDate || "Recently posted"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-500 transition-colors leading-snug">
                    {job.title}
                  </h3>

                  {/* Quick Meta Row */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {job.salaryRange}
                      </span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10.5px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-semibold self-center">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-orange-500 group-hover:underline flex items-center gap-1">
                    <span>Full Job Description</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isApplied) {
                        handleApplyClick(job);
                      } else {
                        onSelectJobForFullPage(job);
                      }
                    }}
                    className={`clip-path-button-sm px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                      isApplied
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Applied ✓</span>
                      </>
                    ) : (
                      <>
                        <span>Quick Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          4. COMPANY PERKS & CULTURE BANNER (WITH CLIP-PATH-CARD)
         ========================================================================= */}
      <div className="clip-path-card bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-10 text-white border border-slate-800 shadow-md space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Join {brandName}?</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Built for World-Class Builders & Innovators
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We provide our teams with the autonomy, premier hardware, and flexible environment to do
            the best work of their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="clip-service p-4 bg-white/5 border border-white/10 space-y-2">
            <Globe2 className="w-5 h-5 text-[#00c0ef]" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Global Remote First
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              Work from anywhere with a $3,000 home workstation stipend and flexible hours.
            </p>
          </div>

          <div className="clip-service p-4 bg-white/5 border border-white/10 space-y-2">
            <Laptop className="w-5 h-5 text-orange-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Top-Tier Gear</h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              Choose an Apple M3 Max MacBook Pro or Dell XPS 16 Developer Edition with 4K display.
            </p>
          </div>

          <div className="clip-service p-4 bg-white/5 border border-white/10 space-y-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Equity Ownership
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              Direct stock options grant and 401(k) matching with comprehensive healthcare.
            </p>
          </div>

          <div className="clip-service p-4 bg-white/5 border border-white/10 space-y-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Growth & Learning
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              £2,500 annual conference and education stipend to accelerate your career mastery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
