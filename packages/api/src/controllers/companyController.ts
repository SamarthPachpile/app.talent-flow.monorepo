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

      let company = null;
      if (email) {
        company = await CompanyService.getCompanyByEmail(email);
      }
      if (!company && uid) {
        company = await CompanyService.getCompany(uid);
      }

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
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Company saved in Dragonfly DB successfully",
        saved,
      );
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to save company", err);
    }
  },

  async registerCandidate(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.params.companyId || "") as string;
      const { candidate } = req.body;

      const updated = await CompanyService.registerCandidate(companyId, candidate);
      if (!updated) {
        errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "Company not found");
        return;
      }

      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Candidate registered to company workspace in Dragonfly DB",
        updated,
      );
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
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Company settings fetched from Dragonfly DB",
        settings,
      );
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to get settings", err);
    }
  },

  async saveSettings(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.params.companyId || "company") as string;
      const settings = await CompanyService.saveSettings(req.body, companyId);
      successResponse(
        res,
        httpStatusCodes.SUCCESS,
        "Company settings saved to Dragonfly DB",
        settings,
      );
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
