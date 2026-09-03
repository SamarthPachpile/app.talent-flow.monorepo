import { Router } from "express";
import { AdminController } from "../controllers/adminController";

export const adminRoutes = Router();

adminRoutes.get("/settings", AdminController.getSettings);
adminRoutes.post("/settings", AdminController.updateSettings);
adminRoutes.get("/health", AdminController.getHealth);
adminRoutes.get("/audit-logs", AdminController.getAuditLogs);
adminRoutes.get("/stats", AdminController.getStats);
adminRoutes.post("/cache/clear", AdminController.clearCache);
adminRoutes.post("/session/revoke", AdminController.revokeSession);

export default adminRoutes;
