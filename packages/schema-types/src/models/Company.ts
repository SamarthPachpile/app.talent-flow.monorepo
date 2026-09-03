import mongoose, { Schema, Document, Model } from "mongoose";
import type { CompanyDocument } from "../types";

export interface ICompany extends Document, Omit<CompanyDocument, "id"> {
  id: string;
  domain?: string;
  industry?: string;
  size?: string;
  brandColor?: string;
  headquarters?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  legalName?: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  registrationNumber?: string;
  timezone?: string;
  currency?: string;
  website?: string;
  description?: string;
  admin?: {
    fullName?: string;
    workEmail?: string;
    phone?: string;
    avatarUrl?: string;
    uid?: string;
  };
  status?: string;
  isCompleted?: boolean;
  emailVerified?: boolean;
  registeredCandidates?: any[];
  candidateIds?: string[];
}

const CompanySchema = new Schema<ICompany>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subdomain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "Technology & Software",
    },
    size: {
      type: String,
      default: "51-200 Employees",
    },
    brandColor: {
      type: String,
      default: "#6366f1",
    },
    headquarters: {
      type: String,
      default: "Remote",
    },
    logoUrl: {
      type: String,
      default: "",
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    legalName: String,
    gstNumber: String,
    panNumber: String,
    cinNumber: String,
    registrationNumber: String,
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    currency: {
      type: String,
      default: "INR",
    },
    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    admin: {
      fullName: { type: String, default: "" },
      workEmail: { type: String, lowercase: true, trim: true, default: "" },
      phone: { type: String, default: "" },
      avatarUrl: { type: String, default: "" },
      uid: { type: String, default: "" },
    },
    status: {
      type: String,
      default: "Active",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    registeredCandidates: [Schema.Types.Mixed],
    candidateIds: [String],
  },
  {
    timestamps: true,
  },
);

export const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
