import { useState, useEffect } from "react";
import {
  AdminApiService,
  SettingsBackendService,
  getBackendStatus,
  type PlatformAdminSettings,
  type SystemHealthMetric,
  type AuditLogEntry,
} from "@talent-flow/api";
import {
  Shield,
  Activity,
  Lock,
  Building2,
  FileText,
  Save,
  Server,
  CheckCircle2,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "@/lib/sweetalert";
import { SettingsCard } from "../settings/settings-card";
import { Footer } from "../Footer";

type TabType = "general" | "health" | "security" | "tenants" | "audit";

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  const [settings, setSettings] = useState<PlatformAdminSettings>(() =>
    AdminApiService.getSettings(),
  );
  const [backendStatus, setBackendStatus] = useState(() => getBackendStatus());
  const [healthMetrics, setHealthMetrics] = useState<SystemHealthMetric[]>(() =>
    AdminApiService.getHealthMetrics(),
  );
  const [auditLogs] = useState<AuditLogEntry[]>(() => AdminApiService.getAuditLogs());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SettingsBackendService.fetchAdminSettings().then((data) => {
      setSettings(data);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await SettingsBackendService.saveAdminSettings(settings);
    setLoading(false);
    if (res.success) {
      toast.success("Platform admin settings saved to MongoDB Atlas & Dragonfly DB!");
    } else {
      toast.error("Failed to save admin settings");
    }
  };

  const handleRefreshStatus = () => {
    setBackendStatus(getBackendStatus());
    setHealthMetrics(AdminApiService.getHealthMetrics());
    toast.info("System backend health refreshed");
  };

  return (
    <div className="font-sans">
      <div className="px-5 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-ember/15 text-ember font-bold">
            <Server className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-foreground text-base">
                MongoDB Atlas & REST API Backend
              </h2>
              <span className="inline-flex items-center gap-1 bg-success/15 text-success border border-success/30 text-11px px-2.5 py-0.5 rounded-full font-semibold">
                <CheckCircle2 className="size-3" /> Connected · {backendStatus.database}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Database Engine:{" "}
              <span className="text-foreground font-mono">{backendStatus.engine}</span> · Auth:{" "}
              <span className="text-foreground font-mono">{backendStatus.authStatus}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStatus}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="size-3.5" /> Refresh Status
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gap-1.5 text-xs bg-ember hover:bg-ember/90 text-ember-foreground"
          >
            <Save className="size-3.5" /> {loading ? "Saving..." : "Save Admin Settings"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-3">
        {[
          { id: "general", label: "Platform General", icon: Shield },
          { id: "health", label: "System Health & Backend", icon: Activity },
          { id: "security", label: "Security & Access", icon: Lock },
          { id: "tenants", label: "Tenant Quotas & Features", icon: Building2 },
          { id: "audit", label: "System Audit Logs", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-ember text-ember-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "general" && (
        <SettingsCard
          icon={Shield}
          title="Platform System & Infrastructure Control"
          description="Global configuration for the TalentFlow CRM platform backend."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Control Name</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="environment">Deployment Environment</Label>
              <Select
                value={settings.environment}
                onValueChange={(val: string) =>
                  setSettings({
                    ...settings,
                    environment: val as "production" | "staging" | "development",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Platform Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branding">Global App Title</Label>
              <Input
                id="branding"
                value={settings.globalBrandingTitle}
                onChange={(e) => setSettings({ ...settings, globalBrandingTitle: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Global Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                Temporarily disable company & candidate logins during scheduled maintenance.
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
            />
          </div>
        </SettingsCard>
      )}

      {activeTab === "health" && (
        <SettingsCard
          icon={Activity}
          title="System Health & Microservice Latency"
          description="Real-time uptime and ping response times for MongoDB Atlas and Node.js REST API services."
        >
          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
            {healthMetrics.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-surface flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded bg-accent">
                    <Cpu className="size-4 text-ember" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.service}</p>
                    <p className="text-11px text-muted-foreground">
                      Uptime: {item.uptime} · Checked: {item.lastChecked}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-muted-foreground text-11px">
                    {item.latencyMs} ms
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-10px font-semibold uppercase ${
                      item.status === "healthy"
                        ? "bg-success/15 text-success border border-success/30"
                        : "bg-warning/15 text-warning-foreground border border-warning/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SettingsCard>
      )}

      {activeTab === "security" && (
        <SettingsCard
          icon={Lock}
          title="Platform Security & Compliance Rules"
          description="Enforce authentication policies, session lifetimes, and IP restrictions across all tenant portals."
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
              <div>
                <p className="font-semibold text-foreground">
                  Require Multi-Factor Authentication (MFA)
                </p>
                <p className="text-11px text-muted-foreground">
                  Force all admin and recruiter accounts to setup 2FA.
                </p>
              </div>
              <Switch
                checked={settings.mfaRequired}
                onCheckedChange={(v) => setSettings({ ...settings, mfaRequired: v })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Admin Session Timeout (Minutes)</Label>
                <Select
                  value={String(settings.sessionTimeoutMinutes)}
                  onValueChange={(val) =>
                    setSettings({ ...settings, sessionTimeoutMinutes: Number(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="60">60 Minutes</SelectItem>
                    <SelectItem value="120">120 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Audit Log Retention (Days)</Label>
                <Select
                  value={String(settings.auditLogRetentionDays)}
                  onValueChange={(val) =>
                    setSettings({ ...settings, auditLogRetentionDays: Number(val) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">365 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Allowed IP Whitelist Ranges (CIDR notation)</Label>
              <Input
                value={settings.allowedIpRanges}
                onChange={(e) => setSettings({ ...settings, allowedIpRanges: e.target.value })}
                placeholder="192.168.1.0/24, 10.0.0.0/16"
              />
            </div>
          </div>
        </SettingsCard>
      )}

      {activeTab === "tenants" && (
        <SettingsCard
          icon={Building2}
          title="Tenant Quotas & Module Feature Flags"
          description="Control default tenant limits and toggle modules across all onboarding companies."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
            <div className="space-y-2">
              <Label>Max Tenant Quota Limit</Label>
              <Input
                type="number"
                value={settings.maxTenantQuota}
                onChange={(e) =>
                  setSettings({ ...settings, maxTenantQuota: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Default Seat Limit per Company</Label>
              <Input
                type="number"
                value={settings.defaultSeatLimit}
                onChange={(e) =>
                  setSettings({ ...settings, defaultSeatLimit: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Global Platform Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(settings.featureFlags).map(([flagKey, enabled]) => (
              <div
                key={flagKey}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface"
              >
                <span className="font-semibold text-foreground capitalize">
                  {flagKey.replace("enable", "")} Module
                </span>
                <Switch
                  checked={enabled}
                  onCheckedChange={(v) =>
                    setSettings({
                      ...settings,
                      featureFlags: { ...settings.featureFlags, [flagKey]: v },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </SettingsCard>
      )}

      {activeTab === "audit" && (
        <SettingsCard
          icon={FileText}
          title="System Audit Log History"
          description="Immutable security and operational log of platform admin actions."
        >
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-muted-foreground font-semibold uppercase text-10px">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Role</th>
                  <th className="p-3">Action Executed</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface/50">
                    <td className="p-3 text-muted-foreground font-mono text-11px">
                      {log.timestamp}
                    </td>
                    <td className="p-3 font-semibold text-foreground">
                      {log.actor} ({log.role})
                    </td>
                    <td className="p-3 text-foreground">{log.action}</td>
                    <td className="p-3 text-muted-foreground">{log.target}</td>
                    <td className="p-3">
                      <span className="bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded text-10px font-semibold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SettingsCard>
      )}

      <Footer
        linksCol1={[
          { label: "Admin Pipeline", href: "/admin-panel/dashboard" },
          { label: "Onboarded Companies", href: "/admin-panel/companies" },
          { label: "Platform Settings", href: "/admin-panel/settings" },
          { label: "Offers Central", href: "/admin-panel/offers" },
        ]}
        linksCol2={[
          { label: "Company Portal", href: "/companies" },
          { label: "Candidate Portal", href: "/candidates-portal" },
          { label: "System Health", href: "/admin-panel/settings" },
        ]}
      />
    </div>
  );
}
