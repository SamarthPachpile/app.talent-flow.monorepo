import React, { useState } from "react";
import { DayOneReadiness, CandidateProfile } from "../../types/candidate";
import { Rocket, Calendar, CheckCircle2, Clock, Sparkles, Send } from "lucide-react";
import { toast } from "../../lib/sweetalert";

interface DayOneStageViewProps {
  dayOne: DayOneReadiness;
  candidate: CandidateProfile;
}

export const DayOneStageView: React.FC<DayOneStageViewProps> = ({ dayOne, candidate }) => {
  const [checklist, setChecklist] = useState(dayOne.checklist);
  const [buddyMessage, setBuddyMessage] = useState("");

  const toggleTask = (id: string) => {
    setChecklist(
      checklist.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
    toast.success("Task status updated");
  };

  const completedCount = checklist.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleSendBuddyMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buddyMessage.trim()) return;
    toast.success(`Message sent to ${dayOne.buddy.name} on Slack!`);
    setBuddyMessage("");
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 flex items-center gap-1">
              <Rocket className="size-3.5" />
              <span>Day 1 Readiness · {progressPercent}% Ready</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Target Start: {candidate.targetStartDate}
            </span>
          </div>
          <h2 className="text-2xl font-display font-normal text-foreground mt-1">
            Team Orientation & First Day Schedule
          </h2>
          <p className="text-xs text-muted-foreground">
            Meet your assigned onboarding buddy, review your Day 1 schedule calendar, and complete
            pre-board tasks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Onboarding Buddy & Pre-boarding Checklist */}
        <div className="lg:col-span-2 space-y-5">
          {/* Onboarding Buddy Card */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ember uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-ember" />
                <span>Your Assigned Onboarding Buddy</span>
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {dayOne.buddy.slackHandle}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={dayOne.buddy.avatarUrl}
                alt={dayOne.buddy.name}
                className="size-12 rounded-full object-cover ring-2 ring-ember/30"
              />
              <div>
                <h3 className="text-base font-display font-normal text-foreground">
                  {dayOne.buddy.name}
                </h3>
                <div className="text-xs text-ember font-medium">{dayOne.buddy.role}</div>
                <p className="text-xs text-muted-foreground italic mt-1.5 bg-surface p-2.5 rounded-md border border-border">
                  "{dayOne.buddy.welcomeNote}"
                </p>
              </div>
            </div>

            {/* Quick Slack Message Input */}
            <form onSubmit={handleSendBuddyMsg} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={buddyMessage}
                onChange={(e) => setBuddyMessage(e.target.value)}
                placeholder={`Send quick message to ${dayOne.buddy.name}...`}
                className="flex-1 px-3.5 py-1.5 rounded-md bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-ember"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-ember text-ember-foreground text-xs font-semibold flex items-center gap-1 transition-colors hover:bg-ember/90 cursor-pointer shadow-xs"
              >
                <Send className="size-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Pre-boarding Checklist */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-ember" />
                <span>Pre-boarding Task Checklist</span>
              </h3>
              <span className="text-xs font-semibold text-foreground bg-surface px-2.5 py-0.5 rounded-full border border-border">
                {completedCount} / {checklist.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-md border transition-colors cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? "bg-surface/50 border-border opacity-75"
                      : "bg-surface border-border hover:border-accent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`size-4 rounded border flex items-center justify-center ${
                        task.completed
                          ? "bg-success border-success text-success-foreground"
                          : "border-border"
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="size-3" />}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                      >
                        {task.title}
                      </div>
                      <div className="text-10px text-muted-foreground">
                        {task.category} · ~{task.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: First Day Schedule */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-lg p-5 shadow-card space-y-3">
            <h3 className="text-lg font-display font-normal text-foreground flex items-center gap-2">
              <Calendar className="size-4 text-ember" />
              <span>Day 1 Schedule (August 15)</span>
            </h3>

            <div className="space-y-2">
              {dayOne.firstDaySchedule.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 bg-surface rounded-md border border-border space-y-1"
                >
                  <div className="flex items-center justify-between text-11px">
                    <span className="font-semibold text-ember flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{slot.time}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-card text-muted-foreground font-medium border border-border text-10px">
                      {slot.meetingType}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground">{slot.title}</div>
                  <div className="text-10px text-muted-foreground">
                    Host: {slot.hostName} ({slot.hostRole})
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
