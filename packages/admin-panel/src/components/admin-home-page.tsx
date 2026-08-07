import React from "react";
import CrotonLandingWebsite from "@croton/pages/Index";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function AdminHomePage() {
  return (
    <div className="relative">
      {/* Top Floating Admin Quick Launcher Bar */}
      <div className="bg-slate-950/90 text-slate-200 border-b border-indigo-500/20 py-2 px-4 text-xs font-sans sticky top-0 z-[10000] backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">
            Root Landing Page &bull; Croton IT Solutions
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin-panel/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Dashboard Login</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Croton IT Solutions Website */}
      <div className="croton-scope">
        <CrotonLandingWebsite />
      </div>
    </div>
  );
}
