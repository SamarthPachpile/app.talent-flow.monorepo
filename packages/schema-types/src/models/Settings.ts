import mongoose, { Schema, Document, Model } from "mongoose";
import type { PlatformAdminSettings, CompanySettings, CandidateSettings } from "../types";

export interface IAdminSettingsDoc extends Document {
  key: string;
  data: PlatformAdminSettings;
  updatedAt: Date;
}

export interface ICompanySettingsDoc extends Document {
  companyId: string;
  data: CompanySettings;
  updatedAt: Date;
}

export interface ICandidateSettingsDoc extends Document {
  candidateId: string;
  data: CandidateSettings;
  updatedAt: Date;
}

export interface ISettingsDoc extends Document {
  scope: string;
  targetId: string;
  data: any;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettingsDoc>(
  {
    scope: { type: String, required: true, index: true },
    targetId: { type: String, required: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const Settings: Model<ISettingsDoc> =
  mongoose.models.Settings || mongoose.model<ISettingsDoc>("Settings", SettingsSchema);

export const AdminSettingsModel: Model<IAdminSettingsDoc> =
  mongoose.models.AdminSettings ||
  mongoose.model<IAdminSettingsDoc>("AdminSettings", SettingsSchema as any);

export const CompanySettingsModel: Model<ICompanySettingsDoc> =
  mongoose.models.CompanySettings ||
  mongoose.model<ICompanySettingsDoc>("CompanySettings", SettingsSchema as any);

export const CandidateSettingsModel: Model<ICandidateSettingsDoc> =
  mongoose.models.CandidateSettings ||
  mongoose.model<ICandidateSettingsDoc>("CandidateSettings", SettingsSchema as any);

export default Settings;
