import { Router } from "express";
import { CandidateController } from "../controllers/candidateController";

export const candidateRoutes = Router();

candidateRoutes.get("/", CandidateController.getAllCandidates);
candidateRoutes.post("/", CandidateController.saveCandidate);
candidateRoutes.get("/search/email", CandidateController.searchCandidateByEmail);
candidateRoutes.get("/:id", CandidateController.getCandidateById);
candidateRoutes.post("/:id/add-company", CandidateController.addCompanyToCandidate);
candidateRoutes.get("/:candidateId/settings", CandidateController.getSettings);
candidateRoutes.post("/:candidateId/settings", CandidateController.saveSettings);
candidateRoutes.delete("/:id", CandidateController.deleteCandidate);

export default candidateRoutes;
