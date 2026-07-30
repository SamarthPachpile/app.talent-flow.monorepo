import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Mail, SlidersHorizontal, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsLayout,
});

const NAV = [
  { to: "/settings", label: "General", icon: SlidersHorizontal, exact: true },
  { to: "/settings/templates", label: "Email templates", icon: Mail },
  { to: "/settings/automation", label: "Automation", icon: Zap },
  { to: "/settings/team", label: "Team & roles", icon: Users },
  { to: "/settings/guidelines", label: "Guidelines", icon: BookOpen },
] as const;

function SettingsLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="px-6 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-[0.18em] hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Pipeline board
          </Link>
          <h1 className="mt-2 text-4xl leading-none">Settings</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Configure the hiring workspace: email templates, stage automation, team access and
            operating guidelines.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-8 px-6 py-8 lg:flex-row">
        <nav className="flex shrink-0 flex-row flex-wrap gap-1 lg:w-56 lg:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="min-w-0 flex-1 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
