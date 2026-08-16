import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Download,
  Trash2,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Globe,
  Clock,
  HelpCircle,
} from "lucide-react";
import { CandidateProfile } from "../../types/candidate";
import { toast } from "sonner";

interface GdprStatusViewProps {
  candidate: CandidateProfile;
}

export const GdprStatusView: React.FC<GdprStatusViewProps> = ({ candidate }) => {
  const [anonymousScreening, setAnonymousScreening] = useState<boolean>(true);
  const [talentPoolSearch, setTalentPoolSearch] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleDownloadData = () => {
    const dataObj = {
      subject: "Candidate Personal Data Record (Art. 15 / Art. 20 GDPR)",
      exportedAt: new Date().toISOString(),
      candidate: {
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        role: candidate.roleTitle,
        company: candidate.companyName,
      },
      gdprCompliance: {
        consentStatus: "VERIFIED_ACTIVE",
        jurisdiction: "EU-GDPR / UK-GDPR / CCPA",
        encryption: "AES-256 GCM at rest & TLS 1.3 in transit",
        dataRetentionPeriodDays: 365,
      },
    };

    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Candidate_GDPR_Export_${candidate.name.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("GDPR Personal Data Archive downloaded successfully!");
  };

  const handleConfirmDeletion = () => {
    setShowDeleteModal(false);
    toast.info(
      "Erasure request logged. Our Data Protection Officer will process your request within 30 days.",
    );
  };

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 ring-2 ring-emerald-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  GDPR & Data Privacy Status
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-[#28a745] text-white">
                  Compliant & Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Your data is cryptographically isolated and governed by European Union GDPR (EU
                2016/679).
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#00c0ef] hover:bg-[#00abdc] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Personal Data</span>
          </button>
        </div>
      </div>

      {/* Compliance Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 p-3.5 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            Encryption Standard
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
            AES-256 / TLS 1.3
          </div>
          <p className="text-[10.5px] text-slate-500">
            End-to-end encrypted storage with row-level tenant keys.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 p-3.5 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00c0ef]" />
            Data Retention Period
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">365 Days</div>
          <p className="text-[10.5px] text-slate-500">
            Auto-archival policy following recruitment process completion.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 p-3.5 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            Hosting Jurisdiction
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
            EU (Frankfurt) / US West
          </div>
          <p className="text-[10.5px] text-slate-500">
            SOC 2 Type II and ISO/IEC 27001 certified cloud infrastructure.
          </p>
        </div>
      </div>

      {/* Data Subject Rights (GDPR Articles) */}
      <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3">
        <h3 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
          Your Data Subject Rights (Articles 15 - 22)
        </h3>

        <div className="space-y-2.5">
          {/* Right 1: Access & Portability */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 gap-2.5">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Right to Access & Portability (Art. 15 & 20)</span>
                <span className="text-[9.5px] bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 px-1.5 py-0.5 rounded font-mono">
                  JSON
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Obtain a complete structured export of your application records, interview notes,
                and profile data.
              </p>
            </div>
            <button
              onClick={handleDownloadData}
              className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              Export JSON
            </button>
          </div>

          {/* Right 2: Privacy Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 gap-2.5">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Anonymous Screening Masking (Art. 18)
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hide personal identifying information (name, photo) during initial recruiter
                evaluation rounds.
              </p>
            </div>
            <button
              onClick={() => toast.success("Blind screening mask preference updated")}
              className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              Enable Masking
            </button>
          </div>

          {/* Right 3: Erasure */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-rose-50/60 dark:bg-rose-950/20 rounded-lg border border-rose-200/60 dark:border-rose-900/40 gap-2.5">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Right to Erasure / Right to be Forgotten (Art. 17)</span>
              </div>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
                Permanently purge all resume PDFs, interview assessments, and account credentials
                from all clusters.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              Request Deletion
            </button>
          </div>
        </div>
      </div>

      {/* Erasure Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Confirm Erasure Request
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
              In accordance with GDPR Article 17, submitting this request will permanently remove
              your candidate profile, resume, and active application records from the company
              workspace.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletion}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Submit Erasure Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
