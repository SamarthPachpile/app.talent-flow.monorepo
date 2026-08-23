import React, { useState } from "react";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  Layers,
  Activity,
  CheckCircle2,
  Building2,
  Users,
} from "lucide-react";
import { toast } from "@/lib/sweetalert";

interface AdminLoginPageProps {
  onSuccess?: () => void;
}

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps = {}) {
  // Pure env variable references - strictly read from environment
  const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [username, setUsername] = useState(() => envUsername || "");
  const [password, setPassword] = useState(() => envPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleNavigateHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/admin-panel/dashboard");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      const activeUser = import.meta.env.VITE_ADMIN_USERNAME;
      const activePass = import.meta.env.VITE_ADMIN_PASSWORD;

      if (!activeUser || !activePass) {
        setIsAuthenticating(false);
        toast.error(
          "Admin environment variables (VITE_ADMIN_USERNAME, VITE_ADMIN_PASSWORD) are not configured in .env file.",
        );
        return;
      }

      if (username.trim() === activeUser && password.trim() === activePass) {
        setIsAuthenticating(false);
        localStorage.setItem("talentflow_admin_auth", "true");
        localStorage.setItem(
          "talentflow_admin_user",
          JSON.stringify({
            username: activeUser,
            role: "Super Admin",
            authenticatedAt: new Date().toISOString(),
          }),
        );
        toast.success("Security verification successful! Redirecting to Admin Suite...");
        if (onSuccess) {
          onSuccess();
        } else if (typeof window !== "undefined") {
          window.history.pushState({}, "", "/admin-panel/dashboard");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      } else {
        setIsAuthenticating(false);
        toast.error(
          "Invalid credentials. Admin access strictly matches environment variable values.",
        );
      }
    }, 400);
  };

  const handleAutofillCredentials = () => {
    const targetUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const targetPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (targetUsername && targetPassword) {
      setUsername(targetUsername);
      setPassword(targetPassword);
      toast.info("Autofilled credentials directly from .env file");
    } else {
      toast.error(".env variables VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD are not defined.");
    }
  };

  return (
    <div
      data-lenis-prevent
      className="min-h-screen lg:h-screen lg:overflow-hidden bg-background font-sans text-foreground grid grid-cols-1 lg:grid-cols-2 relative"
    >
      {/* Left Section: Cover Background Image & Branding Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white overflow-hidden h-full">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('/assets/admin-hero-bg.jpg'), url('/assets/hero-bg.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40 backdrop-blur-[2px] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-t from-ember/20 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <a
            href="/admin-panel"
            onClick={handleNavigateHome}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-lg shadow-ember/30 text-sm shrink-0 transition-transform group-hover:scale-105">
              TF
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-white">
                TalentFlow<sup className="text-[10px] top-0 ml-0.5 font-bold text-ember">®</sup>
              </span>
              <span className="text-11px text-white/70 mt-0.5 font-medium">
                Super Admin ATS Suite
              </span>
            </div>
          </a>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-11px">Production Node Live</span>
          </div>
        </div>

        {/* Center Showcase Info */}
        <div className="relative z-10 my-auto py-10 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember/20 border border-ember/40 text-ember text-xs font-semibold backdrop-blur-md shadow-xs">
            <ShieldCheck className="size-4" />
            <span>Super Administrator Security Control</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-display font-bold leading-tight tracking-tight text-white">
              Unified Governance & Global ATS Infrastructure
            </h1>
            <p className="text-sm xl:text-base text-white/80 leading-relaxed font-light">
              Real-time pipeline orchestration, candidate verification audits, offer workflows, and
              multi-tenant security access across all connected workspaces.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-2 text-ember">
                <Layers className="size-4" />
                <span className="text-xs font-semibold text-white">Pipeline Engine</span>
              </div>
              <p className="text-11px text-white/70">Live recruitment telemetry & stage gating</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-2 text-ember">
                <ShieldAlert className="size-4" />
                <span className="text-xs font-semibold text-white">Strict .env Auth</span>
              </div>
              <p className="text-11px text-white/70">Deterministic credentials verification</p>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Pill */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/15 text-xs text-white/75">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>SOC2 & GDPR Compliant</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-ember" />
              <span>99.99% System SLA</span>
            </span>
          </div>
          <span className="text-11px text-white/50 font-mono">v3.8.2-enterprise</span>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div
        data-lenis-prevent
        className="h-full min-h-screen lg:min-h-0 lg:max-h-screen overflow-y-auto relative z-10 flex flex-col overscroll-contain"
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-full">
          {/* Top Header / Portal Navigation */}
          <div className="flex items-center justify-between pb-6">
            {/* Mobile Logo */}
            <a
              href="/admin-panel"
              onClick={handleNavigateHome}
              className="flex lg:hidden items-center gap-2.5 cursor-pointer"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-ember text-ember-foreground font-bold shadow-xs text-xs shrink-0">
                TF
              </span>
              <span className="text-base font-bold text-foreground tracking-tight">
                TalentFlow<sup className="text-[9px] font-bold text-ember">®</sup>
              </span>
            </a>

            {/* Quick links to other portals */}
            <div className="flex items-center gap-2 ml-auto">
              <a
                href="/companies"
                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-accent border border-border text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="size-3.5 text-ember" />
                <span>Company Portal</span>
              </a>
              <a
                href="/candidates-portal"
                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-accent border border-border text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Users className="size-3.5 text-ember" />
                <span>Candidate Portal</span>
              </a>
            </div>
          </div>

          {/* Main Sign In Form Container */}
          <div className="w-full max-w-md mx-auto py-6 space-y-6">
            {/* Title and Icon */}
            <div className="space-y-2">
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-ember/10 border border-ember/20 text-ember mb-2">
                <Lock className="size-5" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                Admin Suite Sign In
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Sign in with your Super Administrator credentials verified against .env
              </p>
            </div>

            {/* Environmental Status Banner */}
            <div className="bg-surface p-3.5 rounded-xl border border-border space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-ember" />
                  <span>Environment Auth (.env)</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-10px font-semibold border ${
                    envUsername && envPassword
                      ? "bg-success/15 text-success border-success/30"
                      : "bg-destructive/15 text-destructive border-destructive/30"
                  }`}
                >
                  {envUsername && envPassword ? "ENV LOADED" : "ENV UNCONFIGURED"}
                </span>
              </div>
              <p className="text-11px text-muted-foreground leading-relaxed">
                Strict verification enabled against{" "}
                <code className="font-mono text-ember font-semibold">VITE_ADMIN_USERNAME</code> &{" "}
                <code className="font-mono text-ember font-semibold">VITE_ADMIN_PASSWORD</code>.
              </p>
            </div>

            {/* Quick Demo Autofill Box */}
            <div className="bg-surface/60 p-3 rounded-xl border border-border text-xs space-y-1.5">
              <div className="flex items-center justify-between text-10px font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Environment Configuration</span>
                <span className="text-ember font-mono text-9px flex items-center gap-1">
                  <Sparkles className="size-3" /> .env Strictly Enforced
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutofillCredentials}
                className="w-full py-2 px-3 rounded-lg bg-card hover:bg-accent border border-border text-foreground font-medium text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs hover:border-ember/40"
              >
                <span className="text-xs font-semibold">Fill from .env</span>
                <span className="text-10px font-mono text-ember font-bold">
                  {envUsername ? `${envUsername} / ••••••••` : "Not Configured"}
                </span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Admin Username (.env)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username from .env"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Admin Password (.env)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password from .env"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl bg-ember text-ember-foreground font-semibold text-xs shadow-card hover:bg-ember/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isAuthenticating ? (
                  <span>Verifying against .env...</span>
                ) : (
                  <>
                    <span>Authenticate Session</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-11px text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldAlert className="size-3.5 text-ember" />
              <span>Strict .env Authenticated Superuser Access</span>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-6 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3 shrink-0">
            <span>© {new Date().getFullYear()} TalentFlow Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="/admin-panel/dashboard" className="hover:text-foreground transition-colors">
                Pipeline
              </a>
              <a href="/admin-panel/companies" className="hover:text-foreground transition-colors">
                Companies
              </a>
              <a href="/admin-panel/interviews" className="hover:text-foreground transition-colors">
                Interviews
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
