import React from "react";
import {
  X,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  User,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Globe,
  Award,
  Sparkles,
  Layers,
} from "lucide-react";
import { AppliedJob, StageId } from "../types/candidate";

interface JobDetailsModalProps {
  job: AppliedJob | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStage?: (stageId: StageId) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  onNavigateToStage,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-white/10 text-orange-400 border border-white/15">
                {job.jobCode || "REQ-POSITION"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {job.status || "Active Application"}
              </span>
              {job.department && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-300">
                  {job.department}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight leading-snug">
              {job.jobTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Building2 className="w-3.5 h-3.5 text-orange-400" />
                {job.companyName || "Graviton IT Solutions"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location} {job.country ? `(${job.country})` : ""}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                {job.salaryRange || "$130k - $165k"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer relative z-10 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
          {/* Key Metrics Row (4 cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-orange-500" /> Applied On
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {job.appliedDate !== "-" ? job.appliedDate : "Active Review"}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-blue-500" /> Interview
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {job.interviewDate !== "-" ? job.interviewDate : "To Be Scheduled"}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <DollarSign className="w-3 h-3 text-emerald-500" /> Compensation
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {job.salaryRange || "Competitive"}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Briefcase className="w-3 h-3 text-purple-500" /> Employment
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {job.employmentType || "Full-time"}
              </div>
            </div>
          </div>

          {/* Recruiter Notes / Status Announcement */}
          {job.recruiterNotes && (
            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Talent Acquisition Notes</span>
              </div>
              <p className="text-xs text-sky-900 dark:text-sky-200 leading-normal">
                {job.recruiterNotes}
              </p>
            </div>
          )}

          {/* Job Overview & Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Position Summary</span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {job.description ||
                `As a ${job.jobTitle} at ${job.companyName || "Graviton IT Solutions"}, you will design, build, and deploy high-impact software solutions with clean architecture, automated testing, and thoughtful system design.`}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Key Requirements & Qualifications</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span className="leading-normal">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Review Status:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
              {job.status || "Active Candidate"}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
            {onNavigateToStage && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToStage(job.stageId || "application");
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>Track 7-Stage Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
