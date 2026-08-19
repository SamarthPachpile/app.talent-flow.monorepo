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
  Globe,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";

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
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col justify-between p-4 sm:p-6 my-4 relative overflow-x-clip">
      {/* Top Floating Navigation Header (Graviton Capsule Style) */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-[1400px]">
        <div className="clip-path-nav-sm bg-background/95 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] border border-border/60">
          <div className="flex items-center justify-between pl-5 pr-2 sm:pl-7 sm:pr-3 py-2.5">
            {/* Brand Logo */}
            <a
              href="/admin-panel"
              onClick={handleNavigateHome}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-xs text-xs shrink-0">
                TF
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  TalentFlow<sup className="text-[10px] top-0 ml-0.5 font-bold text-ember">®</sup>
                </span>
                <span className="text-10px text-muted-foreground mt-0.5 font-medium">
                  Super Admin ATS Suite
                </span>
              </div>
            </a>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                <Globe className="w-3.5 h-3.5" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              <a
                href="/companies"
                className="clip-path-button-sm bg-ember text-ember-foreground px-5 py-2 text-xs font-semibold hover:bg-ember/90 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Company Portal</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center pt-28 pb-8 relative z-10">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lifted space-y-6">
          {/* Header section */}
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="grid size-11 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-xs shrink-0">
              <Lock className="size-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                Admin Suite Sign In
              </h1>
              <p className="text-xs text-muted-foreground">
                Verified via .env Environment Variables Only
              </p>
            </div>
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
              className="w-full py-3 rounded-xl bg-ember text-ember-foreground font-semibold text-xs shadow-card hover:bg-ember/90 transition-all flex items-center justify-center gap-2 cursor-pointer pt-3 disabled:opacity-50 mt-2"
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

          <div className="pt-2 text-center text-11px text-muted-foreground flex items-center justify-center gap-1">
            <ShieldAlert className="size-3.5 text-ember" />
            <span>Strict .env Authentication Active</span>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <div className="w-full -mx-4 sm:-mx-6 my-10">
        <CTASection
          buttonText="Admin Sign In"
          onButtonClick={() => {
            const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (btn) btn.scrollIntoView({ behavior: "smooth" });
          }}
          headingLine1="Let's start"
          headingLine2="engineering impact"
          headingHighlight="together."
          subtext="Comprehensive multi-tenant governance, candidate pipeline intelligence, and operational compliance tools."
        />
      </div>

      {/* Footer */}
      <div className="w-full -mx-4 sm:-mx-6 -mb-4 sm:-mb-6">
        <Footer
          linksCol1={[
            { label: "Admin Pipeline", href: "/admin-panel/dashboard" },
            { label: "Onboarded Companies", href: "/admin-panel/companies" },
            { label: "Interviews Control", href: "/admin-panel/interviews" },
          ]}
          linksCol2={[
            { label: "Company Portal", href: "/companies" },
            { label: "Candidate Portal", href: "/candidates-portal" },
            { label: "Admin CRM", href: "/admin-panel" },
          ]}
        />
      </div>
    </div>
  );
}
