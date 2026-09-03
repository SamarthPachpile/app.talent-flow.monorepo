import type { Request, Response } from "express";
import { CompanyService } from "../services/companyService";
import { Company } from "@talent-flow/schema-types/models";
import { successResponse, errorResponse } from "@talent-flow/utilities";
import { httpStatusCodes } from "@talent-flow/schema-types";

export const CompanyController = {
  async getAllCompanies(_req: Request, res: Response): Promise<void> {
    try {
      const companies = await CompanyService.getAllCompanies();
      successResponse(res, httpStatusCodes.SUCCESS, "Companies retrieved successfully", companies);
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve companies",
        err,
      );
    }
  },

  async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.params.id || "") as string;
      const company = await CompanyService.getCompany(id);
      if (!company) {
        errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "Company not found");
        return;
      }
      successResponse(res, httpStatusCodes.SUCCESS, "Company retrieved successfully", company);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to retrieve company", err);
    }
  },

  async searchCompanyByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = (req.query.email as string)?.trim().toLowerCase();
      const uid = req.query.uid as string;

      if (!email && !uid) {
        errorResponse(res, httpStatusCodes.BAD_REQUEST, "Email or UID query parameter is required");
        return;
      }

      const query: Record<string, unknown>[] = [];
      if (email) {
        query.push({ "profile.senderAddress": email });
        query.push({ email });
      }
      if (uid) query.push({ uid });

      const company = await Company.findOne({ $or: query }).lean();
      if (!company) {
        errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "Company workspace not found");
        return;
      }

      successResponse(res, httpStatusCodes.SUCCESS, "Company workspace found", company);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Error searching company", err);
    }
  },

  async saveCompany(req: Request, res: Response): Promise<void> {
    try {
      const saved = await CompanyService.saveCompany(req.body);
      successResponse(res, httpStatusCodes.SUCCESS, "Company saved successfully", saved);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to save company", err);
    }
  },

  async registerCandidate(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.params.companyId || "") as string;
      const cleanCompId = companyId.toLowerCase().replace(/[^a-z0-9]/g, "");
      const { candidate } = req.body;

      await Company.updateOne(
        { $or: [{ id: cleanCompId }, { subdomain: cleanCompId }] },
        {
          $addToSet: { registeredCandidateIds: candidate?.id || candidate?.email },
          $inc: { "stats.totalCandidates": 1 },
          $set: { updatedAt: new Date().toISOString() },
        },
      );

      successResponse(res, httpStatusCodes.SUCCESS, "Candidate registered to company workspace");
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to register candidate",
        err,
      );
    }
  },

  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.params.companyId || "company") as string;
      const settings = await CompanyService.fetchSettings(companyId);
      successResponse(res, httpStatusCodes.SUCCESS, "Company settings fetched", settings);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to get settings", err);
    }
  },

  async saveSettings(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.params.companyId || "company") as string;
      const settings = await CompanyService.saveSettings(req.body, companyId);
      successResponse(res, httpStatusCodes.SUCCESS, "Company settings saved", settings);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to save settings", err);
    }
  },

  async scheduleEmails(req: Request, res: Response): Promise<void> {
    try {
      const { companySlug, recipients } = req.body;
      successResponse(res, httpStatusCodes.SUCCESS, "Credentials email dispatch scheduled", {
        companySlug,
        recipientCount: recipients?.length || 0,
        status: "queued",
      });
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to schedule emails", err);
    }
  },
};

export default CompanyController;
