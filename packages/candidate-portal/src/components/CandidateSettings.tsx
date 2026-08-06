import React, { useState, useEffect } from "react";
import {
  CandidateApiService,
  SettingsBackendService,
  type CandidateSettings as CandidateSettingsType,
} from "@talent-flow/api";
import {
  User,
  Bell,
  Shield,
  FileText,
  Key,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";

interface CandidateSettingsProps {
  onClose?: () => void;
}

type TabType = "profile" | "notifications" | "privacy" | "documents" | "account";

export const CandidateSettingsComponent: React.FC<CandidateSettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const [settings, setSettings] = useState<CandidateSettingsType>(() =>
    CandidateApiService.getSettings(),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SettingsBackendService.fetchCandidateSettings().then((data) => {
      setSettings(data);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await SettingsBackendService.saveCandidateSettings(settings);
    setLoading(false);
    if (res.success) {
      toast.success("Candidate portal settings saved!");
    } else {
      toast.error("Failed to save candidate settings");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lifted space-y-6 font-sans max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-ember uppercase">
            Candidate Portal Backend
          </span>
          <h2 className="text-2xl font-display font-bold text-foreground mt-0.5">
            Candidate Account & Preferences
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal profile, notification preferences, privacy visibility and
            documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              Back to Portal
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-ember text-ember-foreground hover:bg-ember/90 font-medium text-xs px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Save className="size-3.5" />
            <span>{loading ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {[
          { id: "profile", label: "Profile Details", icon: User },
          { id: "notifications", label: "Job & Stage Alerts", icon: Bell },
          { id: "privacy", label: "Privacy & Visibility", icon: Eye },
          { id: "documents", label: "Resumes & Documents", icon: FileText },
          { id: "account", label: "Account Security", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-ember text-ember-foreground shadow-xs"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile Details */}
      {activeTab === "profile" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">
                Full Candidate Name
              </label>
              <input
                type="text"
                value={settings.profile.fullName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, fullName: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, email: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.profile.phone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, phone: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">
                Current Location
              </label>
              <input
                type="text"
                value={settings.profile.location}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, location: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={settings.profile.linkedinUrl}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, linkedinUrl: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">
                GitHub / Portfolio URL
              </label>
              <input
                type="text"
                value={settings.profile.githubUrl}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, githubUrl: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-muted-foreground font-medium mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={settings.profile.headline}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, headline: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-muted-foreground font-medium mb-1">Summary / Bio</label>
              <textarea
                rows={3}
                value={settings.profile.bio}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value },
                  }))
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface cursor-pointer">
            <div>
              <p className="font-semibold text-foreground">Application Stage Updates</p>
              <p className="text-[11px] text-muted-foreground">
                Receive emails when your application advances or moves to interview stage.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailStageUpdates}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailStageUpdates: e.target.checked },
                }))
              }
              className="accent-ember size-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface cursor-pointer">
            <div>
              <p className="font-semibold text-foreground">Interview Invitation Alerts</p>
              <p className="text-[11px] text-muted-foreground">
                Get notified when recruiters issue interview slot links or calendar invites.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailInterviewInvites}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailInterviewInvites: e.target.checked },
                }))
              }
              className="accent-ember size-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface cursor-pointer">
            <div>
              <p className="font-semibold text-foreground">SMS Reminder Messages</p>
              <p className="text-[11px] text-muted-foreground">
                Receive SMS reminders 2 hours before scheduled interview sessions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.smsReminders}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, smsReminders: e.target.checked },
                }))
              }
              className="accent-ember size-4"
            />
          </label>
        </div>
      )}

      {/* TAB 3: Privacy */}
      {activeTab === "privacy" && (
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface cursor-pointer">
            <div>
              <p className="font-semibold text-foreground">"Open to Opportunities" Status</p>
              <p className="text-[11px] text-muted-foreground">
                Show recruiters that you are actively interviewing and open to offers.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.openToWork}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  privacy: { ...prev.privacy, openToWork: e.target.checked },
                }))
              }
              className="accent-ember size-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface cursor-pointer">
            <div>
              <p className="font-semibold text-foreground">Anonymous Screening Opt-In</p>
              <p className="text-[11px] text-muted-foreground">
                Anonymize your name and photo during initial recruiter resume parsing.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.anonymousScreeningOptIn}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  privacy: { ...prev.privacy, anonymousScreeningOptIn: e.target.checked },
                }))
              }
              className="accent-ember size-4"
            />
          </label>
        </div>
      )}

      {/* TAB 4: Documents */}
      {activeTab === "documents" && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-muted-foreground font-medium mb-1">
              Primary Resume File Name
            </label>
            <input
              type="text"
              value={settings.documents.primaryResumeName}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  documents: { ...prev.documents, primaryResumeName: e.target.value },
                }))
              }
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">
              Portfolio & Project Link
            </label>
            <input
              type="text"
              value={settings.documents.portfolioUrl}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  documents: { ...prev.documents, portfolioUrl: e.target.value },
                }))
              }
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-ember"
            />
          </div>
        </div>
      )}

      {/* TAB 5: Account & Security */}
      {activeTab === "account" && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-lg border border-border bg-surface flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Two-Factor Authentication (MFA)</p>
              <p className="text-[11px] text-muted-foreground">
                Secure your candidate portal account with an authenticator app.
              </p>
            </div>
            <button
              onClick={() => {
                const nextMfa = !settings.account.mfaEnabled;
                setSettings((prev) => ({
                  ...prev,
                  account: { ...prev.account, mfaEnabled: nextMfa },
                }));
                toast.success(nextMfa ? "MFA enabled for candidate portal" : "MFA disabled");
              }}
              className="px-3 py-1 rounded bg-ember text-ember-foreground font-medium cursor-pointer"
            >
              {settings.account.mfaEnabled ? "Enabled" : "Enable MFA"}
            </button>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-surface flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Password Credentials</p>
              <p className="text-[11px] text-muted-foreground">
                Last updated: {settings.account.passwordLastChanged}
              </p>
            </div>
            <button
              onClick={() => toast.info("Password reset instructions sent to your email")}
              className="px-3 py-1 rounded bg-surface border border-border text-foreground hover:bg-accent cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
