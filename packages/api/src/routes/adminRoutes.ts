import { Router } from "express";
import { AdminController } from "../controllers/adminController";

export const adminRoutes = Router();

adminRoutes.get(["/settings", "/admin-settings"], AdminController.getSettings);
adminRoutes.post(["/settings", "/admin-settings"], AdminController.updateSettings);
adminRoutes.get(["/health", "/system-health"], AdminController.getHealth);
adminRoutes.get(["/audit-logs", "/system-logs"], AdminController.getAuditLogs);
adminRoutes.get(["/stats", "/platform-stats"], AdminController.getStats);
adminRoutes.post(["/cache/clear", "/clear-cache"], AdminController.clearCache);
adminRoutes.post(["/session/revoke", "/revoke-session"], AdminController.revokeSession);
adminRoutes.get(
  ["/sync/status", "/sync-status", "/cron-status"],
  AdminController.getCronSyncStatus,
);
adminRoutes.post(
  ["/sync/trigger", "/sync-trigger", "/sync-now", "/cron-flush"],
  AdminController.triggerCronSync,
);

export default adminRoutes;
