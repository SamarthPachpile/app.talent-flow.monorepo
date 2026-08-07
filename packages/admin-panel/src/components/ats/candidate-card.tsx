import { AlertTriangle, ArrowUpRight, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { type Candidate, STAGES, stageIndex } from "../../lib/ats-data";

const priorityLabel: Record<Candidate["priority"], string> = {
  standard: "Standard",
  high: "High",
  urgent: "Urgent",
};

export function CandidateCard({
  candidate,
  onOpen,
}: {
  candidate: Candidate;
  onOpen: (c: Candidate) => void;
}) {
  const progress = ((stageIndex(candidate.stage) + 1) / STAGES.length) * 100;

  return (
    <button
      type="button"
      onClick={() => onOpen(candidate)}
      className="group w-full rounded-lg border border-border bg-card p-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lifted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-xs font-semibold text-accent-foreground">
          {candidate.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-foreground">{candidate.name}</p>
            <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="truncate text-xs text-muted-foreground">{candidate.role}</p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <MapPin className="size-3" />
        <span className="truncate">{candidate.location}</span>
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="border-clay/40 bg-surface font-normal">
          {candidate.stage}
        </Badge>
        {candidate.priority !== "standard" && (
          <Badge
            className={cn(
              "font-normal",
              candidate.priority === "urgent"
                ? "bg-ember text-ember-foreground"
                : "bg-warning text-warning-foreground",
            )}
          >
            {priorityLabel[candidate.priority]}
          </Badge>
        )}
      </div>

      {candidate.blocked && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-destructive/8 px-2 py-1.5 text-[11px] text-destructive">
          <AlertTriangle className="mt-px size-3 shrink-0" />
          <span>{candidate.blocked}</span>
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-ember" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {stageIndex(candidate.stage) + 1}/{STAGES.length}
        </span>
      </div>
    </button>
  );
}
