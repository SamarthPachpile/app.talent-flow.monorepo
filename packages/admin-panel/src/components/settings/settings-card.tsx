import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SettingsCard({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex gap-3">
          {Icon ? (
            <span className="mt-0.5 flex size-8 items-center justify-center rounded-md bg-accent text-foreground">
              <Icon className="size-4" />
            </span>
          ) : null}
          <div>
            <h2 className="text-base font-medium text-foreground">{title}</h2>
            {description ? (
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </header>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

export function SettingsRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
