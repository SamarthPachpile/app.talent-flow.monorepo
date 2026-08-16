import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  OnboardingState,
  HRTeamMember,
  OfficeLocationBranch,
  RecruitmentStage,
  InterviewSettingsState,
  EmailConfigState,
} from "../types/onboarding";
import {
  Building2,
  MapPin,
  Users,
  Network,
  Briefcase,
  GitMerge,
  FileCheck,
  Calendar,
  Mail,
  Globe,
  Sparkles,
  Laptop,
  Bell,
  ShieldCheck,
  Puzzle,
  UserPlus,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Edit3,
  Upload,
  ChevronRight,
  CheckCircle2,
  Clock,
  Info,
  Key,
  Shield,
  Layers,
  ExternalLink,
  Bot,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface WizardProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<WizardProps> = ({ state, setState, onComplete }) => {
  const steps = [
    { num: 1, title: "Company Profile", icon: Building2 },
    { num: 2, title: "Office Locations", icon: MapPin },
    { num: 3, title: "HR Team", icon: Users },
    { num: 4, title: "Departments", icon: Network },
    { num: 5, title: "Job Titles", icon: Briefcase },
    { num: 6, title: "Recruitment Workflow", icon: GitMerge },
    { num: 7, title: "Candidate Documents", icon: FileCheck },
    { num: 8, title: "Interview Settings", icon: Calendar },
    { num: 9, title: "Email Configuration", icon: Mail },
    { num: 10, title: "Career Portal", icon: Globe },
    { num: 11, title: "Candidate Experience", icon: Sparkles },
    { num: 12, title: "IT Setup", icon: Laptop },
    { num: 13, title: "Notification Preferences", icon: Bell },
    { num: 14, title: "Approval Matrix", icon: ShieldCheck },
    { num: 15, title: "Integrations", icon: Puzzle },
    { num: 16, title: "Invite Remaining Users", icon: UserPlus },
    { num: 17, title: "Finish & Launch", icon: Rocket },
  ];

  const [newDepartmentInput, setNewDepartmentInput] = useState("");
  const [newJobTitleInput, setNewJobTitleInput] = useState("");
  const [newStageInput, setNewStageInput] = useState({ name: "", color: "#3b82f6", slaHours: 24 });
  const [newRemoteCountryInput, setNewRemoteCountryInput] = useState("");

  // HR Team Form state
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    email: "",
    designation: "",
    department: "HR",
    role: "Recruiter",
  });

  // Branch location form state
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    capacity: 25,
  });
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // User invite tab
  const [inviteTab, setInviteTab] = useState<"bulk" | "csv" | "manual">("bulk");
  const [manualInvite, setManualInvite] = useState({
    name: "",
    email: "",
    role: "Recruiter",
    department: "HR",
  });

  const handleNext = () => {
    if (state.currentStep < 17) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const updatedState = { ...state, isCompleted: true };
      setState(updatedState);
      toast.success("🎉 Company Workspace Setup Complete! Welcome to your HR Platform.");
      onComplete();
    }
  };

  const handlePrev = () => {
    if (state.currentStep > 1) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateProfile = <K extends keyof OnboardingState["profile"]>(
    field: K,
    value: OnboardingState["profile"][K],
  ) => {
    setState((prev) => {
      const newProfile = { ...prev.profile, [field]: value };
      const slug = newProfile.subdomain || newProfile.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      return {
        ...prev,
        profile: newProfile,
        careerPortal: {
          ...prev.careerPortal,
          url: `https://gravitonitsolutions.com/candidates-portal/${slug}`,
        },
      };
    });
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, SVG, WebP) from device storage.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size exceeds 5MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateProfile("logoUrl", dataUrl);
      toast.success(`Loaded logo from device: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WebP) from device storage.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover image file size exceeds 10MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateProfile("coverImageUrl", dataUrl);
      toast.success(`Loaded cover image from device: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Helper functions for Step 2 (Head Office & Branch Offices)
  const updateHeadOffice = (
    field: keyof OnboardingState["officeLocations"]["headOffice"],
    value: string,
  ) => {
    setState((prev) => {
      const currentHead = prev.officeLocations?.headOffice || {
        address: prev.profile.headOfficeAddress || "",
        city: prev.profile.city || "",
        state: prev.profile.state || "",
        country: prev.profile.country || "",
        pincode: prev.profile.pincode || "",
      };
      const updatedHead = {
        ...currentHead,
        [field]: value,
      };
      const updatedProfile = {
        ...prev.profile,
        headOfficeAddress: field === "address" ? value : prev.profile.headOfficeAddress,
        city: field === "city" ? value : prev.profile.city,
        state: field === "state" ? value : prev.profile.state,
        country: field === "country" ? value : prev.profile.country,
        pincode: field === "pincode" ? value : prev.profile.pincode,
        headquarters:
          `${updatedHead.city || ""}, ${updatedHead.state || ""}, ${updatedHead.country || ""}`.replace(
            /^, |, $/g,
            "",
          ),
      };
      return {
        ...prev,
        profile: updatedProfile,
        officeLocations: {
          ...prev.officeLocations,
          headOffice: updatedHead,
        },
      };
    });
  };

  const startEditBranch = (branch: OfficeLocationBranch) => {
    setEditingBranchId(branch.id);
    setNewBranch({
      name: branch.name,
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      country: branch.country || "India",
      pincode: branch.pincode || "",
      capacity: branch.capacity || 25,
    });
  };

  const saveBranchOffice = () => {
    if (!newBranch.name.trim() || !newBranch.city.trim()) {
      toast.error("Branch office name and city are required.");
      return;
    }

    if (editingBranchId) {
      setState((prev) => ({
        ...prev,
        officeLocations: {
          ...prev.officeLocations,
          branchOffices: prev.officeLocations.branchOffices.map((b) =>
            b.id === editingBranchId ? { ...b, ...newBranch } : b,
          ),
        },
      }));
      toast.success(`Updated branch office '${newBranch.name}'`);
      setEditingBranchId(null);
    } else {
      const branch: OfficeLocationBranch = {
        id: "branch-" + Date.now(),
        ...newBranch,
      };
      setState((prev) => ({
        ...prev,
        officeLocations: {
          ...prev.officeLocations,
          branchOffices: [...prev.officeLocations.branchOffices, branch],
        },
      }));
      toast.success("Added new branch office!");
    }

    setNewBranch({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      capacity: 25,
    });
  };

  const cancelEditBranch = () => {
    setEditingBranchId(null);
    setNewBranch({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      capacity: 25,
    });
  };

  const removeBranchOffice = (id: string) => {
    setState((prev) => ({
      ...prev,
      officeLocations: {
        ...prev.officeLocations,
        branchOffices: prev.officeLocations.branchOffices.filter((b) => b.id !== id),
      },
    }));
    toast.info("Branch office removed.");
  };

  const addRemoteCountry = () => {
    if (!newRemoteCountryInput.trim()) return;
    const country = newRemoteCountryInput.trim();
    if (!state.officeLocations.remoteLocations.allowedCountries.includes(country)) {
      setState((prev) => ({
        ...prev,
        officeLocations: {
          ...prev.officeLocations,
          remoteLocations: {
            ...prev.officeLocations.remoteLocations,
            allowedCountries: [...prev.officeLocations.remoteLocations.allowedCountries, country],
          },
        },
      }));
      setNewRemoteCountryInput("");
    }
  };

  const removeRemoteCountry = (country: string) => {
    setState((prev) => ({
      ...prev,
      officeLocations: {
        ...prev.officeLocations,
        remoteLocations: {
          ...prev.officeLocations.remoteLocations,
          allowedCountries: prev.officeLocations.remoteLocations.allowedCountries.filter(
            (c) => c !== country,
          ),
        },
      },
    }));
  };

  // Helper functions for Step 3 (HR Team)
  const addHRTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.email) {
      toast.error("Team member name and email are required.");
      return;
    }
    const member: HRTeamMember = {
      id: "team-" + Date.now(),
      name: newTeamMember.name,
      email: newTeamMember.email,
      designation: newTeamMember.designation || "Team Specialist",
      department: newTeamMember.department,
      role: newTeamMember.role,
      permissions: ["Standard Access", "Manage Candidates", "Conduct Interviews"],
      status: "Invited",
    };
    const invite = {
      id: "invite-" + Date.now(),
      email: newTeamMember.email,
      role:
        (newTeamMember.role as "Admin" | "Recruiter" | "Hiring Manager" | "Interviewer") ||
        "Recruiter",
      department: newTeamMember.department,
      status: "Pending" as const,
    };

    setState((prev) => ({
      ...prev,
      hrTeam: [...prev.hrTeam, member],
      teamInvites: [...prev.teamInvites, invite],
    }));

    setNewTeamMember({ name: "", email: "", designation: "", department: "HR", role: "Recruiter" });
    toast.success(
      `Added ${member.name}! Access email scheduled via cron job upon wizard submission.`,
    );
  };

  const removeHRTeamMember = (id: string) => {
    const memberToRemove = state.hrTeam.find((m) => m.id === id);
    if (
      memberToRemove &&
      (memberToRemove.id === "team-1" || memberToRemove.email === state.admin.workEmail)
    ) {
      toast.error("Cannot remove primary workspace admin.");
      return;
    }
    setState((prev) => ({
      ...prev,
      hrTeam: prev.hrTeam.filter((m) => m.id !== id),
      teamInvites: prev.teamInvites.filter((t) => t.email !== memberToRemove?.email),
    }));
    toast.info("Team member removed.");
  };

  // Helper functions for Step 4 (Departments)
  const addDepartment = () => {
    if (!newDepartmentInput.trim()) return;
    const dept = newDepartmentInput.trim();
    if (!state.departments.includes(dept)) {
      setState((prev) => ({ ...prev, departments: [...prev.departments, dept] }));
      setNewDepartmentInput("");
      toast.success(`Department "${dept}" added!`);
    }
  };

  const removeDepartment = (dept: string) => {
    setState((prev) => ({ ...prev, departments: prev.departments.filter((d) => d !== dept) }));
  };

  // Helper functions for Step 5 (Job Titles)
  const addJobTitle = () => {
    if (!newJobTitleInput.trim()) return;
    const title = newJobTitleInput.trim();
    if (!state.jobTitles.includes(title)) {
      setState((prev) => ({ ...prev, jobTitles: [...prev.jobTitles, title] }));
      setNewJobTitleInput("");
      toast.success(`Job title "${title}" added!`);
    }
  };

  const removeJobTitle = (title: string) => {
    setState((prev) => ({ ...prev, jobTitles: prev.jobTitles.filter((t) => t !== title) }));
  };

  // Helper functions for Step 6 (Recruitment Workflow)
  const addPipelineStage = () => {
    if (!newStageInput.name.trim()) return;
    const stage: RecruitmentStage = {
      id: "stg-" + Date.now(),
      name: newStageInput.name.trim(),
      color: newStageInput.color,
      slaHours: newStageInput.slaHours,
    };
    setState((prev) => ({
      ...prev,
      recruitmentWorkflow: [...prev.recruitmentWorkflow, stage],
    }));
    setNewStageInput({ name: "", color: "#3b82f6", slaHours: 24 });
    toast.success(`Stage "${stage.name}" added to pipeline!`);
  };

  const moveStage = (index: number, direction: "up" | "down") => {
    const list = [...state.recruitmentWorkflow];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setState((prev) => ({ ...prev, recruitmentWorkflow: list }));
  };

  const removeStage = (id: string) => {
    if (state.recruitmentWorkflow.length <= 3) {
      toast.error("Minimum 3 stages required in recruitment workflow.");
      return;
    }
    setState((prev) => ({
      ...prev,
      recruitmentWorkflow: prev.recruitmentWorkflow.filter((s) => s.id !== id),
    }));
  };

  // Helper function for Step 16 (Invitations)
  const sendInvitations = () => {
    const nowIso = new Date().toISOString();
    const sentList = [
      ...(state.userInvitations?.sentInvitesList || []),
      {
        email: "team.invite1@" + state.profile.domain,
        role: "Recruiter",
        department: "HR",
        sentAt: nowIso,
      },
      {
        email: "team.invite2@" + state.profile.domain,
        role: "Hiring Manager",
        department: "Engineering",
        sentAt: nowIso,
      },
    ];
    setState((prev) => ({
      ...prev,
      userInvitations: {
        ...prev.userInvitations,
        invitesSent: true,
        sentInvitesList: sentList,
      },
    }));
    toast.success("✨ Invitation emails successfully sent to team members!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      {/* Background Ambient Glow & Subtle Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f9731612,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Top Header Display */}
      <div className="w-full max-w-5xl mx-auto mb-6 text-center space-y-2 relative z-10 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ember/10 text-ember border border-ember/20 text-xs font-semibold backdrop-blur-md shadow-sm mb-1">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>Step 2 — First Login (Company Setup Wizard)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-foreground">
          Welcome to Your HR Platform
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-xl mx-auto">
          Let's set up your workspace.
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Clock className="size-3.5" />
          <span>Estimated time: 8–10 minutes</span>
        </div>
      </div>

      {/* Step Stepper Navigation Header */}
      <div className="w-full max-w-5xl mx-auto mb-6 relative z-10">
        <div className="bg-card/90 border border-border/80 rounded-2xl p-4 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-ember text-ember-foreground font-bold text-xs">
                {state.currentStep}
              </span>
              <span className="font-display font-bold text-sm text-foreground">
                Wizard Step {state.currentStep} — {steps[state.currentStep - 1].title}
              </span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {Math.round((state.currentStep / 17) * 100)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border/40 mb-3">
            <motion.div
              className="bg-gradient-to-r from-ember via-amber-500 to-emerald-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(state.currentStep / 17) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Pill Selector Bar (Scrollable) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {steps.map((s) => {
              const isCurrent = state.currentStep === s.num;
              const isDone = state.currentStep > s.num;
              const Icon = s.icon;
              return (
                <button
                  key={s.num}
                  onClick={() => setState((prev) => ({ ...prev, currentStep: s.num }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-ember text-ember-foreground font-bold shadow-md ring-2 ring-ember/30"
                      : isDone
                        ? "bg-success/15 text-success border border-success/30 hover:bg-success/20"
                        : "bg-surface text-muted-foreground border border-border/60 hover:bg-surface/80"
                  }`}
                >
                  {isDone ? <Check className="size-3" /> : <Icon className="size-3" />}
                  <span>
                    {s.num}. {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Wizard Content Card */}
      <div className="w-full max-w-5xl bg-card/90 border border-border/90 rounded-3xl shadow-2xl backdrop-blur-xl p-5 sm:p-8 md:p-10 relative z-10 mb-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 1: COMPANY PROFILE */}
          {state.currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 1 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Building2 className="text-ember size-7" /> Company Profile Setup
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Provide primary branding, registration details, tax identifiers, and official
                  headquarters information.
                </p>
              </div>

              {/* Pre-filled Registration Banner */}
              <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-ember text-ember-foreground font-bold text-sm">
                    {state.profile.name.slice(0, 2).toUpperCase() || "TF"}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-sm text-foreground">
                        {state.profile.name}
                      </h3>
                      <span className="text-10px bg-ember/15 text-ember font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Pre-filled from Signup
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Account Admin:{" "}
                      <span className="text-foreground font-medium">{state.admin.fullName}</span> (
                      {state.admin.workEmail})
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block">
                  Portal URL:{" "}
                  <strong className="text-ember">
                    gravitonitsolutions.com/candidates-portal/
                    {state.profile.subdomain ||
                      state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "")}
                  </strong>
                </span>
              </div>

              {/* Logo & Cover Image File Selection from Device Internal Storage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-surface/60 border border-border/70">
                {/* Logo File Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Company Logo (From Device Storage)</span>
                    <span className="text-10px text-ember font-semibold">Device Storage Only</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {state.profile.logoUrl ? (
                      <img
                        src={state.profile.logoUrl}
                        alt="Logo Preview"
                        className="size-14 rounded-xl border border-border object-cover bg-background shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="size-14 rounded-xl border-2 border-dashed border-border bg-background flex flex-col items-center justify-center text-muted-foreground shrink-0">
                        <Building2 className="size-5" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-ember text-ember-foreground hover:bg-ember/90 text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                        <Upload className="size-3.5" />
                        <span>Choose Logo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                      {state.profile.logoUrl && (
                        <button
                          type="button"
                          onClick={() => updateProfile("logoUrl", "")}
                          className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <Trash2 className="size-3 text-destructive" />
                          <span>Remove</span>
                        </button>
                      )}
                      <p className="text-10px text-muted-foreground">
                        Select PNG, JPG, SVG, or WebP from your device's internal storage
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cover Image File Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Company Cover Image (From Device Storage)</span>
                    <span className="text-10px text-ember font-semibold">Device Storage Only</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {state.profile.coverImageUrl ? (
                      <img
                        src={state.profile.coverImageUrl}
                        alt="Cover Preview"
                        className="w-24 h-14 rounded-xl border border-border object-cover bg-background shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-24 h-14 rounded-xl border-2 border-dashed border-border bg-background flex flex-col items-center justify-center text-muted-foreground shrink-0">
                        <Upload className="size-5" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border hover:bg-accent text-foreground text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                        <Upload className="size-3.5 text-ember" />
                        <span>Choose Cover File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileUpload}
                          className="hidden"
                        />
                      </label>
                      {state.profile.coverImageUrl && (
                        <button
                          type="button"
                          onClick={() => updateProfile("coverImageUrl", "")}
                          className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <Trash2 className="size-3 text-destructive" />
                          <span>Remove</span>
                        </button>
                      )}
                      <p className="text-10px text-muted-foreground">
                        Select banner image file from your device's internal storage
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                      Company Brand Name *
                    </label>
                    <span className="text-10px text-ember font-bold">From Signup</span>
                  </div>
                  <input
                    type="text"
                    value={state.profile.name}
                    onChange={(e) => {
                      updateProfile("name", e.target.value);
                      if (
                        !state.profile.legalName ||
                        state.profile.legalName.includes("Private Limited")
                      ) {
                        updateProfile("legalName", `${e.target.value} Private Limited`);
                      }
                    }}
                    placeholder="Company Name"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember font-semibold"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Legal Registered Company Name *
                  </label>
                  <input
                    type="text"
                    value={state.profile.legalName || `${state.profile.name} Private Limited`}
                    onChange={(e) => updateProfile("legalName", e.target.value)}
                    placeholder="e.g. Acme Enterprise Solutions Pvt Ltd"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={state.profile.gstNumber}
                    onChange={(e) => updateProfile("gstNumber", e.target.value)}
                    placeholder="27AABCU9603R1ZN"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember font-mono uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={state.profile.panNumber}
                    onChange={(e) => updateProfile("panNumber", e.target.value)}
                    placeholder="AABCU9603R"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember font-mono uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    CIN / Reg Number
                  </label>
                  <input
                    type="text"
                    value={state.profile.cinNumber}
                    onChange={(e) => updateProfile("cinNumber", e.target.value)}
                    placeholder="U72200MH2023PTC398124"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember font-mono uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={state.profile.website}
                    onChange={(e) => updateProfile("website", e.target.value)}
                    placeholder="https://acmecorp.com"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    LinkedIn Company Page
                  </label>
                  <input
                    type="text"
                    value={state.profile.linkedin}
                    onChange={(e) => updateProfile("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/acme"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Year Founded
                  </label>
                  <input
                    type="text"
                    value={state.profile.yearFounded}
                    onChange={(e) => updateProfile("yearFounded", e.target.value)}
                    placeholder="2021"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    About Company Mission & Overview
                  </label>
                  <textarea
                    rows={2}
                    value={state.profile.about}
                    onChange={(e) => updateProfile("about", e.target.value)}
                    placeholder="Brief description of company mission, vision, and focus..."
                    className="w-full bg-surface border border-input rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-ember resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Company Size
                  </label>
                  <select
                    value={state.profile.employeeCount}
                    onChange={(e) => updateProfile("employeeCount", e.target.value)}
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember cursor-pointer"
                  >
                    <option value="1-20">1 - 20 Employees</option>
                    <option value="21-50">21 - 50 Employees</option>
                    <option value="51-200">51 - 200 Employees</option>
                    <option value="201-1000">201 - 1,000 Employees</option>
                    <option value="1000+">1,000+ Enterprise</option>
                  </select>
                </div>

                {/* Single Location Notice Banner to avoid duplicate address fields in Step 1 */}
                <div className="md:col-span-3 p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-ember shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block">
                        Head Office Address & Branch Locations
                      </span>
                      <span className="text-muted-foreground text-11px">
                        Physical building address, city, state, country, timezones, and branch
                        offices are cleanly managed in <strong>Step 2: Office Locations</strong>.
                      </span>
                    </div>
                  </div>
                  <span className="text-11px bg-ember/15 text-ember font-bold px-3 py-1 rounded-lg shrink-0 border border-ember/20">
                    Configured in Step 2 →
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: OFFICE LOCATIONS */}
          {state.currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 font-sans"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 2 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <MapPin className="text-ember size-7" /> Office Locations & Work Schedule
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Configure corporate head office details, add regional branch offices, specify
                  allowed remote work countries, shift hours, and holiday calendars.
                </p>
              </div>

              {/* Head Office (HQ) Configuration Card */}
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-lifted">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-ember/15 text-ember font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="size-3.5" /> Head Office (HQ)
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {state.profile.name || "Main Company"} Headquarters
                    </span>
                  </div>
                  <span className="text-11px text-muted-foreground font-mono">
                    Primary Corporate Location
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Building / Street Address <span className="text-ember">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suite 400, Financial District Tower, 100 Innovation Way"
                      value={
                        state.officeLocations?.headOffice?.address ??
                        state.profile.headOfficeAddress ??
                        ""
                      }
                      onChange={(e) => updateHeadOffice("address", e.target.value)}
                      className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-ember"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      City <span className="text-ember">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / San Francisco"
                      value={state.officeLocations?.headOffice?.city ?? state.profile.city ?? ""}
                      onChange={(e) => updateHeadOffice("city", e.target.value)}
                      className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-ember"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      State / Province / Region <span className="text-ember">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra / California"
                      value={state.officeLocations?.headOffice?.state ?? state.profile.state ?? ""}
                      onChange={(e) => updateHeadOffice("state", e.target.value)}
                      className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-ember"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Country <span className="text-ember">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. India / United States"
                      value={
                        state.officeLocations?.headOffice?.country ?? state.profile.country ?? ""
                      }
                      onChange={(e) => updateHeadOffice("country", e.target.value)}
                      className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-ember"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Postal Code / Pincode
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 400051 / 94105"
                      value={
                        state.officeLocations?.headOffice?.pincode ?? state.profile.pincode ?? ""
                      }
                      onChange={(e) => updateHeadOffice("pincode", e.target.value)}
                      className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Office Timezone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Asia/Kolkata (GMT+5:30)"
                      value={state.profile.timezone || "Asia/Kolkata"}
                      onChange={(e) => updateProfile("timezone", e.target.value)}
                      className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Branch Offices Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                      <Building2 className="size-4 text-ember" /> Regional & Global Branch Offices (
                      {state.officeLocations.branchOffices.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Add additional office locations to route hiring pipelines and location-based
                      HR compliance.
                    </p>
                  </div>
                </div>

                {state.officeLocations.branchOffices.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {state.officeLocations.branchOffices.map((b) => (
                      <div
                        key={b.id}
                        className={`p-4 rounded-xl bg-surface border transition-all flex items-start justify-between ${
                          editingBranchId === b.id
                            ? "border-ember ring-2 ring-ember bg-card"
                            : "border-border hover:border-ember/60"
                        }`}
                      >
                        <div className="space-y-1.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{b.name}</span>
                            <span className="text-10px px-2 py-0.5 rounded-full bg-ember/10 text-ember font-bold">
                              {b.capacity ? `${b.capacity} Desks` : "Flexible"}
                            </span>
                          </div>
                          {b.address && (
                            <p className="text-xs text-foreground font-medium truncate">
                              {b.address}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {b.city}
                            {b.state ? `, ${b.state}` : ""}, {b.country || "India"}
                            {b.pincode ? ` - ${b.pincode}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditBranch(b)}
                            className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-ember transition-colors cursor-pointer"
                            title="Edit Branch Office"
                          >
                            <Edit3 className="size-3.5 text-ember" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBranchOffice(b.id)}
                            className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors cursor-pointer"
                            title="Delete Branch Office"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add / Edit Branch Form Card */}
                <div className="p-5 rounded-2xl bg-surface/80 border border-dashed border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="size-4 text-ember" />
                      {editingBranchId ? `Edit Branch Office` : "Add New Branch Office"}
                    </span>
                    {editingBranchId && (
                      <button
                        type="button"
                        onClick={cancelEditBranch}
                        className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Branch Office Name <span className="text-ember">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru Tech Park Hub"
                        value={newBranch.name}
                        onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                        className="w-full bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Street / Building Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7th Floor, Cyber Towers, Outer Ring Road"
                        value={newBranch.address}
                        onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                        className="w-full bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        City <span className="text-ember">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru / London"
                        value={newBranch.city}
                        onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                        className="w-full bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        State / Region
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Karnataka"
                        value={newBranch.state}
                        onChange={(e) => setNewBranch({ ...newBranch, state: e.target.value })}
                        className="w-full bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. India / United Kingdom"
                        value={newBranch.country}
                        onChange={(e) => setNewBranch({ ...newBranch, country: e.target.value })}
                        className="w-full bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Postal Code / Pincode
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 560103"
                        value={newBranch.pincode}
                        onChange={(e) => setNewBranch({ ...newBranch, pincode: e.target.value })}
                        className="w-full bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Desk Capacity
                      </label>
                      <input
                        type="number"
                        placeholder="25"
                        value={newBranch.capacity}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            capacity: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={saveBranchOffice}
                      className="px-4 py-2.5 rounded-xl bg-ember text-ember-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {editingBranchId ? (
                        <>
                          <Check className="size-4" /> Update Branch Office
                        </>
                      ) : (
                        <>
                          <Plus className="size-4" /> Add Branch Office
                        </>
                      )}
                    </button>
                    {editingBranchId && (
                      <button
                        type="button"
                        onClick={cancelEditBranch}
                        className="px-4 py-2.5 rounded-xl bg-card border border-border text-foreground font-semibold text-xs hover:bg-accent transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Remote Work & Work Schedule Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Remote Work Policy */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-ember" />
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Remote Work Policy
                      </label>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.officeLocations.remoteLocations.enabled}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          officeLocations: {
                            ...prev.officeLocations,
                            remoteLocations: {
                              ...prev.officeLocations.remoteLocations,
                              enabled: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="size-4 accent-ember cursor-pointer"
                    />
                  </div>

                  {state.officeLocations.remoteLocations.enabled ? (
                    <div className="space-y-3">
                      <span className="text-xs text-muted-foreground block">
                        Allowed Remote Hiring Countries & Regions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {state.officeLocations.remoteLocations.allowedCountries.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card text-foreground text-xs font-semibold border border-border"
                          >
                            {c}
                            <button
                              type="button"
                              onClick={() => removeRemoteCountry(c)}
                              className="text-muted-foreground hover:text-destructive cursor-pointer font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add country (e.g. Germany)"
                          value={newRemoteCountryInput}
                          onChange={(e) => setNewRemoteCountryInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addRemoteCountry()}
                          className="flex-1 bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember"
                        />
                        <button
                          type="button"
                          onClick={addRemoteCountry}
                          className="px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:border-ember text-xs font-bold transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                      </div>

                      {/* Quick Country Presets */}
                      <div className="pt-2">
                        <span className="text-10px text-muted-foreground font-semibold block mb-1.5 uppercase tracking-wider">
                          Quick Add Top Regions:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "United States",
                            "India",
                            "United Kingdom",
                            "Canada",
                            "Singapore",
                            "Germany",
                            "United Arab Emirates",
                            "Australia",
                          ].map((preset) => {
                            const isAdded =
                              state.officeLocations.remoteLocations.allowedCountries.includes(
                                preset,
                              );
                            return (
                              <button
                                key={preset}
                                type="button"
                                disabled={isAdded}
                                onClick={() => {
                                  if (!isAdded) {
                                    setState((prev) => ({
                                      ...prev,
                                      officeLocations: {
                                        ...prev.officeLocations,
                                        remoteLocations: {
                                          ...prev.officeLocations.remoteLocations,
                                          allowedCountries: [
                                            ...prev.officeLocations.remoteLocations
                                              .allowedCountries,
                                            preset,
                                          ],
                                        },
                                      },
                                    }));
                                  }
                                }}
                                className={`text-10px px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                                  isAdded
                                    ? "bg-accent/40 text-muted-foreground border-border opacity-50 cursor-default"
                                    : "bg-card text-foreground border-border hover:border-ember"
                                }`}
                              >
                                + {preset}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Remote work disabled. All candidates will be hired for physical office
                      locations.
                    </p>
                  )}
                </div>

                {/* Working Hours & Holidays */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Clock className="size-4 text-ember" />
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Shift Timings & Holiday Schedules
                    </label>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Standard Shift Timings
                      </label>
                      <input
                        type="text"
                        value={state.officeLocations.workingHours}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            officeLocations: {
                              ...prev.officeLocations,
                              workingHours: e.target.value,
                            },
                          }))
                        }
                        placeholder="e.g. 09:00 AM - 06:00 PM IST"
                        className="w-full bg-card border border-input rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {[
                          "09:00 AM - 06:00 PM IST",
                          "08:00 AM - 05:00 PM EST",
                          "09:00 AM - 05:00 PM GMT",
                          "Flexible Rotational Shifts",
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                officeLocations: {
                                  ...prev.officeLocations,
                                  workingHours: preset,
                                },
                              }))
                            }
                            className="text-10px px-2 py-0.5 rounded bg-card text-muted-foreground border border-border hover:text-foreground hover:border-ember transition-colors cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Public Holiday Calendar
                      </label>
                      <input
                        type="text"
                        value={state.officeLocations.holidayCalendar}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            officeLocations: {
                              ...prev.officeLocations,
                              holidayCalendar: e.target.value,
                            },
                          }))
                        }
                        placeholder="e.g. Standard Corporate Calendar (14 Paid Days)"
                        className="w-full bg-card border border-input rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: HR TEAM */}
          {state.currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 3 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Users className="text-ember size-7" /> HR Team & Admin Setup
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Invite initial recruiters, hiring managers, finance leads, and IT admins with
                  customized permission templates.
                </p>
              </div>

              {/* Cron Job Notification Banner */}
              <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-ember shrink-0" />
                  <div>
                    <span className="font-bold text-foreground block">
                      Automated Access Email Dispatch Cron Job
                    </span>
                    <span className="text-muted-foreground text-11px">
                      Dashboard invitation emails with custom links will be scheduled & dispatched
                      to all added team member emails automatically once the setup wizard is
                      completely submitted.
                    </span>
                  </div>
                </div>
                <span className="text-10px bg-ember/15 text-ember font-bold px-2.5 py-1 rounded-md shrink-0 border border-ember/20 flex items-center gap-1">
                  <Clock className="size-3" /> Cron Dispatched on Completion
                </span>
              </div>

              {/* Add Team Member Inline Form */}
              <div className="p-4 rounded-2xl bg-surface/60 border border-border space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Invite New Team Member
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    className="bg-card border border-input rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-ember"
                  />
                  <input
                    type="email"
                    placeholder="Work Email *"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                    className="bg-card border border-input rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-ember"
                  />
                  <input
                    type="text"
                    placeholder="Designation (e.g. Lead Recruiter)"
                    value={newTeamMember.designation}
                    onChange={(e) =>
                      setNewTeamMember({ ...newTeamMember, designation: e.target.value })
                    }
                    className="bg-card border border-input rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-ember"
                  />
                  <select
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                    className="bg-card border border-input rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-ember cursor-pointer"
                  >
                    <option value="HR Admin">HR Admin</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="Finance">Finance</option>
                    <option value="IT Admin">IT Admin</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <button
                  onClick={addHRTeamMember}
                  className="px-4 py-2 rounded-xl bg-ember text-ember-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <UserPlus className="size-3.5" /> Add Team Member
                </button>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-foreground">
                    Configured HR Team ({state.hrTeam.length})
                  </h3>
                  <span className="text-11px text-muted-foreground">
                    Dashboard access will be granted to {state.hrTeam.length} user(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {state.hrTeam.map((m) => {
                    const isPrimaryAdmin = m.id === "team-1" || m.email === state.admin.workEmail;
                    return (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-surface border border-border flex items-start justify-between shadow-sm"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground">{m.name}</span>
                            <span className="text-10px font-bold px-2 py-0.5 rounded-md bg-ember/15 text-ember border border-ember/20">
                              {m.role}
                            </span>
                            {isPrimaryAdmin && (
                              <span className="text-10px bg-ember text-ember-foreground font-bold px-2 py-0.5 rounded-full">
                                Primary Admin
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            {m.email}
                          </span>
                          <span className="text-11px text-muted-foreground block">
                            {m.designation} · {m.department}
                          </span>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {m.permissions.map((p, idx) => (
                              <span
                                key={idx}
                                className="text-9px px-1.5 py-0.5 rounded bg-card text-muted-foreground border border-border/60"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        {!isPrimaryAdmin && (
                          <button
                            onClick={() => removeHRTeamMember(m.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Remove member"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DEPARTMENTS */}
          {state.currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 4 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Network className="text-ember size-7" /> Organization Departments
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select default departments or add custom functional business units.
                </p>
              </div>

              {/* Department Badges Grid */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Active Departments ({state.departments.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {state.departments.map((dept) => (
                    <span
                      key={dept}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-sm font-semibold text-foreground shadow-sm hover:border-ember transition-colors"
                    >
                      <span className="size-2 rounded-full bg-ember" />
                      {dept}
                      <button
                        onClick={() => removeDepartment(dept)}
                        className="text-muted-foreground hover:text-destructive text-base leading-none font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Custom Department Input */}
              <div className="p-4 rounded-2xl bg-surface/50 border border-dashed border-border/80 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter custom department name (e.g. Data & AI, Cyber Security)..."
                  value={newDepartmentInput}
                  onChange={(e) => setNewDepartmentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDepartment()}
                  className="w-full bg-card border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                />
                <button
                  onClick={addDepartment}
                  className="px-5 py-2.5 rounded-xl bg-ember text-ember-foreground font-bold text-xs shrink-0 shadow-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <Plus className="size-4" /> Add Department
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: JOB TITLES */}
          {state.currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 5 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Briefcase className="text-ember size-7" /> Standard Job Titles
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Define official job titles for requisitions, candidate offers, and team
                  hierarchies.
                </p>
              </div>

              {/* Job Titles Badges Grid */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Active Job Titles ({state.jobTitles.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {state.jobTitles.map((title) => (
                    <span
                      key={title}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-sm font-semibold text-foreground shadow-sm hover:border-ember transition-colors"
                    >
                      <Briefcase className="size-3.5 text-ember" />
                      {title}
                      <button
                        onClick={() => removeJobTitle(title)}
                        className="text-muted-foreground hover:text-destructive text-base leading-none font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Custom Title Input */}
              <div className="p-4 rounded-2xl bg-surface/50 border border-dashed border-border/80 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter custom job title (e.g. AI Prompt Engineer, Product Designer)..."
                  value={newJobTitleInput}
                  onChange={(e) => setNewJobTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addJobTitle()}
                  className="w-full bg-card border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                />
                <button
                  onClick={addJobTitle}
                  className="px-5 py-2.5 rounded-xl bg-ember text-ember-foreground font-bold text-xs shrink-0 shadow-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <Plus className="size-4" /> Add Title
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: RECRUITMENT WORKFLOW */}
          {state.currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 6 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <GitMerge className="text-ember size-7" /> Recruitment Pipeline Workflow
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Customize candidate pipeline stages from application receipt to preboarding &
                  joining.
                </p>
              </div>

              {/* Pipeline Flowchart Visual */}
              <div className="p-4 rounded-2xl bg-surface/60 border border-border space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Default Pipeline Sequence
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {state.recruitmentWorkflow.map((stage, idx) => (
                    <React.Fragment key={stage.id}>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shrink-0 shadow-sm">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="text-xs font-bold text-foreground">{stage.name}</span>
                      </div>
                      {idx < state.recruitmentWorkflow.length - 1 && (
                        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Manage Stages List */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-foreground">
                  Pipeline Stage Customization
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {state.recruitmentWorkflow.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-muted-foreground w-4">{index + 1}.</span>
                        <input
                          type="color"
                          value={stage.color}
                          onChange={(e) => {
                            const newWorkflow = [...state.recruitmentWorkflow];
                            newWorkflow[index].color = e.target.value;
                            setState((prev) => ({ ...prev, recruitmentWorkflow: newWorkflow }));
                          }}
                          className="size-6 rounded cursor-pointer border-none bg-transparent"
                        />
                        <input
                          type="text"
                          value={stage.name}
                          onChange={(e) => {
                            const newWorkflow = [...state.recruitmentWorkflow];
                            newWorkflow[index].name = e.target.value;
                            setState((prev) => ({ ...prev, recruitmentWorkflow: newWorkflow }));
                          }}
                          className="bg-card border border-input rounded-lg px-2.5 py-1 text-xs text-foreground font-semibold focus:outline-none focus:border-ember"
                        />
                        <span className="text-10px text-muted-foreground">
                          SLA: {stage.slaHours || 24}h
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveStage(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded bg-card text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronUp className="size-3.5" />
                        </button>
                        <button
                          onClick={() => moveStage(index, "down")}
                          disabled={index === state.recruitmentWorkflow.length - 1}
                          className="p-1 rounded bg-card text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronDown className="size-3.5" />
                        </button>
                        <button
                          onClick={() => removeStage(stage.id)}
                          className="p-1 rounded bg-card text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Stage Form */}
              <div className="p-3.5 rounded-2xl bg-surface/50 border border-dashed border-border flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="New Stage Name (e.g. Executive Interview)"
                  value={newStageInput.name}
                  onChange={(e) => setNewStageInput({ ...newStageInput, name: e.target.value })}
                  className="bg-card border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember w-full"
                />
                <button
                  onClick={addPipelineStage}
                  className="px-4 py-2 rounded-xl bg-ember text-ember-foreground font-bold text-xs shrink-0 shadow-sm"
                >
                  Add Stage
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: CANDIDATE DOCUMENTS */}
          {state.currentStep === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 7 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <FileCheck className="text-ember size-7" /> Candidate Verification Documents
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Toggle required candidate documents for background checks and preboarding
                  compliance.
                </p>
              </div>

              {/* Document Toggles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(state.candidateDocuments).map(([docKey, docVal]) => (
                  <div
                    key={docKey}
                    className="p-4 rounded-2xl bg-surface border border-border space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground flex items-center gap-2">
                        <FileText className="size-4 text-ember" />
                        {docKey}
                      </span>
                      <input
                        type="checkbox"
                        checked={docVal.enabled}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            candidateDocuments: {
                              ...prev.candidateDocuments,
                              [docKey]: { ...docVal, enabled: e.target.checked },
                            },
                          }))
                        }
                        className="size-4 accent-ember cursor-pointer"
                      />
                    </div>

                    {docVal.enabled && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                        <span className="text-muted-foreground">Mandatory / Required</span>
                        <input
                          type="checkbox"
                          checked={docVal.required}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              candidateDocuments: {
                                ...prev.candidateDocuments,
                                [docKey]: { ...docVal, required: e.target.checked },
                              },
                            }))
                          }
                          className="size-3.5 accent-ember cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 8: INTERVIEW SETTINGS */}
          {state.currentStep === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 8 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Calendar className="text-ember size-7" /> Interview Settings & Scorecards
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select interview formats, automated meeting integrations, durations, and scorecard
                  templates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Interview Formats */}
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                    Supported Interview Types
                  </label>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    {["Online", "Offline", "Hybrid"].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.interviewSettings.types.includes(
                            type as "Online" | "Offline" | "Hybrid",
                          )}
                          onChange={(e) => {
                            const current = state.interviewSettings.types;
                            const next = e.target.checked
                              ? [...current, type as "Online" | "Offline" | "Hybrid"]
                              : current.filter((t) => t !== type);
                            setState((prev) => ({
                              ...prev,
                              interviewSettings: { ...prev.interviewSettings, types: next },
                            }));
                          }}
                          className="size-4 accent-ember"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Meeting Platform */}
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                    Meeting Platform Integration
                  </label>
                  <select
                    value={state.interviewSettings.platform}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        interviewSettings: {
                          ...prev.interviewSettings,
                          platform: e.target.value as InterviewSettingsState["platform"],
                        },
                      }))
                    }
                    className="w-full bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom Meetings</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Custom">Custom Link Provider</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                    Default Interview Duration
                  </label>
                  <select
                    value={state.interviewSettings.durationMinutes}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        interviewSettings: {
                          ...prev.interviewSettings,
                          durationMinutes: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="90">90 Minutes</option>
                  </select>
                </div>

                {/* Feedback Form Toggle */}
                <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-foreground uppercase tracking-wider block">
                      Structured Feedback Form
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Mandatory interviewer rating & feedback submit
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={state.interviewSettings.feedbackFormEnabled}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        interviewSettings: {
                          ...prev.interviewSettings,
                          feedbackFormEnabled: e.target.checked,
                        },
                      }))
                    }
                    className="size-4 accent-ember cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 9: EMAIL CONFIGURATION */}
          {state.currentStep === 9 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 9 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Mail className="text-ember size-7" /> Email Configuration & SMTP
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Configure corporate recruitment emails, routing addresses, and automated email
                  triggers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Recruitment Sender Email
                  </label>
                  <input
                    type="email"
                    value={state.emailConfig.recruitmentEmail}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        emailConfig: { ...prev.emailConfig, recruitmentEmail: e.target.value },
                      }))
                    }
                    placeholder="careers@company.com"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Reply-To Address
                  </label>
                  <input
                    type="email"
                    value={state.emailConfig.replyEmail}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        emailConfig: { ...prev.emailConfig, replyEmail: e.target.value },
                      }))
                    }
                    placeholder="no-reply@company.com"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Career Portal Email
                  </label>
                  <input
                    type="email"
                    value={state.emailConfig.careerEmail}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        emailConfig: { ...prev.emailConfig, careerEmail: e.target.value },
                      }))
                    }
                    placeholder="jobs@company.com"
                    className="w-full bg-surface border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-ember"
                  />
                </div>
              </div>

              {/* Email Provider Selector */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Email Dispatch Provider
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["SMTP", "Google Workspace", "Microsoft 365"].map((provider) => (
                    <button
                      key={provider}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          emailConfig: {
                            ...prev.emailConfig,
                            provider: provider as EmailConfigState["provider"],
                          },
                        }))
                      }
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        state.emailConfig.provider === provider
                          ? "bg-ember/15 border-ember text-ember shadow-sm"
                          : "bg-card border-border text-muted-foreground hover:bg-card/80"
                      }`}
                    >
                      <Mail className="size-4" />
                      <span>{provider}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 10: CAREER PORTAL */}
          {state.currentStep === 10 && (
            <motion.div
              key="step-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 10 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Globe className="text-ember size-7" /> Public Career Portal & Branding
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Publish candidate-facing career site URL, employer branding narrative, and
                  application forms.
                </p>
              </div>

              {/* Career Page URL Box */}
              {(() => {
                const careerUrl = state.careerPortal?.url
                  ? state.careerPortal.url.replace("/companies/", "/candidates-portal/")
                  : `https://gravitonitsolutions.com/candidates-portal/${state.profile.subdomain || state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
                return (
                  <div className="p-4 rounded-2xl bg-surface/70 border border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                        Hosted Career Page URL
                      </span>
                      <span className="font-mono text-sm font-bold text-ember">{careerUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(careerUrl, "Career URL")}
                      className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold flex items-center gap-1 hover:bg-card/80 cursor-pointer"
                    >
                      <Copy className="size-3.5" /> Copy Link
                    </button>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    About Company (Employer Brand Story)
                  </label>
                  <textarea
                    rows={2}
                    value={state.careerPortal.aboutCompany}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        careerPortal: { ...prev.careerPortal, aboutCompany: e.target.value },
                      }))
                    }
                    className="w-full bg-surface border border-input rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-ember resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.careerPortal.primaryColor}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          careerPortal: { ...prev.careerPortal, primaryColor: e.target.value },
                        }))
                      }
                      className="size-8 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <input
                      type="text"
                      value={state.careerPortal.primaryColor}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          careerPortal: { ...prev.careerPortal, primaryColor: e.target.value },
                        }))
                      }
                      className="bg-surface border border-input rounded-xl px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Secondary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.careerPortal.secondaryColor}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          careerPortal: { ...prev.careerPortal, secondaryColor: e.target.value },
                        }))
                      }
                      className="size-8 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <input
                      type="text"
                      value={state.careerPortal.secondaryColor}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          careerPortal: { ...prev.careerPortal, secondaryColor: e.target.value },
                        }))
                      }
                      className="bg-surface border border-input rounded-xl px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 11: CANDIDATE EXPERIENCE */}
          {state.currentStep === 11 && (
            <motion.div
              key="step-11"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 11 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Sparkles className="text-ember size-7" /> Candidate Experience Portals
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enable self-service transparency tools for candidates during recruitment &
                  onboarding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    key: "progressTracker",
                    title: "Progress Tracker",
                    desc: "Real-time stage status bar",
                  },
                  {
                    key: "applicationTimeline",
                    title: "Application Timeline",
                    desc: "Detailed date logs",
                  },
                  {
                    key: "recruiterContact",
                    title: "Recruiter Contact",
                    desc: "Direct recruiter email link",
                  },
                  { key: "liveStatus", title: "Live Status", desc: "Live candidate badge" },
                  {
                    key: "interviewTimeline",
                    title: "Interview Timeline",
                    desc: "Scheduled calendar events",
                  },
                  {
                    key: "offerTracker",
                    title: "Offer Tracker",
                    desc: "Digital offer letter e-sign",
                  },
                  {
                    key: "onboardingTracker",
                    title: "Onboarding Tracker",
                    desc: "Day 1 checklist tracker",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-4 rounded-2xl bg-surface border border-border space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{item.title}</span>
                      <input
                        type="checkbox"
                        checked={state.candidateExperience[item.key] ?? true}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            candidateExperience: {
                              ...prev.candidateExperience,
                              [item.key]: e.target.checked,
                            },
                          }))
                        }
                        className="size-4 accent-ember cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 12: IT SETUP */}
          {state.currentStep === 12 && (
            <motion.div
              key="step-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 12 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Laptop className="text-ember size-7" /> IT Setup & Asset Provisioning
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Automate laptop workflows, corporate email creation, access cards, and dev tools
                  for new hires.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    key: "laptopWorkflow",
                    title: "Laptop Workflow",
                    desc: "Automated hardware requisition",
                  },
                  {
                    key: "emailCreation",
                    title: "Email Creation",
                    desc: "Auto Google/Outlook inbox",
                  },
                  { key: "idCard", title: "ID Card Generation", desc: "Digital employee ID card" },
                  {
                    key: "accessCard",
                    title: "Access Card",
                    desc: "Facility entry card provisioning",
                  },
                  { key: "vpn", title: "VPN Provisioning", desc: "Corporate secure VPN" },
                  { key: "github", title: "GitHub Access", desc: "Auto organization invites" },
                  { key: "jira", title: "Jira Access", desc: "Project board assignment" },
                  { key: "slack", title: "Slack Channels", desc: "Team communication sync" },
                  { key: "teams", title: "MS Teams", desc: "Teams workspace creation" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-4 rounded-2xl bg-surface border border-border space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{item.title}</span>
                      <input
                        type="checkbox"
                        checked={state.itSetup[item.key] ?? true}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            itSetup: { ...prev.itSetup, [item.key]: e.target.checked },
                          }))
                        }
                        className="size-4 accent-ember cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 13: NOTIFICATION PREFERENCES */}
          {state.currentStep === 13 && (
            <motion.div
              key="step-13"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 13 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Bell className="text-ember size-7" /> Notification Channels & Events
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select notification dispatch channels (Email, SMS, WhatsApp, Push) and event
                  triggers.
                </p>
              </div>

              {/* Delivery Channels */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Active Delivery Channels
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                  {Object.entries(state.notificationPreferences.channels).map(([chKey, chVal]) => (
                    <label
                      key={chKey}
                      className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-card border border-border"
                    >
                      <input
                        type="checkbox"
                        checked={chVal}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            notificationPreferences: {
                              ...prev.notificationPreferences,
                              channels: {
                                ...prev.notificationPreferences.channels,
                                [chKey]: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="size-4 accent-ember"
                      />
                      <span className="uppercase">{chKey}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Events Checklist */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Choose Trigger Events
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: "applicationSubmitted", label: "Application Submitted" },
                    { key: "interviewScheduled", label: "Interview Scheduled" },
                    { key: "interviewReminder", label: "Interview Reminder" },
                    { key: "offerReleased", label: "Offer Released" },
                    { key: "documentsPending", label: "Documents Pending" },
                    { key: "joiningReminder", label: "Joining Reminder" },
                    { key: "laptopReady", label: "Laptop Ready" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs font-medium"
                    >
                      <span>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={
                          state.notificationPreferences.events[
                            item.key as keyof typeof state.notificationPreferences.events
                          ] ?? true
                        }
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            notificationPreferences: {
                              ...prev.notificationPreferences,
                              events: {
                                ...prev.notificationPreferences.events,
                                [item.key]: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="size-4 accent-ember cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 14: APPROVAL MATRIX */}
          {state.currentStep === 14 && (
            <motion.div
              key="step-14"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 14 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <ShieldCheck className="text-ember size-7" /> Enterprise Approval Matrix
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Establish required approver roles and thresholds for requisitions, offers,
                  salaries, and assets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: "jobApproval", label: "Job Approval" },
                  { key: "interviewApproval", label: "Interview Approval" },
                  { key: "offerApproval", label: "Offer Approval" },
                  { key: "salaryApproval", label: "Salary Approval" },
                  { key: "laptopApproval", label: "Laptop Approval" },
                  { key: "joiningApproval", label: "Joining Approval" },
                ].map((item) => {
                  const val = state.approvalMatrix[
                    item.key as keyof typeof state.approvalMatrix
                  ] || { approverRole: "HR Admin", requiredCount: 1 };
                  return (
                    <div
                      key={item.key}
                      className="p-4 rounded-2xl bg-surface border border-border space-y-2.5 shadow-sm"
                    >
                      <span className="font-bold text-sm text-foreground block">{item.label}</span>
                      <div className="space-y-1.5 text-xs">
                        <label className="text-10px text-muted-foreground uppercase block font-semibold">
                          Approver Role
                        </label>
                        <select
                          value={val.approverRole}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              approvalMatrix: {
                                ...prev.approvalMatrix,
                                [item.key]: { ...val, approverRole: e.target.value },
                              },
                            }))
                          }
                          className="w-full bg-card border border-input rounded-xl px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                        >
                          <option value="HR Admin">HR Admin</option>
                          <option value="Hiring Manager">Hiring Manager</option>
                          <option value="Finance">Finance</option>
                          <option value="Lead Tech">Lead Tech</option>
                          <option value="IT Admin">IT Admin</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 15: INTEGRATIONS */}
          {state.currentStep === 15 && (
            <motion.div
              key="step-15"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 15 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <Puzzle className="text-ember size-7" /> Connected Tools & Integrations
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Connect calendar, chat, video conferencing, developer tools, and payroll software.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: "googleCalendar", name: "Google Calendar", category: "Calendar" },
                  { key: "outlook", name: "Outlook Calendar", category: "Calendar" },
                  { key: "slack", name: "Slack Workspace", category: "Chat" },
                  { key: "msTeams", name: "Microsoft Teams", category: "Chat" },
                  { key: "zoom", name: "Zoom Meetings", category: "Video" },
                  { key: "googleMeet", name: "Google Meet", category: "Video" },
                  { key: "github", name: "GitHub Enterprise", category: "Dev" },
                  { key: "jira", name: "Jira Software", category: "Dev" },
                  { key: "payroll", name: "Payroll Sync (Deel / Razorpay)", category: "Finance" },
                ].map((tool) => (
                  <div
                    key={tool.key}
                    className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <span className="font-bold text-sm text-foreground block">{tool.name}</span>
                      <span className="text-10px px-2 py-0.5 rounded bg-card text-muted-foreground border border-border/60">
                        {tool.category}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.integrations[tool.key] ?? true}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          integrations: { ...prev.integrations, [tool.key]: e.target.checked },
                        }))
                      }
                      className="size-4 accent-ember cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 16: INVITE REMAINING USERS */}
          {state.currentStep === 16 && (
            <motion.div
              key="step-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-ember uppercase tracking-wider">
                  Wizard Step 16 of 17
                </span>
                <h2 className="text-2xl sm:text-3xl font-display text-foreground font-bold flex items-center gap-2 mt-1">
                  <UserPlus className="text-ember size-7" /> Invite Remaining Workspace Users
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Dispatch email invitations via bulk text, CSV upload, or manual entry.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                <button
                  onClick={() => setInviteTab("bulk")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    inviteTab === "bulk"
                      ? "bg-ember text-ember-foreground shadow-sm"
                      : "bg-surface text-muted-foreground"
                  }`}
                >
                  Bulk Invite
                </button>
                <button
                  onClick={() => setInviteTab("csv")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    inviteTab === "csv"
                      ? "bg-ember text-ember-foreground shadow-sm"
                      : "bg-surface text-muted-foreground"
                  }`}
                >
                  CSV Upload
                </button>
                <button
                  onClick={() => setInviteTab("manual")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    inviteTab === "manual"
                      ? "bg-ember text-ember-foreground shadow-sm"
                      : "bg-surface text-muted-foreground"
                  }`}
                >
                  Manual Invite
                </button>
              </div>

              {/* Tab Content */}
              {inviteTab === "bulk" && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Paste Emails (One per line or comma separated)
                  </label>
                  <textarea
                    rows={4}
                    value={state.userInvitations?.bulkEmails || ""}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        userInvitations: { ...prev.userInvitations, bulkEmails: e.target.value },
                      }))
                    }
                    placeholder="john@company.com, sarah@company.com"
                    className="w-full bg-surface border border-input rounded-xl p-3 text-xs font-mono text-foreground focus:outline-none focus:border-ember resize-none"
                  />
                </div>
              )}

              {inviteTab === "csv" && (
                <div className="p-8 rounded-2xl bg-surface/50 border border-dashed border-border/90 text-center space-y-2">
                  <Upload className="size-8 text-ember mx-auto" />
                  <span className="text-xs font-bold text-foreground block">
                    Drop CSV File Here or Click to Upload
                  </span>
                  <span className="text-11px text-muted-foreground block">
                    Supports .csv files with headers: Name, Email, Role, Department
                  </span>
                </div>
              )}

              {inviteTab === "manual" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                  <input
                    type="text"
                    placeholder="Name"
                    value={manualInvite.name}
                    onChange={(e) => setManualInvite({ ...manualInvite, name: e.target.value })}
                    className="bg-surface border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={manualInvite.email}
                    onChange={(e) => setManualInvite({ ...manualInvite, email: e.target.value })}
                    className="bg-surface border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                  />
                  <select
                    value={manualInvite.role}
                    onChange={(e) => setManualInvite({ ...manualInvite, role: e.target.value })}
                    className="bg-surface border border-input rounded-xl px-3 py-2 text-foreground cursor-pointer focus:outline-none focus:border-ember"
                  >
                    <option value="Recruiter">Recruiter</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="Interviewer">Interviewer</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Department"
                    value={manualInvite.department}
                    onChange={(e) =>
                      setManualInvite({ ...manualInvite, department: e.target.value })
                    }
                    className="bg-surface border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={sendInvitations}
                  className="px-6 py-3 rounded-2xl bg-ember text-ember-foreground font-bold text-sm flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
                >
                  <Mail className="size-4" /> Send Invitation Emails
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 17: FINISH & SUMMARY */}
          {state.currentStep === 17 && (
            <motion.div
              key="step-17"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 border-b border-border/80 pb-6">
                <div className="size-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 grid place-items-center mx-auto mb-2">
                  <CheckCircle2 className="size-8 animate-bounce" />
                </div>
                <h2 className="text-3xl font-display font-extrabold text-foreground">
                  Workspace Ready for Launch!
                </h2>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  Your enterprise tenant environment has been fully initialized with security
                  auditing, feature flags, and custom workflows.
                </p>
              </div>

              {/* Workspace Summary Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 shadow-sm">
                  <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                    <Building2 className="size-4 text-ember" /> Workspace Overview
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Company Name:</span>
                      <span className="font-bold text-foreground">{state.profile.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Users Configured:</span>
                      <span className="font-bold text-foreground">
                        {state.hrTeam.length} HR Admins/Recruiters
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Departments:</span>
                      <span className="font-bold text-foreground">
                        {state.departments.length} Functional Units
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Recruitment Pipeline:</span>
                      <span className="font-bold text-foreground">
                        {state.recruitmentWorkflow.length} Custom Stages
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-1.5">
                      <span className="text-muted-foreground">Career Portal:</span>
                      <span className="font-bold text-ember font-mono">
                        {state.careerPortal?.url
                          ? state.careerPortal.url.replace("/companies/", "/candidates-portal/")
                          : `https://gravitonitsolutions.com/candidates-portal/${state.profile.subdomain || state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Metadata Captured Box */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 shadow-sm">
                  <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                    <Shield className="size-4 text-amber-500" /> Automatically Stored Metadata
                  </h3>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-11px">
                      <span className="text-muted-foreground">Company ID:</span>
                      <span className="text-foreground">
                        {state.systemMetadata?.companyId || "comp-uuid-1234"}
                      </span>
                    </div>
                    <div className="flex justify-between text-11px">
                      <span className="text-muted-foreground">Workspace ID:</span>
                      <span className="text-foreground">
                        {state.systemMetadata?.workspaceId || "ws-uuid-5678"}
                      </span>
                    </div>
                    <div className="flex justify-between text-11px">
                      <span className="text-muted-foreground">Tenant ID:</span>
                      <span className="text-foreground">{state.systemMetadata?.tenantId}</span>
                    </div>
                    <div className="flex justify-between text-11px">
                      <span className="text-muted-foreground">Account Status:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                        {state.systemMetadata?.accountStatus}
                      </span>
                    </div>
                    <div className="flex justify-between text-11px">
                      <span className="text-muted-foreground">Trial Period:</span>
                      <span className="text-foreground">14 Days Active</span>
                    </div>
                    <div className="flex justify-between text-11px">
                      <span className="text-muted-foreground">API Key:</span>
                      <span className="text-ember truncate max-w-160px">
                        {state.systemMetadata?.apiKey}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 text-center">
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-ember via-amber-500 to-orange-500 text-ember-foreground font-display font-extrabold text-lg shadow-xl shadow-ember/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Rocket className="size-6 animate-pulse" />
                  <span>Go to Dashboard</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Wizard Controls */}
        <div className="border-t border-border/80 pt-6 mt-8 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={state.currentStep === 1}
            className="px-5 py-2.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs flex items-center gap-2 hover:bg-surface/80 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ArrowLeft className="size-4" /> Previous Step
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
              Step {state.currentStep} of 17
            </span>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-ember text-ember-foreground font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              {state.currentStep === 17 ? (
                <>
                  <span>Go to Dashboard</span>
                  <Rocket className="size-4" />
                </>
              ) : (
                <>
                  <span>Continue to Step {state.currentStep + 1}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
