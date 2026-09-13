import { Router } from "express";
import { CandidateController } from "../controllers/candidateController";

export const candidateRoutes = Router();

candidateRoutes.get(
  ["/", "/all-candidates", "/candidates-list"],
  CandidateController.getAllCandidates,
);
candidateRoutes.post(["/", "/save-candidate", "/save-profile"], CandidateController.saveCandidate);
candidateRoutes.get(
  ["/search/email", "/search-email", "/find-email"],
  CandidateController.searchCandidateByEmail,
);
candidateRoutes.get(["/:id", "/profile/:id"], CandidateController.getCandidateById);
candidateRoutes.post(
  ["/:id/add-company", "/:id/link-company"],
  CandidateController.addCompanyToCandidate,
);
candidateRoutes.get(
  ["/:candidateId/settings", "/:candidateId/candidate-settings"],
  CandidateController.getSettings,
);
candidateRoutes.post(
  ["/:candidateId/settings", "/:candidateId/candidate-settings"],
  CandidateController.saveSettings,
);
candidateRoutes.delete(["/:id", "/delete-candidate/:id"], CandidateController.deleteCandidate);

export default candidateRoutes;
