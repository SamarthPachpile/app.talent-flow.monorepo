import React, { useState } from "react";
import { Lock, KeyRound, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface AdminAuthModalProps {
  onAuthenticated: () => void;
}

export function AdminAuthModal({ onAuthenticated }: AdminAuthModalProps) {
  const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [username, setUsername] = useState(() => envUsername || "");
  const [password, setPassword] = useState(() => envPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    const targetUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const targetPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    setTimeout(() => {
      if (!targetUsername || !targetPassword) {
        setIsVerifying(false);
        toast.error(
          "Environment variables VITE_ADMIN_USERNAME or VITE_ADMIN_PASSWORD are not set.",
        );
        return;
      }

      const inputUsername = username.trim();

      if (inputUsername === targetUsername && password === targetPassword) {
        localStorage.setItem(
          "talentflow_admin_auth",
          JSON.stringify({
            authenticated: true,
            username: inputUsername,
            role: "Super Admin",
            authenticatedAt: new Date().toISOString(),
            authMode: "env_strict",
          }),
        );
        setIsVerifying(false);
        toast.success(`Authentication verified via .env! Welcome, ${inputUsername}.`);
        onAuthenticated();
      } else {
        setIsVerifying(false);
        toast.error("Invalid credentials. Verification against .env failed.");
      }
    }, 300);
  };

  const handleAutofillCredentials = () => {
    const targetUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const targetPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (targetUsername && targetPassword) {
      setUsername(targetUsername);
      setPassword(targetPassword);
      toast.info("Autofilled credentials from .env");
    } else {
      toast.error("Environment credentials not set.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 font-sans overflow-y-auto my-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lifted p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <div className="grid size-10 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-xs">
            <Lock className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground leading-tight">
              Admin Security Access
            </h2>
            <p className="text-xs text-muted-foreground">Strict .env Credentials Required</p>
          </div>
        </div>

        <div className="bg-surface/60 p-2.5 rounded-lg border border-border text-xs flex items-center justify-between">
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-ember" />
            <span>.env Auth Verification</span>
          </span>
          <button
            type="button"
            onClick={handleAutofillCredentials}
            className="text-10px font-mono text-ember font-semibold hover:underline cursor-pointer"
          >
            Autofill .env
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Admin Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username from .env"
                className="w-full pl-9 pr-3 py-2 rounded-md bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Admin Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password from .env"
                className="w-full pl-9 pr-9 py-2 rounded-md bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 rounded-md bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            {isVerifying ? (
              <span>Verifying against .env...</span>
            ) : (
              <>
                <span>Sign In as Admin</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-1 text-10px text-muted-foreground text-center">
          TalentFlow Security Module · Credentials verified strictly from .env
        </div>
      </div>
    </div>
  );
}
