import User, { IUser } from "./User";
import Company, { ICompany } from "./Company";
import Job, { IJob } from "./Job";
import Candidate, { ICandidate } from "./Candidate";
import { AdminSettingsModel, CompanySettingsModel, CandidateSettingsModel } from "./Settings";

const Model = {
  User,
  Company,
  Job,
  Candidate,
  AdminSettings: AdminSettingsModel,
  CompanySettings: CompanySettingsModel,
  CandidateSettings: CandidateSettingsModel,
};

export {
  User,
  Company,
  Job,
  Candidate,
  AdminSettingsModel,
  CompanySettingsModel,
  CandidateSettingsModel,
};
export type { IUser, ICompany, IJob, ICandidate };

export * from "./User";
export * from "./Company";
export * from "./Job";
export * from "./Candidate";
export * from "./Settings";

export default Model;
