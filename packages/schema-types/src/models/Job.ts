import mongoose, { Schema, Document, Model } from "mongoose";
import type { JobPosting } from "../types";

export interface IJob extends Document, Omit<JobPosting, "id"> {
  id: string;
  jobCode?: string;
  country?: string;
  workplaceType?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  salaryPeriod?: string;
  salaryRange?: string;
  openings?: number;
  priority?: string;
  niceToHave?: string[];
  benefits?: string[];
  applicationDeadline?: string;
  hiringManager?: {
    name?: string;
    email?: string;
    designation?: string;
  };
  recruiterEmail?: string;
  applicantsCount?: number;
  postedDate?: string;
}

const JobSchema = new Schema<IJob>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    jobCode: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    subdomain: {
      type: String,
      lowercase: true,
      index: true,
    },
    department: {
      type: String,
      default: "Engineering",
    },
    location: {
      type: String,
      default: "Remote",
    },
    country: {
      type: String,
      default: "United States",
    },
    workplaceType: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "Remote",
    },
    employmentType: {
      type: String,
      default: "Full-time",
    },
    experienceLevel: {
      type: String,
      default: "Mid Level",
    },
    salaryMin: Number,
    salaryMax: Number,
    currency: {
      type: String,
      default: "INR",
    },
    salaryPeriod: {
      type: String,
      default: "year",
    },
    salaryRange: String,
    ctcBreakdown: {
      type: Schema.Types.Mixed,
      default: null,
    },
    openings: {
      type: Number,
      default: 1,
    },
    priority: {
      type: String,
      default: "Medium",
    },
    status: {
      type: String,
      default: "Active",
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    responsibilities: [String],
    requirements: [String],
    niceToHave: [String],
    benefits: [String],
    skills: [String],
    applicationDeadline: String,
    hiringManager: {
      name: String,
      email: String,
      designation: String,
    },
    recruiterEmail: String,
    applicantsCount: {
      type: Number,
      default: 0,
    },
    postedDate: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret.id || (ret._id ? String(ret._id) : "");
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;
