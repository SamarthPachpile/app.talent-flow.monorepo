import { Router } from "express";
import { JobController } from "../controllers/jobController";

export const jobRoutes = Router();

jobRoutes.get("/", JobController.getAllJobs);
jobRoutes.post("/", JobController.createJob);
jobRoutes.get("/company/:companyId", JobController.getJobsByCompany);
jobRoutes.get("/:id", JobController.getJobById);
jobRoutes.patch("/:id/status", JobController.updateJobStatus);
jobRoutes.delete("/:id", JobController.deleteJob);

export default jobRoutes;
