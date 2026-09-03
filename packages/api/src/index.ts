export * from "@talent-flow/schema-types";
export * from "@talent-flow/utilities";

export * from "./client";
export * from "./services";
export * from "./controllers";
export * from "./routes";
export * from "./middlewares";
export * from "./db";
export * from "./backend";
export * from "./dragonfly/viteDragonflyPlugin";

export {
  getBackendStatus,
  getAdminBackendStatus,
  getCompanyBackendStatus,
  getCandidateBackendStatus,
  uploadFileToStorage,
  uploadCompanyFileToStorage,
  uploadCandidateFileToStorage,
  uploadAdminFileToStorage,
} from "./backend";

export { default as config, logger as apiLogger } from "./config";
export { createApp } from "./app";
export { startServer } from "./server";
