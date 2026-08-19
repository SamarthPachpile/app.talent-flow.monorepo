import React, { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Share2,
  Sparkles,
  Eye,
  UserCheck,
  Globe2,
  Layers,
  Award,
  Zap,
  HeartHandshake,
  Laptop,
  GraduationCap,
  Plane,
  Coins,
  Copy,
  Check,
  Mail,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { AppliedJob, AvailableJob, CandidateProfile, StageId } from "../../types/candidate";
import { AppliedResumeModal } from "../AppliedResumeModal";

interface JobDescriptionFullPageViewProps {
  job: AppliedJob | AvailableJob;
  candidate: CandidateProfile;
  sourceTab?: "search_jobs" | "my_applications";
  isApplied?: boolean;
  onApply?: (job: AvailableJob) => void;
  onBack: () => void;
  onNavigateToRoadmap?: (stageId?: StageId) => void;
}

export const JobDescriptionFullPageView: React.FC<JobDescriptionFullPageViewProps> = ({
  job,
  candidate,
  sourceTab = "my_applications",
  isApplied = false,
  onApply,
  onBack,
  onNavigateToRoadmap,
}) => {
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [appliedLocal, setAppliedLocal] = useState<boolean>(isApplied);

  // Derive job attributes safely
  const jobTitle = "jobTitle" in job ? job.jobTitle : job.title;
  const jobCode = "jobCode" in job ? job.jobCode : job.id;
  const appliedDate = "appliedDate" in job ? job.appliedDate : undefined;
  const status = "status" in job ? job.status : "Open Opening";
  const interviewDate = "interviewDate" in job ? job.interviewDate : "-";
  const recruiterNotes = "recruiterNotes" in job ? job.recruiterNotes : undefined;
  const employmentType =
    "employmentType" in job ? job.employmentType : "type" in job ? job.type : "Full-time";
  const salaryRange = job.salaryRange || "$130,000 - $165,000 / yr";
  const brandName =
    ("companyName" in job && job.companyName) || candidate.companyName || "Graviton IT Solutions";
  const department = job.department || "Platform Engineering";
  const location = job.location || "Remote";
  const country = job.country || "Global";
  const requirements = job.requirements || [];
  const skills = "skills" in job ? job.skills : [];

  const handleApplyClick = () => {
    if (onApply && !appliedLocal && !isApplied) {
      onApply(job as AvailableJob);
      setAppliedLocal(true);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const backLabel = sourceTab === "search_jobs" ? "Back to Open Positions" : "Back to Applications";

  const isActuallyApplied = appliedLocal || isApplied || Boolean(appliedDate);

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-slate-800 dark:text-slate-100 pb-12 max-w-7xl mx-auto">
      {/* 1. TOP BREADCRUMB & ACTION NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{backLabel}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>/</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{brandName}</span>
            <span>/</span>
            <span className="font-mono text-slate-500">{jobCode}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Share / Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Copy Job Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Copied Link!
                </span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Job</span>
              </>
            )}
          </button>

          {/* If applied: Resume and Roadmap triggers */}
          {isActuallyApplied ? (
            <>
              <button
                onClick={() => setShowResumeModal(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#ff5a1f]" />
                <span>View Resume</span>
              </button>

              {onNavigateToRoadmap && (
                <button
                  onClick={() =>
                    onNavigateToRoadmap("stageId" in job ? job.stageId : "application")
                  }
                  className="px-4 py-2 rounded-xl bg-[#ff5a1f] hover:bg-[#e04e18] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <span>Track Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : (
            onApply && (
              <button
                onClick={handleApplyClick}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* 2. HERO JOB BANNER CARD */}
      <div className="relative bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 overflow-hidden">
        {/* Subtle Decorative Gradient Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-4xl flex-1">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs ${
                  isActuallyApplied
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isActuallyApplied ? "bg-emerald-500 animate-pulse" : "bg-orange-500"}`}
                />
                {isActuallyApplied ? status || "Application Active" : "Accepting Applications"}
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
                <Layers className="w-3 h-3 text-slate-500" />
                <span>{department}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Globe2 className="w-3 h-3 text-sky-500" />
                <span>{location}</span>
              </span>

              {appliedDate && (
                <span className="text-xs text-slate-500 flex items-center gap-1 pl-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Applied on {appliedDate}</span>
                </span>
              )}
            </div>

            {/* Main Job Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {jobTitle}
              </h1>
            </div>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <Building2 className="w-4 h-4 text-orange-500" />
                <span>{brandName}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>
                  {location} {country ? `• ${country}` : ""}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{employmentType}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{salaryRange}</span>
              </div>
            </div>
          </div>

          {/* Right Action Box in Hero */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 pt-2 lg:pt-0">
            {isActuallyApplied ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 text-center sm:text-left min-w-[220px]">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Application Submitted</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Your profile and documents are in active review by {brandName} hiring team.
                </p>
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Submitted Resume</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-6 py-3 rounded-xl bg-[#ff5a1f] hover:bg-[#e04e18] text-white text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>Submit Application Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Item Quick Stats Metrics Banner */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-0.5">
              <Award className="w-3.5 h-3.5 text-orange-500" />
              <span>Experience Level</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              Mid - Senior (3-6 yrs)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Work Schedule</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              Flexible / Async Ready
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-0.5">
              <Coins className="w-3.5 h-3.5 text-emerald-500" />
              <span>Equity & Bonus</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              Stock Options + Annual Bonus
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-0.5">
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span>Security Clearance</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              Standard Background Verification
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: 2-COLUMN BALANCED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Description, Responsibilities, Requirements, Benefits (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Role Overview & Team Mission */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-3.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>About the Role & Mission</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                {job.description ||
                  `As a ${jobTitle} at ${brandName}, you will play a pivotal role in designing, building, and deploying mission-critical software solutions. You'll partner closely with cross-functional product designers, domain specialists, and fellow engineers to craft delightful user journeys and bulletproof scalable infrastructure.`}
              </p>
              <p>
                Our engineering culture champions high agency, autonomous problem-solving, and
                continuous learning. We value clean code, automated testing, and thoughtful system
                design over bureaucracy.
              </p>
            </div>
          </div>

          {/* Section 2: Key Responsibilities */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Key Responsibilities</span>
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Architect, code, and deploy resilient web services and responsive user interfaces with high performance and accessibility.",
                "Collaborate with product managers and UX teams to translate business requirements into technical execution plans and sprints.",
                "Champion code quality, automated test coverage, peer reviews, and continuous integration workflows.",
                "Proactively identify bottlenecks, optimize latency, and scale distributed database models and API endpoints.",
                "Mentor teammates, participate in architecture discussions, and contribute to shared design system token libraries.",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-normal">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Requirements & Qualifications */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff5a1f]" />
              <span>Qualifications & Requirements</span>
            </h2>
            <div className="space-y-2.5">
              {(requirements.length > 0
                ? requirements
                : [
                    "3+ years of professional full-stack or frontend development experience with TypeScript, React, and modern web frameworks.",
                    "Strong background in modular CSS architecture, responsive design patterns, and cross-browser optimization.",
                    "Experience integrating RESTful & GraphQL APIs, websockets, and relational/document databases (PostgreSQL, Firestore).",
                    "Familiarity with containerized workflows (Docker), automated CI/CD pipelines, and cloud hosting (AWS / GCP / Vercel).",
                    "Excellent problem-solving acumen, written communication skills, and an empathetic team-first approach.",
                  ]
              ).map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <div className="w-2 h-2 rounded-full bg-[#ff5a1f] mt-2 shrink-0" />
                  <span className="leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Tech Stack & Tools Matrix */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Technology Stack & Tools</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {(skills.length > 0
                ? skills
                : [
                    "TypeScript",
                    "React",
                    "Node.js",
                    "TailwindCSS",
                    "Next.js",
                    "PostgreSQL",
                    "Firebase",
                    "GraphQL",
                    "Docker",
                    "Git & GitHub Actions",
                    "Jest / Vitest",
                    "Figma",
                  ]
              ).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-colors shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Benefits & Perks Grid */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>Benefits, Growth & Perks</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                    Comprehensive Healthcare
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    100% premium coverage for medical, dental, vision, and mental wellness.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                    $2,500 Home Office Stipend
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Brand new Apple M-series hardware + monitor and ergonomic desk budget.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                    Learning & Conference Budget
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    $1,500 annual stipend for courses, books, certifications, and conferences.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                    Flexible PTO & Offsites
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Unlimited paid time off with mandatory minimums + biannual team retreats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Application Status Tracker, Submitted Documents & Hiring Partner (Col Span 1) */}
        <div className="space-y-6">
          {/* Card 1: Application Review Status / Roadmap */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Application Status Tracker</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Current Status</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isActuallyApplied ? status || "Under Review" : "Open for Applications"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Interview Session</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {interviewDate !== "-" ? interviewDate : "To Be Scheduled"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Requisition ID</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {jobCode}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Target Start Date</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {candidate.targetStartDate || "September 2026"}
                </span>
              </div>
            </div>

            {/* Recruiter Review Note if present */}
            {recruiterNotes && (
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Talent Partner Note</span>
                </div>
                <p className="text-xs text-sky-900 dark:text-sky-200 leading-normal">
                  {recruiterNotes}
                </p>
              </div>
            )}

            {isActuallyApplied && onNavigateToRoadmap && (
              <button
                onClick={() => onNavigateToRoadmap("stageId" in job ? job.stageId : "application")}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Track 7-Stage Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Card 2: Submitted Candidate Documents */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 space-y-3.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Application Documents</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-200 dark:border-rose-800 shrink-0">
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {candidate.name
                      ? `${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`
                      : "Candidate_Resume.pdf"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Verified Document • {appliedDate || "Active"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowResumeModal(true)}
                className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-orange-500" />
                <span>Preview Submitted Resume</span>
              </button>
            </div>
          </div>

          {/* Card 3: Hiring Team & Talent Contact */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 space-y-3.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Assigned Hiring Team</span>
            </h3>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                {candidate.recruiter?.name
                  ? candidate.recruiter.name.substring(0, 2).toUpperCase()
                  : "TA"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {candidate.recruiter?.name || "Talent Acquisition Lead"}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {candidate.recruiter?.role || "Senior Technical Recruiter"}
                </div>
              </div>
            </div>

            <a
              href={`mailto:${candidate.recruiter?.email || "recruitment@graviton.io"}?subject=Question regarding ${jobTitle} (${jobCode})`}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Recruiter</span>
            </a>
          </div>

          {/* Card 4: Security, EEO & Compliance Reassurance */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Employer</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {brandName} is an Equal Opportunity Employer. All candidate data is encrypted and
              processed in compliance with GDPR and ISO-27001 standards.
            </p>
          </div>
        </div>
      </div>

      {/* Applied Resume Document Modal */}
      <AppliedResumeModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        candidate={candidate}
        job={"jobTitle" in job ? (job as AppliedJob) : null}
      />
    </div>
  );
};
