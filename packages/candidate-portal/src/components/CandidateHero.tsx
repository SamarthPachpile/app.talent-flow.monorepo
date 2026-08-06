import React from "react";
import { motion } from "framer-motion";
import { CandidateProfile, OnboardingStage } from "../types/candidate";
import { Calendar, MapPin, Sparkles, CheckCircle2, Shield, ArrowRight, Building2, Briefcase, Globe, Users } from "lucide-react";
import { CompanyDocument } from "@talent-flow/api";

interface CandidateHeroProps {
  candidate: CandidateProfile;
  stages: OnboardingStage[];
  onOpenStage: (stageId: string) => void;
  company?: CompanyDocument | null;
}

export const CandidateHero: React.FC<CandidateHeroProps> = ({
  candidate,
  stages = [],
  onOpenStage,
  company,
}) => {
  const safeStages = stages && stages.length > 0 ? stages : [];
  const completedStages = safeStages.filter((s) => s.status === "completed").length;
  const progressPercent =
    safeStages.length > 0 ? Math.round((completedStages / safeStages.length) * 100) : 0;
  const activeStage = safeStages.find((s) => s.id === candidate?.currentStageId) || safeStages[0];

  const today = new Date();
  const targetDateStr = candidate?.targetStartDate || new Date().toISOString();
  const startDate = new Date(targetDateStr);
  const isValidDate = !isNaN(startDate.getTime());
  const diffTime = isValidDate ? startDate.getTime() - today.getTime() : 0;
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const compName = company?.name || candidate.companyName || "Acme Corporation";
  const compColor = company?.brandColor || "#6366f1";

  return (
    <div className="border-b border-border bg-gradient-to-b from-background via-surface/60 to-background relative overflow-hidden">
      {/* Company Custom Cover Banner Image (If present in database document) */}
      {company?.coverImageUrl ? (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-border/80">
          <img
            src={company.coverImageUrl}
            alt={`${compName} cover`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 border border-border/80 text-xs font-semibold text-foreground backdrop-blur-md shadow-xs">
              <Building2 className="size-3.5 text-ember" />
              <span>{compName} Portal</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="absolute top-0 right-10 size-72 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${compColor}20` }} />
      )}

      <div className="px-6 py-8 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          {/* Left Column: Company Logo, Eyebrow & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {company?.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={compName}
                  className="size-14 rounded-2xl object-cover border border-border bg-surface p-1 shadow-md shrink-0"
                />
              ) : (
                <div
                  className="size-14 rounded-2xl grid place-items-center text-white font-bold text-xl shadow-md shrink-0"
                  style={{ backgroundColor: compColor }}
                >
                  {compName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase font-semibold">
                    {compName} · Candidate Operations
                  </p>
                  <span
                    className="border text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0"
                    style={{
                      backgroundColor: `${compColor}15`,
                      color: compColor,
                      borderColor: `${compColor}40`,
                    }}
                  >
                    <Shield className="size-3" /> Official Company Portal
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl leading-tight font-display text-foreground font-bold">
                  Welcome, <span style={{ color: compColor }}>{candidate.name}</span>
                </h1>
              </div>
            </div>

            <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
              {company?.about || (
                <>
                  Candidate onboarding lifecycle for{" "}
                  <strong className="text-foreground font-semibold">{candidate.roleTitle}</strong> in
                  the <strong className="text-foreground font-semibold">{candidate.department}</strong>{" "}
                  squad ({candidate.location}).
                </>
              )}
            </p>

            {/* Company Metadata Pills */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
              {company?.industry && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border">
                  <Briefcase className="size-3 text-ember" />
                  {company.industry}
                </span>
              )}
              {company?.headquarters && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border">
                  <MapPin className="size-3 text-ember" />
                  {company.headquarters}
                </span>
              )}
              {company?.size && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border">
                  <Users className="size-3 text-ember" />
                  {company.size}
                </span>
              )}
              {company?.subdomain && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border font-mono text-[11px]">
                  <Globe className="size-3 text-ember" />
                  /candidates-portal/{company.subdomain}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Admin Panel Matching Stats Cards */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="p-3.5 rounded-xl bg-card/75 border border-border/80 shadow-sm backdrop-blur-md">
              <p className="font-display text-2xl font-bold leading-none text-foreground flex items-center gap-1.5">
                <Calendar className="size-4 text-ember" />
                <span>
                  {new Date(candidate.targetStartDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground font-medium">
                Target Start Date
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-card/75 border border-border/80 shadow-sm backdrop-blur-md">
              <p className="font-display text-2xl font-bold leading-none text-success">
                {daysRemaining}d
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground font-medium">Days Countdown</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card/75 border border-border/80 shadow-sm backdrop-blur-md">
              <p className="font-display text-2xl font-bold leading-none text-ember">
                {progressPercent}%
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground font-medium">
                Onboarding Progress
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-card/75 border border-border/80 shadow-sm backdrop-blur-md">
              <p className="font-display text-2xl font-bold leading-none text-foreground">
                {completedStages}/{stages.length}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground font-medium">Stages Done</p>
            </div>
          </div>
        </motion.div>

        {/* Current Active Task Banner Bar */}
        {activeStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 p-4 rounded-xl border border-ember/30 bg-card/80 backdrop-blur-md shadow-lifted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-ember/15 text-ember border border-ember/30 shadow-inner">
                <Sparkles className="size-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-ember uppercase tracking-wider">
                  Active Stage Requirement
                </div>
                <div className="text-sm font-bold text-foreground">{activeStage.title}</div>
                <div className="text-xs text-muted-foreground">{activeStage.description}</div>
              </div>
            </div>

            <button
              onClick={() => onOpenStage(activeStage.id)}
              className="flex items-center gap-2 rounded-xl bg-ember text-ember-foreground px-5 py-2.5 text-xs font-semibold hover:bg-ember/90 transition-all shadow-xs cursor-pointer shrink-0 hover:scale-105 active:scale-95"
            >
              <span>Proceed with {activeStage.shortTitle || activeStage.title}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
