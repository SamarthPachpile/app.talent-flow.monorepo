import React, { useState, useMemo } from "react";
import {
  User,
  Phone,
  Globe,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Mail,
  CheckCircle,
  Upload,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { CandidateApiService, CandidateDocument } from "@talent-flow/api";

interface CandidateOnboardingWizardProps {
  candidateData: Partial<CandidateDocument>;
  onComplete: (completedCandidate: CandidateDocument) => void;
}

export const CandidateOnboardingWizard: React.FC<CandidateOnboardingWizardProps> = ({
  candidateData,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // Retrieve fallback saved candidate details from localStorage if candidateData is partial
  const savedProfile = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("talentflow_candidate_profile");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return {};
  }, []);

  // Step 1: Pre-populate from signup / authentication details
  const initialFullName = candidateData.fullName || savedProfile.fullName || "";
  const initialPhone = candidateData.phone || savedProfile.phone || "";
  const initialEmail = candidateData.email || savedProfile.email || "";
  const initialCountry = candidateData.country || savedProfile.country || "";

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [email] = useState(initialEmail);
  const [country, setCountry] = useState(initialCountry);
  const [bio, setBio] = useState(candidateData.bio || savedProfile.bio || "");

  // Step 2: Resume Details
  const [experienceYears, setExperienceYears] = useState(
    candidateData.experienceYears || savedProfile.experienceYears || "3-5 Years",
  );
  const [skillsInput, setSkillsInput] = useState(
    candidateData.skills?.join(", ") || savedProfile.skills?.join(", ") || "",
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    candidateData.linkedinUrl || savedProfile.linkedinUrl || "",
  );
  const [githubUrl, setGithubUrl] = useState(
    candidateData.githubUrl || savedProfile.githubUrl || "",
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    candidateData.portfolioUrl || savedProfile.portfolioUrl || "",
  );
  const [resumeFileName, setResumeFileName] = useState(
    candidateData.resumeFileName || savedProfile.resumeFileName || "Candidate_Resume.pdf",
  );
  const [resumeSummary, setResumeSummary] = useState(savedProfile.resumeSummary || "");

  // Step 3: Education & Experience
  const [degree, setDegree] = useState(
    candidateData.education?.degree || savedProfile.education?.degree || "",
  );
  const [institution, setInstitution] = useState(
    candidateData.education?.institution || savedProfile.education?.institution || "",
  );
  const [graduationYear, setGraduationYear] = useState(
    candidateData.education?.graduationYear || savedProfile.education?.graduationYear || "",
  );

  // Step 4: Notifications & Launch
  const [emailStageUpdates, setEmailStageUpdates] = useState(true);
  const [emailInterviewInvites, setEmailInterviewInvites] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      toast.success(`Attached resume: ${file.name}`);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!fullName.trim() || !phone.trim()) {
        toast.error("Full Name and Mobile Phone Number are required.");
        return;
      }
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const cleanDocId = (candidateData.id || email || fullName)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const skillsArray = skillsInput
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const completedDoc: CandidateDocument = {
      id: cleanDocId || `candidate_${Date.now()}`,
      fullName,
      email,
      phone,
      country,
      currency: candidateData.currency || savedProfile.currency || "USD ($)",
      compliance: candidateData.compliance || savedProfile.compliance || "US-SOX Compliance",
      payroll: candidateData.payroll || savedProfile.payroll || "Standard Payroll",
      companySize: "N/A",
      industry: "Candidate Profile",
      referralSource: "Direct Application",
      uid: candidateData.uid || savedProfile.uid || cleanDocId,
      isCompleted: true, // Setup wizard complete!
      currentStageId: "application",
      experienceYears,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resumeFileName,
      skills: skillsArray,
      bio,
      education: {
        degree,
        institution,
        graduationYear,
      },
      notificationPreferences: {
        emailStageUpdates,
        emailInterviewInvites,
        smsReminders,
      },
      createdAt: candidateData.createdAt || savedProfile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await CandidateApiService.saveCandidateToFirestore(completedDoc);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Candidate profile & setup saved to Firestore 'candidates' collection!");
      onComplete(completedDoc);
    } else {
      toast.error("Failed to save candidate setup.");
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ember/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-lifted p-6 sm:p-10 relative z-10 space-y-8 my-auto">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-ember text-ember-foreground font-bold text-base shadow-xs shrink-0">
              TF
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                  Candidate Setup Wizard
                </h1>
                <span className="text-[10px] bg-ember/15 text-ember border border-ember/30 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <Sparkles className="size-3" /> Step {currentStep} of {totalSteps}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete your candidate profile to track your application and hiring roadmap
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-ember">{progressPercent}% Completed</span>
            <div className="w-36 h-2 bg-surface rounded-full overflow-hidden border border-border mt-1">
              <div
                className="h-full bg-ember transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, label: "1. Personal Profile", icon: User },
            { step: 2, label: "2. Resume Details", icon: FileText },
            { step: 3, label: "3. Education", icon: GraduationCap },
            { step: 4, label: "4. Final Review", icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = currentStep === item.step;
            const isDone = currentStep > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  if (isDone) setCurrentStep(item.step);
                }}
                disabled={!isDone && !isCurrent}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? "bg-ember text-ember-foreground border-ember shadow-xs font-semibold"
                    : isDone
                      ? "bg-ember/10 text-ember border-ember/30"
                      : "bg-surface text-muted-foreground border-border opacity-60 cursor-not-allowed"
                }`}
              >
                <Icon className="size-4" />
                <span className="text-[11px] truncate hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step 1: Personal Profile */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="size-5 text-ember" /> Personal Profile & Contact Details
              </h2>
              <span className="text-[10px] font-semibold text-success bg-success/15 border border-success/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="size-3" /> Pre-filled from Verified Registration
              </span>
            </div>

            {/* Verified Contact Info Box */}
            <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Legal Full Name <span className="text-ember">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2 rounded-xl bg-card border border-input text-foreground text-xs focus:outline-none focus:border-ember"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Mobile / Contact Phone <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-card border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Verified Account Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-card/60 border border-border text-ember text-xs font-mono font-semibold cursor-not-allowed opacity-90"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-card border border-input text-foreground text-xs focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Candidate Bio & Professional Headline
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your expertise & technical background..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        )}

        {/* Step 2: Resume Details */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="size-5 text-ember" /> Resume & Professional Details
            </h2>

            {/* Resume Upload / File Display Card */}
            <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-ember/10 border border-ember/30 text-ember shrink-0">
                    <Paperclip className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Uploaded Resume Document
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground">{resumeFileName}</p>
                  </div>
                </div>
                <label className="px-3 py-1.5 rounded-lg bg-card border border-border hover:border-ember text-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                  <Upload className="size-3.5 text-ember" />
                  <span>Update Resume</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Resume Highlights / Key Experience Summary
                </label>
                <textarea
                  rows={2}
                  value={resumeSummary}
                  onChange={(e) => setResumeSummary(e.target.value)}
                  placeholder="Key highlights from your resume (e.g. 5+ years building distributed React/Node systems)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-input text-foreground text-xs focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Years of Professional Experience
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember cursor-pointer"
                >
                  <option value="0-2 Years">0-2 Years (Junior)</option>
                  <option value="3-5 Years">3-5 Years (Mid-level)</option>
                  <option value="5-8 Years">5-8 Years (Senior)</option>
                  <option value="8+ Years">8+ Years (Staff / Lead)</option>
                  <option value="12+ Years">12+ Years (Principal / Exec)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Technical Core Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="TypeScript, React, Node.js, Go, AWS..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="size-5 text-ember" /> Education & Academic History
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Highest Degree Earned
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.S. Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  College / University Institution
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="2018"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
              />
            </div>
          </div>
        )}

        {/* Step 4: Summary & Final Submission */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-ember" /> Final Profile Confirmation & Firestore
              Submit
            </h2>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Candidate Name:</span>
                <span className="font-semibold text-foreground">{fullName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Account Email:</span>
                <span className="font-mono text-ember font-semibold">{email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Attached Resume:</span>
                <span className="font-mono text-foreground font-semibold">{resumeFileName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Experience Level:</span>
                <span className="font-semibold text-foreground">{experienceYears}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Core Skills:</span>
                <span className="font-mono text-foreground font-semibold">
                  {skillsInput || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Firestore Collection:</span>
                <span className="font-mono text-ember font-bold bg-ember/15 px-2 py-0.5 rounded border border-ember/30">
                  db/candidates/{fullName.toLowerCase().replace(/[^a-z0-9]/g, "")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailStageUpdates}
                  onChange={(e) => setEmailStageUpdates(e.target.checked)}
                  className="rounded text-ember focus:ring-ember cursor-pointer"
                />
                <span>Receive instant email notifications on candidate stage transitions</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailInterviewInvites}
                  onChange={(e) => setEmailInterviewInvites(e.target.checked)}
                  className="rounded text-ember focus:ring-ember cursor-pointer"
                />
                <span>Receive interview calendar invites & schedule updates</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsReminders}
                  onChange={(e) => setSmsReminders(e.target.checked)}
                  className="rounded text-ember focus:ring-ember cursor-pointer"
                />
                <span>Receive SMS interview & document submission reminders</span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-border bg-surface text-foreground hover:bg-accent text-xs font-semibold disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-ember text-ember-foreground text-xs font-semibold shadow-xs hover:bg-ember/90 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-ember text-ember-foreground text-xs font-bold shadow-lifted hover:bg-ember/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" />
              <span>
                {isSubmitting ? "Saving to Firestore..." : "Complete Setup & Launch Dashboard"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
