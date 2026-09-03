import { Router } from "express";
import { authRouter } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";
import { candidateRoutes } from "./candidateRoutes";
import { companyRoutes } from "./companyRoutes";
import { jobRoutes } from "./jobRoutes";
import { gravitonRoutes } from "./gravitonRoutes";
import { settingsRouter } from "./settingsRoutes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/candidates", candidateRoutes);
apiRouter.use("/companies", companyRoutes);
apiRouter.use("/jobs", jobRoutes);
apiRouter.use("/graviton", gravitonRoutes);
apiRouter.use("/settings", settingsRouter);

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
