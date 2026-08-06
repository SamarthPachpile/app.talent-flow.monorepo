import React from "react";
import { OnboardingState } from "../types/onboarding";
import { Palette, Check, Save, Upload, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
}

export const CompanyProfileSettings: React.FC<SettingsProps> = ({ state, setState }) => {
  const brandColors = [
    { name: "Ember Warmth", hex: "oklch(0.63 0.18 42)" },
    { name: "Slate Dark", hex: "oklch(0.216 0.008 55)" },
    { name: "Emerald Success", hex: "oklch(0.55 0.1 155)" },
    { name: "Clay Accent", hex: "oklch(0.72 0.07 55)" },
    { name: "Warning Amber", hex: "oklch(0.72 0.14 75)" },
    { name: "Indigo Soft", hex: "oklch(0.55 0.18 260)" },
  ];

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
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, logoUrl: dataUrl },
      }));
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
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, coverImageUrl: dataUrl },
      }));
      toast.success(`Loaded cover image from device: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    toast.success("Company profile & branding updated!");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-6 animate-fadeIn">
      <div>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Branding & Configuration
        </p>
        <h1 className="mt-1 text-4xl leading-none font-display text-foreground">
          Company Profile & Custom Branding
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Customize your company portal appearance, brand colors, logo, and cover images from your
          device.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-xl shadow-sm space-y-6">
        {/* Brand Theme Colors */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Palette className="size-4 text-ember" /> Primary Portal Brand Color
          </label>
          <div className="flex flex-wrap gap-3">
            {brandColors.map((color) => {
              const isSelected = state.profile.brandColor === color.hex;
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, brandColor: color.hex },
                    }))
                  }
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "border-ring ring-1 ring-ring bg-accent text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span
                    className="size-3.5 rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                  {isSelected && <Check className="size-3.5 text-foreground" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logo & Cover Image Device Internal Storage Upload Section */}
        <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo File Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Company Logo (Device Storage)
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
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ember text-ember-foreground hover:bg-ember/90 text-xs font-semibold shadow-xs transition-colors cursor-pointer">
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
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, logoUrl: "" },
                      }))
                    }
                    className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Trash2 className="size-3 text-destructive" />
                    <span>Remove</span>
                  </button>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Select image file from your device's internal storage
                </p>
              </div>
            </div>
          </div>

          {/* Cover File Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Company Cover Image (Device Storage)
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
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-accent text-foreground text-xs font-semibold shadow-xs transition-colors cursor-pointer">
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
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, coverImageUrl: "" },
                      }))
                    }
                    className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Trash2 className="size-3 text-destructive" />
                    <span>Remove</span>
                  </button>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Select banner image file from your device's internal storage
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={state.profile.name}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, name: e.target.value },
                }))
              }
              className="w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Primary Web Domain
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
              className="w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Subdomain Handle
            </label>
            <div className="flex">
              <input
                type="text"
                value={state.profile.subdomain}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, subdomain: e.target.value },
                  }))
                }
                className="w-full bg-card border border-r-0 border-input rounded-l-md px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              />
              <span className="bg-surface text-muted-foreground text-xs px-3 py-2 border border-input rounded-r-md font-mono flex items-center">
                .talentflow.io
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Company Headquarter Address
            </label>
            <input
              type="text"
              value={state.profile.headquarters}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, headquarters: e.target.value },
                }))
              }
              className="w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-ember text-ember-foreground hover:bg-ember/90 font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <Save className="size-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
