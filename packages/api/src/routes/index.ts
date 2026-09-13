import { Router } from "express";
import { authRouter } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";
import { candidateRoutes } from "./candidateRoutes";
import { companyRoutes } from "./companyRoutes";
import { jobRoutes } from "./jobRoutes";
import { gravitonRoutes } from "./gravitonRoutes";
import { settingsRouter } from "./settingsRoutes";

export const apiRouter = Router();

apiRouter.use(
  ["/candidates-auth", "/companies-auth", "/admin-auth", "/auth-portal", "/auth-service", "/auth"],
  authRouter,
);
apiRouter.use(["/admin-portal", "/admin-panel", "/admin"], adminRoutes);
apiRouter.use(
  ["/candidates-profile", "/candidates-portal", "/candidates-data", "/candidates"],
  candidateRoutes,
);
apiRouter.use(
  ["/companies-profile", "/companies-workspace", "/companies-portal", "/companies"],
  companyRoutes,
);
apiRouter.use(["/job-postings", "/job-listings", "/jobs-portal", "/jobs"], jobRoutes);
apiRouter.use(["/graviton-services", "/graviton"], gravitonRoutes);
apiRouter.use(["/system-settings", "/app-settings", "/settings"], settingsRouter);

export default apiRouter;
export {
  authRouter,
  adminRoutes,
  candidateRoutes,
  companyRoutes,
  companyRoutes as companyRouter,
  jobRoutes,
  jobRoutes as jobRouter,
  gravitonRoutes,
  settingsRouter,
};
