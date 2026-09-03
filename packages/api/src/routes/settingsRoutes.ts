import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { CandidateController } from "../controllers/candidateController";
import { CompanyController } from "../controllers/companyController";

export const settingsRouter = Router();

settingsRouter.get("/admin", AdminController.getSettings);
settingsRouter.post("/admin", AdminController.updateSettings);
settingsRouter.get(["/company", "/company/:companyId"], CompanyController.getSettings);
settingsRouter.post(["/company", "/company/:companyId"], CompanyController.saveSettings);
settingsRouter.get(["/candidate", "/candidate/:candidateId"], CandidateController.getSettings);
settingsRouter.post(["/candidate", "/candidate/:candidateId"], CandidateController.saveSettings);

export default settingsRouter;
