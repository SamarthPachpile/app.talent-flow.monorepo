import type { Request, Response } from "express";
import { GravitonService } from "../services/gravitonService";
import { successResponse, errorResponse } from "@talent-flow/utilities";
import { httpStatusCodes } from "@talent-flow/schema-types";

export const GravitonController = {
  async getHealth(_req: Request, res: Response): Promise<void> {
    try {
      const health = GravitonService.getEcosystemHealth();
      successResponse(res, httpStatusCodes.SUCCESS, "Graviton ecosystem status retrieved", health);
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to get ecosystem status",
        err,
      );
    }
  },

  async submitLead(req: Request, res: Response): Promise<void> {
    try {
      const lead = req.body;
      successResponse(res, httpStatusCodes.SUCCESS, "Lead captured successfully", {
        id: `lead_${Date.now()}`,
        lead,
      });
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to submit lead", err);
    }
  },
};

export default GravitonController;
