import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Upload,
  CheckCircle2,
  Linkedin,
  Github,
  Globe,
  Save,
  Clock,
  Sparkles,
  X,
  Plus,
} from "lucide-react";
import { CandidateProfile } from "../../types/candidate";
import { toast } from "sonner";

interface CandidateProfileViewProps {
  candidate: CandidateProfile;
  onUpdateProfile?: (updated: Partial<CandidateProfile>) => void;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({
  candidate,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(candidate.name);
  const [email, setEmail] = useState(candidate.email);
  const [phone, setPhone] = useState(candidate.phone);
  const [location, setLocation] = useState(candidate.location);
  const [roleTitle, setRoleTitle] = useState(candidate.roleTitle);
  const [department, setDepartment] = useState(candidate.department);
  const [bio, setBio] = useState(
    "Senior software engineer specializing in scalable fullstack web platforms, distributed systems, and modern component architectures.",
  );
  const [skills, setSkills] = useState<string[]>([
    "React 19",
    "TypeScript",
    "Node.js",
    "TailwindCSS",
    "PostgreSQL",
    "GraphQL",
    "Docker",
    "CI/CD",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        email,
        phone,
        location,
        roleTitle,
        department,
      });
    }
    toast.success("Candidate profile updated successfully!");
  };

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full overflow-hidden ring-2 ring-sky-100 dark:ring-sky-950 bg-slate-100 shrink-0">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {name}
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Verified Candidate
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {roleTitle} • {department}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#00c0ef] hover:bg-[#00abdc] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3 h-3" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Left Column: Personal & Contact Info */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3">
            <h3 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current Location / Timezone
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Candidate Bio & Executive Summary
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef]"
              />
            </div>
          </div>

          {/* Skills & Competencies */}
          <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3">
            <h3 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              Core Skills & Technical Competencies
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-[11px] font-medium"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add new skill (e.g. Docker, TypeScript)..."
                className="flex-1 h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef]"
              />
              <button
                type="submit"
                className="h-8 px-3 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Resume & Online Profiles */}
        <div className="space-y-3.5">
          {/* Primary Resume */}
          <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3">
            <h3 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              Primary Resume
            </h3>

            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-md bg-sky-100 dark:bg-sky-900/60 text-[#00c0ef] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                    Alex_Rivera_Resume_2026.pdf
                  </div>
                  <div className="text-[9.5px] text-slate-500">2.4 MB • Uploaded & Verified</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => toast.info("Select updated resume PDF to upload")}
              className="w-full h-8 border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00c0ef] text-slate-600 dark:text-slate-300 hover:text-[#00c0ef] rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Updated Resume</span>
            </button>
          </div>

          {/* Social Profiles */}
          <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3">
            <h3 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              Online Profiles
            </h3>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Linkedin className="w-3 h-3 text-blue-600" />
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  defaultValue="https://linkedin.com/in/alex-rivera-dev"
                  className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Github className="w-3 h-3 text-slate-800 dark:text-slate-200" />
                  GitHub Repository
                </label>
                <input
                  type="text"
                  defaultValue="https://github.com/alexrivera-dev"
                  className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-emerald-600" />
                  Portfolio Website
                </label>
                <input
                  type="text"
                  defaultValue="https://alexrivera.dev"
                  className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
