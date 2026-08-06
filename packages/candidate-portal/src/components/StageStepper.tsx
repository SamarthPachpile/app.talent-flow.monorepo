import React from "react";
import { OnboardingStage, StageId } from "../types/candidate";
import {
  CheckCircle2,
  FileText,
  Calendar,
  FileCheck,
  ShieldCheck,
  Laptop,
  Key,
  Rocket,
} from "lucide-react";

interface StageStepperProps {
  stages: OnboardingStage[];
  activeStageId: StageId;
  onSelectStage: (stageId: StageId) => void;
}

export const StageStepper: React.FC<StageStepperProps> = ({
  stages,
  activeStageId,
  onSelectStage,
}) => {
  const getStageIcon = (id: StageId) => {
    switch (id) {
      case "application":
        return FileText;
      case "interview":
        return Calendar;
      case "offer":
        return FileCheck;
      case "background_check":
        return ShieldCheck;
      case "hardware_setup":
        return Laptop;
      case "credentials":
        return Key;
      case "day_one":
        return Rocket;
      default:
        return FileText;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-6 shadow-card font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-display font-normal text-foreground flex items-center gap-2">
            <span>Onboarding Roadmap & Stage Tracker</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Track all 7 stages from application submission to laptop delivery & Day 1 orientation
          </p>
        </div>
        <span className="hidden md:inline-block text-[11px] font-medium text-muted-foreground bg-surface px-2.5 py-1 rounded-md border border-border">
          Click any stage to view details
        </span>
      </div>

      {/* Responsive Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((stage) => {
          const Icon = getStageIcon(stage.id);
          const isActive = stage.id === activeStageId;
          const isCompleted = stage.status === "completed";
          const isActionRequired = stage.status === "action_required";
          const isInProgress = stage.status === "in_progress";

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`relative text-left p-3 rounded-md border transition-colors duration-150 flex flex-col justify-between cursor-pointer group ${
                isActive
                  ? "bg-ember text-ember-foreground border-ember font-medium shadow-xs"
                  : isCompleted
                    ? "bg-surface hover:bg-accent/60 border-border text-foreground"
                    : isActionRequired
                      ? "bg-warning/10 hover:bg-warning/20 border-warning/30 text-warning-foreground"
                      : isInProgress
                        ? "bg-accent/50 hover:bg-accent border-border text-foreground"
                        : "bg-surface/50 hover:bg-surface border-border text-muted-foreground"
              }`}
            >
              {/* Top Row: Stage Step Number & Icon */}
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`size-6 rounded-md flex items-center justify-center font-bold text-xs ${
                    isActive
                      ? "bg-ember-foreground text-ember"
                      : isCompleted
                        ? "bg-success/20 text-success border border-success/30"
                        : isActionRequired
                          ? "bg-warning/20 text-warning-foreground border border-warning/30"
                          : "bg-surface text-muted-foreground border border-border"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="size-3.5" /> : stage.stepNumber}
                </div>

                <Icon
                  className={`size-3.5 ${
                    isActive
                      ? "text-ember-foreground"
                      : isCompleted
                        ? "text-success"
                        : isActionRequired
                          ? "text-warning-foreground"
                          : "text-muted-foreground"
                  }`}
                />
              </div>

              {/* Title & Short Details */}
              <div>
                <div className="text-xs font-semibold leading-tight mb-1 truncate">
                  {stage.shortTitle}
                </div>

                {/* Status pill badge */}
                {isCompleted && (
                  <span className="text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-xs inline-block">
                    Done
                  </span>
                )}
                {isActionRequired && (
                  <span className="text-[10px] font-semibold text-warning-foreground bg-warning/20 px-1.5 py-0.5 rounded-xs inline-block border border-warning/30">
                    Action Required
                  </span>
                )}
                {isInProgress && (
                  <span className="text-[10px] font-semibold text-ember bg-ember/10 px-1.5 py-0.5 rounded-xs inline-block">
                    In Progress
                  </span>
                )}
                {stage.status === "pending" && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-surface px-1.5 py-0.5 rounded-xs inline-block border border-border">
                    Upcoming
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
