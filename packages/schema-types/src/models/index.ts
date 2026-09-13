import Company, { ICompany } from "./Company";
import Job, { IJob } from "./Job";
import Candidate, { ICandidate } from "./Candidate";
import Settings, {
  AdminSettingsModel,
  CompanySettingsModel,
  CandidateSettingsModel,
} from "./Settings";

const Model = {
  Company,
  Job,
  Candidate,
  Settings,
  AdminSettings: AdminSettingsModel,
  CompanySettings: CompanySettingsModel,
  CandidateSettings: CandidateSettingsModel,
};

export {
  Company,
  Job,
  Candidate,
  Settings,
  AdminSettingsModel,
  CompanySettingsModel,
  CandidateSettingsModel,
};
export type { ICompany, IJob, ICandidate };

export * from "./Company";
export * from "./Job";
export * from "./Candidate";
export * from "./Settings";

export default Model;
