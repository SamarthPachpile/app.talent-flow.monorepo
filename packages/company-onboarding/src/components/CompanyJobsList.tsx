import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  Globe,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Check,
  X,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { OnboardingState } from "../types/onboarding";
import { JobApiService, JobPosting } from "@talent-flow/api";
import { toast, Swal } from "../lib/sweetalert";
import { CreateJobModal } from "./CreateJobModal";
import { CandidateJobPreview } from "./CandidateJobPreview";

interface CompanyJobsListProps {
  state: OnboardingState;
  onCreateNewJob: () => void;
  onNavigatePipeline?: () => void;
}

export const CompanyJobsList: React.FC<CompanyJobsListProps> = ({
  state,
  onCreateNewJob,
  onNavigatePipeline,
}) => {
  const companyName = state?.profile?.name || "Company Workspace";
  const companyDocId =
    state?.systemMetadata?.companyId ||
    state?.profile?.subdomain ||
    companyName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "company";

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("all");
  const [previewJob, setPreviewJob] = useState<JobPosting | null>(null);

  // Subscribe to real-time updates from Firestore 'jobs' collection
  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = JobApiService.subscribeToCompanyJobs(
      companyDocId,
      (updatedJobs) => {
        setJobs(updatedJobs);
        setIsLoading(false);
      },
      state?.profile?.subdomain,
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [companyDocId, state?.profile?.subdomain]);

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return Array.from(set);
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesDept = selectedDepartment === "all" || job.department === selectedDepartment;

      const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;

      const matchesWorkplace =
        selectedWorkplace === "all" || job.workplaceType === selectedWorkplace;

      return matchesSearch && matchesDept && matchesStatus && matchesWorkplace;
    });
  }, [jobs, searchQuery, selectedDepartment, selectedStatus, selectedWorkplace]);

  const activeCount = jobs.filter((j) => j.status === "Active").length;
  const draftCount = jobs.filter((j) => j.status === "Draft").length;
  const closedCount = jobs.filter((j) => j.status === "Closed" || j.status === "Archived").length;
  const totalOpenings = jobs.reduce((acc, j) => acc + (j.openings || 1), 0);

  const handleToggleStatus = async (job: JobPosting) => {
    const nextStatus = job.status === "Active" ? "Draft" : "Active";
    const res = await JobApiService.updateJobStatus(
      companyDocId,
      job.id,
      nextStatus,
      state?.profile?.subdomain,
    );
    if (res.success) {
      toast.success(`Job "${job.title}" status updated to ${nextStatus}`);
    } else {
      toast.error("Failed to update job status.");
    }
  };

  const handleDeleteJob = async (job: JobPosting) => {
    const result = await Swal.fire({
      title: `Delete "${job.title}"?`,
      text: "This will permanently delete this job requisition from the Firestore jobs collection.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Job",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const res = await JobApiService.deleteJobPosting(
        companyDocId,
        job.id,
        state?.profile?.subdomain,
      );
      if (res.success) {
        toast.success(`Job "${job.title}" deleted from 'jobs' collection.`);
      } else {
        toast.error("Failed to delete job.");
      }
    }
  };

  const copyShareLink = (job: JobPosting) => {
    const url = `${window.location.origin}/candidates-portal?jobId=${job.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public job link copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-600 dark:text-orange-400 font-semibold">
              Manage Requisitions
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-orange-500" />
            <span>Job Postings & Openings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>
              Real-time synchronization with Firestore{" "}
              <strong className="text-orange-600 dark:text-orange-400 font-mono">
                jobs/{companyDocId}
              </strong>
            </span>
          </p>
        </div>

        {/* Action Buttons: Hiring Pipeline & Create Job (Modal) */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onNavigatePipeline && (
            <button
              type="button"
              onClick={onNavigatePipeline}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Hiring Pipeline</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {jobs.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Requisitions
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {activeCount}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Postings
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {draftCount}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Draft Positions
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalOpenings}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Target Headcounts
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, code, skill..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Draft">Draft Only</option>
            <option value="Closed">Closed Only</option>
          </select>

          {/* Workplace Filter */}
          <select
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="all">All Workplaces</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid / List */}
      {isLoading ? (
        <div className="clip-path-card bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
          <div className="animate-spin text-2xl mb-2">⏳</div>
          <span>Loading company job postings from Firestore...</span>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="clip-path-card bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {searchQuery ||
              selectedDepartment !== "all" ||
              selectedStatus !== "all" ||
              selectedWorkplace !== "all"
                ? "No open positions match your search criteria"
                : "No Job Postings Created Yet"}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery ||
              selectedDepartment !== "all" ||
              selectedStatus !== "all" ||
              selectedWorkplace !== "all"
                ? "Try searching with different keywords, removing workplace restrictions, or resetting the department dropdown."
                : "Create your first job posting stored in Firestore to start receiving candidate applications."}
            </p>
          </div>
          <button
            type="button"
            onClick={onCreateNewJob}
            className="clip-path-button-sm px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setPreviewJob(job)}
              className="clip-service bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Top metadata row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {job.department || "Engineering"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {job.postedDate || "Recently posted"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-500 transition-colors leading-snug">
                  {job.title}
                </h3>

                {/* Quick Meta Row */}
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.workplaceType || job.employmentType || "Full-time"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {job.salaryRange || "Competitive"}
                    </span>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {job.description || "No job description provided."}
                </p>

                {/* Skills tags */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10.5px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-semibold self-center">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Action Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-orange-500 group-hover:underline flex items-center gap-1">
                  <span>Candidate View</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {/* Status Toggle / Badge */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(job)}
                    className={`clip-path-button-sm px-2.5 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                      job.status === "Active"
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                    title="Click to toggle Active / Draft status"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        job.status === "Active" ? "bg-white" : "bg-slate-400"
                      }`}
                    />
                    <span>{job.status}</span>
                  </button>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={() => copyShareLink(job)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Copy candidate share link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Job Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete job requisition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Portal View Details / Preview Modal */}
      {previewJob && (
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
                    Candidate Portal View · {previewJob.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live candidate portal presentation for requisition{" "}
                    <code className="font-mono text-orange-600 dark:text-orange-400 font-bold">
                      {previewJob.jobCode}
                    </code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewJob(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <CandidateJobPreview
                job={{
                  title: previewJob.title,
                  jobCode: previewJob.jobCode,
                  companyName: previewJob.companyName || companyName,
                  department: previewJob.department,
                  workplaceType: previewJob.workplaceType,
                  location: previewJob.location,
                  country: previewJob.country,
                  employmentType: previewJob.employmentType,
                  experienceLevel: previewJob.experienceLevel,
                  salaryMin: previewJob.salaryMin,
                  salaryMax: previewJob.salaryMax,
                  currency: previewJob.currency,
                  salaryPeriod: previewJob.salaryPeriod,
                  salaryRange: previewJob.salaryRange,
                  openings: previewJob.openings,
                  priority: previewJob.priority,
                  status: previewJob.status,
                  description: previewJob.description,
                  responsibilities: previewJob.responsibilities,
                  requirements: previewJob.requirements,
                  skills: previewJob.skills,
                  benefits: previewJob.benefits,
                  hiringManager: previewJob.hiringManager,
                  recruiterEmail: previewJob.recruiterEmail,
                  applicationDeadline: previewJob.applicationDeadline,
                  postedDate: previewJob.postedDate,
                }}
                isInModal={true}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Status:</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ● {previewJob.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewJob(null)}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Job Posting Modal Popup */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        state={state}
        onJobCreated={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
