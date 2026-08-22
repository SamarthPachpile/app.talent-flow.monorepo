import React, { useState, useRef } from "react";
import {
  Gauge,
  Search,
  User,
  ShieldCheck,
  Briefcase,
  Menu,
  X,
  Zap,
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Building2,
  CheckCircle2,
  Users,
  Layers,
  FileCheck,
  Camera,
  Upload,
} from "lucide-react";
import {
  CandidatePortalState,
  StageId,
  HardwareSelection,
  AppliedJob,
  AvailableJob,
} from "../types/candidate";
import { OPEN_POSITIONS_CATALOG } from "../data/mockCandidateData";
import { CompanyDocument, uploadCandidateFileToStorage } from "@talent-flow/api";
import { DashboardJobListView } from "./views/DashboardJobListView";
import { SearchJobsView } from "./views/SearchJobsView";
import { CandidateProfileView } from "./views/CandidateProfileView";
import { GdprStatusView } from "./views/GdprStatusView";
import { MyApplicationRoadmapView } from "./views/MyApplicationRoadmapView";
import { JobDescriptionFullPageView } from "./views/JobDescriptionFullPageView";
import { NotificationCenter } from "./NotificationCenter";
import { HelpdeskModal } from "./HelpdeskModal";
import { CandidateSettingsComponent } from "./CandidateSettings";
import { Footer } from "./Footer";
import { toast } from "sonner";

export type SidebarTab = "search_jobs" | "my_applications" | "profile" | "gdpr" | "my_application";

interface CandidateDashboardLayoutProps {
  portalState: CandidatePortalState;
  setPortalState: React.Dispatch<React.SetStateAction<CandidatePortalState>>;
  company: CompanyDocument | null;
  activeCandidateKey?: string;
  onSelectCandidate?: (key: string) => void;
  activeStageId: StageId;
  setActiveStageId: (id: StageId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onAcceptOffer: (signedName: string) => void;
  onUpdateHardware: (updated: Partial<HardwareSelection>) => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
}

export const CandidateDashboardLayout: React.FC<CandidateDashboardLayoutProps> = ({
  portalState,
  setPortalState,
  company,
  activeCandidateKey,
  onSelectCandidate,
  activeStageId,
  setActiveStageId,
  darkMode,
  onToggleDarkMode,
  onLogout,
  onAcceptOffer,
  onUpdateHardware,
  onUpdateAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>("search_jobs");
  const [selectedJobForFullPage, setSelectedJobForFullPage] = useState<
    AppliedJob | AvailableJob | null
  >(null);
  const [fullPageSourceTab, setFullPageSourceTab] = useState<"search_jobs" | "my_applications">(
    "search_jobs",
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showHelpdesk, setShowHelpdesk] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [companyLogoError, setCompanyLogoError] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    try {
      toast.loading("Uploading candidate profile photo...", { id: "avatar-upload" });
      const path = `candidates/${portalState.candidate.id || "cand"}/avatar_${Date.now()}`;
      const url = await uploadCandidateFileToStorage(file, path);
      if (onUpdateAvatar) {
        onUpdateAvatar(url);
      } else {
        setPortalState((prev) => ({
          ...prev,
          candidate: { ...prev.candidate, avatarUrl: url },
        }));
      }
      toast.success("Profile photo updated successfully!", { id: "avatar-upload" });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      toast.error("Failed to upload avatar image", { id: "avatar-upload" });
    }
  };

  const brandName = company?.name || portalState.candidate.companyName || "Graviton";

  const appliedJobsList = portalState.appliedJobs || [];

  const handleApplyNewJob = (availJob: AvailableJob) => {
    const newAppliedJob: AppliedJob = {
      id: `applied-${Date.now()}`,
      jobCode: availJob.id,
      jobTitle: availJob.title,
      location: availJob.location,
      country: availJob.country,
      appliedDate: new Date().toLocaleDateString("en-GB"),
      status: "Active Job",
      interviewDate: "-",
      department: availJob.department,
      employmentType: availJob.type,
      salaryRange: availJob.salaryRange,
      companyName: brandName,
      description: availJob.description,
      requirements: availJob.requirements,
      recruiterNotes: "Application received and under review by talent acquisition team.",
    };

    setPortalState((prev) => ({
      ...prev,
      appliedJobs: [newAppliedJob, ...(prev.appliedJobs || [])],
    }));
  };

  const navItems = [
    {
      id: "search_jobs" as SidebarTab,
      label: "Search Jobs",
      icon: Search,
    },
    {
      id: "my_applications" as SidebarTab,
      label: "My Applications",
      icon: Briefcase,
    },
    {
      id: "profile" as SidebarTab,
      label: "Profile",
      icon: User,
    },
    {
      id: "gdpr" as SidebarTab,
      label: "GDPR Status",
      icon: ShieldCheck,
    },
    {
      id: "my_application" as SidebarTab,
      label: "My Application",
      icon: ChevronRight,
    },
  ];

  const unreadCount = portalState.notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen w-full bg-[#f4f6f9] dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR (Fixed at left: 0, dynamic responsive width, never scrolled away) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 h-screen z-50 flex flex-col bg-[#545C78] text-white transition-all duration-300 ease-in-out shrink-0 select-none ${
          sidebarOpen ? "w-60 xl:w-64 min-w-[240px]" : "w-16 min-w-[64px]"
        } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Brand Header */}
        <div
          className={`h-14 min-h-[56px] flex items-center border-b border-white/10 bg-[#464D67] ${
            sidebarOpen ? "justify-between px-3.5" : "justify-center px-2"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Covered Company Logo Box */}
            <div className="w-8.5 h-8.5 min-w-[34px] min-h-[34px] max-w-[34px] max-h-[34px] rounded-lg overflow-hidden bg-white/10 border border-white/20 shrink-0 flex items-center justify-center shadow-xs">
              {company?.logoUrl && !companyLogoError ? (
                <img
                  src={company.logoUrl}
                  alt={brandName}
                  className="w-full h-full object-cover object-center block"
                  onError={() => setCompanyLogoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                  {brandName ? brandName.substring(0, 2).toUpperCase() : "TF"}
                </div>
              )}
            </div>

            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <span className="font-bold text-sm text-white tracking-tight truncate block leading-tight">
                  {brandName}
                </span>
                <span className="text-[10px] text-white/70 font-mono truncate block leading-tight">
                  Candidate Portal
                </span>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 cursor-pointer"
              aria-label="Close mobile navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar User Profile Badge & Photo Upload */}
        <div className="p-3 border-b border-white/10 bg-[#4D5570]/50 flex items-center gap-2.5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group w-9 h-9 min-w-[36px] min-h-[36px] rounded-full overflow-hidden ring-2 ring-orange-400/50 bg-orange-950/30 shrink-0 flex items-center justify-center cursor-pointer shadow-xs"
            title="Click to upload profile photo"
          >
            {portalState.candidate.avatarUrl ? (
              <img
                src={portalState.candidate.avatarUrl}
                alt={portalState.candidate.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-xs">
                {portalState.candidate.name
                  ? portalState.candidate.name.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}
            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate leading-tight">
                {portalState.candidate.name}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] text-[#e6ea9c] hover:underline truncate leading-tight mt-0.5 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-2.5 h-2.5" />
                <span>Upload Photo</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <nav data-lenis-prevent className="flex-1 px-2.5 py-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedJobForFullPage(null);
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`clip-path-button-sm w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? "bg-[#ff5f2e] text-white shadow-md font-bold scale-[1.02]"
                    : "text-white/85 hover:bg-[#5B6381] hover:text-white"
                } ${!sidebarOpen ? "justify-center px-0" : ""}`}
                title={item.label}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-white fill-white/20"
                      : "text-orange-400 group-hover:text-orange-300"
                  }`}
                />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2.5 border-t border-white/10 bg-[#464D67]">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-rose-200 hover:bg-rose-500/20 hover:text-rose-100 transition-colors cursor-pointer ${
              !sidebarOpen ? "justify-center px-0" : ""
            }`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-300" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Dynamic left padding to offset fixed sidebar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? "lg:pl-60 xl:lg:pl-64" : "lg:pl-16"
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 h-12 min-h-[48px] bg-white dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
          {/* Left: Sidebar Toggle Button & Current View Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {activeTab === "search_jobs" &&
                  (selectedJobForFullPage ? "Job Details & Overview" : "Explore Vacancies")}
                {activeTab === "my_applications" &&
                  (selectedJobForFullPage
                    ? `Application Details: ${
                        "jobTitle" in selectedJobForFullPage
                          ? selectedJobForFullPage.jobTitle
                          : selectedJobForFullPage.title
                      }`
                    : "My Applications")}
                {activeTab === "my_application" && "7-Stage Onboarding Roadmap"}
                {activeTab === "profile" && "Candidate Profile"}
                {activeTab === "gdpr" && "GDPR & Privacy"}
              </span>
              {company && (
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                  {company.logoUrl && !companyLogoError ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="w-4 h-4 rounded object-cover"
                      onError={() => setCompanyLogoError(true)}
                    />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-ember" />
                  )}
                  <span>{company.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Right: Notifications, Dark mode & User Avatar Menu */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-7.5 h-7.5 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-7.5 h-7.5 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#00c0ef] rounded-full ring-2 ring-white dark:ring-slate-850" />
              )}
            </button>

            {/* User Profile Avatar Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-7.5 h-7.5 min-w-[30px] min-h-[30px] rounded-full ring-2 ring-sky-200 dark:ring-sky-900 overflow-hidden bg-sky-50 dark:bg-sky-950 flex items-center justify-center cursor-pointer hover:ring-sky-400 transition-all"
                title="Account Menu"
              >
                {portalState.candidate.avatarUrl ? (
                  <img
                    src={portalState.candidate.avatarUrl}
                    alt={portalState.candidate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-850 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-fadeIn"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {portalState.candidate.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {portalState.candidate.email}
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="py-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Profile Photo</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJobForFullPage(null);
                        setActiveTab("profile");
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Candidate Profile</span>
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preferences & Settings</span>
                    </button>
                    <button
                      onClick={() => setShowHelpdesk(true)}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>HR Helpdesk & Support</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-3.5 sm:p-4.5 lg:p-5">
          <div className="max-w-[1400px] mx-auto">
            {showSettings ? (
              <CandidateSettingsComponent onClose={() => setShowSettings(false)} />
            ) : selectedJobForFullPage ? (
              /* Dedicated Full-Page Job Description View */
              <JobDescriptionFullPageView
                job={selectedJobForFullPage}
                candidate={portalState.candidate}
                sourceTab={fullPageSourceTab}
                isApplied={appliedJobsList.some(
                  (j) =>
                    (j.jobCode || j.id) ===
                    (("jobCode" in selectedJobForFullPage && selectedJobForFullPage.jobCode) ||
                      selectedJobForFullPage.id),
                )}
                onApply={(job) => {
                  handleApplyNewJob(job);
                  const newlyApplied: AppliedJob = {
                    id: `applied-${Date.now()}`,
                    jobCode: job.id,
                    jobTitle: job.title,
                    location: job.location,
                    country: job.country,
                    appliedDate: new Date().toLocaleDateString("en-GB"),
                    status: "Active Job",
                    interviewDate: "-",
                    department: job.department,
                    employmentType: job.type,
                    salaryRange: job.salaryRange,
                    companyName: brandName,
                    description: job.description,
                    requirements: job.requirements,
                    recruiterNotes:
                      "Application received and under review by talent acquisition team.",
                  };
                  setSelectedJobForFullPage(newlyApplied);
                }}
                onBack={() => setSelectedJobForFullPage(null)}
                onNavigateToRoadmap={(stageId) => {
                  if (stageId) setActiveStageId(stageId);
                  setSelectedJobForFullPage(null);
                  setActiveTab("my_application");
                }}
              />
            ) : (
              <>
                {/* 1. Search Jobs View (Default / Main Tab) */}
                {activeTab === "search_jobs" && (
                  <SearchJobsView
                    availableJobs={OPEN_POSITIONS_CATALOG}
                    appliedJobIds={appliedJobsList.map((j) => j.jobCode || j.id)}
                    onApplyJob={handleApplyNewJob}
                    onGoToMyApplications={() => {
                      setSelectedJobForFullPage(null);
                      setActiveTab("my_applications");
                    }}
                    onSelectJobForFullPage={(job) => {
                      setSelectedJobForFullPage(job);
                      setFullPageSourceTab("search_jobs");
                    }}
                    brandName={brandName}
                  />
                )}

                {/* 2. My Applications View */}
                {activeTab === "my_applications" && (
                  <DashboardJobListView
                    appliedJobs={appliedJobsList}
                    onBrowseJobs={() => setActiveTab("search_jobs")}
                    onNavigateToStage={(stageId) => {
                      setActiveStageId(stageId);
                      setActiveTab("my_application");
                    }}
                    onSelectJobForFullPage={(job) => {
                      setSelectedJobForFullPage(job);
                      setFullPageSourceTab("my_applications");
                    }}
                  />
                )}

                {/* 3. Candidate Profile View */}
                {activeTab === "profile" && (
                  <CandidateProfileView
                    candidate={portalState.candidate}
                    onUpdateProfile={(updated) => {
                      setPortalState((prev) => ({
                        ...prev,
                        candidate: { ...prev.candidate, ...updated },
                      }));
                    }}
                    onUpdateAvatar={onUpdateAvatar}
                  />
                )}

                {/* 4. GDPR Status View */}
                {activeTab === "gdpr" && <GdprStatusView candidate={portalState.candidate} />}

                {/* 5. My Application Roadmap View */}
                {activeTab === "my_application" && (
                  <MyApplicationRoadmapView
                    portalState={portalState}
                    company={company}
                    activeStageId={activeStageId}
                    onSelectStage={setActiveStageId}
                    onAcceptOffer={onAcceptOffer}
                    onUpdateHardware={onUpdateHardware}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* Monorepo Standard Dashboard Footer (Full-width edge-to-edge flush footer) */}
        <Footer
          linksCol1={[
            {
              label: "My Application Roadmap",
              href: "#",
              onClick: () => {
                setActiveTab("my_application");
                setSelectedJobForFullPage(null);
              },
            },
            {
              label: "Search Open Positions",
              href: "#",
              onClick: () => {
                setActiveTab("search_jobs");
                setSelectedJobForFullPage(null);
              },
            },
            {
              label: "Candidate Profile",
              href: "#",
              onClick: () => {
                setActiveTab("profile");
                setSelectedJobForFullPage(null);
              },
            },
          ]}
          linksCol2={[
            { label: "Company Directory", href: "/candidates-portal" },
            { label: "Company Workspace", href: "/companies" },
            { label: "Admin CRM", href: "/admin-panel" },
          ]}
        />
      </div>

      {/* Hidden File Input for Avatar Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Notifications Drawer */}
      {showNotifications && (
        <NotificationCenter
          notifications={portalState.notifications}
          onClose={() => setShowNotifications(false)}
          onSelectStage={(stageId) => {
            setActiveStageId(stageId);
            setSelectedJobForFullPage(null);
            setActiveTab("my_application");
            setShowNotifications(false);
          }}
        />
      )}

      {/* Helpdesk Modal */}
      {showHelpdesk && (
        <HelpdeskModal
          candidate={portalState.candidate}
          company={company}
          onClose={() => setShowHelpdesk(false)}
        />
      )}
    </div>
  );
};
