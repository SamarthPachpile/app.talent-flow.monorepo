import React from "react";
import { ApplicationInfo, CandidateProfile } from "../../types/candidate";
import { FileText, Download, CheckCircle2, Calendar, ExternalLink } from "lucide-react";

interface ApplicationStageViewProps {
  application: ApplicationInfo;
  candidate: CandidateProfile;
}

export const ApplicationStageView: React.FC<ApplicationStageViewProps> = ({
  application,
  candidate,
}) => {
  return (
    <div className="space-y-5 font-sans">
      {/* Stage Header Banner */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              <span>Stage 1 Completed</span>
            </span>
            <span className="text-xs text-muted-foreground">Requisition #{application.jobId}</span>
          </div>
          <h2 className="text-2xl font-display font-normal text-foreground mt-1">
            Job Application & Screening Details
          </h2>
          <p className="text-xs text-muted-foreground">
            Submitted on {application.appliedDate} via TalentFlow ATS
          </p>
        </div>

        <button
          onClick={() => alert(`Downloading resume: ${application.resumeFileName}`)}
          className="px-3.5 py-2 rounded-md bg-surface hover:bg-accent/60 text-foreground border border-border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="size-3.5 text-ember" />
          <span>Download Submitted Resume</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Submitted Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-4">
            <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
              <FileText className="size-4 text-ember" />
              <span>Candidate Application Summary</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-surface rounded-md border border-border">
                <div className="text-[11px] text-muted-foreground font-medium">
                  Applied Position
                </div>
                <div className="text-xs font-semibold text-foreground mt-0.5">
                  {application.jobTitle}
                </div>
              </div>

              <div className="p-3 bg-surface rounded-md border border-border">
                <div className="text-[11px] text-muted-foreground font-medium">
                  Years of Experience
                </div>
                <div className="text-xs font-semibold text-foreground mt-0.5">
                  {application.experienceYears} Years Industry Experience
                </div>
              </div>

              {application.portfolioUrl && (
                <div className="p-3 bg-surface rounded-md border border-border">
                  <div className="text-[11px] text-muted-foreground font-medium">
                    Portfolio Site
                  </div>
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-ember hover:underline mt-0.5 flex items-center gap-1"
                  >
                    <span>{application.portfolioUrl}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}

              {application.githubUrl && (
                <div className="p-3 bg-surface rounded-md border border-border">
                  <div className="text-[11px] text-muted-foreground font-medium">
                    GitHub Repository
                  </div>
                  <a
                    href={application.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-ember hover:underline mt-0.5 flex items-center gap-1"
                  >
                    <span>{application.githubUrl}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
            </div>

            {application.coverLetter && (
              <div className="p-3.5 bg-surface/60 rounded-md border border-border">
                <div className="text-xs font-semibold text-foreground mb-1">
                  Submitted Cover Note
                </div>
                <p className="text-xs text-muted-foreground italic">"{application.coverLetter}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Application Status History Timeline */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card">
            <h3 className="text-lg font-display font-normal text-foreground mb-4 flex items-center gap-2">
              <Calendar className="size-4 text-ember" />
              <span>Status History</span>
            </h3>

            <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {application.statusHistory.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[17px] top-0.5 size-3 rounded-full bg-ember border-2 border-card" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">{item.status}</div>
                    <div className="text-[10px] text-ember font-medium mt-0.5">{item.date}</div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
