import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { companyDb } from "./firebase";
import type { ApiResponse } from "../types";

export interface JobPosting {
  id: string;
  jobCode: string;
  title: string;
  companyId: string;
  companyName: string;
  subdomain?: string;
  department: string;
  location: string;
  country: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";
  experienceLevel: "Entry Level" | "Mid Level" | "Senior" | "Lead / Staff" | "Director / Executive";
  salaryMin?: number | string;
  salaryMax?: number | string;
  currency: string;
  salaryPeriod?: "year" | "month" | "hour";
  salaryRange?: string;
  openings: number;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Active" | "Draft" | "Closed" | "Archived";
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  benefits: string[];
  skills: string[];
  applicationDeadline?: string;
  hiringManager?: {
    name: string;
    email: string;
    designation?: string;
  };
  recruiterEmail?: string;
  applicantsCount?: number;
  postedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyJobsDocument {
  companyId: string;
  companyName: string;
  subdomain?: string;
  totalJobs: number;
  activeJobsCount: number;
  jobs: JobPosting[];
  createdAt: string;
  updatedAt: string;
}

export function sanitizeCompanyDocId(companyIdOrName: string): string {
  if (!companyIdOrName) return "default-company";
  return companyIdOrName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

const DEFAULT_SAMPLE_JOBS: Record<string, JobPosting[]> = {
  default: [
    {
      id: "job-default-1",
      jobCode: "REQ-2026-001",
      title: "Senior Fullstack Engineer (React & Node.js)",
      companyId: "default",
      companyName: "Enterprise Workspace",
      department: "Engineering",
      location: "San Francisco, CA (Remote)",
      country: "United States",
      workplaceType: "Remote",
      employmentType: "Full-time",
      experienceLevel: "Senior",
      salaryMin: 1800000,
      salaryMax: 2600000,
      currency: "INR",
      salaryPeriod: "year",
      salaryRange: "₹18,00,000 - ₹26,00,000 / year",
      openings: 2,
      priority: "High",
      status: "Active",
      description:
        "We are looking for an experienced Senior Fullstack Engineer to design, architect, and build next-generation cloud solutions with high scalability and real-time responsiveness.",
      responsibilities: [
        "Architect and build robust, high-performance web applications using React, TypeScript, and Node.js",
        "Design scalable REST and GraphQL APIs with Firebase / PostgreSQL backends",
        "Collaborate closely with product designers, managers, and QA to ship delightful features",
        "Mentor junior and mid-level engineers through rigorous code reviews and engineering syncs",
      ],
      requirements: [
        "5+ years of production experience building web applications in React and TypeScript",
        "Strong experience with Node.js, Express/NestJS, or serverless cloud functions",
        "Proficiency in SQL/NoSQL databases and data modeling",
        "Solid understanding of CI/CD pipelines, Docker, and modern frontend tooling",
      ],
      niceToHave: [
        "Experience with Tailwind CSS and Radix UI design systems",
        "Knowledge of distributed systems and micro-frontends",
      ],
      benefits: [
        "Comprehensive Health, Dental & Optical Insurance",
        "Flexible Paid Time Off (PTO)",
        "Provident Fund & Gratuity Coverage",
        "₹1,50,000 Annual Learning & Skill Development Stipend",
        "Premium Ergonomic Home Office Setup Grant",
      ],
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "Firebase",
        "PostgreSQL",
        "Docker",
      ],
      hiringManager: {
        name: "Nil Yeager",
        email: "nil@employx.io",
        designation: "VP of Engineering",
      },
      recruiterEmail: "recruiter@employx.io",
      applicantsCount: 14,
      postedDate: "2 days ago",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "job-default-2",
      jobCode: "REQ-2026-002",
      title: "Product Marketing Manager",
      companyId: "default",
      companyName: "Enterprise Workspace",
      department: "Marketing",
      location: "Bengaluru, KA (Hybrid)",
      country: "India",
      workplaceType: "Hybrid",
      employmentType: "Full-time",
      experienceLevel: "Mid Level",
      salaryMin: 1200000,
      salaryMax: 1600000,
      currency: "INR",
      salaryPeriod: "year",
      salaryRange: "₹12,00,000 - ₹16,00,000 / year",
      openings: 1,
      priority: "Medium",
      status: "Active",
      description:
        "Drive market positioning, product launches, customer enablement, and go-to-market strategies for our rapidly scaling enterprise SaaS platform.",
      responsibilities: [
        "Own product launch campaigns and cross-functional go-to-market execution",
        "Develop compelling value propositions, sales pitch decks, and case studies",
        "Conduct competitive analysis and market research to guide product roadmaps",
      ],
      requirements: [
        "3+ years of product marketing experience in B2B SaaS or technology companies",
        "Exceptional storytelling, copywriting, and presentation skills",
        "Data-driven mindset with experience analyzing funnel metrics",
      ],
      benefits: [
        "Comprehensive Health & Wellness Benefits",
        "Flexible Hybrid Working Model",
        "Generous Equity / Stock Options",
        "Annual Team Retreats",
      ],
      skills: [
        "Product Marketing",
        "GTM Strategy",
        "Content Creation",
        "Market Research",
        "B2B SaaS",
      ],
      hiringManager: {
        name: "Sarah Jenkins",
        email: "sarah@employx.io",
        designation: "Head of Marketing",
      },
      recruiterEmail: "recruiter@employx.io",
      applicantsCount: 8,
      postedDate: "5 days ago",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export class JobApiService {
  /**
   * Helper to compute Firestore document ID for the 'jobs' collection
   * exactly identical to the company document ID stored in 'companies' collection.
   */
  static getCompanyJobDocId(companyIdOrName: string, subdomain?: string): string {
    return sanitizeCompanyDocId(subdomain || companyIdOrName);
  }

  /**
   * Save or create a new job posting in Firestore 'jobs' collection.
   * The document ID in 'jobs' is exactly the company's identifier / name.
   */
  static async saveJobPosting(
    companyId: string,
    companyName: string,
    jobData: Partial<JobPosting>,
    subdomain?: string,
  ): Promise<ApiResponse<JobPosting>> {
    const cleanDocId = this.getCompanyJobDocId(companyId || subdomain || companyName, subdomain);
    const nowIso = new Date().toISOString();

    const jobId = jobData.id || `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const jobCode =
      jobData.jobCode || `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newJob: JobPosting = {
      id: jobId,
      jobCode: jobCode,
      title: jobData.title || "Untitled Position",
      companyId: cleanDocId,
      companyName: companyName || "Company",
      subdomain: subdomain || cleanDocId,
      department: jobData.department || "Engineering",
      location: jobData.location || "Remote",
      country: jobData.country || "United States",
      workplaceType: jobData.workplaceType || "Remote",
      employmentType: jobData.employmentType || "Full-time",
      experienceLevel: jobData.experienceLevel || "Mid Level",
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
      currency: jobData.currency || "INR",
      salaryPeriod: jobData.salaryPeriod || "year",
      salaryRange:
        jobData.salaryRange ||
        (jobData.salaryMin && jobData.salaryMax
          ? `₹${Number(jobData.salaryMin).toLocaleString("en-IN")} - ₹${Number(jobData.salaryMax).toLocaleString("en-IN")} / ${jobData.salaryPeriod || "year"}`
          : "Competitive Salary"),
      openings: jobData.openings || 1,
      priority: jobData.priority || "Medium",
      status: jobData.status || "Active",
      description: jobData.description || "",
      responsibilities: jobData.responsibilities || [],
      requirements: jobData.requirements || [],
      niceToHave: jobData.niceToHave || [],
      benefits: jobData.benefits || [],
      skills: jobData.skills || [],
      applicationDeadline: jobData.applicationDeadline,
      hiringManager: jobData.hiringManager,
      recruiterEmail: jobData.recruiterEmail,
      applicantsCount: jobData.applicantsCount || 0,
      postedDate: "Just now",
      createdAt: jobData.createdAt || nowIso,
      updatedAt: nowIso,
    };

    try {
      // 1. Fetch existing company jobs document from Firestore
      const companyJobDocRef = doc(companyDb, "jobs", cleanDocId);
      const docSnap = await getDoc(companyJobDocRef);

      let existingJobs: JobPosting[] = [];
      let createdAt = nowIso;

      if (docSnap.exists()) {
        const data = docSnap.data() as CompanyJobsDocument;
        existingJobs = Array.isArray(data.jobs) ? data.jobs : [];
        createdAt = data.createdAt || nowIso;
      } else {
        // Check local cache if Firestore doc doesn't exist yet
        const cached = this.getLocalJobs(cleanDocId);
        if (cached && cached.length > 0) {
          existingJobs = cached;
        }
      }

      // 2. Insert or update the job posting
      const existingIdx = existingJobs.findIndex((j) => j.id === jobId);
      let updatedJobs: JobPosting[];
      if (existingIdx >= 0) {
        updatedJobs = [...existingJobs];
        updatedJobs[existingIdx] = {
          ...existingJobs[existingIdx],
          ...newJob,
          createdAt: existingJobs[existingIdx].createdAt || newJob.createdAt,
          updatedAt: nowIso,
        };
      } else {
        updatedJobs = [newJob, ...existingJobs];
      }

      const activeCount = updatedJobs.filter((j) => j.status === "Active").length;

      const jobsDocPayload: CompanyJobsDocument = {
        companyId: cleanDocId,
        companyName: companyName || "Company",
        subdomain: subdomain || cleanDocId,
        totalJobs: updatedJobs.length,
        activeJobsCount: activeCount,
        jobs: updatedJobs,
        createdAt: createdAt,
        updatedAt: nowIso,
      };

      // 3. Save to Firestore in 'jobs' collection under company document name
      await setDoc(companyJobDocRef, jobsDocPayload, { merge: true });

      // 4. Also store in individual subcollection for granular indexing
      try {
        const subDocRef = doc(companyDb, "jobs", cleanDocId, "postings", jobId);
        await setDoc(subDocRef, newJob, { merge: true });
      } catch {
        // Subcollection write is auxiliary
      }

      // 5. Update local storage cache
      this.setLocalJobs(cleanDocId, updatedJobs);

      return {
        success: true,
        data: newJob,
        message: `Job '${newJob.title}' saved to 'jobs' collection under document '${cleanDocId}' successfully.`,
        timestamp: nowIso,
      };
    } catch (err) {
      console.warn("Firestore saveJobPosting error (falling back to local cache):", err);

      // Fallback to localStorage
      const cached = this.getLocalJobs(cleanDocId) || [];
      const existingIdx = cached.findIndex((j) => j.id === jobId);
      let updatedJobs: JobPosting[];
      if (existingIdx >= 0) {
        updatedJobs = [...cached];
        updatedJobs[existingIdx] = { ...cached[existingIdx], ...newJob, updatedAt: nowIso };
      } else {
        updatedJobs = [newJob, ...cached];
      }
      this.setLocalJobs(cleanDocId, updatedJobs);

      return {
        success: true,
        data: newJob,
        message: `Job saved locally for company '${cleanDocId}'.`,
        timestamp: nowIso,
      };
    }
  }

  /**
   * Fetch all job postings for a specific company from the Firestore 'jobs' collection.
   */
  static async getCompanyJobs(
    companyId: string,
    companyName?: string,
    subdomain?: string,
  ): Promise<JobPosting[]> {
    const cleanDocId = this.getCompanyJobDocId(
      companyId || subdomain || companyName || "",
      subdomain,
    );

    try {
      const companyJobDocRef = doc(companyDb, "jobs", cleanDocId);
      const docSnap = await getDoc(companyJobDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as CompanyJobsDocument;
        if (Array.isArray(data.jobs) && data.jobs.length > 0) {
          this.setLocalJobs(cleanDocId, data.jobs);
          return data.jobs;
        }
      }

      // If document not found in Firestore, check local cache
      const cached = this.getLocalJobs(cleanDocId);
      if (cached && cached.length > 0) {
        return cached;
      }

      // Provide initial seed sample jobs tailored for the company
      const initialSeed: JobPosting[] = (DEFAULT_SAMPLE_JOBS.default || []).map((j, idx) => ({
        ...j,
        id: `seed-${cleanDocId}-${idx + 1}`,
        jobCode: `REQ-${new Date().getFullYear()}-00${idx + 1}`,
        companyId: cleanDocId,
        companyName: companyName || cleanDocId.toUpperCase(),
        subdomain: subdomain || cleanDocId,
      }));

      this.setLocalJobs(cleanDocId, initialSeed);
      return initialSeed;
    } catch (err) {
      console.warn("Firestore getCompanyJobs error (using local cache):", err);
      const cached = this.getLocalJobs(cleanDocId);
      if (cached && cached.length > 0) return cached;

      return (DEFAULT_SAMPLE_JOBS.default || []).map((j, idx) => ({
        ...j,
        id: `seed-${cleanDocId}-${idx + 1}`,
        companyId: cleanDocId,
        companyName: companyName || cleanDocId.toUpperCase(),
        subdomain: subdomain || cleanDocId,
      }));
    }
  }

  /**
   * Delete a job posting from Firestore 'jobs' collection.
   */
  static async deleteJobPosting(
    companyId: string,
    jobId: string,
    subdomain?: string,
  ): Promise<ApiResponse<boolean>> {
    const cleanDocId = this.getCompanyJobDocId(companyId, subdomain);
    const nowIso = new Date().toISOString();

    try {
      const companyJobDocRef = doc(companyDb, "jobs", cleanDocId);
      const docSnap = await getDoc(companyJobDocRef);

      let currentJobs: JobPosting[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data() as CompanyJobsDocument;
        currentJobs = Array.isArray(data.jobs) ? data.jobs : [];
      } else {
        currentJobs = this.getLocalJobs(cleanDocId) || [];
      }

      const filtered = currentJobs.filter((j) => j.id !== jobId);
      const activeCount = filtered.filter((j) => j.status === "Active").length;

      await setDoc(
        companyJobDocRef,
        {
          companyId: cleanDocId,
          totalJobs: filtered.length,
          activeJobsCount: activeCount,
          jobs: filtered,
          updatedAt: nowIso,
        },
        { merge: true },
      );

      try {
        const subDocRef = doc(companyDb, "jobs", cleanDocId, "postings", jobId);
        await deleteDoc(subDocRef);
      } catch {
        // Ignore
      }

      this.setLocalJobs(cleanDocId, filtered);

      return {
        success: true,
        data: true,
        message: "Job posting deleted successfully.",
        timestamp: nowIso,
      };
    } catch (err) {
      console.warn("Firestore deleteJobPosting error (local update):", err);
      const cached = this.getLocalJobs(cleanDocId) || [];
      const filtered = cached.filter((j) => j.id !== jobId);
      this.setLocalJobs(cleanDocId, filtered);

      return {
        success: true,
        data: true,
        message: "Job posting deleted locally.",
        timestamp: nowIso,
      };
    }
  }

  /**
   * Update the status of a job posting (Active, Draft, Closed, Archived).
   */
  static async updateJobStatus(
    companyId: string,
    jobId: string,
    status: "Active" | "Draft" | "Closed" | "Archived",
    subdomain?: string,
  ): Promise<ApiResponse<JobPosting | null>> {
    const cleanDocId = this.getCompanyJobDocId(companyId, subdomain);
    const nowIso = new Date().toISOString();

    try {
      const companyJobDocRef = doc(companyDb, "jobs", cleanDocId);
      const docSnap = await getDoc(companyJobDocRef);

      let currentJobs: JobPosting[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data() as CompanyJobsDocument;
        currentJobs = Array.isArray(data.jobs) ? data.jobs : [];
      } else {
        currentJobs = this.getLocalJobs(cleanDocId) || [];
      }

      let updatedJob: JobPosting | null = null;
      const updatedList = currentJobs.map((j) => {
        if (j.id === jobId) {
          updatedJob = { ...j, status, updatedAt: nowIso };
          return updatedJob;
        }
        return j;
      });

      if (!updatedJob) {
        return {
          success: false,
          data: null,
          message: "Job not found",
          timestamp: nowIso,
        };
      }

      const activeCount = updatedList.filter((j) => j.status === "Active").length;

      await setDoc(
        companyJobDocRef,
        {
          jobs: updatedList,
          totalJobs: updatedList.length,
          activeJobsCount: activeCount,
          updatedAt: nowIso,
        },
        { merge: true },
      );

      this.setLocalJobs(cleanDocId, updatedList);

      return {
        success: true,
        data: updatedJob,
        message: `Job status updated to ${status}`,
        timestamp: nowIso,
      };
    } catch (err) {
      console.warn("Firestore updateJobStatus error:", err);
      const cached = this.getLocalJobs(cleanDocId) || [];
      let updatedJob: JobPosting | null = null;
      const updatedList = cached.map((j) => {
        if (j.id === jobId) {
          updatedJob = { ...j, status, updatedAt: nowIso };
          return updatedJob;
        }
        return j;
      });
      this.setLocalJobs(cleanDocId, updatedList);

      return {
        success: true,
        data: updatedJob,
        message: `Job status updated to ${status} (cached)`,
        timestamp: nowIso,
      };
    }
  }

  /**
   * Fetch all active jobs across all companies from 'jobs' collection.
   * Useful for Candidate Portal, Admin ATS overview, and search portals.
   */
  static async getAllJobsAcrossCompanies(): Promise<JobPosting[]> {
    try {
      const jobsColRef = collection(companyDb, "jobs");
      const snapshot = await getDocs(jobsColRef);
      const allJobs: JobPosting[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as CompanyJobsDocument;
        if (Array.isArray(data.jobs)) {
          allJobs.push(...data.jobs);
        }
      });

      if (allJobs.length > 0) {
        return allJobs;
      }
    } catch (err) {
      console.warn("Firestore getAllJobsAcrossCompanies error:", err);
    }

    // Fallback: check local storage keys
    const fallbackJobs: JobPosting[] = [];
    if (typeof window !== "undefined") {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("talentflow_company_jobs_")) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                fallbackJobs.push(...parsed);
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    if (fallbackJobs.length > 0) return fallbackJobs;

    return DEFAULT_SAMPLE_JOBS.default || [];
  }

  /**
   * Subscribe to real-time updates for a company's job postings in Firestore.
   */
  static subscribeToCompanyJobs(
    companyId: string,
    callback: (jobs: JobPosting[]) => void,
    subdomain?: string,
  ): () => void {
    const cleanDocId = this.getCompanyJobDocId(companyId, subdomain);
    try {
      const companyJobDocRef = doc(companyDb, "jobs", cleanDocId);
      const unsubscribe = onSnapshot(
        companyJobDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as CompanyJobsDocument;
            if (Array.isArray(data.jobs)) {
              this.setLocalJobs(cleanDocId, data.jobs);
              callback(data.jobs);
              return;
            }
          }
          const cached = this.getLocalJobs(cleanDocId);
          callback(cached || DEFAULT_SAMPLE_JOBS.default || []);
        },
        (err) => {
          console.warn("onSnapshot jobs error:", err);
          const cached = this.getLocalJobs(cleanDocId);
          callback(cached || DEFAULT_SAMPLE_JOBS.default || []);
        },
      );
      return unsubscribe;
    } catch (err) {
      console.warn("subscribeToCompanyJobs error:", err);
      const cached = this.getLocalJobs(cleanDocId);
      callback(cached || DEFAULT_SAMPLE_JOBS.default || []);
      return () => {};
    }
  }

  // Local storage caching helpers
  private static getLocalJobs(companyDocId: string): JobPosting[] | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`talentflow_company_jobs_${companyDocId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  }

  private static setLocalJobs(companyDocId: string, jobs: JobPosting[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`talentflow_company_jobs_${companyDocId}`, JSON.stringify(jobs));
    } catch {
      // ignore
    }
  }
}
