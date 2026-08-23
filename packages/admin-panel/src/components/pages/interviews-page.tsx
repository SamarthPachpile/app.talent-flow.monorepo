import { useState } from "react";
import { CalendarClock, Video, BellRing, CheckCircle2 } from "lucide-react";
import { toast } from "@/lib/sweetalert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AppNav } from "../layout/app-nav";
import { SettingsCard } from "../settings/settings-card";
import { AuditTrail } from "../ats/audit-trail";
import { useWorkspace } from "../../lib/workspace-store";
import { AdminLoginPage } from "../admin-login-page";
import { Footer } from "../Footer";

export function InterviewsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("talentflow_admin_auth");
  });

  const {
    candidates,
    interviews,
    audit,
    scheduleInterview,
    sendReminder,
    completeInterview,
    company,
  } = useWorkspace();

  const [candidateId, setCandidateId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("60");
  const [panel, setPanel] = useState("");

  const calendarAudit = audit.filter((a) =>
    [
      "Interview Requested",
      "Calendar Invite Sent",
      "Reminder Sent",
      "Interview Completed",
    ].includes(a.action),
  );

  function request() {
    const c = candidates.find((x) => x.id === candidateId);
    if (!c || !date) {
      toast.error("Pick a candidate and a date");
      return;
    }
    scheduleInterview({
      candidateId: c.id,
      candidateName: c.name,
      role: c.role,
      panel: panel ? panel.split(",").map((p) => p.trim()) : [c.hiringManager],
      date,
      time,
      durationMins: Number(duration),
      timezone: company.timezone,
    });
    toast.success("Google Calendar event created — Calendar Invite Sent");
    setCandidateId("");
    setDate("");
    setPanel("");
  }

  if (!isAuthenticated) {
    return <AdminLoginPage onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNav onLogout={() => setIsAuthenticated(false)} />
      <header className="border-b border-border bg-surface px-6 py-6">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase font-semibold">
          {company.name} · Scheduling
        </p>
        <h1 className="mt-1 text-4xl leading-none font-display font-semibold">
          Interview scheduling
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Requesting an interview creates a Google Calendar event with a Google Meet link and fires
          the Calendar Invite Sent notification automatically.
        </p>
      </header>

      <div className="grid gap-6 px-6 py-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <SettingsCard
            icon={CalendarClock}
            title="Request an interview"
            description="Moves the candidate through Interview Requested → Calendar Invite Sent."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Candidate</Label>
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {c.role} ({c.stage})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="12 Aug 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Start time ({company.timezone})</Label>
                <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dur">Duration (minutes)</Label>
                <Input id="dur" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panel">Panel (comma separated)</Label>
                <Input
                  id="panel"
                  value={panel}
                  onChange={(e) => setPanel(e.target.value)}
                  placeholder="Tom Ellis, Priya Nair"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={request}>
                <Video className="size-4" /> Create calendar invite
              </Button>
              <p className="text-xs text-muted-foreground">
                Live Google Calendar sync activates once the backend is connected — the flow,
                notifications and audit entries are already wired.
              </p>
            </div>
          </SettingsCard>

          <SettingsCard
            icon={Video}
            title="Scheduled interviews"
            description="Send reminders and record completion to unlock feedback and approvals."
          >
            <div className="space-y-3">
              {interviews.length === 0 && (
                <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  Nothing scheduled for {company.name}.
                </p>
              )}
              {interviews.map((i) => (
                <article key={i.id} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{i.candidateName}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.role} · {i.date} at {i.time} ({i.timezone}) · {i.durationMins} min
                      </p>
                      <p className="mt-1 text-11px text-muted-foreground">
                        Panel: {i.panel.join(", ")}
                        {i.calendarEventId ? ` · event ${i.calendarEventId}` : ""}
                      </p>
                      {i.meetLink && (
                        <a
                          href={i.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-xs text-ember underline underline-offset-2"
                        >
                          {i.meetLink}
                        </a>
                      )}
                    </div>
                    <Badge variant="outline" className="font-normal capitalize">
                      {i.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={i.status === "completed"}
                      onClick={() => {
                        sendReminder(i.id);
                        toast.success("Reminder Sent");
                      }}
                    >
                      <BellRing className="size-3.5" /> Send reminder
                    </Button>
                    <Button
                      size="sm"
                      disabled={i.status === "completed"}
                      onClick={() => {
                        completeInterview(i.id);
                        toast.success("Interview Completed");
                      }}
                    >
                      <CheckCircle2 className="size-3.5" /> Mark completed
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </SettingsCard>
        </div>

        <AuditTrail title="Scheduling audit log" entries={calendarAudit} />
      </div>

      <Footer
        linksCol1={[
          { label: "Admin Pipeline", href: "/admin-panel/dashboard" },
          { label: "Onboarded Companies", href: "/admin-panel/companies" },
          { label: "Interviews Control", href: "/admin-panel/interviews" },
          { label: "Offers Central", href: "/admin-panel/offers" },
        ]}
        linksCol2={[
          { label: "Company Portal", href: "/companies" },
          { label: "Candidate Portal", href: "/candidates-portal" },
          { label: "Admin Settings", href: "/admin-panel/settings" },
        ]}
      />
    </div>
  );
}
