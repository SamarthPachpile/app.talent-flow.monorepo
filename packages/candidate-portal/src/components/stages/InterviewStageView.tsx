import React from "react";
import { InterviewSlot } from "../../types/candidate";
import { Calendar, Video, Clock, CheckCircle2, ExternalLink } from "lucide-react";

interface InterviewStageViewProps {
  interviews: InterviewSlot[];
}

export const InterviewStageView: React.FC<InterviewStageViewProps> = ({ interviews }) => {
  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              <span>All Rounds Passed</span>
            </span>
            <span className="text-xs text-muted-foreground">3 of 3 Interviews Completed</span>
          </div>
          <h2 className="text-2xl font-display font-normal text-foreground mt-1">
            Interview & Evaluation Loop
          </h2>
          <p className="text-xs text-muted-foreground">
            Review scheduled sessions, interviewer notes, and video meeting archives
          </p>
        </div>
      </div>

      {/* Interview Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {interviews.map((slot) => (
          <div
            key={slot.id}
            className="bg-card border border-border hover:border-ember/50 transition-colors rounded-lg p-4 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface text-foreground border border-border">
                  {slot.type}
                </span>
                <span className="text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full flex items-center gap-1 border border-success/20">
                  <CheckCircle2 className="size-3" />
                  <span>Passed</span>
                </span>
              </div>

              <h3 className="text-base font-display font-normal text-foreground mb-2">
                {slot.roundName}
              </h3>

              {/* Interviewer Details */}
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-md border border-border mb-3">
                <img
                  src={slot.interviewerAvatar}
                  alt={slot.interviewerName}
                  className="size-9 rounded-full object-cover ring-1 ring-ember/30"
                />
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {slot.interviewerName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{slot.interviewerRole}</div>
                </div>
              </div>

              {/* Time & Meeting */}
              <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-ember" />
                  <span>{slot.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-ember" />
                  <span>
                    {slot.timeSlot} ({slot.durationMinutes} mins)
                  </span>
                </div>
              </div>

              {slot.notesForCandidate && (
                <div className="p-2.5 bg-surface/60 rounded-md border border-border text-[11px] text-muted-foreground italic mb-3">
                  "{slot.notesForCandidate}"
                </div>
              )}
            </div>

            <a
              href={slot.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 rounded-md bg-surface hover:bg-accent/60 text-foreground font-medium text-xs flex items-center justify-center gap-1.5 border border-border transition-colors cursor-pointer"
            >
              <Video className="size-3.5 text-ember" />
              <span>Launch Virtual Room</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
