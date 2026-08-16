import React from "react";
import {
  X,
  FileText,
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { CandidateProfile, AppliedJob } from "../types/candidate";
import { toast } from "sonner";

interface AppliedResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  job?: AppliedJob | null;
}

export const AppliedResumeModal: React.FC<AppliedResumeModalProps> = ({
  isOpen,
  onClose,
  candidate,
  job,
}) => {
  if (!isOpen) return null;

  const candidateName = candidate.name || "Alex Rivera";
  const roleTitle = candidate.roleTitle || job?.jobTitle || "Senior Full Stack Engineer";
  const email = candidate.email || "alex.rivera@example.com";
  const phone = candidate.phone || "+1 (555) 234-5678";
  const location = candidate.location || job?.location || "San Francisco, CA";

  const handleDownload = () => {
    toast.success(`Downloading ${candidateName.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="clip-path-card bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00c0ef]/10 text-[#00c0ef] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">
                Applied Resume Preview
              </h3>
              <p className="text-[11px] text-slate-500">
                Attached to application for:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {job?.jobTitle || "Applied Role"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="clip-path-button-sm p-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Print Resume"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="clip-path-button-sm px-3 py-1.5 bg-[#00c0ef] hover:bg-[#00abdc] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="clip-path-button-sm p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Resume Sheet Content */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#fbfcfd] dark:bg-slate-900"
        >
          {/* Resume Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {candidateName}
            </h1>
            <p className="text-sm font-semibold text-[#00c0ef] mt-0.5">{roleTitle}</p>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mt-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {location}
              </span>
              <span className="flex items-center gap-1 text-[#00c0ef]">
                <Globe className="w-3.5 h-3.5" />
                alexrivera.dev
              </span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Seasoned software engineer with 6+ years of experience crafting enterprise web
              applications, high-throughput microservices, and reactive user interfaces. Passionate
              about developer tooling, scalable front-end architectures, and clean design system
              implementations.
            </p>
          </div>

          {/* Core Competencies & Technical Skills */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Core Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {[
                "TypeScript",
                "React 19",
                "Next.js",
                "Node.js",
                "GraphQL",
                "TailwindCSS",
                "PostgreSQL",
                "Redis",
                "Docker",
                "Kubernetes",
                "CI/CD Pipelines",
                "Jest & Vitest",
                "System Architecture",
                "Web Performance Optimization",
              ].map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>Work Experience</span>
            </h2>

            <div className="space-y-4">
              <div className="relative pl-4 border-l-2 border-[#00c0ef]/40 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Senior Frontend Engineer • Apex Software Systems
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">2023 - Present</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                  • Spearheaded migration of legacy portals to React & TypeScript, boosting page
                  rendering speed by 42%.
                  <br />
                  • Mentored a team of 5 junior engineers in code review practices, testing
                  standards, and accessibility compliance.
                  <br />• Architected a unified multi-tenant design system deployed across 8
                  internal micro-frontends.
                </p>
              </div>

              <div className="relative pl-4 border-l-2 border-slate-300 dark:border-slate-700 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Full Stack Developer • CloudCore Technologies
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">2020 - 2023</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                  • Designed and implemented RESTful and GraphQL APIs handling over 2M requests/day
                  with sub-50ms latency.
                  <br />• Integrated automated testing pipeline reducing post-deployment defects by
                  35%.
                </p>
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>Education</span>
              </h2>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                B.S. in Computer Science
              </p>
              <p className="text-[11px] text-slate-500">
                University of California, Berkeley • 2016 - 2020
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>Certifications</span>
              </h2>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                AWS Certified Solutions Architect (Associate)
              </p>
              <p className="text-[11px] text-slate-500">Issued by Amazon Web Services • 2024</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Candidate Submission • Application ID: {job?.jobCode || "TF-9482"}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
