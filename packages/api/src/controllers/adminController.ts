import type { Request, Response } from "express";
import { AdminService } from "../services/adminService";
import { Company, Candidate, User, Job } from "@talent-flow/schema-types/models";
import { DragonflyCacheService, DragonflySessionService } from "@talent-flow/utilities/dragonfly";
import { successResponse, errorResponse } from "@talent-flow/utilities";
import { httpStatusCodes } from "@talent-flow/schema-types";

export const AdminController = {
  async getSettings(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await AdminService.fetchAdminSettings();
      successResponse(res, httpStatusCodes.SUCCESS, "Admin settings fetched", settings);
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to get admin settings",
        err,
      );
    }
  },

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const updated = await AdminService.saveAdminSettings(req.body);
      successResponse(res, httpStatusCodes.SUCCESS, "Admin settings updated", updated);
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update admin settings",
        err,
      );
    }
  },

  async getHealth(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = AdminService.getHealthMetrics();
      const status = AdminService.getBackendStatus();
      successResponse(res, httpStatusCodes.SUCCESS, "Health status fetched", { metrics, status });
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to get health metrics",
        err,
      );
    }
  },

  async getAuditLogs(_req: Request, res: Response): Promise<void> {
    try {
      const logs = AdminService.getAuditLogs();
      successResponse(res, httpStatusCodes.SUCCESS, "Audit logs fetched", logs);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to get audit logs", err);
    }
  },

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const [companiesCount, candidatesCount, usersCount, jobsCount] = await Promise.all([
        Company.countDocuments().catch(() => 0),
        Candidate.countDocuments().catch(() => 0),
        User.countDocuments().catch(() => 0),
        Job.countDocuments().catch(() => 0),
      ]);

      successResponse(res, httpStatusCodes.SUCCESS, "Platform stats fetched", {
        companies: companiesCount,
        candidates: candidatesCount,
        users: usersCount,
        jobs: jobsCount,
        dragonflyActive: true,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to get stats", err);
    }
  },

  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      const { pattern } = req.body;
      if (pattern) {
        await DragonflyCacheService.del(pattern);
      }
      successResponse(res, httpStatusCodes.SUCCESS, "Dragonfly DB cache cleared successfully");
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to clear cache", err);
    }
  },

  async revokeSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.body;
      if (sessionId) {
        await DragonflySessionService.destroySession(sessionId);
      }
      successResponse(res, httpStatusCodes.SUCCESS, "Session revoked successfully");
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to revoke session", err);
    }
  },
};
