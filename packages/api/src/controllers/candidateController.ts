import type { Request, Response } from "express";
import { CandidateService } from "../services/candidateService";
import { successResponse, errorResponse } from "@talent-flow/utilities";
import { httpStatusCodes } from "@talent-flow/schema-types";

export const CandidateController = {
  async getAllCandidates(_req: Request, res: Response): Promise<void> {
    try {
      const candidates = await CandidateService.getAllCandidates();
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Candidates retrieved successfully",
        candidates,
      );
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve candidates",
        err,
      );
    }
  },

  async getCandidateById(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.params.id || "") as string;
      const candidate = await CandidateService.getCandidate(id);
      if (!candidate) {
        errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "Candidate profile not found");
        return;
      }
      successResponse(res, httpStatusCodes.SUCCESS, "Candidate retrieved successfully", candidate);
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve candidate",
        err,
      );
    }
  },

  async searchCandidateByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = (req.query.email as string)?.trim().toLowerCase();
      const uid = req.query.uid as string;

      if (!email && !uid) {
        errorResponse(res, httpStatusCodes.BAD_REQUEST, "Email or UID query parameter is required");
        return;
      }

      let candidate = null;
      if (email) {
        candidate = await CandidateService.getCandidateByEmail(email);
      }
      if (!candidate && uid) {
        candidate = await CandidateService.getCandidate(uid);
      }

      if (!candidate) {
        errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "Candidate not found");
        return;
      }

      successResponse(res, httpStatusCodes.SUCCESS, "Candidate found", candidate);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Error searching candidate", err);
    }
  },

  async saveCandidate(req: Request, res: Response): Promise<void> {
    try {
      const saved = await CandidateService.saveCandidate(req.body);
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Candidate stored in Dragonfly DB successfully",
        saved,
      );
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to save candidate", err);
    }
  },

  async addCompanyToCandidate(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.params.id || "") as string;
      const { companyId, companyName } = req.body;
      const updated = await CandidateService.linkCompany(id, companyId, companyName);
      if (!updated) {
        errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "Candidate not found");
        return;
      }
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Company linked to candidate in Dragonfly DB",
        updated,
      );
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to link company", err);
    }
  },

  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const candidateId = (req.params.candidateId || "cand-alex") as string;
      const settings = await CandidateService.fetchSettings(candidateId);
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Candidate settings fetched from Dragonfly DB",
        settings,
      );
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to get settings", err);
    }
  },

  async saveSettings(req: Request, res: Response): Promise<void> {
    try {
      const candidateId = (req.params.candidateId || "cand-alex") as string;
      const settings = await CandidateService.saveSettings(req.body, candidateId);
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Candidate settings saved to Dragonfly DB",
        settings,
      );
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to save settings", err);
    }
  },

  async deleteCandidate(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.params.id || "") as string;
      await CandidateService.deleteCandidate(id);
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Candidate deleted from Dragonfly DB successfully",
      );
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete candidate", err);
    }
  },
};

export default CandidateController;
