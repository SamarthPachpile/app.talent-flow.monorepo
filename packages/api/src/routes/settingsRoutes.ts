import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { CandidateController } from "../controllers/candidateController";
import { CompanyController } from "../controllers/companyController";

export const settingsRouter = Router();

settingsRouter.get(["/admin", "/admin-settings"], AdminController.getSettings);
settingsRouter.post(["/admin", "/admin-settings"], AdminController.updateSettings);
settingsRouter.get(
  ["/company", "/company/:companyId", "/company-settings", "/company-settings/:companyId"],
  CompanyController.getSettings,
);
settingsRouter.post(
  ["/company", "/company/:companyId", "/company-settings", "/company-settings/:companyId"],
  CompanyController.saveSettings,
);
settingsRouter.get(
  [
    "/candidate",
    "/candidate/:candidateId",
    "/candidate-settings",
    "/candidate-settings/:candidateId",
  ],
  CandidateController.getSettings,
);
settingsRouter.post(
  [
    "/candidate",
    "/candidate/:candidateId",
    "/candidate-settings",
    "/candidate-settings/:candidateId",
  ],
  CandidateController.saveSettings,
);

export default settingsRouter;
