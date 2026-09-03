import type { Request, Response } from "express";
import { JobService } from "../services/jobService";
import { successResponse, errorResponse } from "@talent-flow/utilities";
import { httpStatusCodes } from "@talent-flow/schema-types";

export const JobController = {
  async getAllJobs(_req: Request, res: Response): Promise<void> {
    try {
      const jobs = await JobService.getAllJobs();
      successResponse(res, httpStatusCodes.SUCCESS, "Jobs retrieved successfully", jobs);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to retrieve jobs", err);
    }
  },

  async getJobsByCompany(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.params.companyId || "") as string;
      const jobs = await JobService.getJobsForCompany(companyId);
      successResponse(res, httpStatusCodes.SUCCESS, "Company jobs retrieved successfully", jobs);
    } catch (err) {
      errorResponse(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve company jobs",
        err,
      );
    }
  },

  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.params.id || "") as string;
      const job = await JobService.getJobById(id);
      if (!job) {
        errorResponse(res, httpStatusCodes.DATA_NOT_FOUND, "Job posting not found");
        return;
      }
      successResponse(res, httpStatusCodes.SUCCESS, "Job retrieved successfully", job);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to retrieve job", err);
    }
  },

  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const created = await JobService.createJob(req.body);
      successResponse(res, httpStatusCodes.SUCCESS, "Job posting created successfully", created);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to create job", err);
    }
  },

  async updateJobStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.params.id || "") as string;
      const { status } = req.body;
      const updated = await JobService.updateJobStatus(id, status);
      successResponse(res, httpStatusCodes.SUCCESS, "Job status updated", updated);
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update job status", err);
    }
  },

  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.params.id || "") as string;
      await JobService.deleteJob(id);
      successResponse(res, httpStatusCodes.SUCCESS, "Job posting deleted successfully");
    } catch (err) {
      errorResponse(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete job", err);
    }
  },
};

export default JobController;
