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
  ChevronDown,
  Layers,
  Sparkles,
  LogOut,
  Settings,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Coins,
  Mail,
  User,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { OnboardingState } from "../types/onboarding";
import { Candidate, CompanyPipelineBoard } from "./CompanyPipelineBoard";
import { ConnectorsHub } from "./ConnectorsHub";
import { TeamManagement } from "./TeamManagement";
import { CompanySettingsComponent as CompanyProfileSettings } from "./CompanySettings";
import { EmployXDashboardOverview } from "./EmployXDashboardOverview";
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

  const companyName = state?.profile?.name || "EmployX Enterprise";

  return (
    <div className="flex min-h-screen w-full bg-[#f4f6fb] dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      {/* =========================================================================
          LEFT SIDEBAR (Fixed at left: 0, dynamic responsive width, never scrolled away)
         ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 h-screen bg-[#545C78] text-white flex flex-col justify-between shrink-0 transition-all duration-300 z-40 shadow-2xl ${
          isSidebarOpen ? "w-60 xl:w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo / Brand Header */}
          <div className="h-14 flex items-center px-4 gap-2.5 border-b border-white/10 bg-[#464D67] shrink-0">
            {/* EmployX Logo Icon: Gradient Swirl */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-400 flex items-center justify-center shrink-0 shadow-md">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" stroke="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5c1.42 0 2.68.66 3.5 1.69L14.7 11c-.39-.5-.99-.8-1.7-.8-1.21 0-2.2.99-2.2 2.2s.99 2.2 2.2 2.2c.71 0 1.31-.3 1.7-.8l1.8 1.81c-.82 1.03-2.08 1.69-3.5 1.69z" />
              </svg>
            </div>
            {isSidebarOpen && (
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-white font-extrabold text-base tracking-tight truncate">
                  EmployX
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#e6ea9c] text-slate-900 shadow-2xs">
                  CRM
                </span>
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
                onClick={() => {
                  toggleSubmenu("jobs");
                  handleTabChange("pipeline");
                }}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "pipeline"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Jobs & Pipeline"
              >
                <div className="flex items-center gap-3 truncate">
                  <Briefcase
                    className={`w-4 h-4 shrink-0 transition-colors ${currentTab === "pipeline" ? "text-white fill-white/20" : "text-orange-400 group-hover:text-orange-300"}`}
                  />
                  {isSidebarOpen && <span className="truncate">Jobs</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${currentTab === "pipeline" ? "text-white" : "text-orange-400/80"} transition-transform ${expandedMenus.jobs ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.jobs && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("pipeline")}
                    className="w-full text-left py-1 text-[11px] text-white/75 hover:text-white cursor-pointer"
                  >
                    28-Stage Pipeline
                  </button>
                  <button
                    onClick={() => toast.info("Opening Requisitions Manager")}
                    className="w-full text-left py-1 text-[11px] text-white/75 hover:text-white cursor-pointer"
                  >
                    Manage Requisitions
                  </button>
                </div>
              )}
            </div>

            {/* 3. Candidates */}
            <div>
              <button
                onClick={() => {
                  toggleSubmenu("candidates");
                  handleTabChange("pipeline");
                }}
                className="clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/85 hover:bg-[#5B6381] hover:text-white transition-all cursor-pointer group"
                title="Candidates"
              >
                <div className="flex items-center gap-3 truncate">
                  <Users className="w-4 h-4 text-orange-400 group-hover:text-orange-300 shrink-0 transition-colors" />
                  {isSidebarOpen && <span className="truncate">Candidates</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-orange-400/80 transition-transform ${expandedMenus.candidates ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {isSidebarOpen && expandedMenus.candidates && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                  <button
                    onClick={() => handleTabChange("pipeline")}
                    className="w-full text-left py-1 text-[11px] text-white/75 hover:text-white cursor-pointer"
                  >
                    Active Candidates
                  </button>
                  <button
                    onClick={() => handleTabChange("connectors")}
                    className="w-full text-left py-1 text-[11px] text-white/75 hover:text-white cursor-pointer"
                  >
                    Sourcing Connectors
                  </button>
                </div>
              )}
            </div>

            {/* 4. Support */}
            <div>
              <button
                onClick={() => {
                  toggleSubmenu("support");
                  toast.info("Customer & Candidate Support Helpdesk");
                }}
                className="clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/85 hover:bg-[#5B6381] hover:text-white transition-all cursor-pointer group"
                title="Support"
              >
                <div className="flex items-center gap-3 truncate">
                  <Headphones className="w-4 h-4 text-orange-400 group-hover:text-orange-300 shrink-0 transition-colors" />
                  {isSidebarOpen && <span className="truncate">Support</span>}
                </div>
                {isSidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-orange-400/80" />}
              </button>
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
                onClick={() => {
                  toggleSubmenu("features");
                  handleTabChange("connectors");
                }}
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
                    className={`w-3.5 h-3.5 ${currentTab === "connectors" ? "text-white" : "text-orange-400/80"}`}
                  />
                )}
              </button>
            </div>

            {/* 6. Forms & Charts */}
            <div>
              <button
                onClick={() => {
                  toggleSubmenu("forms");
                  handleTabChange("dashboard");
                }}
                className="clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/85 hover:bg-[#5B6381] hover:text-white transition-all cursor-pointer group"
                title="Forms & Charts"
              >
                <div className="flex items-center gap-3 truncate">
                  <BarChart3 className="w-4 h-4 text-orange-400 group-hover:text-orange-300 shrink-0 transition-colors" />
                  {isSidebarOpen && <span className="truncate">Forms & Charts</span>}
                </div>
                {isSidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-orange-400/80" />}
              </button>
            </div>

            {/* 7. Tables (Audit Log) */}
            <div>
              <button
                onClick={() => handleTabChange("interactions")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "interactions"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Tables & Audit Log"
              >
                <div className="flex items-center gap-3 truncate">
                  <Table2
                    className={`w-4 h-4 shrink-0 transition-colors ${currentTab === "interactions" ? "text-white fill-white/20" : "text-orange-400 group-hover:text-orange-300"}`}
                  />
                  {isSidebarOpen && <span className="truncate">Tables</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${currentTab === "interactions" ? "text-white" : "text-orange-400/80"}`}
                  />
                )}
              </button>
            </div>

            {/* 8. Apps & Widgets (Team) */}
            <div>
              <button
                onClick={() => handleTabChange("team")}
                className={`clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all cursor-pointer group ${
                  currentTab === "team"
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                }`}
                title="Apps & Team Management"
              >
                <div className="flex items-center gap-3 truncate">
                  <Smartphone
                    className={`w-4 h-4 shrink-0 transition-colors ${currentTab === "team" ? "text-white fill-white/20" : "text-orange-400 group-hover:text-orange-300"}`}
                  />
                  {isSidebarOpen && <span className="truncate">Apps & Widgets</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${currentTab === "team" ? "text-white" : "text-orange-400/80"}`}
                  />
                )}
              </button>
            </div>

            {/* 9. Authentication */}
            <div>
              <button
                onClick={() => handleTabChange("settings")}
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
                    className={`w-3.5 h-3.5 ${currentTab === "settings" ? "text-white" : "text-orange-400/80"}`}
                  />
                )}
              </button>
            </div>

            {/* 10. Miscellaneous */}
            <div>
              <button
                onClick={() => handleTabChange("settings")}
                className="clip-path-button-sm w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/85 hover:bg-[#5B6381] hover:text-white transition-all cursor-pointer group"
                title="Miscellaneous"
              >
                <div className="flex items-center gap-3 truncate">
                  <AlertTriangle className="w-4 h-4 text-orange-400 group-hover:text-orange-300 shrink-0 transition-colors" />
                  {isSidebarOpen && <span className="truncate">Miscellaneous</span>}
                </div>
                {isSidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-orange-400/80" />}
              </button>
            </div>
          </div>

          {/* =========================================================================
              SIDEBAR FOOTER BANNER: "Best Job portal" Floating Card
             ========================================================================= */}
          {isSidebarOpen && (
            <div className="p-3 m-2 rounded-xl bg-white text-slate-800 shadow-xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              {/* Cute SVG Illustration of 3 candidates & avatars */}
              <div className="h-16 w-full flex items-center justify-center my-0.5">
                <svg viewBox="0 0 140 60" className="w-full h-full" fill="none">
                  {/* Floating Candidate 1 (Left) */}
                  <circle cx="35" cy="22" r="10" fill="#fed7aa" />
                  <path d="M28 20C28 14 32 12 38 12C42 13 44 16 44 19" fill="#1e293b" />
                  <rect x="25" y="32" width="20" height="22" rx="3" fill="#3b82f6" />
                  {/* Avatar Frame Box */}
                  <rect
                    x="22"
                    y="10"
                    width="26"
                    height="26"
                    rx="4"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  {/* Candidate 2 Center (Leader) */}
                  <circle cx="70" cy="18" r="11" fill="#fbcfe8" />
                  <path d="M62 16C62 10 66 8 74 8C78 9 80 12 80 15" fill="#ca8a04" />
                  <rect x="58" y="30" width="24" height="26" rx="3" fill="#f59e0b" />
                  {/* Avatar Frame Box */}
                  <rect
                    x="55"
                    y="6"
                    width="30"
                    height="30"
                    rx="4"
                    stroke="#fde047"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  {/* Candidate 3 Right */}
                  <circle cx="105" cy="22" r="10" fill="#fed7aa" />
                  <path d="M98 20C98 14 102 12 108 12C112 13 114 16 114 19" fill="#ef4444" />
                  <rect x="95" y="32" width="20" height="22" rx="3" fill="#ef4444" />
                  {/* Avatar Frame Box */}
                  <rect
                    x="92"
                    y="10"
                    width="26"
                    height="26"
                    rx="4"
                    stroke="#fca5a5"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Pill Button: Best Job portal */}
              <button
                onClick={() => toast.success("EmployX — Rated #1 AI Recruiting Platform")}
                className="mt-1 w-full py-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-bold tracking-tight transition-colors cursor-pointer"
              >
                Best Job portal
              </button>
            </div>
          )}
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
        {/* Top Header Bar */}
        <header className="sticky top-0 h-14 bg-white dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-20">
          {/* Left Controls: Hamburger + Search Input */}
          <div className="flex items-center gap-3.5 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* View Breadcrumb */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentTab === "dashboard" && "EmployX Overview"}
                {currentTab === "pipeline" && "28-Stage Pipeline"}
                {currentTab === "connectors" && "Sourcing Connectors"}
                {currentTab === "interactions" && "Interactions Feed"}
                {currentTab === "team" && "Team & Roles"}
                {currentTab === "settings" && "Workspace Settings"}
              </span>
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Dark Mode Moon Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-850" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 text-xs space-y-2 animate-fadeIn">
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
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Messages"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* US Flag / Language Selector */}
            <div
              className="flex items-center px-1.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Language: English (US)"
            >
              <span className="text-base leading-none">🇺🇸</span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:inline-flex"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Sliders / Settings Icon */}
            <button
              onClick={() => handleTabChange("settings")}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:inline-flex"
              title="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* User Profile Avatar Dropdown (Nil Yeager) */}
            <div className="relative ml-1">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 border-2 border-emerald-500 flex items-center justify-center overflow-hidden cursor-pointer shadow-xs"
                title="Nil Yeager (Active)"
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="16" r="8" fill="#fde047" />
                  <rect x="14" y="14" width="4" height="3" rx="1" fill="#1e293b" />
                  <rect x="22" y="14" width="4" height="3" rx="1" fill="#1e293b" />
                  <line x1="18" y1="15.5" x2="22" y2="15.5" stroke="#1e293b" strokeWidth="1.5" />
                  <path d="M10 36C10 28 15 26 20 26C25 26 30 28 30 36" fill="#3b82f6" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-xs animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-slate-100">Nil Yeager</div>
                    <div className="text-[10px] text-slate-500">
                      {state?.admin?.workEmail || "recruiter@employx.io"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleTabChange("dashboard");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
                    <span>EmployX Overview</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleTabChange("settings");
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Workspace Settings</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-3.5 sm:p-4.5 lg:p-5">
          <div className="max-w-[1500px] mx-auto">
            {currentTab === "dashboard" && (
              <EmployXDashboardOverview
                state={state}
                onNavigateTab={(tab) => handleTabChange(tab)}
              />
            )}

            {currentTab === "pipeline" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      28-Stage Recruitment Pipeline
                    </h2>
                    <p className="text-xs text-slate-500">
                      Autonomous stage advancement and multi-channel screening for {companyName}.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Back to EmployX Dashboard
                  </button>
                </div>
                <CompanyPipelineBoard
                  companyName={state.profile.name}
                  candidates={candidates}
                  onAdvanceCandidate={onAdvanceCandidate}
                  workflowStages={state.recruitmentWorkflow}
                />
              </div>
            )}

            {currentTab === "connectors" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Connectors & Sourcing Hub
                    </h2>
                    <p className="text-xs text-slate-500">
                      Bi-directional sync with LinkedIn Recruiter, Google Sheets, Slack, and HRIS.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Back to EmployX Dashboard
                  </button>
                </div>
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
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Candidate Interactions Audit Feed
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time audit log of all candidate stage advances, connector imports, and
                      recruiter actions.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Back to EmployX Dashboard
                  </button>
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
                <CompanyProfileSettings state={state} setState={setState} />
              </div>
            )}
          </div>
        </main>

        {/* Monorepo Standard Dashboard Footer (Full-width edge-to-edge flush footer) */}
        <Footer
          linksCol1={[
            { label: "Pipeline Board", href: "#", onClick: () => handleTabChange("dashboard") },
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
    </div>
  );
};
