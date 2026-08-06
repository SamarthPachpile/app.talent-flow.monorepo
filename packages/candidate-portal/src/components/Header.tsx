import React, { useState } from "react";
import { CandidateProfile } from "../types/candidate";
import {
  Bell,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  Building2,
  LogOut,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { FirebaseAuthService, CompanyDocument } from "@talent-flow/api";

interface HeaderProps {
  candidate: CandidateProfile;
  company?: CompanyDocument | null;
  activeCandidateKey: string;
  onSelectCandidate: (key: string) => void;
  unreadCount: number;
  onToggleNotifications: () => void;
  onOpenHelpdesk: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  candidate,
  company,
  activeCandidateKey,
  onSelectCandidate,
  unreadCount,
  onToggleNotifications,
  onOpenHelpdesk,
  onOpenSettings,
  darkMode,
  onToggleDarkMode,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogoutCandidate = async () => {
    await FirebaseAuthService.signOut();
    localStorage.removeItem("talentflow_candidate_auth");
    toast.info("Candidate session signed out");
    if (onLogout) {
      onLogout();
    }
    window.location.href = "/candidates-portal";
  };

  const compColor = company?.brandColor || "#6366f1";
  const compName = company?.name || candidate.companyName || "TalentFlow Hub";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
        {/* Brand Logo & Candidate Title */}
        <div className="flex items-center gap-3">
          <a
            href="/candidates-portal"
            title="Candidate Portal Directory"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={compName}
                className="size-9 rounded-xl object-cover border border-border bg-surface p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <span
                className="grid size-9 place-items-center rounded-xl text-white font-bold text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: compColor }}
              >
                {compName.substring(0, 2).toUpperCase()}
              </span>
            )}
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground group-hover:text-ember transition-colors">
                  {compName}
                </p>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                  /{company?.subdomain || "portal"}/
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {candidate.name} · Candidate Operations
              </p>
            </div>
          </a>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* Candidate Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Building2 className="size-3.5 text-muted-foreground" />
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="size-4 rounded-full object-cover"
              />
              <span className="font-medium text-foreground">{candidate.name}</span>
              <span className="text-muted-foreground text-[11px]">({candidate.companyName})</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-md shadow-lifted p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-border text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Select Candidate Persona
                </div>

                <button
                  onClick={() => {
                    onSelectCandidate("alex");
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-md transition-colors flex items-center justify-between mt-1 cursor-pointer ${
                    activeCandidateKey === "alex"
                      ? "bg-accent font-medium text-foreground"
                      : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Alex"
                      className="size-6 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Alex Rivera</div>
                      <div className="text-[10px] text-ember">Stage 5: Laptop & Hardware</div>
                    </div>
                  </div>
                  {activeCandidateKey === "alex" && <CheckCircle2 className="size-4 text-ember" />}
                </button>

                <button
                  onClick={() => {
                    onSelectCandidate("sarah");
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                    activeCandidateKey === "sarah"
                      ? "bg-accent font-medium text-foreground"
                      : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
                      alt="Sarah"
                      className="size-6 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Sarah Chen</div>
                      <div className="text-[10px] text-warning-foreground">
                        Stage 3: Offer Letter
                      </div>
                    </div>
                  </div>
                  {activeCandidateKey === "sarah" && <CheckCircle2 className="size-4 text-ember" />}
                </button>
              </div>
            )}
          </div>

          {/* HR Chat Button */}
          <button
            onClick={onOpenHelpdesk}
            className="flex items-center gap-1.5 rounded-md bg-surface border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            <MessageSquare className="size-3.5 text-ember" />
            <span>Ask HR</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-md bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            title="Candidate Settings"
          >
            <Settings className="size-4 text-muted-foreground" />
          </button>

          {/* Notifications */}
          <button
            onClick={onToggleNotifications}
            className="relative p-1.5 rounded-md bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 bg-ember text-ember-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Sign Out Candidate Session */}
          <button
            onClick={handleLogoutCandidate}
            className="p-1.5 rounded-md bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            title="Sign Out Candidate Session"
          >
            <LogOut className="size-4 text-ember" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-md bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="size-4 text-warning" />
            ) : (
              <Moon className="size-4 text-ember" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
