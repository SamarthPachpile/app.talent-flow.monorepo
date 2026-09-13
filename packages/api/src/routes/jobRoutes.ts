import { Router } from "express";
import { JobController } from "../controllers/jobController";

export const jobRoutes = Router();

jobRoutes.get(["/", "/all-jobs", "/jobs-list"], JobController.getAllJobs);
jobRoutes.post(["/", "/create-job", "/post-job"], JobController.createJob);
jobRoutes.get(["/company/:companyId", "/company-jobs/:companyId"], JobController.getJobsByCompany);
jobRoutes.get(["/:id", "/job-details/:id"], JobController.getJobById);
jobRoutes.patch(["/:id/status", "/:id/update-status"], JobController.updateJobStatus);
jobRoutes.delete(["/:id", "/delete-job/:id"], JobController.deleteJob);

export default jobRoutes;
