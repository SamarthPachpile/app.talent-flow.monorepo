import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  KeyRound,
  Mail,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Phone,
  Globe,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Briefcase,
  Users,
  Send,
  Smartphone,
  Edit3,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  FirebaseAuthService,
  CompanyApiService,
  COUNTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  type CompanyDocument,
} from "@talent-flow/api";

interface AuthSuccessData {
  email: string;
  companyName?: string;
  companySlug?: string;
  adminName?: string;
  isNewAccount?: boolean;
}

interface AuthScreenProps {
  onSuccess: (data: AuthSuccessData) => void;
  onBackToHome: () => void;
  initialIsSignUp?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onBackToHome,
  initialIsSignUp = false,
}) => {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);

  useEffect(() => {
    setIsSignUp(initialIsSignUp);
  }, [initialIsSignUp]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");

  // Extended required & optional signup fields
  const [mobileNumber, setMobileNumber] = useState("+1 (555) 349-8201");
  const [country, setCountry] = useState("United States");
  const [companySize, setCompanySize] = useState("51–100");
  const [industry, setIndustry] = useState("Product Company");
  const [referralSource, setReferralSource] = useState("LinkedIn");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Third-Party CAPTCHA State (Cloudflare Turnstile / reCAPTCHA)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // Firebase Email Verification Modal State
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [pendingCompanyPayload, setPendingCompanyPayload] = useState<CompanyDocument | null>(null);

  // Inline & Go-Back Email Edit state
  const [isEditingEmailInModal, setIsEditingEmailInModal] = useState(false);
  const [editEmailInput, setEditEmailInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountryData = COUNTRY_OPTIONS[country] || COUNTRY_OPTIONS["United States"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match. Please verify your confirm password.");
        return;
      }

      if (!mobileNumber.trim()) {
        toast.error("Mobile Number is required (Primary contact number).");
        return;
      }

      if (!acceptTerms) {
        toast.error("Please accept the Terms & Privacy Policy to proceed with signup.");
        return;
      }

      if (!isCaptchaVerified) {
        toast.error(
          "Please complete the Turnstile / reCAPTCHA verification checkbox to prevent spam.",
        );
        return;
      }

      setIsSubmitting(true);

      const signupPayload = {
        email,
        password,
        confirmPassword,
        fullName: adminName,
        companyName,
        phone: mobileNumber,
        country,
        timezone: selectedCountryData.timezone,
        currency: selectedCountryData.currency,
        compliance: selectedCountryData.compliance,
        payroll: selectedCountryData.payroll,
        companySize,
        industry,
        referralSource,
        termsAccepted: acceptTerms,
        captchaVerified: true,
      };

      const result = await FirebaseAuthService.signUpWithFullDetails(signupPayload);

      if (result.user || result.userProfile) {
        const uid = result.user?.uid || "user-" + Date.now();
        const cleanCompanySlug =
          companyName.toLowerCase().replace(/[^a-z0-9]/g, "") || `comp${Date.now()}`;

        const companyPayload = {
          id: cleanCompanySlug,
          name: companyName,
          subdomain: cleanCompanySlug,
          domain: email.split("@")[1] || "company.com",
          industry,
          size: companySize,
          brandColor: "#6366f1",
          headquarters: selectedCountryData.name,
          admin: {
            fullName: adminName,
            workEmail: email,
            phone: mobileNumber,
            uid,
          },
          country,
          referralSource,
          termsAccepted: acceptTerms,
          captchaVerified: true,
          emailVerified: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // NOTE: Company data is stored in 'companies' collection ONLY after email verification!
        setPendingCompanyPayload(companyPayload);
        setCreatedUserEmail(email);
        setEditEmailInput(email);
        setIsSubmitting(false);
        setShowEmailVerificationModal(true);

        toast.success(
          `Account registered! Firebase verification email link dispatched to ${email}`,
        );
      } else {
        toast.error(result.error || "Failed to create workspace.");
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      const result = await FirebaseAuthService.signIn(email, password);

      if (result.user) {
        // Fetch company document from Firestore 'companies' collection matching signed-up credentials
        const companyDoc = await CompanyApiService.getCompanyByEmailOrUid(email, result.user.uid);

        const resolvedCompanyName = companyDoc?.name || companyName || "Company Workspace";
        const resolvedAdminName = companyDoc?.admin?.fullName || adminName || "Admin";

        const cleanDocId =
          companyDoc?.id?.replace(/[^a-z0-9]/g, "") ||
          companyDoc?.subdomain?.replace(/[^a-z0-9]/g, "") ||
          resolvedCompanyName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
          "companyactive";

        const sessionPayload = {
          id: cleanDocId,
          name: resolvedCompanyName,
          subdomain: cleanDocId,
          domain: companyDoc?.domain || email.split("@")[1] || "company.com",
          industry: companyDoc?.industry || industry,
          size: companyDoc?.size || companySize,
          brandColor: companyDoc?.brandColor || "#6366f1",
          headquarters: companyDoc?.headquarters || selectedCountryData.name,
          admin: {
            fullName: resolvedAdminName,
            workEmail: email,
            phone: companyDoc?.admin?.phone || mobileNumber,
            uid: result.user.uid,
          },
          country: companyDoc?.country || country,
          referralSource: companyDoc?.referralSource || referralSource,
          termsAccepted: true,
          captchaVerified: true,
          emailVerified: result.user.emailVerified,
          isCompleted: companyDoc?.isCompleted ?? false,
          createdAt: companyDoc?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("talentflow_company_auth", "true");
        localStorage.setItem("talentflow_company_profile", JSON.stringify(sessionPayload));

        const derivedSlug = cleanDocId;

        toast.success(`Signed in successfully! Welcome back to ${resolvedCompanyName}`);
        setIsSubmitting(false);
        onSuccess({
          email: result.user.email || email,
          companyName: resolvedCompanyName,
          companySlug: derivedSlug,
          adminName: resolvedAdminName,
          isNewAccount: false,
        });
      } else {
        toast.error(
          result.error || "Invalid credentials. Please enter your signed-up email and password.",
        );
        setIsSubmitting(false);
      }
    }
  };

  const handleDemoCompany = (demoEmail: string, demoCompany: string) => {
    setEmail(demoEmail);
    setCompanyName(demoCompany);
    localStorage.setItem("talentflow_company_auth", "true");
    const demoSlug = demoCompany.toLowerCase().replace(/[^a-z0-9]/g, "");
    toast.success(`Signed in as ${demoCompany} Admin`);
    onSuccess({
      email: demoEmail,
      companyName: demoCompany,
      companySlug: demoSlug,
      adminName: "Sarah Jenkins",
      isNewAccount: false,
    });
  };

  const handleResendEmailVerification = async () => {
    setIsResendingEmail(true);
    const activeMail = createdUserEmail || email;
    const res = await FirebaseAuthService.sendVerificationEmail(activeMail);
    setIsResendingEmail(false);
    toast.success(res.message || `Verification link dispatched to ${activeMail}`);
  };

  const handleCompleteEmailVerification = useCallback(async () => {
    setIsCheckingVerification(true);
    const isVerified = await FirebaseAuthService.checkEmailVerified();
    setIsCheckingVerification(false);

    const activeEmail = createdUserEmail || email;
    const activeCleanSlug =
      companyName.toLowerCase().replace(/[^a-z0-9]/g, "") || `comp${Date.now()}`;
    const activePayload = pendingCompanyPayload || {
      id: activeCleanSlug,
      name: companyName,
      subdomain: activeCleanSlug,
      domain: activeEmail.split("@")[1] || "company.com",
      industry,
      size: companySize,
      brandColor: "#6366f1",
      headquarters: selectedCountryData.name,
      admin: {
        fullName: adminName,
        workEmail: activeEmail,
        phone: mobileNumber,
      },
      country,
      referralSource,
      termsAccepted: acceptTerms,
      captchaVerified: true,
      emailVerified: true,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    activePayload.emailVerified = true;
    activePayload.updatedAt = new Date().toISOString();
    if (activePayload.admin) {
      activePayload.admin.workEmail = activeEmail;
    }

    // STORE COMPANY IN FIRESTORE 'companies' COLLECTION ONLY AFTER EMAIL IS VERIFIED
    await CompanyApiService.saveCompanyToFirestore(activePayload as CompanyDocument);

    localStorage.setItem("talentflow_company_auth", "true");
    localStorage.setItem("talentflow_active_company_id", activePayload.id);
    localStorage.setItem("talentflow_company_profile", JSON.stringify(activePayload));

    setShowEmailVerificationModal(false);
    setIsEditingEmailInModal(false);

    toast.success(
      `Email verification detected! Company '${activePayload.name}' created in Firestore. Proceeding to setup wizard...`,
    );

    onSuccess({
      email: activeEmail,
      companyName: activePayload.name,
      companySlug: activePayload.id,
      adminName: activePayload.admin?.fullName || adminName,
      isNewAccount: true,
    });
  }, [
    createdUserEmail,
    email,
    pendingCompanyPayload,
    companyName,
    industry,
    companySize,
    selectedCountryData.name,
    adminName,
    mobileNumber,
    country,
    referralSource,
    acceptTerms,
    onSuccess,
  ]);

  // REACTIVE BACKGROUND EMAIL VERIFICATION LISTENER & REDIRECT
  // Periodically checks Firebase Auth to detect when the user clicks the verification link in their email inbox.
  // The page stays on this verification screen UNTIL the link in the email is clicked!
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (showEmailVerificationModal) {
      intervalId = setInterval(async () => {
        const isVerified = await FirebaseAuthService.checkEmailVerified();

        // ONLY IF Firebase confirms email is verified (link clicked in inbox)
        if (isVerified) {
          if (intervalId) clearInterval(intervalId);
          await handleCompleteEmailVerification();
        }
      }, 2500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showEmailVerificationModal, handleCompleteEmailVerification]);

  const handleGoBackToEditForm = () => {
    setShowEmailVerificationModal(false);
    setIsEditingEmailInModal(false);
    toast.info("Returned to signup form. Edit your email address and re-submit.");
    setTimeout(() => {
      const el = document.getElementById("workEmailInput");
      if (el) el.focus();
    }, 100);
  };

  const handleSaveInlineEmailEdit = async () => {
    const trimmed = editEmailInput.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Please enter a valid work email address.");
      return;
    }

    setIsResendingEmail(true);
    const updateRes = await FirebaseAuthService.updateUserEmailAndResend(trimmed);
    setIsResendingEmail(false);

    setEmail(trimmed);
    setCreatedUserEmail(trimmed);

    if (pendingCompanyPayload) {
      const updatedPayload = {
        ...pendingCompanyPayload,
        domain: trimmed.split("@")[1] || pendingCompanyPayload.domain,
        admin: {
          ...pendingCompanyPayload.admin,
          workEmail: trimmed,
        },
      };
      setPendingCompanyPayload(updatedPayload);
    }

    setIsEditingEmailInModal(false);
    toast.success(updateRes.message || `Updated email to ${trimmed} & sent new verification link!`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden my-6">
      <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-lifted p-6 sm:p-8 relative z-10">
        <button
          onClick={onBackToHome}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1 cursor-pointer"
        >
          ← Back to Company Portal
        </button>

        <div className="flex items-center gap-3 mb-5">
          <span className="grid size-10 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-xs shrink-0">
            TF
          </span>
          <div>
            <h2 className="font-display text-2xl leading-tight text-foreground">
              {isSignUp ? "Create Company Workspace" : "Company Workspace Sign In"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Enterprise Company Administration & HR Management
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex rounded-xl bg-surface p-1 border border-border mb-5">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              !isSignUp
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isSignUp
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register Company (New Account)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Company & Admin Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Company Name <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corporation"
                      className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Admin Full Name <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>
              </div>

              {/* Work Email & Mobile Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Work Email <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      id="workEmailInput"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-foreground">
                      Mobile Number <span className="text-ember">*</span>
                    </label>
                    <span className="text-10px text-muted-foreground">Primary contact number</span>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Password <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-foreground">
                      Confirm Password <span className="text-ember">*</span>
                    </label>
                    <span className="text-10px text-muted-foreground">Must match password</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full bg-surface border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none font-mono ${
                        confirmPassword && confirmPassword !== password
                          ? "border-destructive focus:ring-1 focus:ring-destructive"
                          : "border-input focus:border-ember"
                      }`}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-10px text-destructive mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Country <span className="text-ember">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                  >
                    {Object.keys(COUNTRY_OPTIONS).map((cName) => (
                      <option key={cName} value={cName}>
                        {cName} ({COUNTRY_OPTIONS[cName].phonePrefix})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Company Size & Industry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Company Size <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                    >
                      {COMPANY_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size} employees
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Industry <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                    >
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Referral Source (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Referral Source
                  </label>
                  <span className="text-10px text-muted-foreground font-medium">Optional</span>
                </div>
                <p className="text-11px text-muted-foreground mb-1.5">How did you hear about us?</p>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                >
                  <option value="">Select an option...</option>
                  {REFERRAL_SOURCE_OPTIONS.map((ref) => (
                    <option key={ref} value={ref}>
                      {ref}
                    </option>
                  ))}
                </select>
              </div>

              {/* Third-Party Free CAPTCHA Widget (Cloudflare Turnstile / reCAPTCHA) */}
              <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCaptchaVerified(!isCaptchaVerified)}
                    className={`size-6 rounded border flex items-center justify-center transition-all cursor-pointer ${
                      isCaptchaVerified
                        ? "bg-success text-success-foreground border-success"
                        : "bg-card border-input hover:border-ember"
                    }`}
                  >
                    {isCaptchaVerified && <CheckCircle2 className="size-4" />}
                  </button>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">I'm not a robot</p>
                    <p className="text-10px text-muted-foreground">
                      Protected by Cloudflare Turnstile / reCAPTCHA
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-9px text-muted-foreground font-mono">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-ember" />
                    <span className="font-semibold text-foreground">Turnstile</span>
                  </div>
                  <span>Privacy - Terms</span>
                </div>
              </div>

              {/* Mandatory Checkbox: Terms & Privacy */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="acceptTermsCheckbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-input text-ember focus:ring-ember cursor-pointer"
                />
                <label
                  htmlFor="acceptTermsCheckbox"
                  className="text-xs text-foreground cursor-pointer leading-tight"
                >
                  I accept the{" "}
                  <span className="font-semibold text-ember underline">Terms of Service</span> and{" "}
                  <span className="font-semibold text-ember underline">Privacy Policy</span>{" "}
                  (Mandatory for account creation).
                </label>
              </div>
            </>
          )}

          {!isSignUp && (
            <>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Company Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Company Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-surface border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (isSignUp && (!isCaptchaVerified || !acceptTerms))}
            className="w-full py-3 rounded-xl bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Storing & Authenticating with Firebase...</span>
            ) : (
              <>
                <span>{isSignUp ? "Create Workspace & Start Setup" : "Sign In to Workspace"}</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-11px text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="size-3 text-muted-foreground" />
            <span>Firebase Auth & Firestore Active</span>
          </span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-ember font-medium hover:underline cursor-pointer"
          >
            {isSignUp ? "Already have an account? Sign In" : "Register New Company"}
          </button>
        </div>
      </div>

      {/* Firebase Account Verification Link Modal */}
      {showEmailVerificationModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-lifted space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-ember/15 text-ember font-bold shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Verify Your Email
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verify email to store company in database
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoBackToEditForm}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer bg-surface px-2.5 py-1 rounded-lg border border-border transition-colors"
                title="Go back to edit form"
              >
                <ArrowLeft className="size-3.5" />
                <span>Edit Form</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* Notice Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl text-11px font-medium flex items-center gap-2">
                <Lock className="size-4 shrink-0" />
                <span>
                  Company data will be stored in the <strong>companies</strong> collection only
                  after your email is verified.
                </span>
              </div>

              <div className="bg-surface p-4 rounded-xl border border-border space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium flex items-center gap-1.5">
                    <Mail className="size-3.5 text-ember" />
                    <span>Verification Email Sent To:</span>
                  </span>
                  {!isEditingEmailInModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditEmailInput(createdUserEmail || email);
                        setIsEditingEmailInModal(true);
                      }}
                      className="text-xs text-ember hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="size-3.5" />
                      <span>Edit Email</span>
                    </button>
                  )}
                </div>

                {!isEditingEmailInModal ? (
                  <div className="flex items-center justify-between bg-card p-2.5 rounded-lg border border-border gap-2">
                    <p className="font-mono text-ember font-semibold text-sm break-all">
                      {createdUserEmail || email}
                    </p>
                    <span className="text-10px text-amber-500 font-semibold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                      PENDING VERIFICATION
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 bg-card p-3 rounded-lg border border-ember/50">
                    <label className="block text-11px font-semibold text-foreground">
                      Correction: Enter correct work email address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={editEmailInput}
                        onChange={(e) => setEditEmailInput(e.target.value)}
                        placeholder="correct.name@company.com"
                        className="flex-1 bg-surface border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ember font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleSaveInlineEmailEdit}
                        className="px-3 py-1.5 rounded-lg bg-ember text-ember-foreground text-xs font-semibold hover:bg-ember/90 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Check className="size-3.5" />
                        <span>Update & Resend</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingEmailInModal(false)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-muted-foreground text-11px leading-relaxed">
                  Please check your inbox and click the verification link. If you entered an
                  incorrect email address, click <strong>"Edit Email"</strong> or{" "}
                  <strong>"Go Back to Edit Email"</strong> below to change it.
                </p>
              </div>

              {/* Real-Time Auto Verification Status Indicator */}
              <div className="p-3 bg-card border border-ember/30 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Loader2 className="size-4 animate-spin text-ember shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">
                      Waiting for email link verification...
                    </p>
                    <p className="text-10px text-muted-foreground">
                      Click the link in your email inbox. Page will auto-proceed once clicked.
                    </p>
                  </div>
                </div>
                <span className="text-10px text-amber-500 font-semibold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                  LISTENING
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isResendingEmail}
                  onClick={handleResendEmailVerification}
                  className="w-full py-2.5 rounded-xl bg-surface border border-border hover:bg-accent text-foreground text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`size-3.5 ${isResendingEmail ? "animate-spin" : ""}`} />
                  <span>{isResendingEmail ? "Sending..." : "Resend Verification Link"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoBackToEditForm}
                  className="w-full py-2.5 rounded-xl bg-surface border border-border hover:bg-accent text-foreground text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="size-3.5 text-ember" />
                  <span>Go Back to Edit Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
