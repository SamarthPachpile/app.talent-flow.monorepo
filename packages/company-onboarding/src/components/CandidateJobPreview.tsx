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
  Share2,
  Sparkles,
  Eye,
  UserCheck,
  Globe,
  Globe2,
  Layers,
  Award,
  Zap,
  HeartHandshake,
  Laptop,
  GraduationCap,
  Plane,
  Coins,
  Check,
  Mail,
  Shield,
  BadgeCheck,
  X,
} from "lucide-react";
import { toast } from "../lib/sweetalert";

export interface CandidateJobPreviewData {
  id?: string;
  jobCode?: string;
  title: string;
  companyName: string;
  department?: string;
  location?: string;
  country?: string;
  workplaceType?: string;
  employmentType?: string;
  experienceLevel?: string;
  salaryRange?: string;
  salaryMin?: number | string;
  salaryMax?: number | string;
  currency?: string;
  salaryPeriod?: string;
  openings?: number | string;
  priority?: string;
  status?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  benefits?: string[];
  hiringManager?: {
    name?: string;
    email?: string;
    designation?: string;
  };
  recruiterEmail?: string;
  applicationDeadline?: string;
  postedDate?: string;
}

interface CandidateJobPreviewProps {
  job: CandidateJobPreviewData;
  onBack?: () => void;
  isInModal?: boolean;
}

export const CandidateJobPreview: React.FC<CandidateJobPreviewProps> = ({
  job,
  onBack,
  isInModal = false,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const jobTitle = job.title || "Untitled Position";
  const jobCode = job.jobCode || job.id || "REQ-2026-001";
  const brandName = job.companyName || "Company Workspace";
  const department = job.department || "Engineering";
  const location = job.location || "San Francisco, CA";
  const country = job.country || "United States";
  const workplaceType = job.workplaceType || "Remote";
  const employmentType = job.employmentType || "Full-time";
  const experienceLevel = job.experienceLevel || "Senior";
  const status = job.status || "Active";
  const openings = job.openings || 1;

  // Format Salary Range
  const getFormattedSalary = (): string => {
    if (job.salaryRange && job.salaryRange.trim().length > 0) return job.salaryRange;
    if (!job.salaryMin && !job.salaryMax) return "₹18,00,000 - ₹26,00,000 / yr";
    const currSym =
      job.currency === "USD"
        ? "$"
        : job.currency === "EUR"
          ? "€"
          : job.currency === "GBP"
            ? "£"
            : "₹";
    const period = job.salaryPeriod ? ` / ${job.salaryPeriod}` : " / yr";
    if (job.salaryMin && job.salaryMax) {
      return `${currSym}${Number(job.salaryMin).toLocaleString("en-IN")} - ${currSym}${Number(job.salaryMax).toLocaleString("en-IN")}${period}`;
    }
    return `${currSym}${Number(job.salaryMin || job.salaryMax).toLocaleString("en-IN")}${period}`;
  };

  const salaryDisplay = getFormattedSalary();

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Job link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Fallback lists if empty
  const responsibilities =
    job.responsibilities && job.responsibilities.length > 0
      ? job.responsibilities
      : [
          "Architect, code, and deploy resilient web services and responsive user interfaces with high performance and accessibility.",
          "Collaborate with product managers and UX teams to translate business requirements into technical execution plans and sprints.",
          "Champion code quality, automated test coverage, peer reviews, and continuous integration workflows.",
          "Proactively identify bottlenecks, optimize latency, and scale distributed database models and API endpoints.",
          "Mentor teammates, participate in architecture discussions, and contribute to shared design system token libraries.",
        ];

  const requirements =
    job.requirements && job.requirements.length > 0
      ? job.requirements
      : [
          "3+ years of professional full-stack or frontend development experience with TypeScript, React, and modern web frameworks.",
          "Strong background in modular CSS architecture, responsive design patterns, and cross-browser optimization.",
          "Experience integrating RESTful & GraphQL APIs, websockets, and relational/document databases (PostgreSQL, Firestore).",
          "Familiarity with containerized workflows (Docker), automated CI/CD pipelines, and cloud hosting (AWS / GCP / Vercel).",
          "Excellent problem-solving acumen, written communication skills, and an empathetic team-first approach.",
        ];

  const skills =
    job.skills && job.skills.length > 0
      ? job.skills
      : [
          "React",
          "TypeScript",
          "Node.js",
          "Tailwind CSS",
          "PostgreSQL",
          "Next.js",
          "GraphQL",
          "Docker",
        ];

  const benefits =
    job.benefits && job.benefits.length > 0
      ? job.benefits
      : [
          "Full Health, Dental & Vision Insurance",
          "401(k) with 5% Employer Match",
          "Unlimited Paid Time Off (PTO)",
          "Remote Work Home Office Budget ($1,500)",
          "Annual Learning & Conference Stipend ($2,000)",
          "Parental Leave (16 Weeks Paid)",
        ];

  const hiringManagerName = job.hiringManager?.name || "Nil Yeager";
  const recruiterEmail =
    job.recruiterEmail || job.hiringManager?.email || "recruiting@talentflow.hub";

  return (
    <div
      className={`space-y-6 animate-fadeIn font-sans text-slate-800 dark:text-slate-100 ${isInModal ? "" : "max-w-7xl mx-auto pb-10"}`}
    >
      {/* 1. TOP BREADCRUMB & ACTION NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="group px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Job Studio</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>/</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{brandName}</span>
            <span>/</span>
            <span className="font-mono text-slate-500">{jobCode}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Candidate Preview Pill */}
          <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-900 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Candidate Portal Live View</span>
          </span>

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
                  status === "Active"
                    ? "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${status === "Active" ? "bg-orange-500 animate-pulse" : "bg-slate-400"}`}
                />
                {status === "Active" ? "Accepting Applications" : "Draft (Private Preview)"}
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
                <Layers className="w-3 h-3 text-slate-500" />
                <span>{department}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Globe2 className="w-3 h-3 text-sky-500" />
                <span>
                  {location} ({workplaceType})
                </span>
              </span>

              <span className="text-xs text-slate-500 flex items-center gap-1 pl-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{job.postedDate || "Posted Recently"}</span>
              </span>
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
                <span>{salaryDisplay}</span>
              </div>
            </div>
          </div>

          {/* Right Info Box in Hero for Company Preview (No Apply Button) */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 pt-2 lg:pt-0">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-left min-w-[230px]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Globe className="w-4 h-4 text-orange-500" />
                <span>Requisition Live View</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Live candidate portal presentation for{" "}
                <code className="font-mono text-orange-600 dark:text-orange-400 font-bold">
                  {jobCode}
                </code>
                .
              </p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">● {status}</span>
              </div>
            </div>
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
              {experienceLevel}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Work Flexibility</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              {workplaceType} Model
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-0.5">
              <Coins className="w-3.5 h-3.5 text-emerald-500" />
              <span>Compensation Band</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {salaryDisplay}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-0.5">
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span>Open Headcount</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              {openings} {openings === 1 ? "Position" : "Positions"}
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
              <p className="whitespace-pre-line">
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
              {responsibilities.map((item, idx) => (
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
              {requirements.map((req, idx) => (
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
              {skills.map((skill, idx) => (
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
              {benefits.map((b, idx) => {
                const isHealth =
                  b.toLowerCase().includes("health") || b.toLowerCase().includes("dental");
                const isEquipment =
                  b.toLowerCase().includes("budget") || b.toLowerCase().includes("office");
                const isLearn =
                  b.toLowerCase().includes("learn") || b.toLowerCase().includes("conference");
                const isPto = b.toLowerCase().includes("pto") || b.toLowerCase().includes("leave");

                const Icon = isHealth
                  ? HeartHandshake
                  : isEquipment
                    ? Laptop
                    : isLearn
                      ? GraduationCap
                      : isPto
                        ? Plane
                        : Award;

                const colorClass = isHealth
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  : isEquipment
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                    : isLearn
                      ? "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
                      : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400";

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-lg ${colorClass} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{b}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Provided standard for all members of the {department} department.
                      </p>
                    </div>
                  </div>
                );
              })}
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
                  {status === "Active" ? "Open for Applications" : "Draft Mode"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Interview Session</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Direct Screen</span>
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
                  {job.applicationDeadline || "Rolling Admissions"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 space-y-1">
              <div className="flex items-center gap-1.5 text-orange-800 dark:text-orange-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Enterprise Talent Flow</span>
              </div>
              <p className="text-xs text-orange-900 dark:text-orange-200 leading-normal">
                Candidates applying to this requisition will be routed through the 7-stage hiring
                pipeline.
              </p>
            </div>
          </div>

          {/* Card 2: Submitted Candidate Documents */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 space-y-3.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Candidate Submissions</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-200 dark:border-rose-800 shrink-0">
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Candidate_Resume.pdf
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    1-Click Auto Parsing Enabled
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                Applicants submit resumes that are automatically indexed into the candidates
                pipeline database.
              </div>
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
                {hiringManagerName.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {hiringManagerName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Hiring Manager • {department}
                </div>
              </div>
            </div>

            <a
              href={`mailto:${recruiterEmail}?subject=Inquiry regarding ${jobTitle} (${jobCode})`}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Hiring Team</span>
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
    </div>
  );
};
