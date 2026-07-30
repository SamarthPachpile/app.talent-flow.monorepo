import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Mail, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  EMAIL_TEMPLATES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_VARIABLES,
  TRIGGER_STAGES,
  type EmailTemplate,
} from "@/lib/settings-data";
import type { Stage } from "@/lib/ats-data";

export const Route = createFileRoute("/settings/templates")({
  head: () => ({
    meta: [
      { title: "Email Templates — Hiring Workspace Settings" },
      {
        name: "description",
        content:
          "Create and edit candidate email templates, map them to hiring stages and preview merge variables before they send.",
      },
      { property: "og:title", content: "Email Templates — Hiring Workspace Settings" },
      {
        property: "og:description",
        content: "Stage-triggered email templates with merge variables and live preview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TemplatesSettings,
});

const SAMPLE: Record<string, string> = {
  "{{candidate_name}}": "Alex Moreau",
  "{{role}}": "Senior Frontend Engineer",
  "{{recruiter}}": "Priya Nair",
  "{{company}}": "Northwind Technologies",
  "{{interview_date}}": "Tue 4 Aug, 14:00 BST",
  "{{interview_link}}": "https://meet.northwind.co/abc-defg",
  "{{offer_link}}": "https://portal.northwind.co/offer/9182",
  "{{portal_link}}": "https://portal.northwind.co/login",
};

function render(text: string) {
  return Object.entries(SAMPLE).reduce(
    (acc, [token, value]) => acc.split(token).join(value),
    text,
  );
}

function blank(): EmailTemplate {
  return {
    id: `tpl-${Math.random().toString(36).slice(2, 8)}`,
    name: "Untitled template",
    category: "Screening",
    trigger: "Application Received",
    subject: "",
    body: "",
    active: false,
    updated: "Just now",
  };
}

function TemplatesSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(EMAIL_TEMPLATES);
  const [selectedId, setSelectedId] = useState(EMAIL_TEMPLATES[0].id);
  const selected = templates.find((t) => t.id === selectedId) ?? templates[0];

  function patch(changes: Partial<EmailTemplate>) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, ...changes, updated: "Just now" } : t)),
    );
  }

  function addTemplate() {
    const t = blank();
    setTemplates((prev) => [t, ...prev]);
    setSelectedId(t.id);
  }

  function removeTemplate(id: string) {
    setTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (id === selectedId && next.length) setSelectedId(next[0].id);
      return next;
    });
    toast.success("Template deleted");
  }

  function insertVariable(token: string) {
    patch({ body: `${selected.body}${selected.body.endsWith(" ") ? "" : " "}${token}` });
  }

  const preview = useMemo(
    () => ({ subject: render(selected?.subject ?? ""), body: render(selected?.body ?? "") }),
    [selected],
  );

  if (!selected) return null;

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">Templates ({templates.length})</h2>
          <Button size="sm" variant="ghost" onClick={addTemplate}>
            <Plus className="size-4" /> New
          </Button>
        </div>
        <ul className="max-h-[560px] overflow-y-auto p-2">
          {templates.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setSelectedId(t.id)}
                className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${
                  t.id === selected.id ? "bg-accent" : "hover:bg-accent/60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm font-medium">{t.name}</span>
                  <span
                    className={`ml-auto size-1.5 shrink-0 rounded-full ${
                      t.active ? "bg-primary" : "bg-muted-foreground/40"
                    }`}
                  />
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {t.category} · {t.trigger}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="min-w-0 space-y-4">
        <div className="rounded-lg border border-border bg-card">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-medium">{selected.name}</h2>
              <p className="text-xs text-muted-foreground">Updated {selected.updated}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={selected.active ? "default" : "secondary"}>
                {selected.active ? "Active" : "Draft"}
              </Badge>
              <Switch
                checked={selected.active}
                onCheckedChange={(v) => patch({ active: v })}
                aria-label="Template active"
              />
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete template"
                onClick={() => removeTemplate(selected.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </header>

          <div className="space-y-4 px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="tpl-name">Template name</Label>
                <Input
                  id="tpl-name"
                  value={selected.name}
                  onChange={(e) => patch({ name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={selected.category}
                  onValueChange={(v) => patch({ category: v as EmailTemplate["category"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sends at stage</Label>
                <Select
                  value={selected.trigger}
                  onValueChange={(v) => patch({ trigger: v as Stage })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="size-3.5" /> Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="tpl-subject">Subject line</Label>
                  <Input
                    id="tpl-subject"
                    value={selected.subject}
                    placeholder="e.g. Your interview for {{role}} is confirmed"
                    onChange={(e) => patch({ subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tpl-body">Email body</Label>
                  <Textarea
                    id="tpl-body"
                    rows={14}
                    className="font-mono text-[13px] leading-relaxed"
                    value={selected.body}
                    onChange={(e) => patch({ body: e.target.value })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="pt-4">
                <div className="rounded-md border border-border bg-surface p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.16em]">
                    Subject
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {preview.subject || "— no subject set —"}
                  </p>
                  <hr className="my-4 border-border" />
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                    {preview.body || "— no content yet —"}
                  </pre>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Preview uses sample candidate data.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card px-5 py-4">
          <h3 className="text-sm font-medium">Merge variables</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Click to insert into the body. They're replaced with real candidate data on send.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEMPLATE_VARIABLES.map((v) => (
              <button
                key={v.token}
                title={v.description}
                onClick={() => insertVariable(v.token)}
                className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {v.token}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => toast("Test email sent to you")}>
            Send test
          </Button>
          <Button onClick={() => toast.success("Template saved")}>
            <Save className="size-4" /> Save template
          </Button>
        </div>
      </section>
    </div>
  );
}
