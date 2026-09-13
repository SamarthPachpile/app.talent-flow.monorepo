import { Router } from "express";
import { GravitonController } from "../controllers/gravitonController";

export const gravitonRoutes = Router();

gravitonRoutes.get(["/health", "/service-health"], GravitonController.getHealth);
gravitonRoutes.post(["/leads", "/submit-lead"], GravitonController.submitLead);

export default gravitonRoutes;
