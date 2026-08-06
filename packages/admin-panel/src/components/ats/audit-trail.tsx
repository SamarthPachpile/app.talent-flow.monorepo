import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AuditEntry } from "@/lib/workspace-data";

export function AuditTrail({
  title = "Audit log",
  entries,
}: {
  title?: string;
  entries: AuditEntry[];
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="flex size-8 items-center justify-center rounded-md bg-accent text-foreground">
          <History className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-medium text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">
            Immutable record — one entry per lifecycle action.
          </p>
        </div>
      </header>
      <ScrollArea className="max-h-[32rem]">
        <ol className="divide-y divide-border">
          {entries.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-muted-foreground">
              No activity recorded yet.
            </li>
          )}
          {entries.map((e) => (
            <li key={e.id} className="px-5 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{e.action}</p>
                <Badge variant="outline" className="shrink-0 font-normal">
                  {e.channel}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {e.candidateName} · {e.actor} · {e.at}
              </p>
              {e.detail && (
                <p className="mt-1 text-xs break-words text-muted-foreground">{e.detail}</p>
              )}
            </li>
          ))}
        </ol>
      </ScrollArea>
    </section>
  );
}
