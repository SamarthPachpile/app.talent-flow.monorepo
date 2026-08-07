import type {
  PlatformAdminSettings,
  SystemHealthMetric,
  AuditLogEntry,
  ApiResponse,
} from "../types";
import { getAdminBackendStatus } from "./firebase";

const STORAGE_KEY_ADMIN_SETTINGS = "talentflow_admin_settings";

const defaultAdminSettings: PlatformAdminSettings = {
  systemName: "TalentFlow Enterprise Control Hub",
  environment: "production",
  supportEmail: "ops-admin@talentflow.hub",
  maintenanceMode: false,
  globalBrandingTitle: "TalentFlow CRM",
  maxTenantQuota: 50,
  defaultSeatLimit: 25,
  sessionTimeoutMinutes: 60,
  mfaRequired: true,
  ipWhitelistEnabled: false,
  allowedIpRanges: "192.168.1.0/24, 10.0.0.0/16",
  auditLogRetentionDays: 90,
  featureFlags: {
    enableAts: true,
    enableScheduler: true,
    enableCandidatePortal: true,
    enableAssetManagement: true,
    enableESignature: true,
    enableAutomationEngine: true,
  },
};

const defaultSystemHealth: SystemHealthMetric[] = [
  {
    id: "srv-1",
    service: "Firebase Auth API (Admin)",
    status: "healthy",
    latencyMs: 38,
    uptime: "99.98%",
    lastChecked: "Just now",
  },
  {
    id: "srv-2",
    service: "Firestore Database (Admin)",
    status: "healthy",
    latencyMs: 42,
    uptime: "99.99%",
    lastChecked: "Just now",
  },
  {
    id: "srv-3",
    service: "Candidate Notification Engine",
    status: "healthy",
    latencyMs: 55,
    uptime: "99.95%",
    lastChecked: "1 min ago",
  },
  {
    id: "srv-4",
    service: "Stage SLA Automations",
    status: "healthy",
    latencyMs: 61,
    uptime: "100%",
    lastChecked: "Just now",
  },
  {
    id: "srv-5",
    service: "Document Storage & CDN",
    status: "healthy",
    latencyMs: 29,
    uptime: "99.99%",
    lastChecked: "Just now",
  },
];

const mockAuditLogs: AuditLogEntry[] = [];

export class AdminApiService {
  static getSettings(): PlatformAdminSettings {
    if (typeof window === "undefined") return defaultAdminSettings;
    const stored = localStorage.getItem(STORAGE_KEY_ADMIN_SETTINGS);
    if (!stored) return defaultAdminSettings;
    try {
      return { ...defaultAdminSettings, ...JSON.parse(stored) };
    } catch {
      return defaultAdminSettings;
    }
  }

  static updateSettings(
    partialSettings: Partial<PlatformAdminSettings>,
  ): ApiResponse<PlatformAdminSettings> {
    const current = this.getSettings();
    const updated: PlatformAdminSettings = {
      ...current,
      ...partialSettings,
      featureFlags: {
        ...current.featureFlags,
        ...(partialSettings.featureFlags || {}),
      },
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ADMIN_SETTINGS, JSON.stringify(updated));
    }
    return {
      success: true,
      data: updated,
      message: "Admin settings updated successfully",
      timestamp: new Date().toISOString(),
    };
  }

  static getHealthMetrics(): SystemHealthMetric[] {
    const backendStatus = getAdminBackendStatus();
    return defaultSystemHealth.map((item) => {
      if (item.service.includes("Firebase")) {
        return {
          ...item,
          status: backendStatus.connected ? "healthy" : "degraded",
          lastPing: backendStatus.lastPing,
        };
      }
      return item;
    });
  }

  static getAuditLogs(): AuditLogEntry[] {
    return mockAuditLogs;
  }
}
