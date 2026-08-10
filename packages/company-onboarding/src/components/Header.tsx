import React from "react";
import {
  LayoutGrid,
  Link2,
  Users,
  Activity,
  ShieldCheck,
  Settings,
  Wand2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { FirebaseAuthService } from "@talent-flow/api";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  companyName: string;
  subdomain?: string;
  industry?: string;
  size?: string;
  adminEmail?: string;
  progressPercent: number;
  isCompleted: boolean;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  onNavigateRoute?: (path: string, tab?: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  companyName,
  subdomain,
  industry,
  size,
  adminEmail,
  progressPercent,
  isCompleted,
  activeSubTab = "pipeline",
  onSelectSubTab,
  onNavigateRoute,
  onLogout,
}) => {
  const companySlug = companyName ? companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "company";
  const dynamicDashPath = `/companies/${companySlug}/dashboard`;

  const navItems = isCompleted
    ? [
        { id: "pipeline", label: "Pipeline Board", icon: LayoutGrid },
        { id: "connectors", label: "Connectors & Sourcing", icon: Link2 },
        { id: "interactions", label: "Company Interactions", icon: Activity },
        { id: "overview", label: "Overview", icon: ShieldCheck },
        { id: "team", label: "Hiring Team", icon: Users },
        { id: "settings", label: "Company Settings", icon: Settings },
      ]
    : [{ id: "wizard", label: "Setup Wizard", icon: Wand2 }];

  const handleRouteClick = (tabId: string) => {
    if (isCompleted) {
      setActiveTab("dashboard");
      if (onSelectSubTab) {
        onSelectSubTab(tabId);
      }
      if (onNavigateRoute) {
        const targetPath =
          tabId === "pipeline" ? dynamicDashPath : `${dynamicDashPath}?tab=${tabId}`;
        onNavigateRoute(targetPath, "dashboard");
      }
    } else {
      setActiveTab("wizard");
      if (onNavigateRoute) {
        onNavigateRoute(dynamicDashPath, "wizard");
      }
    }
  };

  const handleLogoutCompany = async () => {
    await FirebaseAuthService.signOut();
    localStorage.removeItem("talentflow_company_auth");
    localStorage.removeItem("talentflow_company_profile");
    localStorage.removeItem("talentflow_active_company_id");
    toast.info("Company workspace session signed out");
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/companies/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md font-sans shadow-2xs h-14 flex items-center px-4 sm:px-6">
      <div className="w-full flex items-center justify-between gap-3 min-w-0">
        {/* Company Section (Left) */}
        <div
          onClick={() => {
            if (onNavigateRoute) {
              onNavigateRoute("/companies", "home");
            } else {
              setActiveTab("home");
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 min-w-0"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-ember text-ember-foreground font-bold text-xs shadow-xs transition-transform group-hover:scale-105 shrink-0">
            {companyName ? companyName.slice(0, 2).toUpperCase() : "CO"}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="font-display text-sm text-foreground font-bold leading-tight group-hover:text-ember transition-colors truncate max-w-140px sm:max-w-[180px]">
                {companyName || "Company Workspace"}
              </h1>
              <span className="bg-success/15 text-success border border-success/30 text-9px px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                {isCompleted ? "Active" : `${progressPercent}%`}
              </span>
            </div>
            <p className="text-10px text-muted-foreground mt-0.5 flex items-center gap-1 truncate max-w-[180px] sm:max-w-240px">
              <span className="font-mono text-ember font-medium truncate">
                {subdomain || companySlug}.talentflow.hub
              </span>
              {industry && (
                <>
                  <span>·</span>
                  <span className="truncate">{industry}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Center) */}
        <nav className="flex items-center gap-0.5 overflow-x-auto no-scrollbar py-1 whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCompleted
              ? activeTab === "dashboard" && activeSubTab === item.id
              : activeTab === "wizard";

            return (
              <button
                key={item.id}
                onClick={() => handleRouteClick(item.id)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-ember text-ember-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Admin Account Info & Sign Out Button */}
        <div className="flex items-center gap-3 shrink-0">
          {adminEmail && (
            <div className="text-right hidden xl:block text-11px leading-tight">
              <p className="text-muted-foreground text-9px uppercase font-semibold tracking-wider">
                Admin Account
              </p>
              <p className="font-medium text-foreground font-mono text-10px truncate max-w-160px">
                {adminEmail}
              </p>
            </div>
          )}

          {/* Company Logout Button */}
          <button
            onClick={handleLogoutCompany}
            className="p-1.5 rounded-md bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs text-xs"
            title="Sign Out Company Session"
          >
            <LogOut className="size-3.5 text-ember" />
            <span className="text-11px font-medium hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
