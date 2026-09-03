import { Router } from "express";
import { GravitonController } from "../controllers/gravitonController";

export const gravitonRoutes = Router();

gravitonRoutes.get("/health", GravitonController.getHealth);
gravitonRoutes.post("/leads", GravitonController.submitLead);

export default gravitonRoutes;
