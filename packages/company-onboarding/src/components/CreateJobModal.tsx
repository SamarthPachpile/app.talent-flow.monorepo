import React, { useState, useEffect } from "react";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  FileText,
  Send,
  Clock,
  ArrowRight,
  AlertCircle,
  Calendar,
  Mail,
  Layers,
  Globe,
  Check,
} from "lucide-react";
import { OnboardingState } from "../types/onboarding";
import { JobApiService, JobPosting, COUNTRY_OPTIONS } from "@talent-flow/api";
import { toast } from "../lib/sweetalert";
import { CandidateJobPreview } from "./CandidateJobPreview";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: OnboardingState;
  onJobCreated?: (job: JobPosting) => void;
  initialData?: Partial<JobPosting>;
}

const COMMON_SKILL_SUGGESTIONS = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Python",
  "Go",
  "AWS",
  "GCP",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "GraphQL",
  "Tailwind CSS",
  "Figma",
  "CI/CD",
  "Product Strategy",
  "Agile Scrum",
];

const COMMON_BENEFITS = [
  "Comprehensive Health, Dental & Vision Insurance",
  "Provident Fund (PF) & Gratuity Coverage",
  "Flexible Paid Time Off (PTO)",
  "Remote Work Home Office Budget (₹50,000)",
  "Annual Learning & Conference Stipend (₹1,50,000)",
  "Parental Leave (26 Weeks Paid)",
  "Annual Wellness & Fitness Allowance",
  "Company ESOP / Equity Stock Grants",
];

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  state,
  onJobCreated,
  initialData,
}) => {
  const companyName = state?.profile?.name || "Company Workspace";
  const companyDocId =
    state?.systemMetadata?.companyId ||
    state?.profile?.subdomain ||
    companyName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "company";

  // Step tabs
  const activeStepDefault = "details";
  const [activeStep, setActiveStep] = useState<"details" | "qualifications" | "preview">(
    activeStepDefault,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form fields
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [jobCode, setJobCode] = useState<string>(
    initialData?.jobCode ||
      `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
  );
  const [department, setDepartment] = useState<string>(
    initialData?.department || state?.departments?.[0] || "Engineering",
  );
  const [workplaceType, setWorkplaceType] = useState<"Remote" | "Hybrid" | "On-site">(
    initialData?.workplaceType || "Remote",
  );
  const [location, setLocation] = useState<string>(
    initialData?.location || "Bengaluru, KA (Remote)",
  );
  const [country, setCountry] = useState<string>(initialData?.country || "India");
  const [employmentType, setEmploymentType] = useState<
    "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance"
  >(initialData?.employmentType || "Full-time");
  const [experienceLevel, setExperienceLevel] = useState<
    "Entry Level" | "Mid Level" | "Senior" | "Lead / Staff" | "Director / Executive"
  >(initialData?.experienceLevel || "Senior");
  const [salaryMin, setSalaryMin] = useState<string>(
    initialData?.salaryMin ? String(initialData.salaryMin) : "1800000",
  );
  const [salaryMax, setSalaryMax] = useState<string>(
    initialData?.salaryMax ? String(initialData.salaryMax) : "2600000",
  );
  const [currency, setCurrency] = useState<string>(initialData?.currency || "INR");
  const [salaryPeriod, setSalaryPeriod] = useState<"year" | "month" | "hour">(
    initialData?.salaryPeriod || "year",
  );
  const [openings, setOpenings] = useState<number>(initialData?.openings || 1);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">(
    initialData?.priority || "High",
  );
  const [status, setStatus] = useState<"Active" | "Draft">(
    initialData?.status === "Draft" ? "Draft" : "Active",
  );

  const [description, setDescription] = useState<string>(
    initialData?.description ||
      `We are looking for an exceptional ${title || "candidate"} to join our high-impact team at ${companyName}. You will architect mission-critical systems and collaborate across cross-functional squads.`,
  );

  // Dynamic bullet lists
  const [responsibilities, setResponsibilities] = useState<string[]>(
    initialData?.responsibilities && initialData.responsibilities.length > 0
      ? initialData.responsibilities
      : [
          "Design, architect and ship production-ready web and backend features",
          "Collaborate with product designers and engineering leads on roadmap execution",
          "Ensure high code quality through test-driven development and code reviews",
        ],
  );
  const [newResp, setNewResp] = useState<string>("");

  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements && initialData.requirements.length > 0
      ? initialData.requirements
      : [
          "4+ years of relevant industry software engineering experience",
          "Strong foundation in TypeScript, modern frameworks, and cloud architecture",
          "Excellent communication and problem-solving skills",
        ],
  );
  const [newReq, setNewReq] = useState<string>("");

  // Skills
  const [skills, setSkills] = useState<string[]>(
    initialData?.skills && initialData.skills.length > 0
      ? initialData.skills
      : ["React", "TypeScript", "Node.js", "PostgreSQL"],
  );
  const [skillInput, setSkillInput] = useState<string>("");

  // Benefits
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(
    initialData?.benefits && initialData.benefits.length > 0
      ? initialData.benefits
      : [
          "Full Health, Dental & Vision Insurance",
          "401(k) with 5% Employer Match",
          "Unlimited Paid Time Off (PTO)",
        ],
  );

  // Hiring Team
  const [managerName, setManagerName] = useState<string>(
    initialData?.hiringManager?.name || state?.admin?.fullName || "Hiring Manager",
  );
  const [recruiterEmail, setRecruiterEmail] = useState<string>(
    initialData?.recruiterEmail || state?.admin?.workEmail || "recruiting@talentflow.hub",
  );

  // Sync title with description if untouched
  useEffect(() => {
    if (!initialData?.description && title) {
      setDescription(
        `We are looking for an exceptional ${title} to join our high-impact team at ${companyName}. You will architect mission-critical systems and collaborate across cross-functional squads.`,
      );
    }
  }, [title, companyName, initialData?.description]);

  if (!isOpen) return null;

  const handleAddResp = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp("");
    }
  };

  const handleRemoveResp = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const handleAddReq = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq("");
    }
  };

  const handleRemoveReq = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleToggleBenefit = (benefit: string) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const getFormattedSalary = (): string => {
    if (!salaryMin && !salaryMax) return "Competitive";
    const currSym =
      currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₹";
    const minStr = salaryMin ? `${currSym}${Number(salaryMin).toLocaleString("en-IN")}` : "";
    const maxStr = salaryMax ? `${currSym}${Number(salaryMax).toLocaleString("en-IN")}` : "";
    if (minStr && maxStr) return `${minStr} - ${maxStr} / ${salaryPeriod}`;
    return `${minStr || maxStr} / ${salaryPeriod}`;
  };

  const handleSaveJob = async () => {
    if (!title.trim()) {
      toast.error("Please enter a job title");
      setActiveStep("details");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Saving job posting to Firestore 'jobs' collection...", { id: "save-job-modal" });

    try {
      const jobPayload: Partial<JobPosting> = {
        title: title.trim(),
        jobCode: jobCode.trim(),
        department,
        workplaceType,
        location: location.trim(),
        country,
        employmentType,
        experienceLevel,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        currency,
        salaryPeriod,
        salaryRange: getFormattedSalary(),
        openings: Number(openings) || 1,
        priority,
        status,
        description: description.trim(),
        responsibilities,
        requirements,
        skills,
        benefits: selectedBenefits,
        hiringManager: {
          name: managerName.trim(),
          email: recruiterEmail.trim(),
          designation: "Hiring Manager",
        },
        recruiterEmail: recruiterEmail.trim(),
      };

      const response = await JobApiService.saveJobPosting(
        companyDocId,
        companyName,
        jobPayload,
        state?.profile?.subdomain,
      );

      if (response.success && response.data) {
        toast.success(
          `Job "${response.data.title}" successfully published to Firestore 'jobs' collection under '${companyDocId}'!`,
          { id: "save-job-modal" },
        );
        if (onJobCreated) {
          onJobCreated(response.data);
        }
        onClose();
      } else {
        toast.error("Failed to save job posting. Please try again.", { id: "save-job-modal" });
      }
    } catch (err) {
      console.error("Save job modal error:", err);
      toast.error("An unexpected error occurred while saving the job.", { id: "save-job-modal" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Create New Job Posting
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900">
                  jobs/{companyDocId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Publish a job requisition directly to Firestore{" "}
                <code className="text-orange-500 font-mono">jobs</code> collection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="px-6 py-2.5 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "details", label: "1. Position & Compensation", icon: Building2 },
            { id: "qualifications", label: "2. Requirements & Skills", icon: FileText },
            { id: "preview", label: "3. Live Candidate Preview", icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id as typeof activeStep)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-orange-500 text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          {/* TAB 1: POSITION DETAILS & COMPENSATION */}
          {activeStep === "details" && (
            <div className="space-y-5 animate-fadeIn">
              {/* Job Title & Requisition ID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>Job Title *</span>
                    <span className="text-[10px] text-slate-400">e.g. Lead Fullstack Engineer</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Requisition Code
                  </label>
                  <input
                    type="text"
                    value={jobCode}
                    onChange={(e) => setJobCode(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Department, Headcount & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {(
                      state?.departments || [
                        "Engineering",
                        "Product",
                        "Design",
                        "Sales",
                        "Marketing",
                        "People / HR",
                      ]
                    ).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Open Positions
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={openings}
                    onChange={(e) => setOpenings(parseInt(e.target.value) || 1)}
                    className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as typeof priority)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Hire</option>
                  </select>
                </div>
              </div>

              {/* Workplace Model Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Workplace Flexibility Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { type: "Remote" as const, desc: "100% Anywhere" },
                    { type: "Hybrid" as const, desc: "2-3 Days In-Office" },
                    { type: "On-site" as const, desc: "Full-Time at HQ" },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.type}
                      onClick={() => setWorkplaceType(m.type)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        workplaceType === m.type
                          ? "border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 shadow-xs"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {m.type}
                        </div>
                        <div className="text-[10px] text-slate-500">{m.desc}</div>
                      </div>
                      {workplaceType === m.type && (
                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Location / Office
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA or London, UK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-10 pl-9 pr-3.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {Object.values(COUNTRY_OPTIONS).map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Employment Type & Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as typeof employmentType)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="Full-time">Full-time Regular</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract / Advisory</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as typeof experienceLevel)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="Entry Level">Entry Level (0-2 years)</option>
                    <option value="Mid Level">Mid Level (2-5 years)</option>
                    <option value="Senior">Senior (5-8 years)</option>
                    <option value="Lead / Staff">Lead / Staff (8+ years)</option>
                    <option value="Director / Executive">Director / Executive</option>
                  </select>
                </div>
              </div>

              {/* Compensation Range */}
              <div className="p-4 bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200/70 dark:border-orange-900/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Target Compensation Band
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                    {getFormattedSalary()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Min Base (₹)</label>
                    <input
                      type="number"
                      placeholder="1800000"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Max Base (₹)</label>
                    <input
                      type="number"
                      placeholder="2600000"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 cursor-pointer font-semibold"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500">Period</label>
                    <select
                      value={salaryPeriod}
                      onChange={(e) => setSalaryPeriod(e.target.value as typeof salaryPeriod)}
                      className="w-full h-9 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="year">Per Year</option>
                      <option value="month">Per Month</option>
                      <option value="hour">Per Hour</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status visibility toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Publishing Status
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {status === "Active"
                      ? "Active: Published immediately to Career Portal & Firestore jobs collection"
                      : "Draft: Saved privately for internal company review"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("Draft")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      status === "Draft"
                        ? "bg-slate-800 text-white font-bold"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Active")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      status === "Active"
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Live (Active)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUIREMENTS, RESPONSIBILITIES & TECH STACK */}
          {activeStep === "qualifications" && (
            <div className="space-y-5 animate-fadeIn">
              {/* Job Summary Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Role Overview & Mission</span>
                  <span className="text-[10px] text-slate-400">Markdown supported</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why this role is crucial and what impact the new team member will make..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                />
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Key Responsibilities
                </label>
                <div className="space-y-2">
                  {responsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      <span className="flex-1 text-slate-800 dark:text-slate-200">{resp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResp(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        title="Remove responsibility"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add another responsibility item..."
                      value={newResp}
                      onChange={(e) => setNewResp(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddResp();
                        }
                      }}
                      className="flex-1 h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddResp}
                      className="px-3 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Qualifications / Requirements */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Required Qualifications
                </label>
                <div className="space-y-2">
                  {requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="flex-1 text-slate-800 dark:text-slate-200">{req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReq(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        title="Remove requirement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add another qualification requirement..."
                      value={newReq}
                      onChange={(e) => setNewReq(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddReq();
                        }
                      }}
                      className="flex-1 h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddReq}
                      className="px-3 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Skills & Tech Stack
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[50px]">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-lg border border-orange-200 dark:border-orange-900"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Type custom skill..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                      className="h-7 px-2 text-xs bg-transparent border-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Skill suggestions chips */}
                <div className="flex flex-wrap gap-1 items-center pt-1">
                  <span className="text-[10px] text-slate-400 mr-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-500" /> Suggestions:
                  </span>
                  {COMMON_SKILL_SUGGESTIONS.filter((s) => !skills.includes(s))
                    .slice(0, 7)
                    .map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => handleAddSkill(s)}
                        className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white rounded-md text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>

              {/* Enterprise Benefits */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Enterprise Benefits & Perks
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_BENEFITS.map((benefit) => {
                    const isSelected = selectedBenefits.includes(benefit);
                    return (
                      <button
                        type="button"
                        key={benefit}
                        onClick={() => handleToggleBenefit(benefit)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-medium"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "border border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{benefit}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXACT CANDIDATE PORTAL LIVE PREVIEW */}
          {activeStep === "preview" && (
            <div className="animate-fadeIn">
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
                  salaryRange: getFormattedSalary(),
                  openings: Number(openings) || 1,
                  priority,
                  status,
                  description,
                  responsibilities,
                  requirements,
                  skills,
                  benefits: selectedBenefits,
                  hiringManager: {
                    name: managerName,
                    email: recruiterEmail,
                    designation: "Hiring Manager",
                  },
                  recruiterEmail,
                }}
                isInModal={true}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/90 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {activeStep !== "details" && (
              <button
                type="button"
                onClick={() =>
                  setActiveStep(activeStep === "preview" ? "qualifications" : "details")
                }
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {activeStep !== "preview" ? (
              <button
                type="button"
                onClick={() =>
                  setActiveStep(activeStep === "details" ? "qualifications" : "preview")
                }
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSaveJob}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing to jobs/{companyDocId}...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Save & Publish Job Posting</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
