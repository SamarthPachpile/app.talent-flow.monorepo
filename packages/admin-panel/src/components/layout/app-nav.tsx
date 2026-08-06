import { Link } from "@tanstack/react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/lib/workspace-store";
import { OPERATOR } from "@/lib/workspace-data";
import { toast } from "sonner";

const LINKS = [
  { to: "/admin-panel/dashboard", label: "Pipeline", icon: LayoutGrid, exact: true },
  { to: "/admin-panel/companies", label: "Companies", icon: Building2 },
  { to: "/admin-panel/interviews", label: "Interviews", icon: CalendarClock },
  { to: "/admin-panel/approvals", label: "Approvals", icon: ClipboardCheck },
  { to: "/admin-panel/offers", label: "Offers", icon: FileSignature },
  { to: "/admin-panel/settings", label: "Settings", icon: Settings },
] as const;

interface AppNavProps {
  onLogout?: () => void;
}

export function AppNav({ onLogout }: AppNavProps) {
  const { companies, companyId, setCompanyId } = useWorkspace();

  const handleLogout = () => {
    localStorage.removeItem("talentflow_admin_auth");
    toast.info("Admin session locked");
    if (onLogout) {
      onLogout();
    }
    window.location.href = "/admin-panel/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/admin-panel"
            title="Admin Panel Home"
            className="grid size-8 place-items-center rounded-md bg-ember text-xs font-semibold text-ember-foreground shadow-xs hover:opacity-90 transition-opacity"
          >
            TF
          </Link>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{OPERATOR.name}</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-ember/15 text-ember border border-ember/30 flex items-center gap-1">
                <Lock className="size-3" /> ADMIN ATS
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{OPERATOR.tagline}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: "exact" in l ? l.exact : false }}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-foreground"
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Select value={companyId} onValueChange={setCompanyId}>
            <SelectTrigger className="w-44 bg-surface text-xs">
              <SelectValue placeholder="Client company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
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
  );
}
