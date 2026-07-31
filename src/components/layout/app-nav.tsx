import { Link } from "@tanstack/react-router";
import { Building2, CalendarClock, ClipboardCheck, FileSignature, LayoutGrid, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/lib/workspace-store";
import { OPERATOR } from "@/lib/workspace-data";

const LINKS = [
  { to: "/", label: "Pipeline", icon: LayoutGrid, exact: true },
  { to: "/interviews", label: "Interviews", icon: CalendarClock },
  { to: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { to: "/offers", label: "Offers", icon: FileSignature },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppNav() {
  const { companies, companyId, setCompanyId } = useWorkspace();

  return (
    <div className="border-b border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md bg-ember text-xs font-semibold text-ember-foreground">
            CI
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">{OPERATOR.name}</p>
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
          <Building2 className="size-4 text-muted-foreground" />
          <Select value={companyId} onValueChange={setCompanyId}>
            <SelectTrigger className="w-60 bg-surface">
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
        </div>
      </div>
    </div>
  );
}
