import React, { useState } from "react";
import {
  Briefcase,
  BookOpen,
  MessageSquare,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Layers,
  Sparkles,
  UserCheck,
  Clock,
  X,
} from "lucide-react";
import { toast } from "../lib/sweetalert";
import { OnboardingState } from "../types/onboarding";

interface EmployXDashboardOverviewProps {
  state?: OnboardingState;
  onNavigateTab?: (tab: string) => void;
}

export const EmployXDashboardOverview: React.FC<EmployXDashboardOverviewProps> = ({
  onNavigateTab,
}) => {
  // Active Filter state for Top Active Jobs
  const [activeJobFilter, setActiveJobFilter] = useState<"all" | "applications" | "shortlisted">(
    "all",
  );
  const [timeframe, setTimeframe] = useState<string>("Last month");
  const [showTimeframeMenu, setShowTimeframeMenu] = useState<boolean>(false);

  // Modals & Drawers state
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showJobsDrawer, setShowJobsDrawer] = useState<boolean>(false);
  const [showCoursesModal, setShowCoursesModal] = useState<boolean>(false);
  const [showMessagesDrawer, setShowMessagesDrawer] = useState<boolean>(false);
  const [showChatBot, setShowChatBot] = useState<boolean>(false);

  // Employee Gender state for hover inspection
  const [hoveredGender, setHoveredGender] = useState<"Male" | "Female" | null>(null);

  return (
    <div className="space-y-3.5 animate-fadeIn font-sans text-slate-800 dark:text-slate-100">
      {/* =========================================================================
          ROW 1: 4 TOP CARDS (Jobs for Me, My Learning, My Social Story, Profile)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* CARD 1: Jobs for Me */}
        <div className="clip-service bg-white dark:bg-slate-850 p-4 flex flex-col justify-between group shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                Jobs for Me
              </h3>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </div>

            {/* Custom SVG Illustration: Professional at Computer Desk */}
            <div className="h-28 w-full flex items-center justify-center my-1">
              <svg viewBox="0 0 160 110" className="h-full w-auto drop-shadow-xs" fill="none">
                {/* Desk */}
                <rect x="25" y="82" width="110" height="4" rx="2" fill="#cbd5e1" />
                <rect x="35" y="86" width="4" height="20" rx="1" fill="#94a3b8" />
                <rect x="121" y="86" width="4" height="20" rx="1" fill="#94a3b8" />

                {/* Computer Monitor */}
                <rect
                  x="52"
                  y="38"
                  width="56"
                  height="38"
                  rx="3"
                  fill="#3b82f6"
                  fillOpacity="0.1"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <rect
                  x="56"
                  y="42"
                  width="48"
                  height="28"
                  rx="2"
                  fill="#ffffff"
                  className="dark:fill-slate-800"
                />
                <line
                  x1="62"
                  y1="48"
                  x2="86"
                  y2="48"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="62"
                  y1="54"
                  x2="98"
                  y2="54"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="62"
                  y1="60"
                  x2="90"
                  y2="60"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Monitor Stand */}
                <rect x="76" y="76" width="8" height="6" fill="#64748b" />
                <rect x="68" y="81" width="24" height="2" rx="1" fill="#64748b" />

                {/* Character seated (Blue Shirt) */}
                {/* Head */}
                <circle cx="108" cy="38" r="9" fill="#fbcfe8" />
                {/* Hair */}
                <path
                  d="M100 36C100 30 106 27 113 28C117 29 119 33 118 36C115 35 110 35 106 37Z"
                  fill="#1e293b"
                />
                {/* Body / Blue Shirt */}
                <path
                  d="M96 52C96 46 102 46 108 46C114 46 120 46 120 52L124 74H92L96 52Z"
                  fill="#ff5f2e"
                />
                {/* Arms typing */}
                <path d="M94 56L82 66L88 70L98 58" fill="#e04e22" />
                <circle cx="82" cy="67" r="3" fill="#fbcfe8" />

                {/* Office Plant */}
                <path
                  d="M32 74C32 71 35 69 38 69C41 69 44 71 44 74L45 82H31L32 74Z"
                  fill="#e2e8f0"
                />
                <path d="M38 68C35 64 32 58 35 52C39 56 40 62 38 68Z" fill="#10b981" />
                <path d="M39 68C43 64 47 60 46 54C43 57 40 63 39 68Z" fill="#059669" />
              </svg>
            </div>
          </div>

          {/* Action Link Pill Button */}
          <button
            onClick={() => setShowJobsDrawer(true)}
            className="clip-path-button-sm mt-2 w-full py-1.5 px-3 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="truncate flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              10 new jobs for you
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* CARD 2: My Learning */}
        <div className="clip-service bg-white dark:bg-slate-850 p-4 flex flex-col justify-between group shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                My Learning
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            {/* Custom SVG Illustration: Student with Headset & Laptop */}
            <div className="h-28 w-full flex items-center justify-center my-1">
              <svg viewBox="0 0 160 110" className="h-full w-auto drop-shadow-xs" fill="none">
                {/* Desk */}
                <rect x="25" y="82" width="110" height="4" rx="2" fill="#cbd5e1" />
                <rect x="35" y="86" width="4" height="20" rx="1" fill="#94a3b8" />
                <rect x="121" y="86" width="4" height="20" rx="1" fill="#94a3b8" />

                {/* Stack of Books */}
                <rect x="30" y="74" width="22" height="4" rx="1" fill="#3b82f6" />
                <rect x="28" y="70" width="25" height="4" rx="1" fill="#10b981" />
                <rect x="31" y="66" width="20" height="4" rx="1" fill="#f59e0b" />

                {/* Laptop on desk */}
                <path d="M60 82L64 68H96L100 82H60Z" fill="#94a3b8" />
                <rect
                  x="66"
                  y="69"
                  width="28"
                  height="11"
                  rx="1"
                  fill="#38bdf8"
                  fillOpacity="0.4"
                />

                {/* Character (Student Studying) */}
                <circle cx="80" cy="36" r="9" fill="#fbcfe8" />
                {/* Hair */}
                <path
                  d="M72 34C72 27 77 24 85 24C92 24 96 28 95 35C91 32 84 32 79 35Z"
                  fill="#475569"
                />
                {/* Headset */}
                <path
                  d="M70 36C70 30 75 25 80 25C85 25 90 30 90 36"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <rect x="69" y="34" width="3" height="6" rx="1.5" fill="#2563eb" />
                <rect x="88" y="34" width="3" height="6" rx="1.5" fill="#2563eb" />
                {/* Body / Shirt */}
                <path
                  d="M68 50C68 44 74 44 80 44C86 44 92 44 92 50L95 68H65L68 50Z"
                  fill="#10b981"
                />

                {/* Desk Lamp */}
                <path
                  d="M120 82L120 54L112 58"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M108 55L118 51L114 62Z" fill="#f59e0b" />
              </svg>
            </div>
          </div>

          {/* Action Link Pill Button */}
          <button
            onClick={() => setShowCoursesModal(true)}
            className="clip-path-button-sm mt-2 w-full py-1.5 px-3 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="truncate flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />3 essential courses
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* CARD 3: My Social Story */}
        <div className="clip-service bg-white dark:bg-slate-850 p-4 flex flex-col justify-between group shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                My Social Story
              </h3>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </div>

            {/* Custom SVG Illustration: Person with floating social chat bubbles */}
            <div className="h-28 w-full flex items-center justify-center my-1">
              <svg viewBox="0 0 160 110" className="h-full w-auto drop-shadow-xs" fill="none">
                {/* Central Character */}
                <ellipse cx="80" cy="94" rx="28" ry="6" fill="#e2e8f0" />
                {/* Head */}
                <circle cx="80" cy="38" r="8" fill="#fed7aa" />
                {/* Hair */}
                <path
                  d="M73 36C73 30 78 28 85 28C90 29 93 33 92 37C88 34 83 34 78 37Z"
                  fill="#334155"
                />
                {/* Body (Purple Outfit) */}
                <path
                  d="M72 50C72 45 76 45 80 45C84 45 88 45 88 50L91 80H69L72 50Z"
                  fill="#8b5cf6"
                />
                {/* Smartphone */}
                <rect x="76" y="52" width="8" height="14" rx="1.5" fill="#1e293b" />
                <rect x="77" y="54" width="6" height="10" rx="1" fill="#60a5fa" />

                {/* Floating Social Profile Bubbles */}
                {/* Bubble 1 Left */}
                <g className="animate-bounce" style={{ animationDuration: "3s" }}>
                  <circle
                    cx="42"
                    cy="42"
                    r="10"
                    fill="#3b82f6"
                    fillOpacity="0.15"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <circle cx="42" cy="40" r="4" fill="#3b82f6" />
                  <path d="M36 49C36 45 39 45 42 45C45 45 48 45 48 49" fill="#3b82f6" />
                  <path d="M49 46L68 54" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                {/* Bubble 2 Right */}
                <g className="animate-bounce" style={{ animationDuration: "2.5s" }}>
                  <circle
                    cx="118"
                    cy="38"
                    r="10"
                    fill="#10b981"
                    fillOpacity="0.15"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <circle cx="118" cy="36" r="4" fill="#10b981" />
                  <path d="M112 45C112 41 115 41 118 41C121 41 124 41 124 45" fill="#10b981" />
                  <path d="M110 44L92 54" stroke="#86efac" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                {/* Bubble 3 Top Left */}
                <circle
                  cx="56"
                  cy="22"
                  r="7"
                  fill="#f59e0b"
                  fillOpacity="0.15"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
                <circle cx="56" cy="21" r="2.5" fill="#f59e0b" />
                {/* Bubble 4 Top Right */}
                <circle
                  cx="106"
                  cy="20"
                  r="7"
                  fill="#ec4899"
                  fillOpacity="0.15"
                  stroke="#ec4899"
                  strokeWidth="1"
                />
                <circle cx="106" cy="19" r="2.5" fill="#ec4899" />
              </svg>
            </div>
          </div>

          {/* Action Link Pill Button */}
          <button
            onClick={() => setShowMessagesDrawer(true)}
            className="clip-path-button-sm mt-2 w-full py-1.5 px-3 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="truncate flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />4 New Messages
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* CARD 4: Nil Yeager User Profile Card */}
        <div className="clip-service bg-white dark:bg-slate-850 p-4 flex flex-col justify-between shadow-2xs">
          <div>
            {/* Top User Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ring-2 ring-orange-400 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                    <circle cx="20" cy="16" r="8" fill="#fed7aa" />
                    <path d="M12 14C12 9 15 7 20 7C25 7 28 9 28 14" fill="#334155" />
                    <rect
                      x="15"
                      y="14"
                      width="4"
                      height="3"
                      rx="1"
                      stroke="#0f172a"
                      strokeWidth="1.2"
                      fill="#e2e8f0"
                      fillOpacity="0.5"
                    />
                    <rect
                      x="21"
                      y="14"
                      width="4"
                      height="3"
                      rx="1"
                      stroke="#0f172a"
                      strokeWidth="1.2"
                      fill="#e2e8f0"
                      fillOpacity="0.5"
                    />
                    <line x1="19" y1="15.5" x2="21" y2="15.5" stroke="#0f172a" strokeWidth="1.2" />
                    <path d="M10 32C10 26 15 25 20 25C25 25 30 26 30 32V36H10V32Z" fill="#ff5f2e" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <span>Nil Yeager</span>
                    <span className="text-[10px] text-amber-500">★</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">Lead Recruiter • Pro</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            {/* Profile Completion Bar */}
            <div className="space-y-1 my-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Profile completion</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">80%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full w-[80%]" />
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="clip-path-button-sm mt-3 w-full py-2 px-3 bg-[#ff5f2e] hover:bg-[#e04e22] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer text-center"
          >
            Finish Your Profile
          </button>
        </div>
      </div>
      {/* =========================================================================
          ROW 2 & 3: MAIN ANALYTICS + TWO-ROW HIGH TOP ACTIVE JOBS (Dynamic Full Height & Width)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* CARD 1: Total Employees Donut Chart (Col Span 4) */}
        <div className="lg:col-span-4 clip-service bg-white dark:bg-slate-850 p-4 sm:p-5 flex flex-col justify-between h-full w-full shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Total Employees
            </h3>
            <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">590</span>
          </div>

          {/* Donut Chart with Dynamic Resizing Center Label */}
          <div className="relative flex-1 w-full flex items-center justify-center py-3 min-h-[170px]">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full max-w-[190px] max-h-[190px] aspect-square drop-shadow-xs"
            >
              {/* Outer Glow / Background Ring */}
              <circle
                cx="80"
                cy="80"
                r="60"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="18"
                fill="none"
              />

              {/* Blue Arc: Male (75% = 282.74 circumference, dashoffset = 70.68) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#3b82f6"
                strokeWidth="18"
                strokeDasharray="376.99"
                strokeDashoffset="94.25"
                strokeLinecap="butt"
                fill="none"
                transform="rotate(-90 80 80)"
                className="transition-all duration-700 cursor-pointer hover:opacity-90"
                onMouseEnter={() => setHoveredGender("Male")}
                onMouseLeave={() => setHoveredGender(null)}
              />

              {/* Green Arc: Female (25% = 94.25 length, start at 270 deg) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#10b981"
                strokeWidth="18"
                strokeDasharray="94.25 282.74"
                strokeDashoffset="0"
                strokeLinecap="butt"
                fill="none"
                transform="rotate(180 80 80)"
                className="transition-all duration-700 cursor-pointer hover:opacity-90"
                onMouseEnter={() => setHoveredGender("Female")}
                onMouseLeave={() => setHoveredGender(null)}
              />

              {/* Inner Circle mask for crisp donut */}
              <circle cx="80" cy="80" r="48" className="fill-white dark:fill-slate-850" />
            </svg>

            {/* Centered Donut Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                {hoveredGender || "Male"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {hoveredGender === "Female" ? "25%" : "75%"}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {hoveredGender === "Female" ? "148 Staff" : "442 Staff"}
              </span>
            </div>
          </div>

          {/* Bottom Gender Legend */}
          <div className="flex items-center justify-around w-full pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors"
              onClick={() => setHoveredGender("Male")}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
              <span>Male (75%)</span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-500 transition-colors"
              onClick={() => setHoveredGender("Female")}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span>Female (25%)</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Total Projects Stacked Bar Chart (Col Span 4) */}
        <div className="lg:col-span-4 clip-service bg-white dark:bg-slate-850 p-4 sm:p-5 flex flex-col justify-between h-full w-full shadow-2xs">
          <div className="shrink-0">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Total Projects
              </h3>
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                87
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-blue-500 font-medium">Ongoing 24 Projects</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-medium">
                30/11/2026
              </span>
            </div>
          </div>

          {/* 12-Month Stacked Bar Chart — Dynamically Fills Full Height & Width */}
          <div className="relative flex-1 w-full my-2 flex items-end justify-between gap-1 sm:gap-1.5 pt-6 pb-1 min-h-[170px]">
            {/* Y-Axis scale lines */}
            <div className="absolute inset-x-0 top-3 border-b border-slate-100 dark:border-slate-800/80 pointer-events-none text-[9px] text-slate-400 flex justify-start">
              100
            </div>
            <div className="absolute inset-x-0 top-1/2 border-b border-slate-100 dark:border-slate-800/80 pointer-events-none text-[9px] text-slate-400 flex justify-start">
              50
            </div>
            <div className="absolute inset-x-0 bottom-6 border-b border-slate-100 dark:border-slate-800/80 pointer-events-none text-[9px] text-slate-400 flex justify-start">
              10
            </div>

            {/* Monthly Bars */}
            {[
              { month: "Jan", upcoming: 15, inProgress: 20, complete: 10 },
              { month: "Feb", upcoming: 18, inProgress: 25, complete: 12 },
              { month: "Mar", upcoming: 22, inProgress: 30, complete: 15 },
              { month: "Apr", upcoming: 24, inProgress: 35, complete: 18 },
              { month: "May", upcoming: 28, inProgress: 38, complete: 20 },
              { month: "Jun", upcoming: 30, inProgress: 42, complete: 22 },
              { month: "Jul", upcoming: 34, inProgress: 45, complete: 25 },
              { month: "Aug", upcoming: 38, inProgress: 50, complete: 28 },
              { month: "Sep", upcoming: 40, inProgress: 54, complete: 30 },
              { month: "Oct", upcoming: 44, inProgress: 58, complete: 32 },
              { month: "Nov", upcoming: 48, inProgress: 64, complete: 35 },
              { month: "Dec", upcoming: 52, inProgress: 70, complete: 38 },
            ].map((b, idx) => (
              <div
                key={idx}
                className="flex-1 h-full flex flex-col items-center justify-end gap-1.5 z-10 group relative"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] py-0.5 px-1.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                  {b.month}: {b.upcoming + b.inProgress + b.complete} total
                </div>

                {/* Stacked Vertical Pill Bar taking full dynamic height */}
                <div className="w-full max-w-[13px] flex-1 flex flex-col-reverse rounded-t overflow-hidden bg-slate-100 dark:bg-slate-800 min-h-[70px]">
                  {/* Blue segment (Upcoming) */}
                  <div
                    style={{ height: `${b.upcoming}%` }}
                    className="w-full bg-[#3b82f6] transition-all"
                  />
                  {/* Green segment (In Progress) */}
                  <div
                    style={{ height: `${b.inProgress}%` }}
                    className="w-full bg-[#10b981] transition-all"
                  />
                  {/* Gray segment (Complete) */}
                  <div
                    style={{ height: `${b.complete}%` }}
                    className="w-full bg-[#cbd5e1] dark:bg-slate-600 transition-all"
                  />
                </div>

                <span className="text-[9px] text-slate-400 font-medium shrink-0">{b.month}</span>
              </div>
            ))}
          </div>

          {/* Bottom Projects Legend */}
          <div className="flex items-center justify-around w-full pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <span>Upcoming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#cbd5e1] dark:bg-slate-600" />
              <span>Complete</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols, 2 rows high!): TOP ACTIVE JOBS CARD */}
        <div className="lg:col-span-4 lg:row-span-2 clip-service bg-white dark:bg-slate-850 p-4 sm:p-5 flex flex-col justify-between h-full w-full shadow-2xs space-y-3">
          <div>
            {/* Header & Timeframe Filter */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                  Top Active Jobs
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[10px] font-bold">
                  Live
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowTimeframeMenu(!showTimeframeMenu)}
                  className="clip-path-button-sm px-2.5 py-1 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-1 cursor-pointer"
                >
                  <span>{timeframe}</span>
                  <ChevronRight className="w-3 h-3 rotate-90 text-orange-500" />
                </button>

                {showTimeframeMenu && (
                  <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-30 text-xs">
                    {["This week", "Last month", "Last 3 months", "This year"].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeframe(t);
                          setShowTimeframeMenu(false);
                          toast.info(`Filtered for: ${t}`);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Metric Toggle Badges */}
            <div className="flex items-center gap-3 text-xs font-semibold py-2">
              <button
                onClick={() =>
                  setActiveJobFilter(activeJobFilter === "applications" ? "all" : "applications")
                }
                className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${
                  activeJobFilter === "shortlisted" ? "opacity-40" : "opacity-100"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Applications
                </span>
              </button>

              <button
                onClick={() =>
                  setActiveJobFilter(activeJobFilter === "shortlisted" ? "all" : "shortlisted")
                }
                className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${
                  activeJobFilter === "applications" ? "opacity-40" : "opacity-100"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Shortlisted
                </span>
              </button>
            </div>

            {/* Smooth SVG Spline Area Chart (Green + Purple Waves) */}
            <div className="relative h-28 w-full my-2">
              <svg viewBox="0 0 280 80" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  {/* Purple Area Gradient */}
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Green Area Gradient */}
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line
                  x1="0"
                  y1="20"
                  x2="280"
                  y2="20"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  className="dark:stroke-slate-800"
                />
                <line
                  x1="0"
                  y1="50"
                  x2="280"
                  y2="50"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  className="dark:stroke-slate-800"
                />

                {/* Green Wave (Applications) */}
                {(activeJobFilter === "all" || activeJobFilter === "applications") && (
                  <>
                    <path
                      d="M0,65 C40,62 70,55 105,40 C140,25 175,60 210,50 C245,40 260,15 280,10 L280,80 L0,80 Z"
                      fill="url(#greenGradient)"
                    />
                    <path
                      d="M0,65 C40,62 70,55 105,40 C140,25 175,60 210,50 C245,40 260,15 280,10"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Purple Wave (Shortlisted) */}
                {(activeJobFilter === "all" || activeJobFilter === "shortlisted") && (
                  <>
                    <path
                      d="M0,70 C35,68 70,45 105,20 C140,55 175,58 210,54 C245,50 260,25 280,22 L280,80 L0,80 Z"
                      fill="url(#purpleGradient)"
                    />
                    <path
                      d="M0,70 C35,68 70,45 105,20 C140,55 175,58 210,54 C245,50 260,25 280,22"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>

              {/* X-axis months */}
              <div className="flex justify-between text-[9.5px] text-slate-400 font-medium pt-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>

            {/* Extended List of 6 Top Jobs (Fitting 2 rows height) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>Job Position</span>
                <span>Applications</span>
              </div>

              {[
                { title: "Senior Cloud Solutions Architect", dept: "Engineering", count: 482 },
                { title: "Lead AI Research Scientist", dept: "AI & ML", count: 412 },
                { title: "Senior Product Designer (UI/UX)", dept: "Design", count: 325 },
                { title: "Staff DevOps & SRE Engineer", dept: "Infrastructure", count: 284 },
                { title: "Principal Backend Architect", dept: "Engineering", count: 240 },
                { title: "Global Sales & Enterprise Director", dept: "Sales", count: 154 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="clip-service p-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50/60 dark:hover:bg-orange-950/30 transition-all cursor-pointer flex items-center justify-between gap-2"
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab("pipeline");
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.dept}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {item.count}
                    </span>
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Footer */}
          <button
            onClick={() => onNavigateTab?.("pipeline")}
            className="clip-path-button-sm w-full py-2 px-3 bg-[#ff5f2e] hover:bg-[#e04e22] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>View All Jobs in Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Left Column Bottom (8 cols): 3 RADIAL CIRCULAR PROGRESS STATS CARDS (Dynamic Full Height & Width) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 h-full">
          {/* Metric 1: Applications (60% Blue Ring) */}
          <div
            onClick={() => {
              if (onNavigateTab) onNavigateTab("pipeline");
              toast.info("Filtered pipeline for all submitted applications");
            }}
            className="clip-service bg-white dark:bg-slate-850 p-4 sm:p-5 flex flex-col justify-between h-full w-full cursor-pointer group shadow-2xs hover:shadow-md transition-all"
          >
            {/* Top Label */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 font-bold group-hover:text-orange-500 transition-colors uppercase tracking-wider">
                Applications ➔
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>

            {/* Middle Main Metric & Radial Ring taking full width */}
            <div className="flex items-center justify-between gap-3 my-auto py-2 w-full">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  132.0K
                </div>
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +14.8% this month
                </span>
              </div>

              {/* 60% Blue Circular Ring */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="4.5"
                    fill="none"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="#3b82f6"
                    strokeWidth="4.5"
                    strokeDasharray="113.1"
                    strokeDashoffset="45.24"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  60%
                </span>
              </div>
            </div>

            {/* Bottom Progress Bar filling full width */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#3b82f6] rounded-full w-[60%]" />
            </div>
          </div>

          {/* Metric 2: Shortlisted (50% Green Ring) */}
          <div
            onClick={() => {
              if (onNavigateTab) onNavigateTab("pipeline");
              toast.info("Filtered pipeline for shortlisted candidates");
            }}
            className="clip-service bg-white dark:bg-slate-850 p-4 sm:p-5 flex flex-col justify-between h-full w-full cursor-pointer group shadow-2xs hover:shadow-md transition-all"
          >
            {/* Top Label */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 font-bold group-hover:text-emerald-500 transition-colors uppercase tracking-wider">
                Shortlisted ➔
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            {/* Middle Main Metric & Radial Ring taking full width */}
            <div className="flex items-center justify-between gap-3 my-auto py-2 w-full">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  10.9k
                </div>
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +8.2% this month
                </span>
              </div>

              {/* 50% Green Circular Ring */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="4.5"
                    fill="none"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="#10b981"
                    strokeWidth="4.5"
                    strokeDasharray="113.1"
                    strokeDashoffset="56.55"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  50%
                </span>
              </div>
            </div>

            {/* Bottom Progress Bar filling full width */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#10b981] rounded-full w-[50%]" />
            </div>
          </div>
          {/* Metric 3: On Hold (34% Purple Ring) */}
          <div
            onClick={() => {
              if (onNavigateTab) onNavigateTab("pipeline");
              toast.info("Filtered pipeline for candidates on hold / awaiting interview");
            }}
            className="clip-service bg-white dark:bg-slate-850 p-4 sm:p-5 flex flex-col justify-between h-full w-full cursor-pointer group shadow-2xs hover:shadow-md transition-all"
          >
            {/* Top Label */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 font-bold group-hover:text-purple-500 transition-colors uppercase tracking-wider">
                On Hold ➔
              </span>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </div>

            {/* Middle Main Metric & Radial Ring taking full width */}
            <div className="flex items-center justify-between gap-3 my-auto py-2 w-full">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  03.1k
                </div>
                <span className="text-[11px] text-purple-500 font-semibold flex items-center gap-0.5 mt-1">
                  <Clock className="w-3.5 h-3.5" /> 24 in interview
                </span>
              </div>

              {/* 34% Purple Circular Ring */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="4.5"
                    fill="none"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="#8b5cf6"
                    strokeWidth="4.5"
                    strokeDasharray="113.1"
                    strokeDashoffset="74.65"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  34%
                </span>
              </div>
            </div>

            {/* Bottom Progress Bar filling full width */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#8b5cf6] rounded-full w-[34%]" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 4: ACTIVITY & PIPELINE QUICK ACTIONS BAR
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Followers</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">48.5K</div>
            <span className="text-[10px] text-slate-500">Across LinkedIn & TalentFlow</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Growth Rate</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+28.4%</div>
            <span className="text-[10px] text-slate-500">Quarter-over-Quarter</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Active Pipeline Stages</span>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">28 Stages</div>
            <span className="text-[10px] text-slate-500">Autonomous Screening Active</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          FLOATING YELLOW ACTION / CHAT BOT BUTTON
         ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowChatBot(!showChatBot)}
          className="w-12 h-12 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="EmployX AI Recruiter Assistant"
        >
          <Sparkles className="w-5 h-5 fill-white" />
        </button>

        {/* AI Assistant Flyout */}
        {showChatBot && (
          <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-fadeIn z-50">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  EmployX AI Copilot
                </h4>
              </div>
              <button
                onClick={() => setShowChatBot(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Hello Nil! You have <strong>10 high-matching candidates</strong> awaiting review for
              the <em>Project Manager</em> opening.
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  setShowChatBot(false);
                  if (onNavigateTab) onNavigateTab("pipeline");
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold text-left hover:bg-blue-100 transition-colors flex items-center justify-between"
              >
                <span>Open Pipeline Board</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  setShowChatBot(false);
                  if (onNavigateTab) onNavigateTab("connectors");
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-left hover:bg-emerald-100 transition-colors flex items-center justify-between"
              >
                <span>Sync LinkedIn Connector</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          INTERACTIVE MODAL: Finish Your Profile (Nil Yeager)
         ========================================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Complete Recruiter Profile</h3>
                  <p className="text-xs text-blue-100">Nil Yeager • Lead Talent Acquisition</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-200">
              <div>
                <label className="block font-semibold mb-1">Company / Workspace Role</label>
                <input
                  type="text"
                  defaultValue="Senior Technical Recruiter & Hiring Lead"
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Recruitment Focus Areas</label>
                <input
                  type="text"
                  defaultValue="Fullstack Engineering, Product Management, AI/ML"
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Recruiter Bio & Values</label>
                <textarea
                  rows={3}
                  defaultValue="Building high-impact engineering teams with automated screening, equitable evaluations, and delightful candidate journeys."
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">
                    LinkedIn Connector Synced
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    Auto-sourcing enabled for open jobs
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  toast.success("Profile 100% completed! Recruiter badge updated.");
                }}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Save & Update (100%)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE DRAWER: 10 New Jobs For You
         ========================================================================= */}
      {showJobsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Recommended Open Roles (10)
                </h3>
              </div>
              <button
                onClick={() => setShowJobsDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {[
                { title: "Senior React Architect", dept: "Engineering", count: 48, match: "98%" },
                { title: "Lead Product Designer", dept: "UX & Product", count: 32, match: "94%" },
                {
                  title: "DevOps & Cloud Engineer",
                  dept: "Infrastructure",
                  count: 19,
                  match: "91%",
                },
                {
                  title: "Head of Talent Acquisition",
                  dept: "People & HR",
                  count: 14,
                  match: "89%",
                },
                {
                  title: "AI/ML Solutions Engineer",
                  dept: "Data Science",
                  count: 27,
                  match: "88%",
                },
              ].map((j, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {j.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {j.dept} • {j.count} Candidates
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {j.match} Match
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <button
                onClick={() => {
                  setShowJobsDrawer(false);
                  if (onNavigateTab) onNavigateTab("pipeline");
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Open Full Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL: My Learning Courses
         ========================================================================= */}
      {showCoursesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Essential Recruitment Modules
                </h3>
              </div>
              <button
                onClick={() => setShowCoursesModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                {
                  title: "Structured Behavioral Interviewing",
                  duration: "35 mins",
                  status: "In Progress (60%)",
                },
                {
                  title: "Mitigating Cognitive Bias in Sourcing",
                  duration: "45 mins",
                  status: "Completed",
                },
                {
                  title: "Candidate Experience Masterclass",
                  duration: "25 mins",
                  status: "Not Started",
                },
              ].map((c, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {c.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{c.duration}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowCoursesModal(false);
                toast.success("Course progress synced to HR dashboard!");
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE DRAWER: 4 New Messages
         ========================================================================= */}
      {showMessagesDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Recruiter Inbox (4 Unread)
                </h3>
              </div>
              <button
                onClick={() => setShowMessagesDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                {
                  name: "Alex Rivera",
                  role: "Sr. Fullstack Candidate",
                  msg: "I've accepted the offer letter and completed my hardware preferences!",
                  time: "10m ago",
                },
                {
                  name: "Sarah Chen",
                  role: "Lead UX Candidate",
                  msg: "Looking forward to the technical design panel tomorrow at 2:00 PM.",
                  time: "1h ago",
                },
                {
                  name: "David Kim",
                  role: "Hiring Manager",
                  msg: "Approved compensation range for the DevOps Engineer requisition.",
                  time: "3h ago",
                },
                {
                  name: "Emma Watson",
                  role: "HR Operations",
                  msg: "Background verification completed for 3 new hires this week.",
                  time: "5h ago",
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => toast.info(`Replying to ${m.name}`)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <div className="text-[10px] text-blue-500 font-medium mb-1">{m.role}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    {m.msg}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setShowMessagesDrawer(false);
                  toast.success("All messages marked as read.");
                }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
              >
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
