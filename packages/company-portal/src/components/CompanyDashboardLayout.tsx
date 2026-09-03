import React, { useState } from "react";
import {
  Search,
  LayoutDashboard,
  Briefcase,
  Users,
  Headphones,
  Sliders,
  BarChart3,
  Table2,
  Smartphone,
  Lock,
  AlertTriangle,
  Menu,
  Moon,
  Sun,
  Bell,
  MessageSquare,
  Maximize2,
  Minimize2,
  ChevronRight,
  LogOut,
  Settings,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "../lib/sweetalert";
import { OnboardingState } from "../types/onboarding";
import { Candidate, CompanyPipelineBoard } from "./CompanyPipelineBoard";
import { ConnectorsHub } from "./ConnectorsHub";
import { TeamManagement } from "./TeamManagement";
import { CompanySettingsComponent } from "./CompanySettings";
import { EmployXDashboardOverview } from "./EmployXDashboardOverview";
import { CompanyJobsList } from "./CompanyJobsList";
import { CreateJobModal } from "./CreateJobModal";
import { Footer } from "./Footer";

interface CompanyDashboardLayoutProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  candidates: Candidate[];
  onAdvanceCandidate: (id: string) => void;
  onFetchConnectorCandidates: (source: "LinkedIn" | "Google Sheets") => void;
  interactionsLog: { id: string; at: string; actor: string; action: string; channel: string }[];
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  onLogout?: () => void;
}

export const CompanyDashboardLayout: React.FC<CompanyDashboardLayoutProps> = ({
  state,
  setState,
  candidates,
  onAdvanceCandidate,
  onFetchConnectorCandidates,
  interactionsLog,
  activeSubTab = "dashboard",
  onSelectSubTab,
  onLogout,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(activeSubTab || "dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState<boolean>(false);

  // Menu expansion state for sidebar categories
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    jobs: false,
    candidates: false,
    support: false,
    features: false,
    forms: false,
    tables: false,
    apps: false,
    auth: false,
    misc: false,
  });

  const toggleSubmenu = (key: string) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleParentMenuClick = (key: string) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setExpandedMenus((prev) => ({ ...prev, [key]: true }));
    } else {
      toggleSubmenu(key);
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (onSelectSubTab) onSelectSubTab(tab);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      toast.info("Dark mode activated");
    } else {
      document.documentElement.classList.remove("dark");
      toast.info("Light mode activated");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f4f6fb] dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      {/* =========================================================================
          LEFT SIDEBAR (Fixed at left: 0, dynamic responsive width, never scrolled away)
         ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 h-screen bg-[#545C78] text-white flex flex-col justify-between shrink-0 transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-60 xl:w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo / Brand Header */}
          <div className="h-14 flex items-center justify-center px-4 border-b border-white/10 bg-[#545C78] shrink-0">
            {state?.profile?.logoUrl ? (
              <img
                src={state.profile.logoUrl}
                alt={state?.profile?.name || "Company Logo"}
                className="max-h-9 max-w-full object-contain rounded-lg p-0.5 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-400 flex items-center justify-center shrink-0 shadow-md font-bold text-xs text-white uppercase tracking-wider">
                {state?.profile?.name ? state.profile.name.slice(0, 2).toUpperCase() : "CO"}
              </div>
            )}
          </div>

          {/* Navigation Links Scrollable Area */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5 scrollbar-thin scrollbar-thumb-white/20 overscroll-contain"
          >
            {/* 1. Dashboard (Active) */}
            <button
              onClick={() => handleTabChange("dashboard")}
              className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                currentTab === "dashboard"
                  ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                  : "text-white/85 hover:bg-[#5B6381] hover:text-white"
              }`}
              title="Dashboard"
            >
              <div className="flex items-center gap-3 truncate">
                <LayoutDashboard
                  className={`w-4 h-4 shrink-0 transition-colors ${currentTab === "dashboard" ? "text-white fill-white/20" : "text-orange-400 group-hover:text-orange-300"}`}
                />
                {isSidebarOpen && <span className="truncate">Dashboard</span>}
              </div>
            </button>

            {/* 2. Jobs */}
            <div>
              <button
                onClick={() => handleParentMenuClick("jobs")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "jobs-list" || currentTab === "jobs" || currentTab === "create-job"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Jobs & Requisitions"
              >
                <div className="flex items-center gap-3 truncate">
                  <Briefcase
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      currentTab === "jobs-list" ||
                      currentTab === "jobs" ||
                      currentTab === "create-job"
                        ? "text-white fill-white/20"
                        : "text-orange-400 group-hover:text-orange-300"
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">Jobs</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      currentTab === "jobs-list" ||
                      currentTab === "jobs" ||
                      currentTab === "create-job"
                        ? "text-white"
                        : "text-orange-400/80"
                    } transition-transform ${expandedMenus.jobs ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.jobs && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("jobs-list")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "jobs-list" || currentTab === "jobs"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Manage Jobs
                  </button>
                </div>
              )}
            </div>

            {/* 3. Candidates */}
            <div>
              <button
                onClick={() => handleParentMenuClick("candidates")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "pipeline" || currentTab === "connectors"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Candidates"
              >
                <div className="flex items-center gap-3 truncate">
                  <Users
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      currentTab === "pipeline" || currentTab === "connectors"
                        ? "text-white fill-white/20"
                        : "text-orange-400 group-hover:text-orange-300"
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">Candidates</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      currentTab === "pipeline" || currentTab === "connectors"
                        ? "text-white"
                        : "text-orange-400/80"
                    } transition-transform ${expandedMenus.candidates ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.candidates && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("pipeline")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "pipeline"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Hiring Pipeline
                  </button>
                  <button
                    onClick={() => handleTabChange("connectors")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "connectors"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Sourcing Connectors
                  </button>
                </div>
              )}
            </div>

            {/* 4. Support */}
            <div>
              <button
                onClick={() => handleParentMenuClick("support")}
                className="clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/85 hover:bg-[#5B6381] hover:text-white transition-all cursor-pointer group"
                title="Support"
              >
                <div className="flex items-center gap-3 truncate">
                  <Headphones className="w-4 h-4 text-orange-400 group-hover:text-orange-300 shrink-0 transition-colors" />
                  {isSidebarOpen && <span className="truncate">Support</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-orange-400/80 transition-transform ${expandedMenus.support ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.support && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => toast.info("EmployX Help Center & Documentation")}
                    className="w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    Help Center
                  </button>
                  <button
                    onClick={() => toast.info("Recruiter Support: support@talentflow.internal")}
                    className="w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    Contact Support
                  </button>
                </div>
              )}
            </div>

            {/* Section Header: Components */}
            {isSidebarOpen && (
              <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-white/50">
                Components
              </div>
            )}

            {/* 5. Features (Connectors) */}
            <div>
              <button
                onClick={() => handleParentMenuClick("features")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "connectors"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Features & Connectors"
              >
                <div className="flex items-center gap-3 truncate">
                  <Sliders
                    className={`w-4 h-4 shrink-0 transition-colors ${currentTab === "connectors" ? "text-white fill-white/20" : "text-orange-400 group-hover:text-orange-300"}`}
                  />
                  {isSidebarOpen && <span className="truncate">Features</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${currentTab === "connectors" ? "text-white" : "text-orange-400/80"} transition-transform ${expandedMenus.features ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.features && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("connectors")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "connectors"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Sourcing Connectors
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange("connectors");
                      toast.info("LinkedIn & Google Sheets Integrations Active");
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    Integration Hub
                  </button>
                </div>
              )}
            </div>

            {/* 6. Forms & Charts */}
            <div>
              <button
                onClick={() => handleParentMenuClick("forms")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "dashboard" || currentTab === "pipeline"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Forms & Charts"
              >
                <div className="flex items-center gap-3 truncate">
                  <BarChart3
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      currentTab === "dashboard" || currentTab === "pipeline"
                        ? "text-white fill-white/20"
                        : "text-orange-400 group-hover:text-orange-300"
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">Forms & Charts</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      currentTab === "dashboard" || currentTab === "pipeline"
                        ? "text-white"
                        : "text-orange-400/80"
                    } transition-transform ${expandedMenus.forms ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.forms && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "dashboard"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Overview Analytics
                  </button>
                  <button
                    onClick={() => handleTabChange("pipeline")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "pipeline"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Workflow Charts
                  </button>
                </div>
              )}
            </div>

            {/* 7. Tables (Audit Log) */}
            <div>
              <button
                onClick={() => handleParentMenuClick("tables")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "interactions" || currentTab === "jobs-list"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Tables & Audit Log"
              >
                <div className="flex items-center gap-3 truncate">
                  <Table2
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      currentTab === "interactions" || currentTab === "jobs-list"
                        ? "text-white fill-white/20"
                        : "text-orange-400 group-hover:text-orange-300"
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">Tables</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      currentTab === "interactions" || currentTab === "jobs-list"
                        ? "text-white"
                        : "text-orange-400/80"
                    } transition-transform ${expandedMenus.tables ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.tables && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("interactions")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "interactions"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Audit Feed & Logs
                  </button>
                  <button
                    onClick={() => handleTabChange("jobs-list")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "jobs-list"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Requisitions Table
                  </button>
                </div>
              )}
            </div>

            {/* 8. Apps & Widgets (Team) */}
            <div>
              <button
                onClick={() => handleParentMenuClick("apps")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "team" || currentTab === "connectors"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Apps & Team Management"
              >
                <div className="flex items-center gap-3 truncate">
                  <Smartphone
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      currentTab === "team" || currentTab === "connectors"
                        ? "text-white fill-white/20"
                        : "text-orange-400 group-hover:text-orange-300"
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">Apps & Widgets</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      currentTab === "team" || currentTab === "connectors"
                        ? "text-white"
                        : "text-orange-400/80"
                    } transition-transform ${expandedMenus.apps ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.apps && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("team")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "team"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Team Management
                  </button>
                  <button
                    onClick={() => handleTabChange("connectors")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "connectors"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Connected Apps
                  </button>
                </div>
              )}
            </div>

            {/* 9. Authentication */}
            <div>
              <button
                onClick={() => handleParentMenuClick("auth")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "settings"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Authentication & Security"
              >
                <div className="flex items-center gap-3 truncate">
                  <Lock
                    className={`w-4 h-4 shrink-0 transition-colors ${currentTab === "settings" ? "text-white fill-white/20" : "text-orange-400 group-hover:text-orange-300"}`}
                  />
                  {isSidebarOpen && <span className="truncate">Authentication</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${currentTab === "settings" ? "text-white" : "text-orange-400/80"} transition-transform ${expandedMenus.auth ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.auth && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("settings")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "settings"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Company Profile
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange("settings");
                      toast.info("Security & Access Settings");
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    Security & Access
                  </button>
                </div>
              )}
            </div>

            {/* 10. Miscellaneous */}
            <div>
              <button
                onClick={() => handleParentMenuClick("misc")}
                className="clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/85 hover:bg-[#5B6381] hover:text-white transition-all cursor-pointer group"
                title="Miscellaneous"
              >
                <div className="flex items-center gap-3 truncate">
                  <AlertTriangle className="w-4 h-4 text-orange-400 group-hover:text-orange-300 shrink-0 transition-colors" />
                  {isSidebarOpen && <span className="truncate">Miscellaneous</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-orange-400/80 transition-transform ${expandedMenus.misc ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.misc && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("settings")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "settings"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Platform Settings
                  </button>
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      currentTab === "dashboard"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    System Overview
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Settings & User Profile Section */}
          <div className="border-t border-white/10 p-2.5 space-y-1.5 bg-[#545C78] shrink-0 relative">
            {/* Settings Link */}
            <button
              onClick={() => handleTabChange("settings")}
              className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                currentTab === "settings"
                  ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                  : "text-white/85 hover:bg-[#5B6381] hover:text-white"
              }`}
              title="Workspace Settings"
            >
              <div className="flex items-center gap-3 truncate">
                <Settings
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    currentTab === "settings"
                      ? "text-white fill-white/20"
                      : "text-orange-400 group-hover:text-orange-300"
                  }`}
                />
                {isSidebarOpen && <span className="truncate">Settings</span>}
              </div>
              {isSidebarOpen && (
                <ChevronRight
                  className={`w-3.5 h-3.5 ${
                    currentTab === "settings" ? "text-white" : "text-orange-400/80"
                  }`}
                />
              )}
            </button>

            {/* User Profile Card / Trigger */}
            <div className="relative pt-1 border-t border-white/10">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-full flex items-center ${
                  isSidebarOpen ? "justify-between px-2 py-1.5" : "justify-center py-1"
                } rounded-xl hover:bg-white/10 transition-colors cursor-pointer group`}
                title={`${state?.admin?.fullName || "Nil Yeager"} (${state?.admin?.workEmail || "recruiter@employx.io"})`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="relative w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 border-2 border-emerald-500 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    <svg viewBox="0 0 40 40" className="w-full h-full">
                      <circle cx="20" cy="16" r="8" fill="#fde047" />
                      <rect x="14" y="14" width="4" height="3" rx="1" fill="#1e293b" />
                      <rect x="22" y="14" width="4" height="3" rx="1" fill="#1e293b" />
                      <line
                        x1="18"
                        y1="15.5"
                        x2="22"
                        y2="15.5"
                        stroke="#1e293b"
                        strokeWidth="1.5"
                      />
                      <path d="M10 36C10 28 15 26 20 26C25 26 30 28 30 36" fill="#3b82f6" />
                    </svg>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  {isSidebarOpen && (
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-white font-semibold text-xs tracking-tight truncate">
                        {state?.admin?.fullName || "Nil Yeager"}
                      </span>
                      <span className="text-white/70 text-[10.5px] truncate">
                        {state?.admin?.jobTitle || state?.admin?.workEmail || "HR Admin"}
                      </span>
                    </div>
                  )}
                </div>
                {isSidebarOpen && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onLogout) onLogout();
                    }}
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-rose-400 shrink-0 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>

              {/* Profile Popup Menu */}
              {showProfileMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs animate-fadeIn text-slate-800 dark:text-slate-100">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {state?.admin?.fullName || "Nil Yeager"}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {state?.admin?.workEmail || "recruiter@employx.io"}
                    </div>
                    <div className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
                      {state?.admin?.jobTitle || "HR Admin / Recruiter"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleTabChange("dashboard");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-medium">Overview</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleTabChange("settings");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium">Workspace Settings</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA & TOP HEADER BAR (Dynamic left padding to offset fixed sidebar)
         ========================================================================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarOpen ? "pl-60 xl:pl-64" : "pl-16"
        }`}
      >
        {/* Top Header Bar (Fixed at top) */}
        <header
          className={`fixed top-0 right-0 h-14 bg-[#545C78] text-white border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shadow-xs z-30 transition-all duration-300 ${
            isSidebarOpen ? "left-60 xl:left-64" : "left-16"
          }`}
        >
          {/* Left Controls: Hamburger + Search Input */}
          <div className="flex items-center gap-3.5 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Rounded Search Input with Icon */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:bg-white/15 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-white/60 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* View Breadcrumb */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-white/20">
              <span className="text-xs font-bold text-white/90">
                {currentTab === "dashboard" && "EmployX Overview"}
                {currentTab === "create-job" && "Create New Job Posting"}
                {currentTab === "jobs-list" && "Job Requisitions & Postings"}
                {currentTab === "pipeline" && "Hiring Pipeline"}
                {currentTab === "connectors" && "Sourcing Connectors"}
                {currentTab === "interactions" && "Interactions Feed"}
                {currentTab === "team" && "Team & Roles"}
                {currentTab === "settings" && "Workspace Settings"}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Dark Mode Moon Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-orange-400 absolute top-1.5 right-1.5 ring-2 ring-[#545C78]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 text-xs space-y-2 animate-fadeIn text-slate-800 dark:text-slate-100">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800 font-bold">
                    <span>Notifications (3)</span>
                    <span className="text-[10px] text-blue-500 font-normal">Mark read</span>
                  </div>
                  <div className="p-2 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      10 new candidates applied
                    </span>
                    <p className="text-[10px] text-slate-500">For Project Manager Requisition</p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Offer signed by Alex Rivera
                    </span>
                    <p className="text-[10px] text-slate-500">Target start date 01/09/2026</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat / Message Icon */}
            <button
              onClick={() => toast.info("Opened Recruiter Live Chat")}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Messages"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* US Flag / Language Selector */}
            <div
              className="flex items-center px-1.5 py-1 rounded hover:bg-white/10 cursor-pointer transition-colors"
              title="Language: English (US)"
            >
              <span className="text-base leading-none">🇺🇸</span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:inline-flex"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Fixed Header Spacer */}
        <div className="h-14 shrink-0" aria-hidden="true" />

        {/* Viewport Content */}
        <main className="flex-1 p-3.5 sm:p-4.5 lg:p-5">
          <div className="max-w-[1500px] mx-auto">
            {currentTab === "dashboard" && (
              <EmployXDashboardOverview
                state={state}
                onNavigateTab={(tab) => handleTabChange(tab)}
              />
            )}

            {(currentTab === "jobs-list" ||
              currentTab === "create-job" ||
              currentTab === "jobs") && (
              <div className="space-y-4 animate-fadeIn">
                <CompanyJobsList
                  state={state}
                  onCreateNewJob={() => setIsCreateJobModalOpen(true)}
                  onNavigatePipeline={() => handleTabChange("pipeline")}
                />
              </div>
            )}

            {currentTab === "pipeline" && (
              <div className="space-y-4 animate-fadeIn">
                <CompanyPipelineBoard
                  companyName={state.profile.name}
                  logoUrl={state.profile.logoUrl}
                  candidates={candidates}
                  onAdvanceCandidate={onAdvanceCandidate}
                  workflowStages={state.recruitmentWorkflow}
                />
              </div>
            )}

            {currentTab === "connectors" && (
              <div className="space-y-4 animate-fadeIn">
                <ConnectorsHub
                  onFetchCandidates={onFetchConnectorCandidates}
                  interactionsCount={
                    interactionsLog.filter(
                      (l) => l.channel === "LinkedIn" || l.channel === "Google Sheets",
                    ).length
                  }
                />
              </div>
            )}

            {currentTab === "interactions" && (
              <div className="space-y-4 animate-fadeIn bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Candidate Interactions Audit Feed
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time audit log of all candidate stage advances, connector imports, and
                    recruiter actions.
                  </p>
                </div>

                <div className="overflow-x-auto mt-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Timestamp</th>
                        <th className="p-2.5">Actor / Recruiter</th>
                        <th className="p-2.5">Action Description</th>
                        <th className="p-2.5">Channel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {interactionsLog.length > 0 ? (
                        interactionsLog.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                          >
                            <td className="p-2.5 text-slate-400 font-mono text-[10.5px]">
                              {log.at}
                            </td>
                            <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                              {log.actor}
                            </td>
                            <td className="p-2.5 text-slate-700 dark:text-slate-300">
                              {log.action}
                            </td>
                            <td className="p-2.5">
                              <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                                {log.channel}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400 text-xs">
                            No interactions logged yet. Sync a connector or advance candidates to
                            populate this table.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentTab === "team" && (
              <div className="space-y-4 animate-fadeIn">
                <TeamManagement state={state} setState={setState} />
              </div>
            )}

            {currentTab === "settings" && (
              <div className="space-y-4 animate-fadeIn">
                <CompanySettingsComponent state={state} setState={setState} />
              </div>
            )}
          </div>
        </main>

        {/* Monorepo Standard Dashboard Footer (Full-width edge-to-edge flush footer) */}
        <Footer
          linksCol1={[
            { label: "Post New Job", href: "#", onClick: () => setIsCreateJobModalOpen(true) },
            { label: "Manage Jobs", href: "#", onClick: () => handleTabChange("jobs-list") },
            { label: "Pipeline Board", href: "#", onClick: () => handleTabChange("pipeline") },
            { label: "Connectors Hub", href: "#", onClick: () => handleTabChange("connectors") },
            { label: "Team Management", href: "#", onClick: () => handleTabChange("team") },
            { label: "Company Settings", href: "#", onClick: () => handleTabChange("settings") },
          ]}
          linksCol2={[
            { label: "Candidate Portal", href: "/candidates-portal" },
            { label: "Admin CRM Panel", href: "/admin-panel" },
            { label: "Company Home", href: "/companies" },
          ]}
        />
      </div>

      {/* Global Quick Create Job Modal */}
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
        state={state}
        onJobCreated={() => {
          setIsCreateJobModalOpen(false);
          handleTabChange("jobs-list");
        }}
      />
    </div>
  );
};
