import React from "react";
import {
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileSignature,
  LayoutGrid,
  Settings,
  LogOut,
  Lock,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useWorkspace } from "../../lib/workspace-store";
import { OPERATOR } from "../../lib/workspace-data";
import { toast } from "@/lib/sweetalert";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Pipeline", exact: true, icon: LayoutGrid },
  { path: "/companies", label: "Companies", exact: false, icon: Building2 },
  { path: "/interviews", label: "Interviews", exact: false, icon: CalendarClock },
  { path: "/approvals", label: "Approvals", exact: false, icon: ClipboardCheck },
  { path: "/offers", label: "Offers", exact: false, icon: FileSignature },
  { path: "/settings", label: "Settings", exact: false, icon: Settings },
] as const;

interface AppNavProps {
  onLogout?: () => void;
}

export function AppNav({ onLogout }: AppNavProps) {
  const { companies, companyId, setCompanyId } = useWorkspace();
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isSubpath = currentPath.startsWith("/admin-panel");
  const basePath = isSubpath ? "/admin-panel" : "";

  const handleNavClick = (targetPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    const fullTarget = `${basePath}${targetPath}`;
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", fullTarget);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("talentflow_admin_auth");
    toast.info("Admin session locked");
    if (onLogout) {
      onLogout();
    }
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `${basePath}/login`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const isLinkActive = (targetPath: string, exact: boolean) => {
    const cleanCurrent = currentPath.split("?")[0].replace(/\/+$/, "");
    const relativePath = isSubpath
      ? cleanCurrent.replace(/^\/admin-panel/, "") || "/"
      : cleanCurrent || "/";
    if (exact) {
      return relativePath === targetPath || relativePath === "/" || relativePath === "";
    }
    return relativePath.startsWith(targetPath);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-md font-sans shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <a
              href={`${basePath || "/"}`}
              onClick={(e) => handleNavClick("/dashboard", e)}
              title="Admin Panel Home"
              className="grid size-8 place-items-center rounded-md bg-ember text-xs font-semibold text-ember-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              TF
            </a>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{OPERATOR.name}</p>
                <span className="text-10px font-semibold px-1.5 py-0.2 rounded bg-ember/15 text-ember border border-ember/30 flex items-center gap-1">
                  <Lock className="size-3" /> ADMIN ATS
                </span>
              </div>
              <p className="text-11px text-muted-foreground">{OPERATOR.tagline}</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            {NAV_ITEMS.map((l) => {
              const active = isLinkActive(l.path, l.exact);
              const fullHref = `${basePath}${l.path}`;
              return (
                <a
                  key={l.path}
                  href={fullHref}
                  onClick={(e) => handleNavClick(l.path, e)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                    active
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <l.icon className="size-4" />
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className="w-44 bg-surface text-xs">
                <SelectValue placeholder="Client company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c: { id: string; name: string; plan: string }) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} · {c.plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Lock / Sign Out Admin Session */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="size-4 text-ember" />
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Navbar Spacer */}
      <div className="h-[57px] shrink-0" aria-hidden="true" />
    </>
  );
}
