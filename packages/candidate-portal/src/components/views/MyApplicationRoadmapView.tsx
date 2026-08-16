import React, { useState } from "react";
import { CandidatePortalState, StageId, HardwareSelection } from "../../types/candidate";
import { StageStepper } from "../StageStepper";
import { ApplicationStageView } from "../stages/ApplicationStageView";
import { InterviewStageView } from "../stages/InterviewStageView";
import { OfferStageView } from "../stages/OfferStageView";
import { BackgroundCheckStageView } from "../stages/BackgroundCheckStageView";
import { HardwareSetupStageView } from "../stages/HardwareSetupStageView";
import { CredentialsStageView } from "../stages/CredentialsStageView";
import { DayOneStageView } from "../stages/DayOneStageView";
import { CompanyDocument } from "@talent-flow/api";
import { CheckCircle2, Clock, Calendar, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";

interface MyApplicationRoadmapViewProps {
  portalState: CandidatePortalState;
  company?: CompanyDocument | null;
  activeStageId: StageId;
  onSelectStage: (stageId: StageId) => void;
  onAcceptOffer: (signedName: string) => void;
  onUpdateHardware: (updated: Partial<HardwareSelection>) => void;
}

export const MyApplicationRoadmapView: React.FC<MyApplicationRoadmapViewProps> = ({
  portalState,
  company,
  activeStageId,
  onSelectStage,
  onAcceptOffer,
  onUpdateHardware,
}) => {
  const completedStages = portalState.stages.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedStages / portalState.stages.length) * 100);

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Onboarding Progress Summary Banner */}
      <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#00c0ef]">
                Candidate Onboarding Pipeline
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {completedStages} of {portalState.stages.length} Stages Completed
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {portalState.candidate.roleTitle}
            </h2>
            <p className="text-[11px] text-slate-500">
              {company?.name || portalState.candidate.companyName} • Target Start Date:{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                {portalState.candidate.targetStartDate}
              </strong>
            </p>
          </div>

          <div className="w-full md:w-44 space-y-1 shrink-0">
            <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span>Overall Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00c0ef] to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Stage Roadmap Stepper */}
      <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4">
        <StageStepper
          stages={portalState.stages}
          activeStageId={activeStageId}
          onSelectStage={(stageId) => onSelectStage(stageId)}
        />
      </div>

      {/* Active Stage View Body */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-md p-3.5 sm:p-4 shadow-2xs">
        {activeStageId === "application" && (
          <ApplicationStageView
            application={portalState.application}
            candidate={portalState.candidate}
          />
        )}

        {activeStageId === "interview" && (
          <InterviewStageView interviews={portalState.interviews} />
        )}

        {activeStageId === "offer" && (
          <OfferStageView
            offer={portalState.offer}
            candidate={portalState.candidate}
            onAcceptOffer={onAcceptOffer}
          />
        )}

        {activeStageId === "background_check" && (
          <BackgroundCheckStageView
            backgroundCheck={portalState.backgroundCheck}
            onUploadDoc={(docId) => toast.success(`Uploaded document: ${docId}`)}
          />
        )}

        {activeStageId === "hardware_setup" && (
          <HardwareSetupStageView
            hardware={portalState.hardware}
            onUpdateHardware={onUpdateHardware}
          />
        )}

        {activeStageId === "credentials" && (
          <CredentialsStageView credentials={portalState.credentials} />
        )}

        {activeStageId === "day_one" && (
          <DayOneStageView dayOne={portalState.dayOne} candidate={portalState.candidate} />
        )}
      </div>
    </div>
  );
};
