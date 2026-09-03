import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  CheckCircle2,
  X,
  FileText,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe,
  Clock,
  ChevronRight,
  Save,
  Tag,
  Check,
  Lock,
} from "lucide-react";
import { OnboardingState } from "../types/onboarding";
import {
  JobApiService,
  JobPosting,
  COUNTRY_OPTIONS,
  CtcBreakdown,
  calculateDefaultCtcBreakdown,
} from "@talent-flow/api";
import { toast } from "../lib/sweetalert";
import { CandidateJobPreview } from "./CandidateJobPreview";
import { RichJobDescriptionRenderer } from "./RichJobDescriptionRenderer";
import { CtcBreakdownEditor } from "./CtcBreakdownEditor";
import { RichWordDocumentEditor } from "./RichWordDocumentEditor";

interface CreateJobPostingProps {
  state: OnboardingState;
  onJobCreated?: (job: JobPosting) => void;
  onCancel?: () => void;
}

const COMMON_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Human Resources",
  "Finance & Operations",
  "Data & AI",
  "Legal & Compliance",
  "DevOps & Security",
];

const SUGGESTED_SKILLS: Record<string, string[]> = {
  Engineering: [
    "React",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Python",
    "Go",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Tailwind CSS",
  ],
  Product: [
    "Product Roadmap",
    "User Research",
    "Agile / Scrum",
    "Data Analysis",
    "Jira",
    "Mixpanel",
    "Figma",
  ],
  Design: [
    "Figma",
    "Design Systems",
    "UI/UX",
    "Prototyping",
    "User Research",
    "Wireframing",
    "Motion Design",
  ],
  Marketing: [
    "SEO",
    "Content Marketing",
    "Social Media",
    "Google Analytics",
    "HubSpot",
    "Growth Hacking",
  ],
  Sales: ["CRM", "B2B Sales", "Lead Generation", "Enterprise Sales", "Negotiation", "Salesforce"],
  General: [
    "Communication",
    "Problem Solving",
    "Team Leadership",
    "Cross-functional Collaboration",
  ],
};

const COMMON_BENEFITS = [
  "Comprehensive Health, Dental & Vision",
  "Unlimited Paid Time Off (PTO)",
  "401(k) with 5% Company Match",
  "$2,500 Annual Learning & Conference Budget",
  "Home Office & Hardware Stipend",
  "Flexible Remote & Hybrid Hours",
  "Company Stock Options / Equity Grant",
  "Paid Parental & Family Leave",
  "Gym & Wellness Reimbursement",
  "Annual Company & Team Retreats",
];

export const CreateJobPosting: React.FC<CreateJobPostingProps> = ({
  state,
  onJobCreated,
  onCancel,
}) => {
  const companyName = state?.profile?.name || "Company Workspace";
  const companySubdomain =
    state?.profile?.subdomain ||
    state?.systemMetadata?.companyId ||
    companyName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "company";

  const companyDocId =
    state?.systemMetadata?.companyId ||
    state?.profile?.subdomain ||
    companyName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "company";

  // Form State
  const [title, setTitle] = useState<string>("");
  const [jobCode, setJobCode] = useState<string>(
    () => `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
  );
  const [department, setDepartment] = useState<string>(state?.departments?.[0] || "Engineering");
  const [openings, setOpenings] = useState<number>(1);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("High");
  const [status, setStatus] = useState<"Active" | "Draft">("Active");

  const [workplaceType, setWorkplaceType] = useState<"Remote" | "Hybrid" | "On-site">("Remote");
  const [location, setLocation] = useState<string>(
    state?.profile?.headquarters || "Bengaluru, KA (Remote)",
  );
  const [country, setCountry] = useState<string>(state?.profile?.country || "India");

  const [employmentType, setEmploymentType] = useState<
    "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance"
  >("Full-time");
  const [experienceLevel, setExperienceLevel] = useState<
    "Entry Level" | "Mid Level" | "Senior" | "Lead / Staff" | "Director / Executive"
  >("Senior");

  const [salaryMin, setSalaryMin] = useState<string>("1800000");
  const [salaryMax, setSalaryMax] = useState<string>("2600000");
  const [currency, setCurrency] = useState<string>("INR");
  const [salaryPeriod, setSalaryPeriod] = useState<"year" | "month" | "hour">("year");

  const [ctcBreakdown, setCtcBreakdown] = useState<CtcBreakdown>(() => {
    return calculateDefaultCtcBreakdown(
      2600000,
      companyName || "IMS Learning Resources Pvt Ltd",
      "01-Jun-2026",
      "Onroll (Code on Wages)",
    );
  });

  const handleCtcChange = (newBreakdown: CtcBreakdown) => {
    setCtcBreakdown(newBreakdown);
    if (newBreakdown.totalCostToCompany?.annual) {
      const annual = newBreakdown.totalCostToCompany.annual;
      setSalaryMax(String(annual));
      if (!salaryMin || Number(salaryMin) > annual) {
        setSalaryMin(String(Math.round(annual * 0.8)));
      }
    }
  };

  const [description, setDescription] = useState<string>(
    `We are seeking a talented and proactive professional to join ${companyName}. In this role, you will collaborate with passionate teammates to deliver high-impact features and drive operational excellence.`,
  );

  const [responsibilities, setResponsibilities] = useState<string[]>([
    "Lead and execute high-priority projects aligning with team goals and product milestones",
    "Collaborate closely with cross-functional stakeholders including Product, Design, and QA",
    "Maintain high standards of code/deliverable quality through rigorous reviews and best practices",
  ]);
  const [newRespInput, setNewRespInput] = useState<string>("");

  const [requirements, setRequirements] = useState<string[]>([
    "3+ years of relevant industry experience in a fast-paced environment",
    "Strong communication, analytical thinking, and problem-solving skills",
    "Demonstrated ability to own projects from conception to production rollout",
  ]);
  const [newReqInput, setNewReqInput] = useState<string>("");

  const [niceToHave, setNiceToHave] = useState<string[]>([
    "Experience working in remote or distributed team environments",
    "Familiarity with modern enterprise SaaS development practices",
  ]);
  const [newNiceInput, setNewNiceInput] = useState<string>("");

  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Node.js"]);
  const [newSkillInput, setNewSkillInput] = useState<string>("");

  const [benefits, setBenefits] = useState<string[]>([
    "Comprehensive Health, Dental & Vision",
    "Unlimited Paid Time Off (PTO)",
    "401(k) with 5% Company Match",
    "$2,500 Annual Learning & Conference Budget",
  ]);

  const [hiringManagerName, setHiringManagerName] = useState<string>(
    state?.admin?.fullName || "Nil Yeager",
  );
  const [hiringManagerEmail, setHiringManagerEmail] = useState<string>(
    state?.admin?.workEmail || "recruiter@employx.io",
  );
  const [recruiterEmail, setRecruiterEmail] = useState<string>(
    state?.admin?.workEmail || "recruiter@employx.io",
  );
  const [applicationDeadline, setApplicationDeadline] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const isDescriptionFilled = (desc: string): boolean => {
    if (!desc) return false;
    const clean = desc.replace(/<[^>]*>/g, "").trim();
    return clean.length > 0;
  };

  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    if (!title.trim()) missing.push("Job Title");
    if (!department) missing.push("Department");
    if (!employmentType) missing.push("Employment Type");
    if (!experienceLevel) missing.push("Experience Level");
    if (workplaceType !== "Remote" && !location.trim()) missing.push("Location / City");
    if (!salaryMin || Number(salaryMin) <= 0) missing.push("Minimum CTC");
    if (!salaryMax || Number(salaryMax) <= 0) missing.push("Maximum CTC");
    if (!isDescriptionFilled(description)) missing.push("Job Description");
    return missing;
  };

  const missingFields = getMissingFields();
  const isJobReadyForPreview = missingFields.length === 0;

  // Available department choices
  const departmentOptions = Array.from(
    new Set([...(state?.departments || []), ...COMMON_DEPARTMENTS]),
  );

  // Dynamic Skill Suggestions based on selected department
  const currentSkillSuggestions = SUGGESTED_SKILLS[department] || SUGGESTED_SKILLS["General"];

  // Add Item Helpers
  const addResponsibility = () => {
    if (!newRespInput.trim()) return;
    setResponsibilities((prev) => [...prev, newRespInput.trim()]);
    setNewRespInput("");
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities((prev) => prev.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (!newReqInput.trim()) return;
    setRequirements((prev) => [...prev, newReqInput.trim()]);
    setNewReqInput("");
  };

  const removeRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const addNiceToHave = () => {
    if (!newNiceInput.trim()) return;
    setNiceToHave((prev) => [...prev, newNiceInput.trim()]);
    setNewNiceInput("");
  };

  const removeNiceToHave = (index: number) => {
    setNiceToHave((prev) => prev.filter((_, i) => i !== index));
  };

  const addSkill = (skillToAdd?: string) => {
    const s = (skillToAdd || newSkillInput).trim();
    if (!s) return;
    if (!skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
    }
    if (!skillToAdd) setNewSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const toggleBenefit = (benefit: string) => {
    if (benefits.includes(benefit)) {
      setBenefits((prev) => prev.filter((b) => b !== benefit));
    } else {
      setBenefits((prev) => [...prev, benefit]);
    }
  };

  const currencySymbol =
    currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₹";

  const formattedSalaryRange =
    salaryMin && salaryMax
      ? `${currencySymbol}${Number(salaryMin).toLocaleString("en-IN")} - ${currencySymbol}${Number(salaryMax).toLocaleString("en-IN")} / ${salaryPeriod}`
      : "Competitive Salary";

  const handleSubmit = async (e?: React.FormEvent, targetStatus?: "Active" | "Draft") => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a valid Job Title.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a Job Description / Overview.");
      return;
    }

    setIsSubmitting(true);
    const finalStatus = targetStatus || status;

    const jobPayload: Partial<JobPosting> = {
      title: title.trim(),
      jobCode: jobCode.trim(),
      department: department,
      openings: Number(openings) || 1,
      priority: priority,
      status: finalStatus,
      workplaceType: workplaceType,
      location: location.trim(),
      country: country,
      employmentType: employmentType,
      experienceLevel: experienceLevel,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      currency: currency,
      salaryPeriod: salaryPeriod,
      salaryRange: formattedSalaryRange,
      ctcBreakdown: ctcBreakdown,
      description: description.trim(),
      responsibilities: responsibilities,
      requirements: requirements,
      niceToHave: niceToHave,
      benefits: benefits,
      skills: skills,
      hiringManager: {
        name: hiringManagerName.trim(),
        email: hiringManagerEmail.trim(),
      },
      recruiterEmail: recruiterEmail.trim(),
      applicationDeadline: applicationDeadline || undefined,
    };

    try {
      // Save directly to MongoDB Atlas under company document
      const res = await JobApiService.saveJobPosting(
        companyDocId,
        companyName,
        jobPayload,
        companySubdomain,
      );

      if (res.success) {
        toast.success(
          `🎉 Job "${res.data.title}" successfully saved to MongoDB Atlas under "${companyDocId}"!`,
        );

        if (onJobCreated) {
          onJobCreated(res.data);
        }
      } else {
        toast.error("Failed to save job posting. Please try again.");
      }
    } catch (err) {
      console.error("Error creating job posting:", err);
      toast.error("An error occurred while creating the job posting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 dark:text-orange-400 font-semibold">
              Create New Job Posting
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-orange-500" />
            <span>Post a New Job</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>
              Publishing for company workspace:{" "}
              <strong className="text-slate-800 dark:text-slate-200">{companyName}</strong>
            </span>
            <span>•</span>
            <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-orange-600 dark:text-orange-400 font-semibold">
              MongoDB: jobs/{companyDocId}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (!isJobReadyForPreview) {
                toast.warning(
                  `Please complete all required fields before previewing: ${missingFields.join(", ")}`,
                );
                return;
              }
              setShowPreviewModal(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isJobReadyForPreview
                ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-80"
            }`}
            title={
              isJobReadyForPreview
                ? "Candidate Preview"
                : `Complete required fields: ${missingFields.join(", ")}`
            }
          >
            {isJobReadyForPreview ? (
              <Eye className="w-4 h-4 text-orange-500" />
            ) : (
              <Lock className="w-4 h-4 text-slate-400" />
            )}
            <span>{isJobReadyForPreview ? "Candidate Preview" : "Candidate Preview (Locked)"}</span>
            {isJobReadyForPreview && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(undefined, "Draft")}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(undefined, "Active")}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Publish Job Now</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={(e) => handleSubmit(e, "Active")} className="space-y-6">
        {/* Section 1: General Job Information */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. Job Title & Requisition Information
              </h2>
              <p className="text-xs text-slate-500">
                Define the core job title, department, position code, and hiring priority.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Job Title */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Job Title *</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  e.g., Senior Fullstack Engineer
                </span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Fullstack Engineer (React & Node.js)"
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Requisition ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Job / Requisition Code</span>
                <button
                  type="button"
                  onClick={() =>
                    setJobCode(
                      `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                    )
                  }
                  className="text-[10.5px] text-orange-600 hover:underline cursor-pointer"
                >
                  Regenerate
                </button>
              </label>
              <input
                type="text"
                value={jobCode}
                onChange={(e) => setJobCode(e.target.value)}
                className="w-full h-10 px-3.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {departmentOptions.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Openings */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Number of Headcounts / Openings
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={openings}
                onChange={(e) => setOpenings(parseInt(e.target.value) || 1)}
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Hiring Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Hiring Priority
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "Low" | "Medium" | "High" | "Urgent")
                }
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">🔥 Urgent / Immediate Hiring</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Workplace Type */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                2. Location & Workplace Model
              </h2>
              <p className="text-xs text-slate-500">
                Specify where this job is based and candidate remote flexibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Workplace Model Select Cards */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Workplace Model *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "Remote",
                    title: "100% Remote",
                    desc: "Work anywhere worldwide or within country",
                    icon: Globe,
                  },
                  {
                    id: "Hybrid",
                    title: "Hybrid (2-3 days)",
                    desc: "Flexible mix of office & remote work",
                    icon: Building2,
                  },
                  {
                    id: "On-site",
                    title: "On-site / Office",
                    desc: "Full-time at company physical headquarters",
                    icon: MapPin,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setWorkplaceType(item.id as "Remote" | "Hybrid" | "On-site")}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-1.5 ${
                      workplaceType === item.id
                        ? "border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon
                          className={`w-4 h-4 ${workplaceType === item.id ? "text-orange-500" : "text-slate-400"}`}
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          workplaceType === item.id
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {workplaceType === item.id && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* City / Region Location */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Primary Location (City, State / Region)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA (Remote)"
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {Object.values(COUNTRY_OPTIONS).map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Employment, Experience & Compensation */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                3. Employment Type & Compensation Package
              </h2>
              <p className="text-xs text-slate-500">
                Configure salary expectations, currency, and seniority level.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Employment Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(
                    e.target.value as
                      "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance",
                  )
                }
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract / 1099</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance / Project</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Seniority / Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(
                    e.target.value as
                      | "Entry Level"
                      | "Mid Level"
                      | "Senior"
                      | "Lead / Staff"
                      | "Director / Executive",
                  )
                }
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="Entry Level">Entry Level (0-2 yrs)</option>
                <option value="Mid Level">Mid Level (3-5 yrs)</option>
                <option value="Senior">Senior Level (5-8 yrs)</option>
                <option value="Lead / Staff">Lead / Staff (8-12 yrs)</option>
                <option value="Director / Executive">Director / Executive (12+ yrs)</option>
              </select>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer font-semibold"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>

            {/* Pay Period */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Payment Period
              </label>
              <select
                value={salaryPeriod}
                onChange={(e) => setSalaryPeriod(e.target.value as "year" | "month" | "hour")}
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="year">Per Year (Annual)</option>
                <option value="month">Per Month</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>

            {/* Min & Max Salary */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Minimum Base Salary ({currencySymbol})
              </label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="120000"
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Maximum Base Salary ({currencySymbol})
              </label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="160000"
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Full CTC Compensation Breakdown Table */}
          <CtcBreakdownEditor
            value={ctcBreakdown}
            onChange={handleCtcChange}
            companyName={companyName}
            targetAnnualCtc={salaryMax ? Number(salaryMax) : 2600000}
          />

          {/* Formatted Preview */}
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center justify-between text-xs">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">
              Candidate Display Range:
            </span>
            <span className="font-bold text-emerald-900 dark:text-emerald-200 font-mono">
              {formattedSalaryRange}
            </span>
          </div>
        </div>

        {/* Section 4: Generalized Job Description & Role Overview */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                4. Job Description & Role Overview
              </h2>
              <p className="text-xs text-slate-500">
                Write or paste your full Job Description with headings, bullets, formatting, and
                emojis.
              </p>
            </div>
          </div>

          {/* Overview - Word Document Style Rich Editor */}
          <RichWordDocumentEditor
            value={description}
            onChange={setDescription}
            label="Role Summary & Job Description *"
            placeholder="Write or paste your complete Job Description here... Format with bold, italic, underline, bullets (•), numbered lists (1.), headings, and emojis just like a Word document."
            minHeight="240px"
          />
        </div>

        {/* Section 5: Hiring Team & Publishing Options */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                5. Hiring Team & Publishing Status
              </h2>
              <p className="text-xs text-slate-500">
                Assign point-of-contact and set application deadlines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Hiring Manager Name
              </label>
              <input
                type="text"
                value={hiringManagerName}
                onChange={(e) => setHiringManagerName(e.target.value)}
                placeholder="e.g., Nil Yeager"
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Hiring Manager Email
              </label>
              <input
                type="email"
                value={hiringManagerEmail}
                onChange={(e) => setHiringManagerEmail(e.target.value)}
                placeholder="hiring.lead@company.com"
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Application Deadline (Optional)
              </label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Publishing Mode Radio */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Publishing Visibility State:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  status === "Active"
                    ? "bg-orange-50/70 dark:bg-orange-950/30 border-orange-500 text-orange-950 dark:text-orange-200 font-semibold"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="jobStatus"
                  checked={status === "Active"}
                  onChange={() => setStatus("Active")}
                  className="accent-orange-500"
                />
                <div>
                  <div className="text-xs font-bold">Active (Live Immediately)</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Visible to candidates on candidate portal and ready to receive applications.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  status === "Draft"
                    ? "bg-slate-200 dark:bg-slate-700 border-slate-500 text-slate-900 dark:text-slate-100 font-semibold"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="jobStatus"
                  checked={status === "Draft"}
                  onChange={() => setStatus("Draft")}
                  className="accent-slate-500"
                />
                <div>
                  <div className="text-xs font-bold">Draft (Internal Review)</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Saved in MongoDB jobs collection but hidden from external candidate searches.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Submission Bar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(undefined, "Draft")}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Save Draft</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="animate-spin text-sm">⏳</span>
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Publish Job Posting</span>
            </button>
          </div>
        </div>
      </form>

      {/* Candidate View Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-orange-100 dark:bg-orange-950/70 text-orange-600 rounded-xl">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Candidate Portal View Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    This is the exact layout candidates will see in their portal when viewing this
                    position.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <CandidateJobPreview
                job={{
                  title,
                  jobCode,
                  companyName,
                  department,
                  workplaceType,
                  location,
                  country,
                  employmentType,
                  experienceLevel,
                  salaryMin: salaryMin ? Number(salaryMin) : undefined,
                  salaryMax: salaryMax ? Number(salaryMax) : undefined,
                  currency,
                  salaryPeriod,
                  salaryRange: formattedSalaryRange,
                  openings: Number(openings) || 1,
                  priority,
                  status,
                  description,
                  responsibilities,
                  requirements,
                  skills,
                  benefits,
                  hiringManager: {
                    name: hiringManagerName,
                    email: hiringManagerEmail,
                    designation: "Hiring Manager",
                  },
                  recruiterEmail: hiringManagerEmail,
                  applicationDeadline,
                }}
                isInModal={true}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850 shrink-0">
              <span className="text-xs text-slate-500">
                Target Requisition:{" "}
                <code className="font-mono text-orange-600 dark:text-orange-400 font-bold">
                  {jobCode}
                </code>
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
