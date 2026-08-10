import React, { useState } from "react";
import { OnboardingState, OfficeLocationBranch, RecruitmentStage } from "../types/onboarding";
import { CompanyApiService, CompanyDocument } from "@talent-flow/api";
import {
  Building2,
  MapPin,
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
  Info,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface CompanySettingsProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
}

type SubTabType =
  | "profile"
  | "locations"
  | "org_structure"
  | "pipeline"
  | "candidate_docs"
  | "interviews"
  | "email_comms"
  | "career_portal"
  | "it_integrations"
  | "approvals_notifications";

export const CompanySettingsComponent: React.FC<CompanySettingsProps> = ({ state, setState }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Form states for adding items
  const [newBranch, setNewBranch] = useState<Omit<OfficeLocationBranch, "id">>({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    capacity: 25,
  });
  const [newDepartmentInput, setNewDepartmentInput] = useState("");
  const [newJobTitleInput, setNewJobTitleInput] = useState("");
  const [newStageInput, setNewStageInput] = useState({ name: "", color: "#3b82f6", slaHours: 24 });
  const [newRemoteCountryInput, setNewRemoteCountryInput] = useState("");
  const [newScorecardTemplateInput, setNewScorecardTemplateInput] = useState("");

  const brandColors = [
    { name: "Ember Warmth", hex: "#f97316" },
    { name: "Indigo Soft", hex: "#6366f1" },
    { name: "Emerald Success", hex: "#10b981" },
    { name: "Slate Dark", hex: "#0f172a" },
    { name: "Amber Glow", hex: "#f59e0b" },
    { name: "Rose Accent", hex: "#f43f5e" },
    { name: "Sky Blue", hex: "#0284c7 text-sky-500" },
  ];

  const handleSaveAll = async () => {
    setIsSaving(true);
    const slug =
      state.profile.subdomain || state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Update localStorage
    localStorage.setItem(
      "talentflow_company_profile",
      JSON.stringify({
        id: slug,
        name: state.profile.name,
        subdomain: state.profile.subdomain,
        domain: state.profile.domain,
        industry: state.profile.industry,
        size: state.profile.size,
        brandColor: state.profile.brandColor,
        headquarters: state.profile.headquarters,
        email: state.admin.workEmail,
        adminName: state.admin.fullName,
        isCompleted: state.isCompleted,
      }),
    );

    // 2. Persist to Firestore
    const docData: CompanyDocument = {
      id: slug,
      name: state.profile.name,
      subdomain: state.profile.subdomain,
      domain: state.profile.domain,
      industry: state.profile.industry,
      size: state.profile.size,
      brandColor: state.profile.brandColor,
      headquarters: state.profile.headquarters,
      admin: {
        fullName: state.admin.fullName,
        workEmail: state.admin.workEmail,
        phone: state.admin.phone,
        jobTitle: state.admin.jobTitle,
        billingEmail: state.admin.billingEmail,
      },
      plan: {
        id: state.plan.id,
        name: state.plan.name,
        priceMonthly: state.plan.priceMonthly,
        billingCycle: state.plan.billingCycle,
      },
      modules: state.modules as unknown as Record<string, unknown>,
      integrations: state.integrations,
      teamInvites: state.teamInvites as unknown as CompanyDocument["teamInvites"],
      isCompleted: state.isCompleted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await CompanyApiService.saveCompanyToFirestore(docData);
      toast.success(`✅ Settings for '${state.profile.name}' saved & updated across workspace!`);
    } catch (err) {
      console.warn("Failed saving settings to Firestore:", err);
      toast.success(`✅ Settings updated in local workspace profile!`);
    } finally {
      setIsSaving(false);
    }
  };

  const copyApiKeyToClipboard = () => {
    if (state.systemMetadata?.apiKey) {
      navigator.clipboard.writeText(state.systemMetadata.apiKey);
      toast.success("API key copied to clipboard!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-11px font-semibold tracking-wider text-muted-foreground uppercase">
            Setup Wizard & Company Management
          </span>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1">
            Company Workspace Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View and modify all 17 configuration steps configured during the setup wizard.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-ember text-ember-foreground hover:bg-ember/90 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="size-4" />
          <span>{isSaving ? "Saving..." : "Save All Workspace Settings"}</span>
        </button>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {[
          { id: "profile", label: "1. Profile & Admin", icon: Building2 },
          { id: "locations", label: "2. Locations & Remote", icon: MapPin },
          { id: "org_structure", label: "3. Depts & Job Titles", icon: Network },
          { id: "pipeline", label: "4. Recruitment Pipeline", icon: GitMerge },
          { id: "candidate_docs", label: "5. Candidate Docs", icon: FileCheck },
          { id: "interviews", label: "6. Interview Defaults", icon: Calendar },
          { id: "email_comms", label: "7. Email & Comms", icon: Mail },
          { id: "career_portal", label: "8. Career Portal & UX", icon: Globe },
          { id: "it_integrations", label: "9. IT & Integrations", icon: Laptop },
          { id: "approvals_notifications", label: "10. Approvals & System", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTabType)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-ember text-ember-foreground shadow-xs font-semibold"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: Profile & Admin Details */}
      {activeSubTab === "profile" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Company Profile Details */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Building2 className="size-4 text-ember" /> Company Profile (Step 1 Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={state.profile.name}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, name: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Legal Company Name
                </label>
                <input
                  type="text"
                  value={state.profile.legalName || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, legalName: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Subdomain Handle
                </label>
                <input
                  type="text"
                  value={state.profile.subdomain}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, subdomain: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Primary Domain
                </label>
                <input
                  type="text"
                  value={state.profile.domain}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, domain: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Industry Sector
                </label>
                <input
                  type="text"
                  value={state.profile.industry}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, industry: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Company Size</label>
                <input
                  type="text"
                  value={state.profile.size}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, size: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">GST Number</label>
                <input
                  type="text"
                  value={state.profile.gstNumber || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, gstNumber: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">PAN Number</label>
                <input
                  type="text"
                  value={state.profile.panNumber || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, panNumber: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">CIN Number</label>
                <input
                  type="text"
                  value={state.profile.cinNumber || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, cinNumber: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Official Website
                </label>
                <input
                  type="text"
                  value={state.profile.website || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, website: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Year Founded</label>
                <input
                  type="text"
                  value={state.profile.yearFounded || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, yearFounded: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Employee Count
                </label>
                <input
                  type="text"
                  value={state.profile.employeeCount || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, employeeCount: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-muted-foreground font-medium mb-1">
                  Company Description & Bio
                </label>
                <textarea
                  rows={2}
                  value={state.profile.about || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, about: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            {/* Brand Primary Color Selection */}
            <div className="border-t border-border pt-4">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="size-3.5 text-ember" /> Brand Primary Theme Color
              </label>
              <div className="flex flex-wrap gap-3">
                {brandColors.map((col) => {
                  const isSelected = state.profile.brandColor === col.hex;
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          profile: { ...prev.profile, brandColor: col.hex },
                        }))
                      }
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "border-ember ring-1 ring-ember bg-accent text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      {isSelected && <Check className="size-3.5 text-ember" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary Admin Details */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="size-4 text-ember" /> Workspace Super Admin Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={state.admin.fullName}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, fullName: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  value={state.admin.workEmail}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, workEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={state.admin.phone || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, phone: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  value={state.admin.jobTitle || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, jobTitle: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Billing Email
                </label>
                <input
                  type="email"
                  value={state.admin.billingEmail || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      admin: { ...prev.admin, billingEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Office Locations & Remote Policy */}
      {activeSubTab === "locations" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Head Office Location */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="size-4 text-ember" /> Head Office Location (Step 2 Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-muted-foreground font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={state.officeLocations.headOffice.address}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, address: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">City</label>
                <input
                  type="text"
                  value={state.officeLocations.headOffice.city}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, city: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">State</label>
                <input
                  type="text"
                  value={state.officeLocations.headOffice.state}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, state: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={state.officeLocations.headOffice.country}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, country: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Pincode / ZIP
                </label>
                <input
                  type="text"
                  value={state.officeLocations.headOffice.pincode}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        headOffice: { ...prev.officeLocations.headOffice, pincode: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>
            </div>
          </div>

          {/* Branch Offices Management */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="size-4 text-ember" /> Branch Offices List (
              {state.officeLocations.branchOffices.length})
            </h2>

            {/* List Existing Branches */}
            <div className="space-y-3">
              {state.officeLocations.branchOffices.map((branch) => (
                <div
                  key={branch.id}
                  className="p-3 border border-border rounded-lg bg-surface flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-foreground">{branch.name}</p>
                    <p className="text-muted-foreground">
                      {branch.address}, {branch.city}, {branch.state}, {branch.country} (
                      {branch.pincode}) · Capacity: {branch.capacity} seats
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        officeLocations: {
                          ...prev.officeLocations,
                          branchOffices: prev.officeLocations.branchOffices.filter(
                            (b) => b.id !== branch.id,
                          ),
                        },
                      }));
                      toast.success(`Removed branch office ${branch.name}`);
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Branch */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-medium text-foreground">Add New Branch Office</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Branch Name (e.g. Pune Tech Park)"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="Address Line"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newBranch.city}
                  onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newBranch.state}
                  onChange={(e) => setNewBranch({ ...newBranch, state: e.target.value })}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newBranch.pincode}
                  onChange={(e) => setNewBranch({ ...newBranch, pincode: e.target.value })}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember"
                />
                <button
                  onClick={() => {
                    if (!newBranch.name.trim()) return toast.error("Enter branch name");
                    const createdBranch: OfficeLocationBranch = {
                      ...newBranch,
                      id: "branch-" + Date.now(),
                    };
                    setState((prev) => ({
                      ...prev,
                      officeLocations: {
                        ...prev.officeLocations,
                        branchOffices: [...prev.officeLocations.branchOffices, createdBranch],
                      },
                    }));
                    setNewBranch({
                      name: "",
                      address: "",
                      city: "",
                      state: "",
                      country: "India",
                      pincode: "",
                      capacity: 25,
                    });
                    toast.success(`Added branch office '${createdBranch.name}'`);
                  }}
                  className="bg-ember text-ember-foreground hover:bg-ember/90 font-medium px-4 py-1.5 rounded-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="size-4" /> Add Branch
                </button>
              </div>
            </div>
          </div>

          {/* Remote Policy & Working Hours */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Globe className="size-4 text-ember" /> Remote Hiring Policy & Working Hours
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Allow Remote Hiring Worldwide</p>
                  <p className="text-11px text-muted-foreground">
                    Enable candidate applications for remote work roles.
                  </p>
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
                  className="accent-ember size-4"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">
                    Default Working Hours Window
                  </label>
                  <input
                    type="text"
                    value={state.officeLocations.workingHours}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        officeLocations: { ...prev.officeLocations, workingHours: e.target.value },
                      }))
                    }
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">
                    Corporate Holiday Calendar Policy
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
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Departments & Job Titles */}
      {activeSubTab === "org_structure" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Departments */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Network className="size-4 text-ember" /> Company Departments (Step 4 Details)
            </h2>

            <div className="flex flex-wrap gap-2">
              {state.departments.map((dept) => (
                <div
                  key={dept}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-foreground"
                >
                  <span>{dept}</span>
                  <button
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        departments: prev.departments.filter((d) => d !== dept),
                      }));
                      toast.success(`Removed department '${dept}'`);
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
                placeholder="Enter new department name..."
                value={newDepartmentInput}
                onChange={(e) => setNewDepartmentInput(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember flex-1"
              />
              <button
                onClick={() => {
                  if (!newDepartmentInput.trim()) return;
                  if (state.departments.includes(newDepartmentInput.trim()))
                    return toast.error("Department already exists");
                  setState((prev) => ({
                    ...prev,
                    departments: [...prev.departments, newDepartmentInput.trim()],
                  }));
                  setNewDepartmentInput("");
                  toast.success("Department added!");
                }}
                className="bg-ember text-ember-foreground font-medium px-4 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-4" /> Add Department
              </button>
            </div>
          </div>

          {/* Job Titles */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Briefcase className="size-4 text-ember" /> Job Designations & Titles (Step 5 Details)
            </h2>

            <div className="flex flex-wrap gap-2">
              {state.jobTitles.map((title) => (
                <div
                  key={title}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-foreground"
                >
                  <span>{title}</span>
                  <button
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        jobTitles: prev.jobTitles.filter((t) => t !== title),
                      }));
                      toast.success(`Removed title '${title}'`);
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
                placeholder="Enter new job title..."
                value={newJobTitleInput}
                onChange={(e) => setNewJobTitleInput(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember flex-1"
              />
              <button
                onClick={() => {
                  if (!newJobTitleInput.trim()) return;
                  if (state.jobTitles.includes(newJobTitleInput.trim()))
                    return toast.error("Job title already exists");
                  setState((prev) => ({
                    ...prev,
                    jobTitles: [...prev.jobTitles, newJobTitleInput.trim()],
                  }));
                  setNewJobTitleInput("");
                  toast.success("Job title added!");
                }}
                className="bg-ember text-ember-foreground font-medium px-4 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-4" /> Add Job Title
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Recruitment Pipeline Stages */}
      {activeSubTab === "pipeline" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <GitMerge className="size-4 text-ember" /> Custom Recruitment Stages & SLA (Step 6
              Details)
            </h2>

            {/* List Stages */}
            <div className="space-y-3 text-xs">
              {state.recruitmentWorkflow.map((stage, idx) => (
                <div
                  key={stage.id}
                  className="p-3 border border-border rounded-lg bg-surface flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {idx + 1}. {stage.name}
                      </p>
                      <p className="text-muted-foreground text-11px">
                        {stage.description || "Pipeline stage"} · SLA: {stage.slaHours ?? 24} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={stage.slaHours ?? 24}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        const updated = [...state.recruitmentWorkflow];
                        updated[idx] = { ...stage, slaHours: val };
                        setState((prev) => ({ ...prev, recruitmentWorkflow: updated }));
                      }}
                      className="w-16 bg-card border border-border rounded px-2 py-1 text-center font-mono"
                      title="SLA Hours"
                    />
                    <button
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          recruitmentWorkflow: prev.recruitmentWorkflow.filter(
                            (s) => s.id !== stage.id,
                          ),
                        }));
                        toast.success(`Removed stage '${stage.name}'`);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Stage */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-medium text-foreground">Add Custom Stage</h3>
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Stage Name (e.g. Tech Assessment)"
                  value={newStageInput.name}
                  onChange={(e) => setNewStageInput({ ...newStageInput, name: e.target.value })}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember flex-1"
                />
                <input
                  type="number"
                  placeholder="SLA Hours"
                  value={newStageInput.slaHours}
                  onChange={(e) =>
                    setNewStageInput({ ...newStageInput, slaHours: parseInt(e.target.value) || 24 })
                  }
                  className="w-24 bg-surface border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-ember"
                />
                <button
                  onClick={() => {
                    if (!newStageInput.name.trim()) return toast.error("Enter stage name");
                    const newStage: RecruitmentStage = {
                      id: "stg-" + Date.now(),
                      name: newStageInput.name.trim(),
                      color: newStageInput.color,
                      slaHours: newStageInput.slaHours,
                      description: "Custom pipeline stage",
                    };
                    setState((prev) => ({
                      ...prev,
                      recruitmentWorkflow: [...prev.recruitmentWorkflow, newStage],
                    }));
                    setNewStageInput({ name: "", color: "#3b82f6", slaHours: 24 });
                    toast.success(`Added stage '${newStage.name}'`);
                  }}
                  className="bg-ember text-ember-foreground font-medium px-4 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="size-4" /> Add Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Candidate Document Requirements */}
      {activeSubTab === "candidate_docs" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <FileCheck className="size-4 text-ember" /> Candidate Document Requirements (Step 7
              Details)
            </h2>

            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface border-b border-border text-muted-foreground font-semibold uppercase text-10px">
                  <tr>
                    <th className="p-3">Document Type</th>
                    <th className="p-3">Enable Verification</th>
                    <th className="p-3">Mandatory / Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(state.candidateDocuments).map(([docKey, config]) => (
                    <tr key={docKey} className="hover:bg-surface/50">
                      <td className="p-3 font-semibold text-foreground">{docKey}</td>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={(e) =>
                            setState((prev) => ({
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
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={config.required}
                          onChange={(e) =>
                            setState((prev) => ({
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

      {/* SUB-TAB 6: Interview & Scheduling Defaults */}
      {activeSubTab === "interviews" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Calendar className="size-4 text-ember" /> Interview Defaults & Scorecards (Step 8
              Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Video Platform Integration
                </label>
                <select
                  value={state.interviewSettings.platform}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      interviewSettings: {
                        ...prev.interviewSettings,
                        platform: e.target.value as typeof prev.interviewSettings.platform,
                      },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Custom">Custom Link Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
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
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                >
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="90">90 Minutes</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-muted-foreground font-medium mb-1">
                  Custom Platform Link (if applicable)
                </label>
                <input
                  type="text"
                  value={state.interviewSettings.customPlatformUrl || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      interviewSettings: {
                        ...prev.interviewSettings,
                        customPlatformUrl: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            {/* Scorecards */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-semibold text-foreground">Scorecard Evaluation Templates</h3>
              <div className="flex flex-wrap gap-2">
                {state.interviewSettings.scorecardTemplates.map((template) => (
                  <span
                    key={template}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground"
                  >
                    {template}
                    <button
                      onClick={() =>
                        setState((prev) => ({
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
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: Email & Communication Hub */}
      {activeSubTab === "email_comms" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Mail className="size-4 text-ember" /> Email & Communication Settings (Step 9 Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Recruitment Email
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
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Reply Email</label>
                <input
                  type="email"
                  value={state.emailConfig.replyEmail}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      emailConfig: { ...prev.emailConfig, replyEmail: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
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
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            {/* Auto Emails */}
            <div className="border-t border-border pt-4 space-y-3 text-xs">
              <h3 className="font-semibold text-foreground">Automated Notification Triggers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(state.emailConfig.autoEmails).map(([key, enabled]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer"
                  >
                    <span className="capitalize font-medium text-foreground">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          emailConfig: {
                            ...prev.emailConfig,
                            autoEmails: { ...prev.emailConfig.autoEmails, [key]: e.target.checked },
                          },
                        }))
                      }
                      className="accent-ember size-4"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: Career Portal & Experience */}
      {activeSubTab === "career_portal" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Globe className="size-4 text-ember" /> Career Portal Customization (Step 10 Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Career Portal Public URL
                </label>
                <input
                  type="text"
                  value={state.careerPortal.url}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      careerPortal: { ...prev.careerPortal, url: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground font-mono text-11px focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  About Company Heading
                </label>
                <input
                  type="text"
                  value={state.careerPortal.aboutCompany}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      careerPortal: { ...prev.careerPortal, aboutCompany: e.target.value },
                    }))
                  }
                  className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="size-4 text-ember" /> Candidate Experience Features (Step 11
              Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(state.candidateExperience).map(([key, enabled]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer"
                >
                  <span className="capitalize font-medium text-foreground">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        candidateExperience: {
                          ...prev.candidateExperience,
                          [key]: e.target.checked,
                        },
                      }))
                    }
                    className="accent-ember size-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 9: IT Provisioning & Integrations */}
      {activeSubTab === "it_integrations" && (
        <div className="space-y-6 animate-fadeIn">
          {/* IT Provisioning */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Laptop className="size-4 text-ember" /> IT Setup & Provisioning Workflows (Step 12
              Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(state.itSetup).map(([key, enabled]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer"
                >
                  <span className="capitalize font-medium text-foreground">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        itSetup: { ...prev.itSetup, [key]: e.target.checked },
                      }))
                    }
                    className="accent-ember size-4"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Puzzle className="size-4 text-ember" /> Software Integrations Hub (Step 15 Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(state.integrations).map(([key, enabled]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer"
                >
                  <span className="capitalize font-medium text-foreground">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        integrations: { ...prev.integrations, [key]: e.target.checked },
                      }))
                    }
                    className="accent-ember size-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 10: Approvals & System Metadata */}
      {activeSubTab === "approvals_notifications" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Notification Channels */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Bell className="size-4 text-ember" /> Notification Channels (Step 13 Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {Object.entries(state.notificationPreferences.channels).map(([channel, enabled]) => (
                <label
                  key={channel}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface cursor-pointer"
                >
                  <span className="capitalize font-medium text-foreground">{channel}</span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setState((prev) => ({
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
                    className="accent-ember size-4"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* System Metadata & API Key */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4 text-xs font-mono">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3 font-sans">
              <Key className="size-4 text-ember" /> System Identifiers & API Security (Step 17
              Details)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-surface border border-border rounded-lg flex items-center justify-between">
                <span className="text-muted-foreground">Company UUID:</span>
                <span className="font-bold text-foreground">{state.systemMetadata?.companyId}</span>
              </div>
              <div className="p-3 bg-surface border border-border rounded-lg flex items-center justify-between">
                <span className="text-muted-foreground">Tenant ID:</span>
                <span className="font-bold text-foreground">{state.systemMetadata?.tenantId}</span>
              </div>
              <div className="p-3 bg-surface border border-border rounded-lg flex items-center justify-between md:col-span-2">
                <span className="text-muted-foreground">Secret API Key:</span>
                <div className="flex items-center gap-2">
                  <span className="text-ember truncate max-w-xs">
                    {state.systemMetadata?.apiKey}
                  </span>
                  <button
                    onClick={copyApiKeyToClipboard}
                    className="p-1 rounded bg-card border border-border hover:bg-accent text-foreground cursor-pointer"
                    title="Copy API Key"
                  >
                    <Copy className="size-3.5" />
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
