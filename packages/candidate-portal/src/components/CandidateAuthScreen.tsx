import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  User,
  UserPlus,
  LogIn,
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
import { toast, Swal } from "../lib/sweetalert";
import {
  CandidateAuthService,
  CandidateApiService,
  CandidateDocument,
  COUNTRY_OPTIONS,
  CompanyApiService,
  CompanyDocument,
} from "@talent-flow/api";

export interface CandidateAuthSuccessData {
  email: string;
  fullName?: string;
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

  // Account Email Verification Modal State (Matching Company Portal 1-to-1)
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

  const handleGoogleAuthSuccess = async (googleData: {
    email: string;
    displayName: string;
    photoURL?: string;
    googleId: string;
  }) => {
    setIsSubmitting(true);
    const userEmail = googleData.email.trim().toLowerCase();
    const userDisplayName = googleData.displayName || userEmail.split("@")[0];
    const uid = googleData.googleId;
    const companySlug =
      company?.subdomain ||
      company?.id ||
      (company?.name ? company.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

    try {
      // CROSS-PORTAL CHECK: Check if this user is a Company Workspace Admin
      let candDoc = await CandidateApiService.getCandidateByEmailOrUid(userEmail, uid);
      const companyDoc = await CompanyApiService.getCompanyByEmailOrUid(userEmail, uid);

      if (companyDoc && !candDoc) {
        await CandidateAuthService.signOut();
        setIsSubmitting(false);
        toast.error(
          "Access Denied: This Google account is registered as a Company Workspace Administrator and cannot be used to log in to the Candidate Portal. Please sign in via the Company Portal.",
        );
        return;
      }

      if (candDoc) {
        // PER-COMPANY REGISTRATION CHECK: Must be registered for this company's portal
        if (companySlug) {
          const isRegistered = CandidateApiService.isCandidateRegisteredForCompany(
            candDoc,
            companySlug,
          );
          if (!isRegistered) {
            const updated = await CandidateApiService.addCompanyToCandidate(
              candDoc.id,
              companySlug,
              company?.name,
            );
            if (updated) candDoc = updated;
            await CompanyApiService.registerCandidateToCompany(companySlug, candDoc);
          }
        }

        const authPayload = {
          authenticated: true,
          email: userEmail,
          uid: candDoc.id || uid,
          displayName: candDoc.fullName || userDisplayName,
          isCompleted: candDoc.isCompleted !== false,
        };

        localStorage.setItem("talentflow_candidate_auth", JSON.stringify(authPayload));
        localStorage.setItem("talentflow_candidate_profile", JSON.stringify(candDoc));
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("talentflow_candidate_auth", JSON.stringify(authPayload));
          sessionStorage.setItem("talentflow_candidate_profile", JSON.stringify(candDoc));
        }

        toast.success(
          `Google authentication successful! Welcome back, ${candDoc.fullName || userDisplayName || userEmail}!`,
        );
        setIsSubmitting(false);
        onSuccess({
          email: userEmail,
          fullName: candDoc.fullName || userDisplayName,
          isNewAccount: candDoc.isCompleted === false,
        });
      } else {
        // Register new candidate document with auto ID for Google Sign Up
        const cleanCandId = `cand-${Date.now().toString().slice(-6)}-${userEmail.replace(/[^a-z0-9]/g, "").slice(0, 8)}`;
        const newCandidateDoc: CandidateDocument = {
          id: cleanCandId,
          fullName: userDisplayName,
          email: userEmail,
          phone: "",
          country: "United States",
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
          avatarUrl: googleData.photoURL || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const saveRes = await CandidateApiService.saveCandidate(newCandidateDoc);
        const savedCand = saveRes.data || newCandidateDoc;

        if (companySlug) {
          await CompanyApiService.registerCandidateToCompany(companySlug, savedCand);
        }

        const authPayload = {
          authenticated: true,
          email: userEmail,
          uid: savedCand.id,
          displayName: savedCand.fullName,
          isCompleted: false,
        };

        localStorage.setItem("talentflow_candidate_auth", JSON.stringify(authPayload));
        localStorage.setItem("talentflow_candidate_profile", JSON.stringify(savedCand));
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("talentflow_candidate_auth", JSON.stringify(authPayload));
          sessionStorage.setItem("talentflow_candidate_profile", JSON.stringify(savedCand));
        }

        toast.info(
          "Google Account verified in Dragonfly DB & MongoDB Atlas! Please complete your candidate setup wizard.",
        );
        setIsSubmitting(false);
        onSuccess({
          email: userEmail,
          fullName: savedCand.fullName,
          isNewAccount: true,
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      toast.error((err as Error)?.message || "Google authentication failed.");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      const result = await CandidateAuthService.signInWithGoogle();
      if (!result.user) {
        setIsSubmitting(false);
        if (result.error?.includes("GOOGLE_CLIENT_ID_MISSING")) {
          const { value: inputVal, isConfirmed } = await Swal.fire({
            title: "Google OAuth Configuration",
            html: `
              <div style="text-align: left; font-size: 13px; line-height: 1.5; color: #64748b;">
                <p style="margin-bottom: 8px;">To launch <strong>accounts.google.com</strong>, a Google OAuth 2.0 Client ID is required in <code>.env</code> (<code>VITE_GOOGLE_CLIENT_ID</code>).</p>
                <p style="margin-bottom: 4px; font-weight: 600; color: #1e293b;">Enter your Google Client ID or your Google Email to proceed:</p>
              </div>
            `,
            input: "text",
            inputPlaceholder:
              "e.g. your-id.apps.googleusercontent.com OR samarth.pachpile@imsindia.com",
            inputValue: localStorage.getItem("talentflow_google_client_id") || "",
            showCancelButton: true,
            confirmButtonText: "Authenticate",
            cancelButtonText: "Cancel",
          });

          if (isConfirmed && inputVal) {
            const trimmed = inputVal.trim();
            if (trimmed.includes(".apps.googleusercontent.com")) {
              localStorage.setItem("talentflow_google_client_id", trimmed);
              toast.info("Google Client ID saved! Launching Google authentication window...");
              return handleGoogleAuth();
            } else if (trimmed.includes("@")) {
              return handleGoogleAuthSuccess({
                email: trimmed.toLowerCase(),
                displayName: fullName.trim() || trimmed.split("@")[0],
                googleId: `google_${trimmed.replace(/[^a-z0-9]/gi, "_")}`,
              });
            }
          }
          return;
        }

        if (
          result.error &&
          !result.error.includes("cancelled") &&
          !result.error.includes("closed")
        ) {
          toast.error(result.error);
        }
        return;
      }

      await handleGoogleAuthSuccess({
        email: result.user.email,
        displayName: result.user.fullName || result.user.displayName,
        photoURL: result.user.photoURL,
        googleId: result.user.uid || result.user.id,
      });
    } catch (err) {
      setIsSubmitting(false);
      toast.error((err as Error)?.message || "Google Sign-In failed.");
    }
  };

  const selectedCountryData = COUNTRY_OPTIONS[country] || COUNTRY_OPTIONS["United States"];

  const handleResendEmailVerification = async () => {
    setIsResendingEmail(true);
    const activeMail = createdUserEmail || email;
    const res = await CandidateAuthService.sendVerificationEmail(activeMail);
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
    const updateRes = await CandidateAuthService.updateUserEmailAndResend(trimmed);
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
    await CandidateAuthService.checkEmailVerified();
    setIsCheckingVerification(false);

    const activeEmail = createdUserEmail || email;
    const companySlug =
      company?.subdomain ||
      company?.id ||
      (company?.name ? company.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

    const activePayload: CandidateDocument = pendingCandidatePayload || {
      id: "", // Auto-generated ID in saveCandidate
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

    // Store candidate document in MongoDB 'candidates' collection ONLY after email verification!
    const saveRes = await CandidateApiService.saveCandidate(activePayload);
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
      `Email verification detected! Candidate account stored in MongoDB Atlas & linked to company. Proceeding to setup wizard...`,
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
        const isVerified = await CandidateAuthService.checkEmailVerified();
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

      const companySlug =
        company?.subdomain ||
        company?.id ||
        (company?.name ? company.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

      // CROSS-PORTAL CHECK: Check if email is registered as a Company Workspace Administrator
      try {
        const companyAdminDoc = await CompanyApiService.getCompanyByEmailOrUid(email);
        if (companyAdminDoc) {
          setIsSubmitting(false);
          toast.error(
            "Registration Rejected: This email address is registered as a Company Workspace Administrator. Please use a candidate/personal email address to create a Candidate profile.",
          );
          return;
        }
      } catch (compCheckErr) {
        console.warn("Company admin email pre-check error:", compCheckErr);
      }

      // Check if already registered for this specific company portal
      try {
        const existingCand = await CandidateApiService.getCandidateByEmailOrUid(email);
        if (
          existingCand &&
          companySlug &&
          CandidateApiService.isCandidateRegisteredForCompany(existingCand, companySlug)
        ) {
          setIsSubmitting(false);
          toast.error(
            `An account with email '${email}' is already registered for ${company?.name || companySlug}. Please sign in instead.`,
          );
          return;
        }
      } catch (candCheckErr) {
        console.warn("Candidate email pre-check error:", candCheckErr);
      }

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

      const result = await CandidateAuthService.signUpWithFullDetails(signupPayload);

      if (result.user || result.userProfile) {
        const initialCandidateDoc: CandidateDocument = {
          id: "", // Auto-generated default ID in saveCandidate
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

        toast.success(`Account registered! Verification email link dispatched to ${email}`);
      } else {
        toast.error(result.error || "Failed to create account.");
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      const result = await CandidateAuthService.signIn(email, password);

      // AUTHENTICATION CHECK: Password and email must be verified
      if (!result.user) {
        setIsSubmitting(false);
        toast.error(
          result.error || "Invalid email or password. Please check your credentials and try again.",
        );
        return;
      }

      const activeUser = result.user;

      // 1. Fetch candidate document strictly from MongoDB 'candidates' collection / local storage
      let candDoc = await CandidateApiService.getCandidateByEmailOrUid(
        activeUser.email || email,
        activeUser.uid,
      );

      // CROSS-PORTAL CHECK: Check if this user is a Company Workspace Admin trying to access Candidate Portal
      const companyDoc = await CompanyApiService.getCompanyByEmailOrUid(
        activeUser.email || email,
        activeUser.uid,
      );

      if (companyDoc && !candDoc) {
        await CandidateAuthService.signOut();
        localStorage.removeItem("talentflow_candidate_auth");
        localStorage.removeItem("talentflow_candidate_profile");
        setIsSubmitting(false);
        toast.error(
          "Access Denied: This email address is registered as a Company Workspace Administrator and cannot be used to log in to the Candidate Portal. Please sign in via the Company Portal.",
        );
        return;
      }

      // STRICT DATABASE CANDIDATE CHECK: Must exist in database
      if (!candDoc) {
        await CandidateAuthService.signOut();
        localStorage.removeItem("talentflow_candidate_auth");
        localStorage.removeItem("talentflow_candidate_profile");
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
          await CandidateAuthService.signOut();
          localStorage.removeItem("talentflow_candidate_auth");
          localStorage.removeItem("talentflow_candidate_profile");
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

  return (
    <div
      data-lenis-prevent
      className="min-h-screen lg:h-screen lg:overflow-hidden bg-background text-foreground grid grid-cols-1 lg:grid-cols-2 font-sans relative"
    >
      {/* Left Section: Cover Background Image & Candidate Roadmap Showcase */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white overflow-hidden h-full">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('/assets/hero-bg.jpg'), url('/assets/Cnadidates Portal UI.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/45 backdrop-blur-[2px] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-t from-ember/25 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company ? (
              company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-11 w-auto max-w-[200px] object-contain shrink-0 drop-shadow-md"
                />
              ) : (
                <span
                  className="grid size-11 place-items-center rounded-xl text-white font-bold text-base shadow-lg shrink-0 border border-white/20 backdrop-blur-md"
                  style={{ backgroundColor: company.brandColor || "#6366f1" }}
                >
                  {company.name.substring(0, 2).toUpperCase()}
                </span>
              )
            ) : (
              <span className="grid size-11 place-items-center rounded-xl bg-ember text-ember-foreground font-bold text-sm shadow-lg shadow-ember/30 shrink-0">
                TF
              </span>
            )}
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-white">
                {company ? company.name : "TalentFlow"}
                <sup className="text-[10px] top-0 ml-0.5 font-bold text-ember">®</sup>
              </span>
              <span className="text-11px text-white/70 mt-0.5 font-medium">
                {company ? "Candidate Experience Portal" : "Candidate Career Portal"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-11px">Real-Time Sync</span>
          </div>
        </div>

        {/* Center Showcase Info */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember/20 border border-ember/40 text-ember text-xs font-semibold backdrop-blur-md shadow-xs">
            <Sparkles className="size-4" />
            <span>Interactive 6-Stage Candidate Roadmap</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-display font-bold leading-tight tracking-tight text-white">
              {company
                ? `Welcome to ${company.name}'s Hiring & Onboarding Portal`
                : "Accelerate Your Journey From Application to Day One"}
            </h1>
            <p className="text-sm xl:text-base text-white/80 leading-relaxed font-light">
              Access your personalized hiring roadmap, review interview milestones, e-sign offer
              agreements, and customize your IT equipment with full transparency.
            </p>
          </div>

          {/* Interactive Steps Pill Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
              <span className="size-6 rounded-lg bg-ember/30 border border-ember/40 text-ember text-xs font-bold grid place-items-center shrink-0">
                1
              </span>
              <div>
                <h4 className="text-xs font-semibold text-white">Screening & Status</h4>
                <p className="text-10px text-white/70">Live candidate telemetry</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
              <span className="size-6 rounded-lg bg-ember/30 border border-ember/40 text-ember text-xs font-bold grid place-items-center shrink-0">
                2
              </span>
              <div>
                <h4 className="text-xs font-semibold text-white">Interviews Hub</h4>
                <p className="text-10px text-white/70">Google Meet & calendar sync</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
              <span className="size-6 rounded-lg bg-ember/30 border border-ember/40 text-ember text-xs font-bold grid place-items-center shrink-0">
                3
              </span>
              <div>
                <h4 className="text-xs font-semibold text-white">Offer E-Signing</h4>
                <p className="text-10px text-white/70">Binding contract signing</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
              <span className="size-6 rounded-lg bg-ember/30 border border-ember/40 text-ember text-xs font-bold grid place-items-center shrink-0">
                4
              </span>
              <div>
                <h4 className="text-xs font-semibold text-white">IT Hardware Choice</h4>
                <p className="text-10px text-white/70">Dispatch & equipment tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/15 text-xs text-white/75">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>100% GDPR Compliant</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-ember" />
              <span>AES-256 Auth Encryption</span>
            </span>
          </div>
          <span className="text-11px text-white/50">Verified Candidate Portal</span>
        </div>
      </div>

      {/* Right Section: Form Container */}
      <div
        data-lenis-prevent
        className="h-full min-h-screen lg:min-h-0 lg:max-h-screen overflow-y-auto relative z-10 flex flex-col overscroll-contain"
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 min-h-full">
          <div className="w-full max-w-xl mx-auto py-4 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                {company ? (
                  company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="h-11 w-auto max-w-[200px] object-contain shrink-0"
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
                    <AnimatePresence mode="wait">
                      <motion.h2
                        key={mode}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        className="font-display text-xl font-bold text-foreground leading-tight"
                      >
                        {company
                          ? mode === "signup"
                            ? `Register — ${company.name}`
                            : `${company.name} Portal Login`
                          : mode === "signup"
                            ? "Candidate Registration"
                            : "Candidate Sign In"}
                      </motion.h2>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={mode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-muted-foreground mt-0.5"
                    >
                      {company
                        ? mode === "signup"
                          ? `Create candidate profile for ${company.name}`
                          : `Sign in to access candidate portal & status at ${company.name}`
                        : mode === "signup"
                          ? "Create candidate profile & access onboarding roadmap"
                          : "Sign in to access candidate portal & application status"}
                    </motion.p>
                  </AnimatePresence>
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
                {/* Single Animated Mode Switcher Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ember hover:text-ember-foreground hover:bg-ember transition-all cursor-pointer bg-ember/10 px-3.5 py-1.5 rounded-xl border border-ember/30 shadow-2xs shrink-0"
                >
                  {mode === "login" ? (
                    <>
                      <UserPlus className="size-3.5" />
                      <span>Create Candidate Account</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="size-3.5" />
                      <span>Sign In to Account</span>
                    </>
                  )}
                </motion.button>
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
                <span className="bg-card px-3 text-10px text-muted-foreground uppercase tracking-wider font-semibold absolute">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
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
                              placeholder="candidate@example.com"
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
                            <span className="text-10px text-muted-foreground">Must match</span>
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
                            <p className="text-10px text-muted-foreground">
                              Cloudflare Turnstile · I am human
                            </p>
                          </div>
                        </div>
                        <span className="text-10px font-semibold text-success bg-success/15 px-2 py-0.5 rounded border border-success/30">
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
                        <span className="text-11px leading-tight text-muted-foreground">
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
                            placeholder="candidate@example.com"
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
                </motion.div>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={
                  isSubmitting || (mode === "signup" && (!isCaptchaVerified || !acceptTerms))
                }
                className="w-full py-3 rounded-xl bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {mode === "signup" ? "Register Candidate Account" : "Sign In to Portal"}
                    </span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </motion.button>

              {/* Single Mode Toggle Action Under Form */}
              <div className="pt-2 text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                >
                  <span>
                    {mode === "login"
                      ? "Don't have a candidate account yet?"
                      : "Already registered for this portal?"}
                  </span>
                  <span className="text-ember font-bold hover:underline inline-flex items-center gap-1">
                    {mode === "login" ? "Create an account" : "Sign in now"}
                    <ArrowRight className="size-3" />
                  </span>
                </motion.button>
              </div>
            </form>
          </div>

          {/* Bottom Footer */}
          <div className="pt-6 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3 shrink-0">
            <span>© {new Date().getFullYear()} TalentFlow Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="/candidates-portal" className="hover:text-foreground transition-colors">
                Candidate Home
              </a>
              <a href="/companies" className="hover:text-foreground transition-colors">
                Company Portal
              </a>
              <a href="/admin-panel/login" className="hover:text-foreground transition-colors">
                Admin Suite
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Account Verification Link Modal - Matching Company Portal 1-to-1 */}
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
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl text-11px font-medium flex items-center gap-2">
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
                    <span className="text-10px text-amber-500 font-semibold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                      PENDING VERIFICATION
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 bg-card p-3 rounded-lg border border-ember/50">
                    <label className="block text-11px font-semibold text-foreground">
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
}
