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
  Download,
  Share2,
  Sparkles,
  Eye,
  UserCheck,
  Check,
} from "lucide-react";
import { AppliedJob, AvailableJob, CandidateProfile, StageId } from "../../types/candidate";
import { AppliedResumeModal } from "../AppliedResumeModal";
import { toast } from "sonner";

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

  // Derive job attributes safely
  const jobTitle = "jobTitle" in job ? job.jobTitle : job.title;
  const jobCode = "jobCode" in job ? job.jobCode : job.id;
  const appliedDate = "appliedDate" in job ? job.appliedDate : undefined;
  const status = "status" in job ? job.status : "Open Opening";
  const interviewDate = "interviewDate" in job ? job.interviewDate : "-";
  const recruiterNotes = "recruiterNotes" in job ? job.recruiterNotes : undefined;
  const employmentType =
    "employmentType" in job ? job.employmentType : "type" in job ? job.type : "Full-time";
  const salaryRange = job.salaryRange || "Competitive Market Rate";
  const brandName =
    ("companyName" in job && job.companyName) || candidate.companyName || "Graviton";
  const requirements = job.requirements || [];
  const skills = "skills" in job ? job.skills : [];

  const handleApplyClick = () => {
    if (onApply && !isApplied) {
      onApply(job as AvailableJob);
      toast.success(`Application submitted for ${jobTitle}!`);
    }
  };

  const backLabel = sourceTab === "search_jobs" ? "Back to Search Jobs" : "Back to My Applications";

  return (
    <div className="space-y-4 animate-fadeIn font-sans text-slate-800 dark:text-slate-100 pb-10">
      {/* 1. TOP BREADCRUMB & BACK ACTION BAR (WITH CLIP-SERVICE) */}
      <div className="clip-service flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="clip-path-button-sm px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>/</span>
            <span className="font-mono text-slate-500">{jobCode}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Job application link copied to clipboard");
              }
            }}
            className="clip-path-button-sm p-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer text-xs"
            title="Share Application Link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* If applied, show View Applied Resume */}
          {(isApplied || appliedDate) && (
            <button
              onClick={() => setShowResumeModal(true)}
              className="clip-path-button-sm px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#00c0ef]" />
              <span>View Applied Resume</span>
            </button>
          )}

          {/* If not applied, show Submit Application */}
          {!isApplied && !appliedDate && onApply && (
            <button
              onClick={handleApplyClick}
              className="clip-path-button-sm px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Quick Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Onboarding Roadmap link */}
          {(isApplied || appliedDate) && onNavigateToRoadmap && (
            <button
              onClick={() => onNavigateToRoadmap("stageId" in job ? job.stageId : "application")}
              className="clip-path-button-sm px-3.5 py-1.5 bg-[#00c0ef] hover:bg-[#00abdc] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Track Stage Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. HERO JOB BANNER (WITH CLIP-PATH-CARD) */}
      <div className="clip-path-card bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-6 sm:p-7 relative overflow-hidden">
        {/* Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00c0ef]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold shadow-2xs ${
                  isApplied || appliedDate ? "bg-[#28a745] text-white" : "bg-orange-500 text-white"
                }`}
              >
                {isApplied || appliedDate ? status || "Active Application" : "Open Vacancy"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {job.department || "Engineering"}
              </span>
              {appliedDate && (
                <span className="text-xs text-slate-400">• Applied on {appliedDate}</span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {jobTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {brandName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {job.location} {job.country ? `• ${job.country}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{employmentType || "Full-time"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {salaryRange}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            {isApplied || appliedDate ? (
              <button
                onClick={() => setShowResumeModal(true)}
                className="clip-path-button-sm px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4 text-[#00c0ef]" />
                <span>View Applied Resume</span>
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                className="clip-path-button-sm px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (2-COLUMN GRID WITH CLIP-SERVICE CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Job Description & Details (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Position Overview Card */}
          <div className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00c0ef]" />
              <span>Position Overview</span>
            </h2>
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
              {job.description ||
                `As a ${jobTitle} at ${brandName}, you will collaborate closely with cross-functional product, engineering, and design teams to build scalable software solutions. You'll drive architecture decisions, ship high-impact features, and contribute to our high-performance engineering culture.`}
            </p>
          </div>

          {/* Key Responsibilities Card */}
          <div className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Key Responsibilities</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {[
                `Design, develop, and maintain clean, testable, and efficient code for high-throughput enterprise systems.`,
                `Collaborate with product managers, UX designers, and stakeholders to define intuitive software experiences.`,
                `Optimize application performance, front-end rendering speed, and backend query efficiency.`,
                `Conduct code reviews, mentor junior peers, and establish engineering best practices across the team.`,
                `Participate in agile sprint planning, architectural design sessions, and CI/CD automated deployments.`,
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="leading-normal">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements & Competencies Card */}
          <div className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00c0ef]" />
              <span>Requirements & Qualifications</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {(requirements.length > 0
                ? requirements
                : [
                    "3+ years of professional software engineering experience in modern JavaScript / TypeScript environments.",
                    "Demonstrated mastery of React, state management, component lifecycles, and modern CSS architecture.",
                    "Familiarity with RESTful APIs, GraphQL endpoints, and cloud infrastructures (AWS/GCP/Azure).",
                    "Strong problem-solving ability, clear written and verbal communication, and dedication to team success.",
                    "Bachelor's degree in Computer Science or equivalent practical industry experience.",
                  ]
              ).map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c0ef] mt-1.5 shrink-0" />
                  <span className="leading-normal">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills & Tech Stack Tags */}
          <div className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Core Skills & Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {(skills.length > 0
                ? skills
                : [
                    "TypeScript",
                    "React",
                    "Node.js",
                    "TailwindCSS",
                    "GraphQL",
                    "PostgreSQL",
                    "Docker",
                    "Git & GitHub Actions",
                    "Automated Testing",
                    "Microservices",
                  ]
              ).map((skill, idx) => (
                <span
                  key={idx}
                  className="clip-path-button-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Application Meta & Documents */}
        <div className="space-y-4">
          {/* Applied Resume Card (Only for applied jobs) */}
          {isApplied || appliedDate ? (
            <div className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#00c0ef]" />
                <span>Applied Resume</span>
              </h3>

              <div className="clip-service p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {candidate.name
                        ? `${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`
                        : "Alex_Rivera_Resume.pdf"}
                    </div>
                    <div className="text-[10.5px] text-slate-400">
                      248 KB • Submitted on {appliedDate || "14 Aug 2026"}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <button
                    onClick={() => setShowResumeModal(true)}
                    className="clip-path-button-sm flex-1 py-1.5 px-2 bg-[#00c0ef] hover:bg-[#00abdc] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Applied Resume</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                <span>Ready to Apply?</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                Your verified candidate profile and resume ({candidate.name}) will be submitted
                directly to the hiring team.
              </p>
              <button
                onClick={handleApplyClick}
                className="clip-path-button-sm w-full py-2.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Application Status & Recruiter Review Card */}
          <div className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 sm:p-5 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Application Status</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Current Review Stage:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isApplied || appliedDate
                    ? status || "Active Application"
                    : "Open for Applications"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Interview Schedule:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {interviewDate !== "-" ? interviewDate : "To Be Scheduled"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Requisition ID:</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {jobCode}
                </span>
              </div>
            </div>

            {/* Recruiter Notes */}
            {recruiterNotes && (
              <div className="clip-service p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 font-semibold text-[11px] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Talent Acquisition Note</span>
                </div>
                <p className="text-[11px] text-sky-900 dark:text-sky-200 leading-normal">
                  {recruiterNotes}
                </p>
              </div>
            )}

            {(isApplied || appliedDate) && onNavigateToRoadmap && (
              <button
                onClick={() => onNavigateToRoadmap("stageId" in job ? job.stageId : "application")}
                className="clip-path-button-sm w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Track 7-Stage Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
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
