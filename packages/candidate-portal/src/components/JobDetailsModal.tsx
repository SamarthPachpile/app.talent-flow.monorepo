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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-3 flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-mono font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {job.jobCode || "REQ-APPLY"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#28a745] text-white">
                {job.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">{job.jobTitle}</h2>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-sky-400" />
                {job.companyName || "iSmartRecruit"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-400" />
                {job.location} {job.country ? `(${job.country})` : ""}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-200 text-xs">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                <Calendar className="w-2.5 h-2.5 text-slate-400" /> Applied On
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
                {job.appliedDate !== "-" ? job.appliedDate : "Pending Sync"}
              </div>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                <Clock className="w-2.5 h-2.5 text-slate-400" /> Interview Date
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
                {job.interviewDate !== "-" ? job.interviewDate : "To Be Scheduled"}
              </div>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                <DollarSign className="w-2.5 h-2.5 text-slate-400" /> Compensation
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
                {job.salaryRange || "Competitive"}
              </div>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                <Briefcase className="w-2.5 h-2.5 text-slate-400" /> Job Type
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
                {job.employmentType || "Full-time"}
              </div>
            </div>
          </div>

          {/* Recruiter Notes / Status Announcement */}
          {job.recruiterNotes && (
            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-lg">
              <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 font-semibold text-xs mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Talent Acquisition Notes</span>
              </div>
              <p className="text-[11px] text-sky-900 dark:text-sky-200 leading-normal">
                {job.recruiterNotes}
              </p>
            </div>
          )}

          {/* Job Overview & Description */}
          {job.description && (
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider">
                Position Summary
              </h4>
              <p className="text-xs leading-normal text-slate-600 dark:text-slate-300">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider">
                Key Requirements & Competencies
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500">
            Application Status:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">Active</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onNavigateToStage && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToStage(job.stageId || "application");
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded bg-[#00c0ef] hover:bg-[#00abdc] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <span>View Onboarding Roadmap</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
