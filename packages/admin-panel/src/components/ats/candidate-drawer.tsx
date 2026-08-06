import { Check, Circle, Mail, User, Building2, CalendarDays, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type Candidate, STAGES, phaseOfStage, stageIndex } from "@/lib/ats-data";

export function CandidateDrawer({
  candidate,
  onOpenChange,
  onAdvance,
}: {
  candidate: Candidate | null;
  onOpenChange: (open: boolean) => void;
  onAdvance: (id: string) => void;
}) {
  const current = candidate ? stageIndex(candidate.stage) : -1;
  const atEnd = current === STAGES.length - 1;

  return (
    <Sheet open={!!candidate} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-xl">
        {candidate && (
          <>
            <SheetHeader className="border-b border-border px-6 pt-6 pb-5">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                  {candidate.initials}
                </span>
                <div className="min-w-0">
                  <SheetTitle className="font-display text-2xl leading-tight">
                    {candidate.name}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    {candidate.role} · {candidate.department}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="font-normal">
                      {phaseOfStage(candidate.stage).label}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {candidate.stage}
                    </Badge>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="px-6 py-5">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <Field icon={Mail} label="Email" value={candidate.email} />
                  <Field icon={CalendarDays} label="Applied" value={candidate.appliedOn} />
                  <Field icon={User} label="Recruiter" value={candidate.recruiter} />
                  <Field icon={Building2} label="Hiring manager" value={candidate.hiringManager} />
                  <Field icon={Tag} label="Source" value={candidate.source} />
                  <Field icon={Tag} label="Skills" value={candidate.tags.join(", ")} />
                </dl>

                <Separator className="my-6" />

                <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                  Lifecycle
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {current + 1} of {STAGES.length} micro-stages complete
                </p>

                <ol className="mt-4 space-y-0">
                  {STAGES.map((stage, i) => {
                    const done = i <= current;
                    const isCurrent = i === current;
                    const event = candidate.history[i];
                    return (
                      <li key={stage} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              "grid size-5 shrink-0 place-items-center rounded-full border",
                              done
                                ? "border-ember bg-ember text-ember-foreground"
                                : "border-border bg-background text-muted-foreground",
                            )}
                          >
                            {done ? (
                              <Check className="size-3" />
                            ) : (
                              <Circle className="size-1.5 fill-current" />
                            )}
                          </span>
                          {i < STAGES.length - 1 && (
                            <span
                              className={cn("w-px flex-1", done ? "bg-ember/40" : "bg-border")}
                            />
                          )}
                        </div>
                        <div className={cn("pb-4", i === STAGES.length - 1 && "pb-0")}>
                          <p
                            className={cn(
                              "text-sm leading-5",
                              isCurrent
                                ? "font-semibold text-foreground"
                                : done
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                            )}
                          >
                            {stage}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event ? `${event.at} · ${event.actor}` : "Pending"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-6 py-4">
              <p className="text-xs text-muted-foreground">
                {atEnd ? "Lifecycle complete" : `Next: ${STAGES[current + 1]}`}
              </p>
              <Button
                disabled={atEnd}
                onClick={() => onAdvance(candidate.id)}
                className="bg-ember text-ember-foreground hover:bg-ember/90"
              >
                Advance stage
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm text-foreground">{value}</dd>
    </div>
  );
}
