import mongoose, { Schema, Document, Model } from "mongoose";
import type { CandidateDocument } from "../types";

export interface ICandidate extends Document, Omit<CandidateDocument, "id"> {
  id: string;
  avatarUrl?: string;
  compliance?: string;
  payroll?: string;
  companySize?: string;
  industry?: string;
  referralSource?: string;
  currentStageId?: string;
  linkedinUrl?: string;
  linkedInUrl?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  targetRole?: string;
  experienceYears?: string;
  resumeUrl?: string;
  roadmapStage?: string;
  status?: string;
  isCompleted?: boolean;
  emailVerified?: boolean;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    country: String,
    timezone: String,
    currency: String,
    compliance: String,
    payroll: String,
    companySize: String,
    industry: String,
    referralSource: String,
    uid: {
      type: String,
      index: true,
    },
    currentStageId: {
      type: String,
      default: "stage-applied",
    },
    targetRole: String,
    experienceYears: String,
    skills: [String],
    bio: String,
    linkedInUrl: String,
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    resumeUrl: String,
    companyId: {
      type: String,
      index: true,
    },
    registeredCompanyIds: {
      type: [String],
      default: [],
    },
    registeredCompanies: {
      type: [
        {
          companyId: String,
          companyName: String,
          registeredAt: String,
          status: { type: String, default: "active" },
        },
      ],
      default: [],
    },
    roadmapStage: {
      type: String,
      default: "Applied",
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
  },
  {
    timestamps: true,
  },
);

export const Candidate: Model<ICandidate> =
  mongoose.models.Candidate || mongoose.model<ICandidate>("Candidate", CandidateSchema);

export default Candidate;
