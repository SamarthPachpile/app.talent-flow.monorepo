import React, { useState, useEffect, useMemo } from "react";
import {
  OnboardingState,
  OfficeLocationBranch,
  HRTeamMember,
  RecruitmentStage,
} from "../types/onboarding";
import {
  CompanyApiService,
  CompanyDocument,
  COUNTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
} from "@talent-flow/api";
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
  Save,
  Plus,
  Trash2,
  Check,
  Palette,
  Key,
  Copy,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Shield,
  AlertCircle,
  RotateCcw,
  Database,
} from "lucide-react";
import { toast } from "../lib/sweetalert";

interface CompanySettingsProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
}

type SubTabType =
  | "profile"
  | "admin"
  | "locations"
  | "team"
  | "org_structure"
  | "pipeline"
  | "candidate_docs"
  | "interviews"
  | "email_comms"
  | "career_portal"
  | "it_integrations"
  | "approvals_system";

const DEFAULT_DEPARTMENTS_SUGGESTIONS = [
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",
  "Design",
  "Customer Success",
  "Finance & Accounts",
  "Legal & Compliance",
  "Operations",
  "QA & Automation",
];

const DEFAULT_JOB_TITLES_SUGGESTIONS = [
  "Senior Fullstack Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "UI/UX Designer",
  "DevOps & Cloud Engineer",
  "QA Automation Engineer",
  "HR Generalist",
  "Talent Acquisition Lead",
  "Account Executive",
  "Customer Success Manager",
  "Data Scientist",
];

const DEFAULT_28_MICRO_STAGES = [
  "Application Received",
  "Acknowledgement Email Sent",
  "Resume Uploaded",
  "Resume Parsed",
  "Duplicate Check",
  "Recruiter Assigned",
  "Screening Pending",
  "Screening Complete",
  "Shortlisted",
  "Interview Requested",
  "Calendar Invite Sent",
  "Reminder Sent",
  "Interview Completed",
  "Feedback Submitted",
  "Hiring Manager Approved",
  "HR Approved",
  "Offer Generated",
  "Offer Sent",
  "Offer Viewed",
  "Offer Accepted",
  "Documents Requested",
  "Documents Uploaded",
  "Verification Complete",
  "Onboarding Started",
  "Laptop Assigned",
  "Accounts Created",
  "Joining Confirmed",
  "Employee Created",
];

export const CompanySettingsComponent: React.FC<CompanySettingsProps> = ({ state, setState }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Local front-end working state (changes stay in memory until user explicitly saves)
  const [formData, setFormData] = useState<OnboardingState>(state);

  // Sync formData if state changes externally and form is clean
  useEffect(() => {
    setFormData(state);
  }, [state]);

  // Determine if there are unsaved front-end changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(state);
  }, [formData, state]);

  // Form states for adding items
  const [newBranch, setNewBranch] = useState<Omit<OfficeLocationBranch, "id">>({
    name: "",
    address: "",
    city: "",
    state: "",
    country: formData.profile.country || "India",
    pincode: "",
    capacity: 25,
  });

  const [newTeamMember, setNewTeamMember] = useState<Omit<HRTeamMember, "id">>({
    name: "",
    email: "",
    designation: "Recruiter",
    department: formData.departments[0] || "Human Resources",
    role: "Recruiter",
    permissions: ["view_pipeline", "advance_candidates"],
    status: "Active",
  });

  const [newDepartmentInput, setNewDepartmentInput] = useState("");
  const [newJobTitleInput, setNewJobTitleInput] = useState("");
  const [newStageInput, setNewStageInput] = useState({
    name: "",
    color: "#f97316",
    slaHours: 24,
    category: "Workflow",
    description: "Custom stage",
  });
  const [newScorecardTemplateInput, setNewScorecardTemplateInput] = useState("");

  const brandColors = [
    { name: "Ember Warmth", hex: "#f97316" },
    { name: "Indigo Soft", hex: "#6366f1" },
    { name: "Emerald Success", hex: "#10b981" },
    { name: "Slate Dark", hex: "#0f172a" },
    { name: "Amber Glow", hex: "#f59e0b" },
    { name: "Rose Accent", hex: "#f43f5e" },
    { name: "Sky Blue", hex: "#0284c7" },
    { name: "Purple Dynamic", hex: "#a855f7" },
    { name: "Teal Modern", hex: "#0d9488" },
  ];

  // Image Upload Handlers (Logo & Cover Image) - Front-end memory only
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size exceeds 5MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, logoUrl: dataUrl },
        careerPortal: { ...prev.careerPortal, logoUrl: dataUrl },
      }));
      toast.info("Logo loaded in front-end preview. Click 'Save to Database' to persist.");
    };
    reader.readAsDataURL(file);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover banner file size exceeds 10MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, coverImageUrl: dataUrl },
        careerPortal: { ...prev.careerPortal, bannerUrl: dataUrl },
      }));
      toast.info("Cover banner loaded in front-end preview. Click 'Save to Database' to persist.");
    };
    reader.readAsDataURL(file);
  };

  // Discard all unsaved front-end changes
  const handleDiscardChanges = () => {
    setFormData(state);
    toast.info("Unsaved changes discarded. Restored database state.");
  };

  // SAVE TO DB: Only triggers when user explicitly clicks "Save Workspace Settings" or "Save to Database"
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    const slug =
      formData.profile.subdomain || formData.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Commit formData to parent React state
    setState(formData);

    // 2. Persist to localStorage
    try {
      localStorage.setItem(
        "talentflow_company_profile",
        JSON.stringify({
          id: slug,
          name: formData.profile.name,
          legalName: formData.profile.legalName,
          subdomain: formData.profile.subdomain,
          domain: formData.profile.domain,
          industry: formData.profile.industry,
          size: formData.profile.size,
          brandColor: formData.profile.brandColor,
          headquarters: formData.profile.headquarters,
          logoUrl: formData.profile.logoUrl,
          coverImageUrl: formData.profile.coverImageUrl,
          email: formData.admin.workEmail,
          adminName: formData.admin.fullName,
          isCompleted: formData.isCompleted,
        }),
      );

      localStorage.setItem("talentflow_onboarding_state", JSON.stringify(formData));
    } catch {
      // ignore storage quota error
    }

    // 3. Save to Firestore Database
    const docData: CompanyDocument = {
      id: slug,
      name: formData.profile.name,
      legalName: formData.profile.legalName,
      subdomain: formData.profile.subdomain,
      domain: formData.profile.domain,
      industry: formData.profile.industry,
      size: formData.profile.size,
      brandColor: formData.profile.brandColor,
      headquarters: formData.profile.headquarters,
      logoUrl: formData.profile.logoUrl,
      coverImageUrl: formData.profile.coverImageUrl,
      admin: {
        fullName: formData.admin.fullName,
        workEmail: formData.admin.workEmail,
        phone: formData.admin.phone,
        jobTitle: formData.admin.jobTitle,
        billingEmail: formData.admin.billingEmail,
      },
      plan: {
        id: formData.plan.id,
        name: formData.plan.name,
        priceMonthly: formData.plan.priceMonthly,
        billingCycle: formData.plan.billingCycle,
      },
      modules: formData.modules as unknown as Record<string, unknown>,
      integrations: formData.integrations,
      teamInvites: formData.teamInvites as unknown as CompanyDocument["teamInvites"],
      isCompleted: formData.isCompleted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Full configuration payload
      officeLocations: formData.officeLocations as unknown as Record<string, unknown>,
      hrTeam: formData.hrTeam as unknown as Record<string, unknown>[],
      departments: formData.departments,
      jobTitles: formData.jobTitles,
      recruitmentWorkflow: formData.recruitmentWorkflow as unknown as Record<string, unknown>[],
      candidateDocuments: formData.candidateDocuments as unknown as Record<string, unknown>,
      interviewSettings: formData.interviewSettings as unknown as Record<string, unknown>,
      emailConfig: formData.emailConfig as unknown as Record<string, unknown>,
      careerPortal: formData.careerPortal as unknown as Record<string, unknown>,
      candidateExperience: formData.candidateExperience as unknown as Record<string, unknown>,
      itSetup: formData.itSetup as unknown as Record<string, unknown>,
      notificationPreferences: formData.notificationPreferences as unknown as Record<
        string,
        unknown
      >,
      approvalMatrix: formData.approvalMatrix as unknown as Record<string, unknown>,
      systemMetadata: formData.systemMetadata as unknown as Record<string, unknown>,
    };

    try {
      await CompanyApiService.saveCompanyToFirestore(docData);
      toast.success("Settings saved & written to live database for " + formData.profile.name + "!");
    } catch (err) {
      console.warn("Failed saving settings to Firestore:", err);
      toast.success("Settings updated in local workspace cache!");
    } finally {
      setIsSaving(false);
    }
  };

  const copyApiKeyToClipboard = () => {
    if (formData.systemMetadata?.apiKey) {
      navigator.clipboard.writeText(formData.systemMetadata.apiKey);
      toast.success("API key copied to clipboard!");
    }
  };

  const regenerateApiKey = () => {
    const newKey =
      "tf_live_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setFormData((prev) => ({
      ...prev,
      systemMetadata: {
        ...prev.systemMetadata,
        apiKey: newKey,
      },
    }));
    toast.info("New API key generated in front-end memory! Click 'Save to Database' to persist.");
  };

  const resetToDefault28Stages = () => {
    const defaultStages: RecruitmentStage[] = DEFAULT_28_MICRO_STAGES.map((name, i) => ({
      id: "stg-" + (i + 1),
      name,
      color: brandColors[i % brandColors.length].hex,
      slaHours: 24,
      description: "Automated recruitment micro-stage",
    }));
    setFormData((prev) => ({
      ...prev,
      recruitmentWorkflow: defaultStages,
    }));
    toast.info("Workflow reset to 28 stages in front-end memory. Click Save to persist to DB.");
  };

  const tabs = [
    { id: "profile", label: "Profile & Identity", icon: Building2, badge: "Step 1" },
    { id: "admin", label: "Super Admin & Signup", icon: ShieldCheck, badge: "Auth" },
    {
      id: "locations",
      label: "Locations & Remote",
      icon: MapPin,
      badge: (formData.officeLocations.branchOffices.length + 1).toString(),
    },
    {
      id: "team",
      label: "HR Team & Roles",
      icon: Users,
      badge: (formData.hrTeam?.length || 0).toString(),
    },
    {
      id: "org_structure",
      label: "Departments & Titles",
      icon: Network,
      badge: formData.departments.length.toString(),
    },
    {
      id: "pipeline",
      label: "Recruitment Workflow",
      icon: GitMerge,
      badge: formData.recruitmentWorkflow.length.toString(),
    },
    {
      id: "candidate_docs",
      label: "Candidate Documents",
      icon: FileCheck,
      badge: Object.keys(formData.candidateDocuments).length.toString(),
    },
    {
      id: "interviews",
      label: "Interview Defaults",
      icon: Calendar,
      badge: formData.interviewSettings.platform,
    },
    {
      id: "email_comms",
      label: "Email & Triggers",
      icon: Mail,
      badge: formData.emailConfig.provider,
    },
    { id: "career_portal", label: "Career Portal & UX", icon: Globe, badge: "Live" },
    { id: "it_integrations", label: "IT Setup & Connectors", icon: Laptop, badge: "Sync" },
    { id: "approvals_system", label: "Approvals & Security", icon: Shield, badge: "System" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Logo preview or Monogram */}
          {formData.profile.logoUrl ? (
            <img
              src={formData.profile.logoUrl}
              alt={formData.profile.name}
              className="h-12 w-auto max-w-[200px] object-contain shrink-0"
            />
          ) : (
            <div className="size-12 rounded-xl bg-ember text-ember-foreground font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
              {formData.profile.name ? formData.profile.name.substring(0, 2).toUpperCase() : "TF"}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {formData.profile.name || "Workspace Settings"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Workspace
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-secondary-foreground">
                {formData.plan.name} Plan
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Subdomain:{" "}
              <span className="font-mono text-foreground font-semibold">
                {formData.profile.subdomain}.talentflow.hub
              </span>{" "}
              · All field edits stay in front-end memory until you click Save.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <button
              onClick={handleDiscardChanges}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-xs px-4 py-2.5 rounded-xl transition-all border border-border cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="size-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-ember hover:bg-ember/90 text-ember-foreground font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Database className="size-4" />
            )}
            <span>{isSaving ? "Saving to DB..." : "Save to Database"}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-medium">
            <AlertCircle className="size-4 shrink-0" />
            <span>
              <strong>Unsaved Front-End Changes:</strong> You have made edits that are currently
              held in front-end memory only. Click &apos;Save to Database&apos; to persist to
              Firestore.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleDiscardChanges}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground hover:bg-accent font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-lg bg-ember text-ember-foreground hover:bg-ember/90 font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Save className="size-3.5" />
              {isSaving ? "Saving..." : "Save to DB"}
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTabType)}
              className={
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer " +
                (isActive
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-card")
              }
            >
              <Icon className="size-3.5 shrink-0" />
              <span>{tab.label}</span>
              <span
                className={
                  "text-[10px] px-1.5 py-0.2 rounded-full font-mono " +
                  (isActive
                    ? "bg-background/20 text-background"
                    : "bg-secondary text-muted-foreground")
                }
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUB-TAB 1: COMPANY PROFILE, BRANDING & LEGAL IDENTITY
         ========================================================================= */}
      {activeSubTab === "profile" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Logo & Cover Banner Upload Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <ImageIcon className="size-4 text-ember" /> Company Brand Visual Assets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <label className="block text-xs font-bold text-foreground">
                  Company Official Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {formData.profile.logoUrl ? (
                      <img
                        src={formData.profile.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Building2 className="size-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-[11px] text-muted-foreground">
                      Upload high-res PNG, SVG, or JPG (Max 5MB). Changes remain in front-end memory
                      until you click Save to Database.
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground hover:bg-accent cursor-pointer transition-colors">
                        <Upload className="size-3.5 text-ember" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>

                      {formData.profile.logoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, logoUrl: "" },
                              careerPortal: { ...prev.careerPortal, logoUrl: "" },
                            }))
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 text-xs font-medium cursor-pointer"
                        >
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Banner Upload */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <label className="block text-xs font-bold text-foreground">
                  Career Portal Cover Banner
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-36 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {formData.profile.coverImageUrl ? (
                      <img
                        src={formData.profile.coverImageUrl}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-[11px] text-muted-foreground">
                      Upload wide landscape cover banner (Max 10MB). Used on public jobs portal
                      header.
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground hover:bg-accent cursor-pointer transition-colors">
                        <Upload className="size-3.5 text-ember" />
                        <span>Choose Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                        />
                      </label>

                      {formData.profile.coverImageUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, coverImageUrl: "" },
                              careerPortal: { ...prev.careerPortal, bannerUrl: "" },
                            }))
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 text-xs font-medium cursor-pointer"
                        >
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Theme Colors */}
            <div className="border-t border-border pt-4">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="size-3.5 text-ember" /> Brand Primary Theme Color
              </label>
              <div className="flex flex-wrap gap-2.5 items-center">
                {brandColors.map((col) => {
                  const isSelected = formData.profile.brandColor === col.hex;
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          profile: { ...prev.profile, brandColor: col.hex },
                          careerPortal: { ...prev.careerPortal, primaryColor: col.hex },
                        }))
                      }
                      className={
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer " +
                        (isSelected
                          ? "border-ember ring-2 ring-ember/30 bg-card text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground")
                      }
                    >
                      <span
                        className="size-3.5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      {isSelected && <Check className="size-3.5 text-ember" />}
                    </button>
                  );
                })}

                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-border">
                  <span className="text-xs text-muted-foreground">Custom:</span>
                  <input
                    type="color"
                    value={
                      formData.profile.brandColor.startsWith("#")
                        ? formData.profile.brandColor
                        : "#f97316"
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, brandColor: e.target.value },
                        careerPortal: { ...prev.careerPortal, primaryColor: e.target.value },
                      }))
                    }
                    className="size-7 rounded cursor-pointer border border-border bg-card p-0"
                  />
                  <span className="font-mono text-xs text-foreground font-semibold">
                    {formData.profile.brandColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Company Profile Details Grid */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Building2 className="size-4 text-ember" /> Company Legal & Commercial Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Company Display Name
                </label>
                <input
                  type="text"
                  value={formData.profile.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, name: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Registered Legal Name
                </label>
                <input
                  type="text"
                  value={formData.profile.legalName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, legalName: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Subdomain Handle
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.profile.subdomain}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        profile: {
                          ...prev.profile,
                          subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        },
                      }))
                    }
                    className="w-full bg-card border border-border rounded-l-xl px-3.5 py-2.5 text-foreground font-mono font-medium focus:outline-none focus:border-ember"
                  />
                  <span className="bg-secondary border border-l-0 border-border text-muted-foreground px-3 py-2.5 rounded-r-xl text-[11px] font-mono">
                    .talentflow.hub
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Corporate Primary Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. acme-corp.com"
                  value={formData.profile.domain || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, domain: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Industry Sector
                </label>
                <select
                  value={formData.profile.industry}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, industry: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember cursor-pointer"
                >
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Company Size
                </label>
                <select
                  value={formData.profile.size}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, size: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember cursor-pointer"
                >
                  {COMPANY_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s} employees
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Country</label>
                <select
                  value={formData.profile.country || "India"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, country: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember cursor-pointer"
                >
                  {Object.keys(COUNTRY_OPTIONS).map((cntry) => (
                    <option key={cntry} value={cntry}>
                      {cntry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Year Founded
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2018"
                  value={formData.profile.yearFounded || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, yearFounded: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Official Website
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={formData.profile.website || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, website: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  LinkedIn Page URL
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/company/..."
                  value={formData.profile.linkedin || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, linkedin: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Default Timezone
                </label>
                <input
                  type="text"
                  placeholder="Asia/Kolkata (IST)"
                  value={formData.profile.timezone || "Asia/Kolkata (IST)"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, timezone: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Standard Business Hours
                </label>
                <input
                  type="text"
                  placeholder="09:00 AM – 06:00 PM (Mon-Fri)"
                  value={formData.profile.businessHours || "09:00 AM – 06:00 PM"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, businessHours: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              {/* Tax Identifiers */}
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">GST Number</label>
                <input
                  type="text"
                  placeholder="27AAACG0000A1Z5"
                  value={formData.profile.gstNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, gstNumber: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-mono font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">PAN Number</label>
                <input
                  type="text"
                  placeholder="AAACG0000A"
                  value={formData.profile.panNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, panNumber: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-mono font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">CIN Number</label>
                <input
                  type="text"
                  placeholder="U72900MH2020PTC000000"
                  value={formData.profile.cinNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, cinNumber: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-mono font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-muted-foreground font-semibold mb-1">
                  Company Description & About Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of your company, mission, and culture..."
                  value={formData.profile.about || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, about: e.target.value },
                      careerPortal: { ...prev.careerPortal, aboutCompany: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: SUPER ADMIN & SIGNUP METADATA
         ========================================================================= */}
      {activeSubTab === "admin" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="size-4 text-ember" /> Primary Super Admin & Account Owner
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Super Admin Full Name
                </label>
                <input
                  type="text"
                  value={formData.admin.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, fullName: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Primary Work Email
                </label>
                <input
                  type="email"
                  value={formData.admin.workEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, workEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Mobile / Phone Number
                </label>
                <input
                  type="text"
                  value={formData.admin.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, phone: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Job Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chief People Officer / Head of Talent"
                  value={formData.admin.jobTitle || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, jobTitle: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-muted-foreground font-semibold mb-1">
                  Billing & Invoices Contact Email
                </label>
                <input
                  type="email"
                  placeholder="billing@company.com"
                  value={formData.admin.billingEmail || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, billingEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: OFFICE LOCATIONS & REMOTE POLICY
         ========================================================================= */}
      {activeSubTab === "locations" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Head Office */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="size-4 text-ember" /> Headquarters Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-muted-foreground font-semibold mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.officeLocations.headOffice.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, address: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={formData.officeLocations.headOffice.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, city: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  value={formData.officeLocations.headOffice.state}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, state: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Pincode / ZIP
                </label>
                <input
                  type="text"
                  value={formData.officeLocations.headOffice.pincode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, pincode: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>
            </div>
          </div>

          {/* Branch Offices Management */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <MapPin className="size-4 text-ember" /> Regional & Branch Offices (
                {formData.officeLocations.branchOffices.length})
              </h2>
            </div>

            {/* List Existing Branches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {formData.officeLocations.branchOffices.map((branch) => (
                <div
                  key={branch.id}
                  className="p-4 border border-border rounded-xl bg-card flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-foreground text-sm">{branch.name}</p>
                    <p className="text-muted-foreground">
                      {branch.address}, {branch.city}, {branch.state} - {branch.pincode} (
                      {branch.country})
                    </p>
                    <span className="inline-block text-[10.5px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
                      Capacity: {branch.capacity} Seats
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        officeLocations: {
                          ...prev.officeLocations,
                          branchOffices: prev.officeLocations.branchOffices.filter(
                            (b) => b.id !== branch.id,
                          ),
                        },
                      }));
                      toast.info(
                        "Removed branch " + branch.name + " (click Save to DB to persist)",
                      );
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Branch Form */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-bold text-foreground">Add New Regional Office</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Branch Name (e.g. Pune R&D Center)"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newBranch.city}
                  onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newBranch.state}
                  onChange={(e) => setNewBranch({ ...newBranch, state: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newBranch.pincode}
                  onChange={(e) => setNewBranch({ ...newBranch, pincode: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                />
                <button
                  onClick={() => {
                    if (!newBranch.name.trim()) return toast.error("Enter branch office name");
                    const created: OfficeLocationBranch = {
                      ...newBranch,
                      id: "branch-" + Date.now(),
                    };
                    setFormData((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        branchOffices: [...prev.officeLocations.branchOffices, created],
                      },
                    }));
                    setNewBranch({
                      name: "",
                      address: "",
                      city: "",
                      state: "",
                      country: formData.profile.country || "India",
                      pincode: "",
                      capacity: 25,
                    });
                    toast.info(
                      "Added branch office '" +
                        created.name +
                        "' to front-end. Click Save to persist.",
                    );
                  }}
                  className="bg-ember hover:bg-ember/90 text-ember-foreground font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="size-4" /> Add Branch
                </button>
              </div>
            </div>
          </div>

          {/* Remote Policy & Working Hours */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Globe className="size-4 text-ember" /> Remote Hiring Policy & Corporate Calendar
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-card cursor-pointer">
                <div>
                  <p className="font-bold text-foreground">Allow Remote Work & Hiring Worldwide</p>
                  <p className="text-[11px] text-muted-foreground">
                    Enables remote work flags across all job requisitions and candidate
                    applications.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.officeLocations.remoteLocations.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                  className="accent-ember size-4 cursor-pointer"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    Standard Working Hours Window
                  </label>
                  <input
                    type="text"
                    value={formData.officeLocations.workingHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        officeLocations: { ...prev.officeLocations, workingHours: e.target.value },
                      }))
                    }
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">
                    Corporate Holiday Calendar Policy
                  </label>
                  <input
                    type="text"
                    value={formData.officeLocations.holidayCalendar}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        officeLocations: {
                          ...prev.officeLocations,
                          holidayCalendar: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: HR TEAM MEMBERS & USER ROLES
         ========================================================================= */}
      {activeSubTab === "team" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Users className="size-4 text-ember" /> HR Team Directory & Access Control
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage recruiter, hiring manager, and interviewer accounts for your company.
                </p>
              </div>
            </div>

            {/* List Team Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(formData.hrTeam || []).map((member) => (
                <div
                  key={member.id}
                  className="p-4 border border-border rounded-xl bg-card flex items-start justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-ember/15 text-ember font-bold text-sm flex items-center justify-center shrink-0">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{member.name}</p>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-ember/15 text-ember border border-ember/20">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">{member.email}</p>
                      <p className="text-muted-foreground text-[10.5px]">
                        {member.designation} · {member.department}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        hrTeam: prev.hrTeam.filter((m) => m.id !== member.id),
                      }));
                      toast.info(
                        "Removed team member " + member.name + " (click Save to DB to persist)",
                      );
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Team Member Form */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-bold text-foreground">Add New Team Member</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newTeamMember.name}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="email"
                  placeholder="Work Email"
                  value={newTeamMember.email}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember"
                />
                <select
                  value={newTeamMember.role}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember cursor-pointer"
                >
                  <option value="HR Admin">HR Admin</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Hiring Manager">Hiring Manager</option>
                  <option value="Finance">Finance</option>
                  <option value="IT Admin">IT Admin</option>
                  <option value="Operations">Operations</option>
                </select>
                <button
                  onClick={() => {
                    if (!newTeamMember.name.trim() || !newTeamMember.email.trim())
                      return toast.error("Enter member name and email");
                    const createdMember: HRTeamMember = {
                      ...newTeamMember,
                      id: "hr-" + Date.now(),
                      status: "Active",
                    };
                    setFormData((prev) => ({
                      ...prev,
                      hrTeam: [...(prev.hrTeam || []), createdMember],
                    }));
                    setNewTeamMember({
                      name: "",
                      email: "",
                      designation: "Recruiter",
                      department: formData.departments[0] || "Human Resources",
                      role: "Recruiter",
                      permissions: ["view_pipeline", "advance_candidates"],
                      status: "Active",
                    });
                    toast.info(
                      "Added '" +
                        createdMember.name +
                        "' to front-end team. Click Save to persist to DB.",
                    );
                  }}
                  className="bg-ember hover:bg-ember/90 text-ember-foreground font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="size-4" /> Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: DEPARTMENTS & JOB DESIGNATIONS
         ========================================================================= */}
      {activeSubTab === "org_structure" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Departments */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Network className="size-4 text-ember" /> Company Departments (
              {formData.departments.length})
            </h2>

            <div className="flex flex-wrap gap-2">
              {formData.departments.map((dept) => (
                <div
                  key={dept}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground shadow-2xs"
                >
                  <span>{dept}</span>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        departments: prev.departments.filter((d) => d !== dept),
                      }));
                      toast.info(
                        "Removed department '" + dept + "' (front-end only, click Save to persist)",
                      );
                    }}
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 text-xs">
              <input
                type="text"
                placeholder="Type department name..."
                value={newDepartmentInput}
                onChange={(e) => setNewDepartmentInput(e.target.value)}
                className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember flex-1"
              />
              <button
                onClick={() => {
                  if (!newDepartmentInput.trim()) return;
                  if (formData.departments.includes(newDepartmentInput.trim()))
                    return toast.error("Department already exists");
                  setFormData((prev) => ({
                    ...prev,
                    departments: [...prev.departments, newDepartmentInput.trim()],
                  }));
                  setNewDepartmentInput("");
                  toast.info("Department added to front-end! Click Save to DB to persist.");
                }}
                className="bg-ember hover:bg-ember/90 text-ember-foreground font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="size-4" /> Add Department
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="pt-2 border-t border-border">
              <p className="text-[11px] text-muted-foreground font-semibold mb-2">
                Quick Add Suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_DEPARTMENTS_SUGGESTIONS.filter(
                  (d) => !formData.departments.includes(d),
                ).map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, departments: [...prev.departments, sug] }));
                      toast.info("Added " + sug + " to front-end");
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-card border border-border/70 hover:border-ember text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Titles */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Briefcase className="size-4 text-ember" /> Job Designations & Roles (
              {formData.jobTitles.length})
            </h2>

            <div className="flex flex-wrap gap-2">
              {formData.jobTitles.map((title) => (
                <div
                  key={title}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground shadow-2xs"
                >
                  <span>{title}</span>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        jobTitles: prev.jobTitles.filter((t) => t !== title),
                      }));
                      toast.info("Removed title '" + title + "' (front-end only)");
                    }}
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 text-xs">
              <input
                type="text"
                placeholder="Type job designation..."
                value={newJobTitleInput}
                onChange={(e) => setNewJobTitleInput(e.target.value)}
                className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember flex-1"
              />
              <button
                onClick={() => {
                  if (!newJobTitleInput.trim()) return;
                  if (formData.jobTitles.includes(newJobTitleInput.trim()))
                    return toast.error("Job title already exists");
                  setFormData((prev) => ({
                    ...prev,
                    jobTitles: [...prev.jobTitles, newJobTitleInput.trim()],
                  }));
                  setNewJobTitleInput("");
                  toast.info("Job title added to front-end! Click Save to DB to persist.");
                }}
                className="bg-ember hover:bg-ember/90 text-ember-foreground font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="size-4" /> Add Designation
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="pt-2 border-t border-border">
              <p className="text-[11px] text-muted-foreground font-semibold mb-2">
                Quick Add Suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_JOB_TITLES_SUGGESTIONS.filter((j) => !formData.jobTitles.includes(j)).map(
                  (sug) => (
                    <button
                      key={sug}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, jobTitles: [...prev.jobTitles, sug] }));
                        toast.info("Added " + sug + " to front-end");
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-card border border-border/70 hover:border-ember text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      + {sug}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 6: RECRUITMENT PIPELINE STAGES & SLA
         ========================================================================= */}
      {activeSubTab === "pipeline" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <GitMerge className="size-4 text-ember" /> Custom Recruitment Pipeline Stages (
                  {formData.recruitmentWorkflow.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure SLA turnarounds, micro-stage advancement triggers, and color themes.
                </p>
              </div>

              <button
                onClick={resetToDefault28Stages}
                className="text-xs text-ember font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="size-3.5" /> Reset to 28 Micro-Stages
              </button>
            </div>

            {/* List Stages */}
            <div className="space-y-2.5 text-xs max-h-[480px] overflow-y-auto pr-1">
              {formData.recruitmentWorkflow.map((stage, idx) => (
                <div
                  key={stage.id}
                  className="p-3 border border-border rounded-xl bg-card flex flex-wrap items-center justify-between gap-3 hover:border-ember/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div>
                      <p className="font-bold text-foreground">
                        {idx + 1}. {stage.name}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {stage.description || "Micro-stage"} · SLA Turnaround:{" "}
                        {stage.slaHours ?? 24} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-muted-foreground">SLA (hrs):</span>
                      <input
                        type="number"
                        value={stage.slaHours ?? 24}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const updated = [...formData.recruitmentWorkflow];
                          updated[idx] = { ...stage, slaHours: val };
                          setFormData((prev) => ({ ...prev, recruitmentWorkflow: updated }));
                        }}
                        className="w-16 bg-surface border border-border rounded-lg px-2 py-1 text-center font-mono text-xs text-foreground focus:outline-none focus:border-ember"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          recruitmentWorkflow: prev.recruitmentWorkflow.filter(
                            (s) => s.id !== stage.id,
                          ),
                        }));
                        toast.info("Removed stage '" + stage.name + "' from front-end");
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Stage */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-bold text-foreground">Add Custom Stage</h3>
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Stage Name (e.g. AI Technical Screening)"
                  value={newStageInput.name}
                  onChange={(e) => setNewStageInput({ ...newStageInput, name: e.target.value })}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember flex-1"
                />
                <input
                  type="number"
                  placeholder="SLA Hours"
                  value={newStageInput.slaHours}
                  onChange={(e) =>
                    setNewStageInput({ ...newStageInput, slaHours: parseInt(e.target.value) || 24 })
                  }
                  className="w-24 bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember font-mono"
                />
                <button
                  onClick={() => {
                    if (!newStageInput.name.trim()) return toast.error("Enter stage name");
                    const newStage: RecruitmentStage = {
                      id: "stg-" + Date.now(),
                      name: newStageInput.name.trim(),
                      color: newStageInput.color,
                      slaHours: newStageInput.slaHours,
                      description: "Custom recruitment workflow stage",
                    };
                    setFormData((prev) => ({
                      ...prev,
                      recruitmentWorkflow: [...prev.recruitmentWorkflow, newStage],
                    }));
                    setNewStageInput({
                      name: "",
                      color: "#f97316",
                      slaHours: 24,
                      category: "Workflow",
                      description: "",
                    });
                    toast.info("Added stage '" + newStage.name + "' to front-end");
                  }}
                  className="bg-ember hover:bg-ember/90 text-ember-foreground font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="size-4" /> Add Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 7: CANDIDATE VERIFICATION DOCUMENTS
         ========================================================================= */}
      {activeSubTab === "candidate_docs" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <FileCheck className="size-4 text-ember" /> Candidate Verification & Onboarding
              Documents Matrix
            </h2>

            <div className="overflow-x-auto border border-border rounded-xl bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface border-b border-border text-muted-foreground font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Document Requirement</th>
                    <th className="p-3.5 text-center">Enable Upload</th>
                    <th className="p-3.5 text-center">Mandatory / Strict Blocking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(formData.candidateDocuments).map(([docKey, config]) => (
                    <tr key={docKey} className="hover:bg-surface/50 transition-colors">
                      <td className="p-3.5 font-bold text-foreground">{docKey}</td>
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              candidateDocuments: {
                                ...prev.candidateDocuments,
                                [docKey]: { ...config, enabled: e.target.checked },
                              },
                            }))
                          }
                          className="accent-ember size-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={config.required}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              candidateDocuments: {
                                ...prev.candidateDocuments,
                                [docKey]: { ...config, required: e.target.checked },
                              },
                            }))
                          }
                          className="accent-ember size-4 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 8: INTERVIEW DEFAULTS & SCORECARDS
         ========================================================================= */}
      {activeSubTab === "interviews" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Calendar className="size-4 text-ember" /> Interview Scheduling & Evaluation Defaults
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Default Meeting Platform
                </label>
                <select
                  value={formData.interviewSettings.platform}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      interviewSettings: {
                        ...prev.interviewSettings,
                        platform: e.target.value as typeof prev.interviewSettings.platform,
                      },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember cursor-pointer"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Custom">Custom Provider URL</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Default Interview Slot Duration
                </label>
                <select
                  value={formData.interviewSettings.durationMinutes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      interviewSettings: {
                        ...prev.interviewSettings,
                        durationMinutes: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember cursor-pointer"
                >
                  <option value="15">15 Minutes (Screening)</option>
                  <option value="30">30 Minutes (Standard)</option>
                  <option value="45">45 Minutes (Technical)</option>
                  <option value="60">60 Minutes (Deep Dive)</option>
                  <option value="90">90 Minutes (Panel)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-muted-foreground font-semibold mb-1">
                  Custom Video Platform Link Pattern (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="https://meet.company.internal/{interviewId}"
                  value={formData.interviewSettings.customPlatformUrl || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      interviewSettings: {
                        ...prev.interviewSettings,
                        customPlatformUrl: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            {/* Scorecard Templates */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-bold text-foreground">Scorecard Evaluation Criteria Templates</h3>
              <div className="flex flex-wrap gap-2">
                {formData.interviewSettings.scorecardTemplates.map((template) => (
                  <span
                    key={template}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border text-foreground font-semibold shadow-2xs"
                  >
                    {template}
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          interviewSettings: {
                            ...prev.interviewSettings,
                            scorecardTemplates: prev.interviewSettings.scorecardTemplates.filter(
                              (t) => t !== template,
                            ),
                          },
                        }))
                      }
                      className="text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="New evaluation criteria (e.g. System Design Mastery)..."
                  value={newScorecardTemplateInput}
                  onChange={(e) => setNewScorecardTemplateInput(e.target.value)}
                  className="bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-ember flex-1"
                />
                <button
                  onClick={() => {
                    if (!newScorecardTemplateInput.trim()) return;
                    setFormData((prev) => ({
                      ...prev,
                      interviewSettings: {
                        ...prev.interviewSettings,
                        scorecardTemplates: [
                          ...prev.interviewSettings.scorecardTemplates,
                          newScorecardTemplateInput.trim(),
                        ],
                      },
                    }));
                    setNewScorecardTemplateInput("");
                    toast.info("Added criteria template to front-end");
                  }}
                  className="bg-ember hover:bg-ember/90 text-ember-foreground font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="size-4" /> Add Criteria
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 9: EMAIL & AUTOMATION TRIGGERS
         ========================================================================= */}
      {activeSubTab === "email_comms" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Mail className="size-4 text-ember" /> Email Inboxes & Automated Candidate Triggers
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Recruitment Outbox Email
                </label>
                <input
                  type="email"
                  value={formData.emailConfig.recruitmentEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailConfig: { ...prev.emailConfig, recruitmentEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Reply-To Address
                </label>
                <input
                  type="email"
                  value={formData.emailConfig.replyEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailConfig: { ...prev.emailConfig, replyEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Career Inquiries Email
                </label>
                <input
                  type="email"
                  value={formData.emailConfig.careerEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emailConfig: { ...prev.emailConfig, careerEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            {/* Email Triggers */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-bold text-foreground">Automated Notification Triggers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(formData.emailConfig.autoEmails).map(([key, enabled]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card cursor-pointer"
                  >
                    <span className="capitalize font-semibold text-foreground">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          emailConfig: {
                            ...prev.emailConfig,
                            autoEmails: { ...prev.emailConfig.autoEmails, [key]: e.target.checked },
                          },
                        }))
                      }
                      className="accent-ember size-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 10: CAREER PORTAL & CANDIDATE EXPERIENCE
         ========================================================================= */}
      {activeSubTab === "career_portal" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Globe className="size-4 text-ember" /> Public Career Portal Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Public Jobs Portal URL
                </label>
                <input
                  type="text"
                  value={formData.careerPortal.url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      careerPortal: { ...prev.careerPortal, url: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-mono text-xs focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Career Portal Headline
                </label>
                <input
                  type="text"
                  value={formData.careerPortal.aboutCompany}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      careerPortal: { ...prev.careerPortal, aboutCompany: e.target.value },
                    }))
                  }
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            {/* Application form fields requirements */}
            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="font-bold text-foreground">Application Form Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(formData.careerPortal.applicationFormFields).map(
                  ([key, enabled]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-card cursor-pointer"
                    >
                      <span className="font-semibold text-foreground capitalize">
                        {key.replace(/^require/, "").replace(/([A-Z])/g, " $1")}
                      </span>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            careerPortal: {
                              ...prev.careerPortal,
                              applicationFormFields: {
                                ...prev.careerPortal.applicationFormFields,
                                [key]: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="accent-ember size-4 cursor-pointer"
                      />
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Candidate Experience Features */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="size-4 text-ember" /> Candidate Experience Enhancements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(formData.candidateExperience).map(([key, enabled]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card cursor-pointer"
                >
                  <span className="capitalize font-semibold text-foreground">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        candidateExperience: {
                          ...prev.candidateExperience,
                          [key]: e.target.checked,
                        },
                      }))
                    }
                    className="accent-ember size-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 11: IT PROVISIONING & SOFTWARE CONNECTORS
         ========================================================================= */}
      {activeSubTab === "it_integrations" && (
        <div className="space-y-6 animate-fadeIn">
          {/* IT Provisioning */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Laptop className="size-4 text-ember" /> IT Equipment & Account Provisioning Workflows
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(formData.itSetup).map(([key, enabled]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card cursor-pointer"
                >
                  <span className="capitalize font-semibold text-foreground">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        itSetup: { ...prev.itSetup, [key]: e.target.checked },
                      }))
                    }
                    className="accent-ember size-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Puzzle className="size-4 text-ember" /> Multi-Channel Connectors & HRIS Sync
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(formData.integrations).map(([key, enabled]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card cursor-pointer"
                >
                  <span className="capitalize font-semibold text-foreground">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        integrations: { ...prev.integrations, [key]: e.target.checked },
                      }))
                    }
                    className="accent-ember size-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 12: APPROVAL MATRIX, NOTIFICATIONS & SYSTEM SECURITY
         ========================================================================= */}
      {activeSubTab === "approvals_system" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Approval Matrix */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="size-4 text-ember" /> Multi-Stage Governance & Approval Matrix
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(formData.approvalMatrix).map(([key, config]) => (
                <div key={key} className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                  <p className="font-bold text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">Approver Role:</span>
                    <select
                      value={config.approverRole}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          approvalMatrix: {
                            ...prev.approvalMatrix,
                            [key]: { ...config, approverRole: e.target.value },
                          },
                        }))
                      }
                      className="bg-surface border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="HR Head">HR Head</option>
                      <option value="Hiring Manager">Hiring Manager</option>
                      <option value="Finance Lead">Finance Lead</option>
                      <option value="Operations Head">Operations Head</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Channels */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Bell className="size-4 text-ember" /> Notification Delivery Channels
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(formData.notificationPreferences.channels).map(
                ([channel, enabled]) => (
                  <label
                    key={channel}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card cursor-pointer"
                  >
                    <span className="capitalize font-semibold text-foreground">{channel}</span>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notificationPreferences: {
                            ...prev.notificationPreferences,
                            channels: {
                              ...prev.notificationPreferences.channels,
                              [channel]: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="accent-ember size-4 cursor-pointer"
                    />
                  </label>
                ),
              )}
            </div>
          </div>

          {/* System Metadata & API Key */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4 text-xs font-mono">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-3 font-sans">
              <Key className="size-4 text-ember" /> System Identifiers & API Keys
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between">
                <span className="text-muted-foreground font-sans text-xs">Tenant ID:</span>
                <span className="font-bold text-foreground">
                  {formData.systemMetadata?.tenantId || "tenant-default"}
                </span>
              </div>
              <div className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between">
                <span className="text-muted-foreground font-sans text-xs">Company Slug:</span>
                <span className="font-bold text-foreground">{formData.profile.subdomain}</span>
              </div>

              <div className="p-3.5 bg-card border border-border rounded-xl flex items-center justify-between sm:col-span-2">
                <span className="text-muted-foreground font-sans text-xs">Secret API Key:</span>
                <div className="flex items-center gap-2">
                  <span className="text-ember font-bold truncate max-w-xs sm:max-w-md">
                    {formData.systemMetadata?.apiKey || "tf_live_default_key"}
                  </span>
                  <button
                    onClick={copyApiKeyToClipboard}
                    className="p-1.5 rounded-lg bg-surface border border-border hover:bg-accent text-foreground cursor-pointer shadow-2xs"
                    title="Copy API Key"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    onClick={regenerateApiKey}
                    className="p-1.5 rounded-lg bg-surface border border-border hover:bg-accent text-foreground cursor-pointer shadow-2xs"
                    title="Regenerate API Key"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
