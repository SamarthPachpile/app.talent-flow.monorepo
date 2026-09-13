import { Router } from "express";
import { CompanyController } from "../controllers/companyController";

export const companyRoutes = Router();

companyRoutes.get(["/", "/all-companies", "/companies-list"], CompanyController.getAllCompanies);
companyRoutes.post(["/", "/save-company", "/save-profile"], CompanyController.saveCompany);
companyRoutes.get(
  ["/search/email", "/search-email", "/find-email"],
  CompanyController.searchCompanyByEmail,
);
companyRoutes.get(["/:id", "/profile/:id"], CompanyController.getCompanyById);
companyRoutes.post(
  ["/:companyId/register-candidate", "/:companyId/enroll-candidate"],
  CompanyController.registerCandidate,
);
companyRoutes.get(
  ["/:companyId/settings", "/:companyId/company-settings"],
  CompanyController.getSettings,
);
companyRoutes.post(
  ["/:companyId/settings", "/:companyId/company-settings"],
  CompanyController.saveSettings,
);
companyRoutes.post(
  ["/schedule-credentials-email", "/schedule-email", "/send-credentials"],
  CompanyController.scheduleEmails,
);

export default companyRoutes;
