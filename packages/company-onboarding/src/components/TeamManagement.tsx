import React, { useState } from "react";
import { OnboardingState, TeamInvite } from "../types/onboarding";
import { UserPlus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

interface TeamProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
}

export const TeamManagement: React.FC<TeamProps> = ({ state, setState }) => {
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState<
    "Admin" | "Hiring Manager" | "Recruiter" | "Interviewer"
  >("Hiring Manager");
  const [deptInput] = useState("Engineering");

  const addInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const newInvite: TeamInvite = {
      id: Math.random().toString(36).substring(2, 9),
      email: emailInput.trim(),
      role: roleInput,
      department: deptInput,
      status: "Sent",
    };

    setState((prev) => ({
      ...prev,
      teamInvites: [...prev.teamInvites, newInvite],
    }));

    toast.success(`Invite dispatched to ${emailInput}`);
    setEmailInput("");
  };

  const removeInvite = (id: string) => {
    setState((prev) => ({
      ...prev,
      teamInvites: prev.teamInvites.filter((inv) => inv.id !== id),
    }));
    toast.info("Invite cancelled");
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-6 animate-fadeIn">
      <div>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Access Control & Hiring Roster
        </p>
        <h1 className="mt-1 text-4xl leading-none font-display text-foreground">
          Team Invites & Role Governance
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Invite recruiters, hiring managers, and interviewers to join your{" "}
          {state.profile.name || "Company"} workspace.
        </p>
      </div>

      {/* Invite Form */}
      <form
        onSubmit={addInvite}
        className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4"
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <UserPlus className="size-4 text-ember" /> Send Single or Bulk Invitations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <div>
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value as TeamInvite["role"])}
              className="w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Hiring Manager">Hiring Manager</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Interviewer">Interviewer</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-ember text-ember-foreground hover:bg-ember/90 font-medium text-sm py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <Send className="size-4" />
              <span>Send Invite</span>
            </button>
          </div>
        </div>
      </form>

      {/* Team Roster Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-display text-foreground">Pending & Active Team Invites</h3>
          <span className="text-xs text-muted-foreground">{state.teamInvites.length} Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-surface text-muted-foreground uppercase text-[11px] tracking-wider border-b border-border font-semibold">
              <tr>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {state.teamInvites.map((invite) => (
                <tr key={invite.id} className="hover:bg-accent/40">
                  <td className="px-6 py-3.5 font-medium text-foreground">{invite.email}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-foreground font-medium text-[11px]">
                      {invite.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground">{invite.department}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-success/15 text-success border border-success/30 text-[11px] font-semibold">
                      {invite.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => removeInvite(invite.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
