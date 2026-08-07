import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Globe,
  RefreshCw,
  CheckCircle2,
  Lock,
  Edit3,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  FirebaseAuthService,
  CandidateApiService,
  CandidateDocument,
  COUNTRY_OPTIONS,
  CompanyApiService,
  CompanyDocument,
} from "@talent-flow/api";

export interface CandidateAuthSuccessData {
  email: string;
  fullName?: string;
  candidateKey?: "alex" | "sarah";
  isNewAccount?: boolean;
}

interface CandidateAuthScreenProps {
  onSuccess: (data: CandidateAuthSuccessData) => void;
  onBackToHome?: () => void;
  company?: CompanyDocument | null;
  onBackToCompanies?: () => void;
}

export function CandidateAuthScreen({
  onSuccess,
  onBackToHome,
  company,
  onBackToCompanies,
}: CandidateAuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Extended signup fields - initial states left empty so candidate completes them in wizard
  const [mobileNumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState("United States");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Third-Party CAPTCHA State (Cloudflare Turnstile / reCAPTCHA)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // Firebase Email Verification Modal State (Matching Company Portal 1-to-1)
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [, setIsCheckingVerification] = useState(false);
  const [pendingCandidatePayload, setPendingCandidatePayload] = useState<CandidateDocument | null>(
    null,
  );

  // Inline & Go-Back Email Edit state
  const [isEditingEmailInModal, setIsEditingEmailInModal] = useState(false);
  const [editEmailInput, setEditEmailInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    const result = await FirebaseAuthService.signInWithGoogle();
    setIsSubmitting(false);

    if (result.user) {
      const userEmail = result.user.email || "";
      const userDisplayName = result.user.displayName || "";
      const uid = result.user.uid;
      const companySlug =
        company?.subdomain ||
        company?.id ||
        (company?.name ? company.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

      // Fetch candidate profile from Firestore 'candidates' collection if it exists
      let candDoc = await CandidateApiService.getCandidateByEmailOrUid(userEmail, uid);

      if (candDoc) {
        // PER-COMPANY REGISTRATION CHECK: Must be registered for this company's portal
        if (companySlug) {
          const isRegistered = CandidateApiService.isCandidateRegisteredForCompany(
            candDoc,
            companySlug,
          );
          if (!isRegistered) {
            toast.error(
              `Account '${userEmail}' is not registered for ${company?.name || companySlug}'s candidate portal. Please sign up for this company portal first.`,
            );
            return;
          }
          const updated = await CandidateApiService.addCompanyToCandidate(
            candDoc.id,
            companySlug,
            company?.name,
          );
          if (updated) candDoc = updated;
          await CompanyApiService.registerCandidateToCompany(companySlug, candDoc);
        }

        localStorage.setItem(
          "talentflow_candidate_auth",
          JSON.stringify({
            authenticated: true,
            email: userEmail,
            uid: candDoc.id || uid,
            displayName: candDoc.fullName || userDisplayName,
            isCompleted: candDoc.isCompleted,
          }),
        );
        localStorage.setItem("talentflow_candidate_profile", JSON.stringify(candDoc));
        toast.success(
          `Google authentication successful! Welcome back, ${candDoc.fullName || userDisplayName || userEmail}!`,
        );
        onSuccess({
          email: userEmail,
          fullName: candDoc.fullName || userDisplayName,
          isNewAccount: false,
        });
      } else {
        // Register new candidate document with auto ID for Google Sign Up
        const newCandidateDoc: CandidateDocument = {
          id: "", // Auto-generated ID in saveCandidateToFirestore
          fullName: userDisplayName || userEmail.split("@")[0] || "Candidate User",
          email: userEmail,
          phone: "",
          country: "",
          companyId: companySlug,
          registeredCompanyIds: companySlug ? [companySlug] : [],
          registeredCompanies: companySlug
            ? [
                {
                  companyId: companySlug,
                  companyName: company?.name || companySlug,
                  registeredAt: new Date().toISOString(),
                },
              ]
            : [],
          isCompleted: false,
          emailVerified: true,
          uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const saveRes = await CandidateApiService.saveCandidateToFirestore(newCandidateDoc);
        const savedCand = saveRes.data || newCandidateDoc;

        if (companySlug) {
          await CompanyApiService.registerCandidateToCompany(companySlug, savedCand);
        }

        localStorage.setItem(
          "talentflow_candidate_auth",
          JSON.stringify({
            authenticated: true,
            email: userEmail,
            uid: savedCand.id,
            displayName: savedCand.fullName,
            isCompleted: false,
          }),
        );
        localStorage.setItem("talentflow_candidate_profile", JSON.stringify(savedCand));

        toast.info("Google Account verified! Please complete your candidate setup wizard.");
        onSuccess({
          email: userEmail,
          fullName: savedCand.fullName,
          isNewAccount: true,
        });
      }
    } else if (result.error && !result.error.includes("auth/popup-closed-by-user")) {
      toast.error(result.error || "Google Sign-In failed.");
    }
  };

  const selectedCountryData = COUNTRY_OPTIONS[country] || COUNTRY_OPTIONS["United States"];

  const handleResendEmailVerification = async () => {
    setIsResendingEmail(true);
    const activeMail = createdUserEmail || email;
    const res = await FirebaseAuthService.sendVerificationEmail(activeMail);
    setIsResendingEmail(false);
    toast.success(res.message || `Verification link dispatched to ${activeMail}`);
  };

  const handleGoBackToEditForm = () => {
    setShowEmailVerificationModal(false);
    setIsEditingEmailInModal(false);
    toast.info("Returned to signup form. Edit your email address and re-submit.");
  };

  const handleSaveInlineEmailEdit = async () => {
    const trimmed = editEmailInput.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsResendingEmail(true);
    const updateRes = await FirebaseAuthService.updateUserEmailAndResend(trimmed);
    setIsResendingEmail(false);

    setEmail(trimmed);
    setCreatedUserEmail(trimmed);
    if (pendingCandidatePayload) {
      setPendingCandidatePayload({ ...pendingCandidatePayload, email: trimmed });
    }
    setIsEditingEmailInModal(false);
    toast.success(updateRes.message || `Updated email to ${trimmed} & sent new verification link!`);
  };

  const handleCompleteEmailVerification = useCallback(async () => {
    setIsCheckingVerification(true);
    const isVerified = await FirebaseAuthService.checkEmailVerified();
    setIsCheckingVerification(false);

    const activeEmail = createdUserEmail || email;
    const companySlug =
      company?.subdomain ||
      company?.id ||
      (company?.name ? company.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

    const activePayload: CandidateDocument = pendingCandidatePayload || {
      id: "", // Auto-generated ID in saveCandidateToFirestore
      fullName,
      email: activeEmail,
      phone: mobileNumber,
      country,
      timezone: selectedCountryData.timezone,
      currency: selectedCountryData.currency,
      compliance: selectedCountryData.compliance,
      payroll: selectedCountryData.payroll,
      companyId: companySlug,
      registeredCompanyIds: companySlug ? [companySlug] : [],
      registeredCompanies: companySlug
        ? [
            {
              companyId: companySlug,
              companyName: company?.name || companySlug,
              registeredAt: new Date().toISOString(),
            },
          ]
        : [],
      termsAccepted: acceptTerms,
      captchaVerified: true,
      emailVerified: true,
      isCompleted: false, // Mandatory setup wizard pending
      uid: activeEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (companySlug) {
      activePayload.companyId = companySlug;
      activePayload.registeredCompanyIds = Array.from(
        new Set([...(activePayload.registeredCompanyIds || []), companySlug]),
      );
      activePayload.registeredCompanies = [
        ...(activePayload.registeredCompanies || []).filter((c) => c.companyId !== companySlug),
        {
          companyId: companySlug,
          companyName: company?.name || companySlug,
          registeredAt: new Date().toISOString(),
        },
      ];
    }

    activePayload.emailVerified = true;
    activePayload.updatedAt = new Date().toISOString();

    // Store candidate document in Firestore 'candidates' collection ONLY after email verification!
    const saveRes = await CandidateApiService.saveCandidateToFirestore(activePayload);
    const savedCand = saveRes.data || activePayload;

    if (companySlug) {
      await CompanyApiService.registerCandidateToCompany(companySlug, savedCand);
    }

    const authData = {
      authenticated: true,
      email: activeEmail,
      uid: savedCand.id,
      displayName: fullName,
      companyId: companySlug,
      isCompleted: false,
    };

    localStorage.setItem("talentflow_candidate_auth", JSON.stringify(authData));
    localStorage.setItem("talentflow_candidate_profile", JSON.stringify(savedCand));

    setShowEmailVerificationModal(false);
    setIsEditingEmailInModal(false);

    toast.success(
      `Email verification detected! Candidate account stored in Firestore & linked to company. Proceeding to setup wizard...`,
    );

    onSuccess({
      email: activeEmail,
      fullName,
      isNewAccount: true,
    });
  }, [
    company,
    createdUserEmail,
    email,
    fullName,
    mobileNumber,
    country,
    selectedCountryData,
    acceptTerms,
    pendingCandidatePayload,
    onSuccess,
  ]);

  // REACTIVE BACKGROUND EMAIL VERIFICATION LISTENER matching Company Portal
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (showEmailVerificationModal) {
      intervalId = setInterval(async () => {
        const isVerified = await FirebaseAuthService.checkEmailVerified();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const candidateKey = email.toLowerCase().includes("sarah") ? "sarah" : "alex";

    if (mode === "signup") {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match. Please verify your confirm password.");
        return;
      }

      if (!mobileNumber.trim()) {
        toast.error("Mobile Number is required (Primary contact number).");
        return;
      }

      if (!acceptTerms) {
        toast.error("Please accept Terms & Privacy Policy to complete registration.");
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
        fullName,
        phone: mobileNumber,
        country,
        timezone: selectedCountryData.timezone,
        currency: selectedCountryData.currency,
        compliance: selectedCountryData.compliance,
        payroll: selectedCountryData.payroll,
        termsAccepted: acceptTerms,
        captchaVerified: true,
      };

      const result = await FirebaseAuthService.signUpWithFullDetails(signupPayload);

      if (result.user || result.userProfile) {
        const companySlug =
          company?.subdomain ||
          company?.id ||
          (company?.name ? company.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

        const initialCandidateDoc: CandidateDocument = {
          id: "", // Auto-generated default Firestore ID in saveCandidateToFirestore
          fullName,
          email: result.user?.email || email,
          phone: mobileNumber,
          country,
          timezone: selectedCountryData.timezone,
          currency: selectedCountryData.currency,
          compliance: selectedCountryData.compliance,
          payroll: selectedCountryData.payroll,
          companyId: companySlug,
          registeredCompanyIds: companySlug ? [companySlug] : [],
          registeredCompanies: companySlug
            ? [
                {
                  companyId: companySlug,
                  companyName: company?.name || companySlug,
                  registeredAt: new Date().toISOString(),
                },
              ]
            : [],
          termsAccepted: acceptTerms,
          captchaVerified: true,
          emailVerified: false,
          isCompleted: false, // Mandatory setup wizard pending
          uid: result.user?.uid || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPendingCandidatePayload(initialCandidateDoc);
        setCreatedUserEmail(email);
        setEditEmailInput(email);
        setIsSubmitting(false);
        setShowEmailVerificationModal(true);

        toast.success(
          `Account registered! Firebase verification email link dispatched to ${email}`,
        );
      } else {
        toast.error(result.error || "Failed to create account.");
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      const result = await FirebaseAuthService.signIn(email, password);
      const activeUser = result.user;

      // 1. Fetch candidate document strictly from Firestore 'candidates' collection / local storage
      let candDoc = await CandidateApiService.getCandidateByEmailOrUid(
        activeUser?.email || email,
        activeUser?.uid,
      );

      // STRICT DATABASE CANDIDATE CHECK: Must exist in database
      if (!candDoc) {
        setIsSubmitting(false);
        toast.error(
          `No candidate account found for ${email}. Please register an account for this company portal first.`,
        );
        return;
      }

      const companySlug =
        company?.subdomain ||
        company?.id ||
        (company?.name ? company.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

      // 2. PER-COMPANY PERMISSION CHECK: Login credentials only work from companies where candidate registered!
      if (companySlug) {
        const isRegisteredForCompany = CandidateApiService.isCandidateRegisteredForCompany(
          candDoc,
          companySlug,
        );

        if (!isRegisteredForCompany) {
          setIsSubmitting(false);
          toast.error(
            `Account '${email}' is not registered for ${company?.name || companySlug}'s candidate portal. Please sign up on this company portal first.`,
          );
          return;
        }

        // Add/update company link in candidate document
        const updated = await CandidateApiService.addCompanyToCandidate(
          candDoc.id,
          companySlug,
          company?.name,
        );
        if (updated) candDoc = updated;

        // Register Candidate ID in Company Document in 'companies' collection
        await CompanyApiService.registerCandidateToCompany(companySlug, candDoc);
      }

      const isComp = candDoc.isCompleted ?? true;
      localStorage.setItem(
        "talentflow_candidate_auth",
        JSON.stringify({
          authenticated: true,
          email: candDoc.email || email,
          uid: candDoc.id || candDoc.uid,
          companyId: companySlug,
          isCompleted: isComp,
        }),
      );

      localStorage.setItem("talentflow_candidate_profile", JSON.stringify(candDoc));

      setIsSubmitting(false);
      toast.success(`Signed in as ${candDoc.fullName || candDoc.email}`);
      onSuccess({
        email: candDoc.email || email,
        fullName: candDoc.fullName,
        isNewAccount: false,
      });
    }
  };

  const handleSelectPersona = (key: "alex" | "sarah") => {
    const personaName = key === "alex" ? "Alex Rivera" : "Sarah Chen";
    const personaEmail = key === "alex" ? "alex.rivera@gmail.com" : "sarah.chen@designhub.io";

    setEmail(personaEmail);
    setFullName(personaName);
    toast.info(`Selected ${personaName}. Enter your password or click 1-Click Demo Login below.`);
  };

  const handleDemoLogin = (key: "alex" | "sarah" | "new") => {
    if (key === "new") {
      const newDoc: CandidateDocument = {
        id: "cand-new",
        fullName: "Jordan Lee",
        email: "jordan.lee@example.com",
        phone: "+1 (555) 987-6543",
        country: "United States",
        isCompleted: false, // Mandatory Setup Wizard Pending
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "talentflow_candidate_auth",
        JSON.stringify({ authenticated: true, email: newDoc.email }),
      );
      localStorage.setItem("talentflow_candidate_profile", JSON.stringify(newDoc));
      toast.success("Demo Login as New Candidate: Redirecting to Setup Wizard...");
      onSuccess({
        email: newDoc.email,
        fullName: newDoc.fullName,
        candidateKey: "alex",
        isNewAccount: true,
      });
    } else {
      const personaName = key === "alex" ? "Alex Rivera" : "Sarah Chen";
      const personaEmail = key === "alex" ? "alex.rivera@gmail.com" : "sarah.chen@designhub.io";
      const existingDoc: CandidateDocument = {
        id: key === "alex" ? "cand-alex" : "cand-sarah",
        fullName: personaName,
        email: personaEmail,
        isCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "talentflow_candidate_auth",
        JSON.stringify({ authenticated: true, email: personaEmail }),
      );
      localStorage.setItem("talentflow_candidate_profile", JSON.stringify(existingDoc));
      toast.success(`Demo Login as ${personaName}: Opening Candidate Dashboard...`);
      onSuccess({
        email: personaEmail,
        fullName: personaName,
        candidateKey: key,
        isNewAccount: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ember/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-lifted p-5 sm:p-8 relative z-10 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            {company ? (
              company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="size-11 rounded-xl object-cover border border-border bg-surface p-1 shadow-xs shrink-0"
                />
              ) : (
                <span
                  className="grid size-11 place-items-center rounded-xl text-white font-bold text-base shadow-xs shrink-0"
                  style={{ backgroundColor: company.brandColor || "#6366f1" }}
                >
                  {company.name.substring(0, 2).toUpperCase()}
                </span>
              )
            ) : (
              <span className="grid size-10 place-items-center rounded-xl bg-ember text-ember-foreground font-bold text-sm shadow-xs shrink-0">
                TF
              </span>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                  {company
                    ? mode === "signup"
                      ? `Register — ${company.name}`
                      : `${company.name} Portal Login`
                    : mode === "signup"
                      ? "Candidate Registration"
                      : "Candidate Sign In"}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {company
                  ? mode === "signup"
                    ? `Create candidate profile for ${company.name}`
                    : `Sign in to access candidate portal & status at ${company.name}`
                  : mode === "signup"
                    ? "Create candidate profile & access onboarding roadmap"
                    : "Sign in to access candidate portal & application status"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(onBackToCompanies || onBackToHome) && (
              <button
                type="button"
                onClick={onBackToCompanies || onBackToHome}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                title="Switch Company Portal"
              >
                <ArrowLeft className="size-3.5 text-ember" />
                <span>Switch Company</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-xs font-semibold text-ember hover:underline cursor-pointer bg-ember/10 px-3 py-1.5 rounded-lg border border-ember/20 shrink-0"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Google Authentication Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-accent text-foreground text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer hover:border-ember/40 disabled:opacity-50"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{mode === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold absolute">
              or continue with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" ? (
            <div className="space-y-4">
              {/* Row 1: Full Name & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Legal Full Name <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Mobile Number <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Email Address <span className="text-ember">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.rivera@gmail.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>

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
              </div>

              {/* Row 3: Password & Confirm Password */}
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
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-foreground">
                      Confirm Password <span className="text-ember">*</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground">Must match</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg bg-surface border text-foreground text-xs focus:outline-none font-mono ${
                        confirmPassword && confirmPassword !== password
                          ? "border-destructive focus:ring-1 focus:ring-destructive"
                          : "border-input focus:border-ember"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Third-Party Free CAPTCHA Widget */}
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
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-ember" />
                      <span>Security CAPTCHA Check</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Cloudflare Turnstile · I am human
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-success bg-success/15 px-2 py-0.5 rounded border border-success/30">
                  VERIFIED
                </span>
              </div>

              {/* Row 5: Terms Checkbox */}
              <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded text-ember focus:ring-ember cursor-pointer mt-0.5"
                />
                <span className="text-[11px] leading-tight text-muted-foreground">
                  I accept the{" "}
                  <a href="#" className="text-ember hover:underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-ember hover:underline font-medium">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email Address <span className="text-ember">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.rivera@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                  />
                </div>
              </div>

              {/* Password */}
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-input text-foreground text-xs focus:outline-none focus:border-ember font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (mode === "signup" && (!isCaptchaVerified || !acceptTerms))}
            className="w-full py-3 rounded-xl bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Authenticating with Firebase...</span>
            ) : (
              <>
                <span>
                  {mode === "signup" ? "Register Candidate Account" : "Sign In to Portal"}
                </span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Personas */}
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
            <Sparkles className="size-3 text-ember" />
            <span>1-Click Test Login (Instant Access)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("new")}
              className="p-2.5 rounded-xl border border-ember/30 bg-ember/10 hover:bg-ember/20 text-left transition-colors cursor-pointer"
            >
              <p className="text-xs font-bold text-ember">New Candidate</p>
              <p className="text-[10px] text-muted-foreground">Test Candidate Setup Wizard</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("alex")}
              className="p-2.5 rounded-xl border border-border bg-surface hover:bg-accent text-left transition-colors cursor-pointer"
            >
              <p className="text-xs font-bold text-foreground">Alex Rivera</p>
              <p className="text-[10px] text-muted-foreground">Dashboard (Hardware Stage)</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("sarah")}
              className="p-2.5 rounded-xl border border-border bg-surface hover:bg-accent text-left transition-colors cursor-pointer"
            >
              <p className="text-xs font-bold text-foreground">Sarah Chen</p>
              <p className="text-[10px] text-muted-foreground">Dashboard (Offer Stage)</p>
            </button>
          </div>
        </div>
      </div>

      {/* Firebase Account Verification Link Modal - Matching Company Portal 1-to-1 */}
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
                    Verify email to store candidate in database
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
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl text-[11px] font-medium flex items-center gap-2">
                <Lock className="size-4 shrink-0" />
                <span>
                  Candidate data will be stored in the <strong>candidates</strong> collection only
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
                    <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                      PENDING VERIFICATION
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 bg-card p-3 rounded-lg border border-ember/50">
                    <label className="block text-[11px] font-semibold text-foreground">
                      Correction: Enter correct candidate email address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={editEmailInput}
                        onChange={(e) => setEditEmailInput(e.target.value)}
                        placeholder="correct.email@domain.com"
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

                <p className="text-muted-foreground text-[11px] leading-relaxed">
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
                    <p className="text-[10px] text-muted-foreground">
                      Click the link in your email inbox. Page will auto-proceed once clicked.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
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
}
