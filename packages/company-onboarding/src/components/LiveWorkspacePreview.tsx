import React from "react";
import { OnboardingState } from "../types/onboarding";
import { Briefcase } from "lucide-react";

interface PreviewProps {
  state: OnboardingState;
}

export const LiveWorkspacePreview: React.FC<PreviewProps> = ({ state }) => {
  const brandColor = state.profile.brandColor || "oklch(0.63 0.18 42)";
  const companyName = state.profile.name || "Acme Corporation";

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Interactive Portal View
          </p>
          <h1 className="mt-1 text-4xl leading-none font-display text-foreground">
            Live Workspace Preview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time interactive preview of {companyName}'s branded candidate & employee portal.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface border border-border px-3 py-1.5 rounded-md font-mono">
          <span className="size-2 rounded-full bg-success" />
          <span>
            https://gravitonitsolutions.com/candidates-portal/{state.profile.subdomain || "company"}
          </span>
        </div>
      </div>

      {/* Simulated Portal Browser Window Frame */}
      <div className="rounded-xl border border-border overflow-hidden shadow-sm bg-card">
        {/* Mock Browser Header */}
        <div className="bg-surface px-4 py-2.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-warning/60" />
            <span className="size-2.5 rounded-full bg-success/60" />
          </div>
          <div className="bg-card border border-border rounded-md px-3 py-0.5 text-xs font-mono text-muted-foreground w-full max-w-md text-center truncate">
            https://gravitonitsolutions.com/candidates-portal/{state.profile.subdomain || "company"}
          </div>
          <div className="w-12" />
        </div>

        {/* Simulated Branded Page */}
        <div className="p-6 sm:p-8 space-y-6 bg-background text-foreground">
          {/* Simulated Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="size-9 rounded-md flex items-center justify-center text-ember-foreground font-semibold text-sm shadow-sm"
                style={{ backgroundColor: brandColor }}
              >
                {companyName.charAt(0)}
              </div>
              <div>
                <span className="font-display text-2xl text-foreground">{companyName}</span>
                <p className="text-xs text-muted-foreground">
                  {state.profile.industry || "Technology"} Careers
                </p>
              </div>
            </div>

            <button
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-ember-foreground transition-opacity shadow-sm cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              Apply Now
            </button>
          </div>

          {/* Hero Banner */}
          <div className="rounded-lg p-6 bg-surface border border-border space-y-2">
            <span className="text-11px font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider text-foreground bg-card border border-border inline-block">
              Now Hiring Across All Departments
            </span>
            <h2 className="text-3xl font-display text-foreground">
              Join {companyName}'s High-Growth Team
            </h2>
            <p className="text-muted-foreground text-xs max-w-xl">
              Discover open positions, submit your resume, and track your interview stage in
              real-time through our TalentFlow CRM pipeline.
            </p>
          </div>

          {/* Simulated Open Roles */}
          <div className="space-y-3">
            <h3 className="text-lg font-display text-foreground flex items-center gap-2">
              <Briefcase className="size-4 text-ember" /> Featured Job Openings (3 Active)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Senior Full Stack Engineer",
                  dept: "Engineering",
                  location: "San Francisco (Hybrid)",
                  type: "Full-time",
                },
                {
                  title: "Technical Product Manager",
                  dept: "Product",
                  location: "Remote (US)",
                  type: "Full-time",
                },
                {
                  title: "Senior Talent Acquisition Lead",
                  dept: "HR & People",
                  location: "New York, NY",
                  type: "Full-time",
                },
              ].map((job, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-11px text-muted-foreground font-medium">{job.dept}</span>
                    <span className="text-10px bg-card border border-border text-foreground px-2 py-0.5 rounded-md">
                      {job.type}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">{job.title}</h4>
                  <p className="text-xs text-muted-foreground">{job.location}</p>
                  <button
                    className="w-full text-center py-1.5 rounded-md text-xs font-medium text-ember-foreground transition-opacity cursor-pointer mt-2"
                    style={{ backgroundColor: brandColor }}
                  >
                    View & Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
