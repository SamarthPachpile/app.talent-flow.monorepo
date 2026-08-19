import React from "react";
import { Search, Briefcase, Plus, RotateCcw } from "lucide-react";

interface EmptyJobsIllustrationProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export const EmptyJobsIllustration: React.FC<EmptyJobsIllustrationProps> = ({
  title = "No Applied Jobs Found",
  description = "You haven't submitted any job applications for this company yet. Explore our open positions and find the role that matches your skills and aspirations.",
  onAction,
  actionText = "Browse Open Positions",
  onResetFilters,
  isFiltered = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center animate-fadeIn">
      {/* Decorative Vector Graphic */}
      <div className="relative mb-3">
        {/* Ambient Glow */}
        <div className="absolute -inset-3 bg-gradient-to-tr from-sky-400/20 via-cyan-300/15 to-blue-500/20 rounded-full blur-xl opacity-70 pointer-events-none" />

        {/* Central Illustration Container */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
          <svg
            className="w-full h-full drop-shadow-sm"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Circular Platform */}
            <ellipse
              cx="100"
              cy="160"
              rx="75"
              ry="18"
              className="fill-slate-200/70 dark:fill-slate-800/80"
            />
            <ellipse
              cx="100"
              cy="156"
              rx="60"
              ry="12"
              className="fill-slate-300/50 dark:fill-slate-700/60"
            />

            {/* Folder / Application Base */}
            <path
              d="M45 75C45 68.3726 50.3726 63 57 63H82.5L96.5 77H143C149.627 77 155 82.3726 155 89V142C155 148.627 149.627 154 143 154H57C50.3726 154 45 148.627 45 142V75Z"
              className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="2.5"
            />

            {/* Document Sheet 1 (Behind) */}
            <g transform="rotate(-6 100 100)">
              <rect
                x="65"
                y="52"
                width="66"
                height="86"
                rx="6"
                className="fill-slate-50 dark:fill-slate-700 stroke-slate-200 dark:stroke-slate-600"
                strokeWidth="2"
              />
              <line
                x1="75"
                y1="68"
                x2="110"
                y2="68"
                stroke="#00c0ef"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="75"
                y1="78"
                x2="120"
                y2="78"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="75"
                y1="88"
                x2="114"
                y2="88"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Document Sheet 2 (Main) */}
            <g transform="rotate(4 105 105)">
              <rect
                x="70"
                y="50"
                width="70"
                height="92"
                rx="6"
                className="fill-white dark:fill-slate-900 stroke-sky-400 dark:stroke-sky-500"
                strokeWidth="2.5"
              />
              {/* Header bar on sheet */}
              <rect x="70" y="50" width="70" height="14" rx="6" fill="#00c0ef" />
              <circle cx="80" cy="57" r="2.5" fill="white" />
              <circle cx="87" cy="57" r="2.5" fill="white" opacity="0.8" />
              <circle cx="94" cy="57" r="2.5" fill="white" opacity="0.6" />

              {/* Text Lines */}
              <line
                x1="80"
                y1="76"
                x2="128"
                y2="76"
                stroke="#0284c7"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="80"
                y1="88"
                x2="122"
                y2="88"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="80"
                y1="98"
                x2="112"
                y2="98"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="80"
                y1="108"
                x2="126"
                y2="108"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="80"
                y1="118"
                x2="105"
                y2="118"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Magnifying Glass Overlay */}
            <g transform="translate(15, 5)">
              <circle
                cx="120"
                cy="115"
                r="24"
                className="fill-sky-50/90 dark:fill-slate-800/90 stroke-cyan-500 dark:stroke-cyan-400"
                strokeWidth="4"
              />
              <circle cx="120" cy="115" r="18" fill="#38bdf8" fillOpacity="0.15" />
              <path d="M137 132L156 151" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />
              {/* Question mark / sparkle inside glass */}
              <circle cx="118" cy="110" r="3" fill="#0284c7" />
              <path
                d="M114 116C114 116 116 122 122 121"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Floating Sparkles & Badges */}
            <g className="animate-pulse">
              <path d="M48 55L50 48L57 46L50 44L48 37L46 44L39 46L46 48L48 55Z" fill="#00c0ef" />
              <path
                d="M152 45L153.5 40L158.5 38.5L153.5 37L152 32L150.5 37L145.5 38.5L150.5 40L152 45Z"
                fill="#38bdf8"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-normal mb-4">
        {description}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {isFiltered && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset Filters</span>
          </button>
        )}

        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#00c0ef] hover:bg-[#00abdc] text-white text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Briefcase className="w-3 h-3" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
