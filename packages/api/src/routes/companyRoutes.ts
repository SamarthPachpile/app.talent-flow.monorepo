import { Router } from "express";
import { CompanyController } from "../controllers/companyController";

export const companyRoutes = Router();

companyRoutes.get("/", CompanyController.getAllCompanies);
companyRoutes.post("/", CompanyController.saveCompany);
companyRoutes.get("/search/email", CompanyController.searchCompanyByEmail);
companyRoutes.get("/:id", CompanyController.getCompanyById);
companyRoutes.post("/:companyId/register-candidate", CompanyController.registerCandidate);
companyRoutes.get("/:companyId/settings", CompanyController.getSettings);
companyRoutes.post("/:companyId/settings", CompanyController.saveSettings);
companyRoutes.post("/schedule-credentials-email", CompanyController.scheduleEmails);

export default companyRoutes;
