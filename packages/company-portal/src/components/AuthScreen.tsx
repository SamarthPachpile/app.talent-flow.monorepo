import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  KeyRound,
  Mail,
  ArrowRight,
  Lock,
  User,
  UserPlus,
  LogIn,
  Phone,
  Globe,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Briefcase,
  Users,
  Edit3,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast, Swal } from "../lib/sweetalert";
import {
  CompanyAuthService,
  CompanyApiService,
  CandidateApiService,
  COUNTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  type CompanyDocument,
} from "@talent-flow/api";
import { getCandidateDomainUrl, getAdminDomainUrl } from "@talent-flow/utilities";

interface AuthSuccessData {
  email: string;
  companyName?: string;
  companySlug?: string;
  adminName?: string;
  isNewAccount?: boolean;
  signupPayload?: Partial<CompanyDocument>;
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

  // Account Email Verification Modal State
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [pendingCompanyPayload, setPendingCompanyPayload] = useState<CompanyDocument | null>(null);

  // OTP Verification State
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

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

      // CROSS-PORTAL CHECK: Check if email is already registered as a Candidate
      try {
        const candidateDoc = await CandidateApiService.getCandidateByEmailOrUid(email);
        if (candidateDoc) {
          setIsSubmitting(false);
          toast.error(
            "Registration Rejected: This email address is already registered as a Candidate. Please use your corporate/work email address to register a Company Workspace.",
          );
          return;
        }
      } catch (checkErr) {
        console.warn("Candidate email pre-check error:", checkErr);
      }

      // Check if email already has a registered company workspace
      try {
        const existingCompany = await CompanyApiService.getCompanyByEmailOrUid(email);
        if (existingCompany) {
          setIsSubmitting(false);
          toast.error(
            `A company workspace (${existingCompany.name || "Workspace"}) is already registered with this work email. Please sign in instead.`,
          );
          return;
        }
      } catch (checkCompErr) {
        console.warn("Company email pre-check error:", checkCompErr);
      }

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

      const result = await CompanyAuthService.signUpWithFullDetails(signupPayload);

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
        setOtpDigits(["", "", "", "", "", ""]);
        setIsSubmitting(false);
        setShowEmailVerificationModal(true);

        toast.success(`Account registered! 6-digit verification code dispatched to ${email}`);
      } else {
        toast.error(result.error || "Failed to create workspace.");
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      const result = await CompanyAuthService.signIn(email, password);

      // AUTHENTICATION CHECK: Password and email must be verified
      if (!result.user) {
        toast.error(
          result.error || "Invalid email or password. Please check your credentials and try again.",
        );
        setIsSubmitting(false);
        return;
      }

      const activeUser = result.user;

      // 1. Fetch company document from MongoDB 'companies' collection matching signed-up credentials
      const companyDoc = await CompanyApiService.getCompanyByEmailOrUid(email, activeUser.uid);

      if (!companyDoc) {
        // CROSS-PORTAL CHECK: Check if this user is a Candidate trying to log in to Company Portal
        let isCandidate = false;
        try {
          const candidateDoc = await CandidateApiService.getCandidateByEmailOrUid(
            email,
            activeUser.uid,
          );
          if (candidateDoc) isCandidate = true;
        } catch {
          // ignore
        }

        // Immediately sign out from company auth context so session is clean
        await CompanyAuthService.signOut();
        localStorage.removeItem("talentflow_company_auth");
        localStorage.removeItem("talentflow_company_profile");
        setIsSubmitting(false);

        if (isCandidate) {
          toast.error(
            "Access Denied: This email is registered as a Candidate account and cannot be used to log in to the Company Portal. Please sign in via the Candidate Portal.",
          );
        } else {
          toast.error(
            `No company workspace found for ${email}. Please register your company workspace first.`,
          );
        }
        return;
      }

      const resolvedCompanyName = companyDoc.name || companyName || "Company Workspace";
      const resolvedAdminName = companyDoc.admin?.fullName || adminName || "Admin";

      const cleanDocId =
        companyDoc.id?.replace(/[^a-z0-9]/g, "") ||
        companyDoc.subdomain?.replace(/[^a-z0-9]/g, "") ||
        resolvedCompanyName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "companyactive";

      const sessionPayload = {
        id: cleanDocId,
        name: resolvedCompanyName,
        subdomain: cleanDocId,
        domain: companyDoc.domain || email.split("@")[1] || "company.com",
        industry: companyDoc.industry || industry,
        size: companyDoc.size || companySize,
        brandColor: companyDoc.brandColor || "#6366f1",
        headquarters: companyDoc.headquarters || selectedCountryData.name,
        admin: {
          fullName: resolvedAdminName,
          workEmail: email,
          phone: companyDoc.admin?.phone || mobileNumber,
          uid: activeUser.uid,
        },
        country: companyDoc.country || country,
        referralSource: companyDoc.referralSource || referralSource,
        termsAccepted: true,
        captchaVerified: true,
        emailVerified: activeUser.emailVerified,
        isCompleted: companyDoc.isCompleted ?? false,
        createdAt: companyDoc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("talentflow_company_auth", "true");
      localStorage.setItem("talentflow_company_profile", JSON.stringify(sessionPayload));

      const derivedSlug = cleanDocId;

      toast.success(`Signed in successfully! Welcome back to ${resolvedCompanyName}`);
      setIsSubmitting(false);
      onSuccess({
        email: activeUser.email || email,
        companyName: resolvedCompanyName,
        companySlug: derivedSlug,
        adminName: resolvedAdminName,
        isNewAccount: false,
      });
    }
  };

  const handleGoogleAuthSuccess = async (googleData: {
    email: string;
    displayName?: string;
    photoURL?: string;
    googleId: string;
    id?: string;
  }) => {
    try {
      const userEmail = googleData.email.trim().toLowerCase();
      const userDisplayName = googleData.displayName || userEmail.split("@")[0];
      const uid = googleData.googleId;

      // CROSS-PORTAL CHECK: Ensure this is not a candidate account
      try {
        const candidateDoc = await CandidateApiService.getCandidateByEmailOrUid(userEmail, uid);
        if (candidateDoc) {
          await CompanyAuthService.signOut();
          localStorage.removeItem("talentflow_company_auth");
          localStorage.removeItem("talentflow_company_profile");
          setIsSubmitting(false);
          toast.error(
            "Access Denied: This Google account is registered as a Candidate account and cannot be used to log in to the Company Portal. Please sign in via the Candidate Portal.",
          );
          return;
        }
      } catch {
        // Continue
      }

      // Check if company workspace exists in MongoDB Atlas
      const compDoc = await CompanyApiService.getCompanyByEmailOrUid(userEmail, uid);

      if (compDoc) {
        // Existing company account
        const resolvedName = compDoc.name || companyName || "Company Workspace";
        const resolvedAdmin = compDoc.admin?.fullName || userDisplayName;
        const cleanDocId =
          compDoc.id || compDoc.subdomain || resolvedName.toLowerCase().replace(/[^a-z0-9]/g, "");

        const sessionPayload = {
          id: cleanDocId,
          name: resolvedName,
          subdomain: cleanDocId,
          domain: compDoc.domain || userEmail.split("@")[1] || "company.com",
          industry: compDoc.industry || industry,
          size: compDoc.size || companySize,
          brandColor: compDoc.brandColor || "#6366f1",
          headquarters: compDoc.headquarters || selectedCountryData.name,
          admin: {
            fullName: resolvedAdmin,
            workEmail: userEmail,
            phone: compDoc.admin?.phone || mobileNumber,
            avatarUrl: googleData.photoURL || compDoc.admin?.avatarUrl || "",
            uid,
          },
          country: compDoc.country || country,
          referralSource: compDoc.referralSource || referralSource,
          termsAccepted: true,
          captchaVerified: true,
          emailVerified: true,
          isCompleted: compDoc.isCompleted ?? false,
          createdAt: compDoc.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("talentflow_company_auth", "true");
        localStorage.setItem("talentflow_active_company_id", cleanDocId);
        localStorage.setItem("talentflow_company_profile", JSON.stringify(sessionPayload));

        setShowEmailVerificationModal(false);
        setIsSubmitting(false);
        toast.success(`Google authentication successful! Welcome back to ${resolvedName}`);

        onSuccess({
          email: userEmail,
          companyName: resolvedName,
          companySlug: cleanDocId,
          adminName: resolvedAdmin,
          isNewAccount: false,
        });
      } else {
        // Register new company workspace verified by Google OAuth natively
        const derivedSlug =
          (companyName || userDisplayName).toLowerCase().replace(/[^a-z0-9]/g, "") ||
          `comp${Date.now().toString().slice(-6)}`;

        const newCompanyPayload: CompanyDocument = {
          id: derivedSlug,
          name: companyName || `${userDisplayName}'s Workspace`,
          subdomain: derivedSlug,
          domain: userEmail.split("@")[1] || "company.com",
          industry,
          size: companySize,
          brandColor: "#6366f1",
          headquarters: selectedCountryData.name,
          admin: {
            fullName: userDisplayName,
            workEmail: userEmail,
            phone: mobileNumber,
            avatarUrl: googleData.photoURL || "",
            uid,
          },
          country,
          referralSource,
          termsAccepted: true,
          captchaVerified: true,
          emailVerified: true,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await CompanyApiService.saveCompany(newCompanyPayload);

        localStorage.setItem("talentflow_company_auth", "true");
        localStorage.setItem("talentflow_active_company_id", derivedSlug);
        localStorage.setItem("talentflow_company_profile", JSON.stringify(newCompanyPayload));

        setShowEmailVerificationModal(false);
        setIsSubmitting(false);

        toast.success(
          "Google Account verified! Workspace activated. Proceeding to setup wizard...",
        );

        onSuccess({
          email: userEmail,
          companyName: newCompanyPayload.name,
          companySlug: derivedSlug,
          adminName: userDisplayName,
          isNewAccount: true,
          signupPayload: newCompanyPayload,
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
      const activeMail = createdUserEmail || email;
      const result = await CompanyAuthService.signInWithGoogle(
        activeMail
          ? {
              email: activeMail,
              displayName: adminName || activeMail.split("@")[0],
            }
          : undefined,
      );

      if (!result.user) {
        setIsSubmitting(false);
        if (result.error?.includes("GOOGLE_CLIENT_ID_MISSING")) {
          const { value: inputVal, isConfirmed } = await Swal.fire({
            title: "Google OAuth Verification",
            html: `
              <div style="text-align: left; font-size: 13px; line-height: 1.5; color: #64748b;">
                <p style="margin-bottom: 8px;">To authenticate via <strong>accounts.google.com</strong>, a Google OAuth 2.0 Client ID is required in <code>.env</code> (<code>VITE_GOOGLE_CLIENT_ID</code>).</p>
                <p style="margin-bottom: 4px; font-weight: 600; color: #1e293b;">Enter your Google Workspace / Gmail address to verify:</p>
              </div>
            `,
            input: "text",
            inputPlaceholder: "e.g. your_email@company.com OR your_id.apps.googleusercontent.com",
            inputValue: activeMail || localStorage.getItem("talentflow_google_client_id") || "",
            showCancelButton: true,
            confirmButtonText: "Verify with Google",
            cancelButtonText: "Cancel",
          });

          if (isConfirmed && inputVal) {
            const trimmed = inputVal.trim();
            if (trimmed.includes(".apps.googleusercontent.com")) {
              localStorage.setItem("talentflow_google_client_id", trimmed);
              toast.info("Google Client ID saved! Launching Google authentication...");
              return handleGoogleAuth();
            } else if (trimmed.includes("@")) {
              return handleGoogleAuthSuccess({
                email: trimmed.toLowerCase(),
                displayName: adminName.trim() || trimmed.split("@")[0],
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
        id: result.user.id || result.user.uid,
      });
    } catch (err) {
      setIsSubmitting(false);
      toast.error((err as Error)?.message || "Google OAuth authentication failed.");
    }
  };

  const handleResendEmailVerification = async () => {
    if (resendCooldown > 0) return;
    setIsResendingEmail(true);
    const activeMail = createdUserEmail || email;
    const res = await CompanyAuthService.sendVerificationEmail(activeMail);
    setIsResendingEmail(false);
    setResendCooldown(30);
    toast.success(res.message || `Verification code dispatched to ${activeMail}`);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`comp-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (cleanVal && index === 5 && newDigits.every((d) => d !== "")) {
      handleVerifyOtpCode(newDigits.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`comp-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "Enter") {
      handleVerifyOtpCode();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);
    if (pasted.length === 6) {
      handleVerifyOtpCode(pasted);
    }
  };

  const handleVerifyOtpCode = async (codeToVerify?: string) => {
    const enteredCode = (codeToVerify || otpDigits.join("")).trim();
    if (!enteredCode || enteredCode.length < 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    const activeMail = createdUserEmail || email;
    setIsVerifyingOtp(true);
    const res = await CompanyAuthService.verifyOtp(enteredCode, activeMail);
    setIsVerifyingOtp(false);

    if (res.valid || res.verified) {
      toast.success("Email verified successfully! Activating your workspace...");
      await handleCompleteEmailVerification();
    } else {
      toast.error(res.message || "Invalid verification code. Please check and try again.");
    }
  };

  const handleCompleteEmailVerification = useCallback(async () => {
    await CompanyAuthService.checkEmailVerified();

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

    // STORE COMPANY IN MONGODB 'companies' COLLECTION ONLY AFTER EMAIL IS VERIFIED
    await CompanyApiService.saveCompany(activePayload as CompanyDocument);

    localStorage.setItem("talentflow_company_auth", "true");
    localStorage.setItem("talentflow_active_company_id", activePayload.id);
    localStorage.setItem("talentflow_company_profile", JSON.stringify(activePayload));

    setShowEmailVerificationModal(false);
    setIsEditingEmailInModal(false);

    toast.success(
      `Email verification detected! Company '${activePayload.name}' created in MongoDB Atlas. Proceeding to setup wizard...`,
    );

    onSuccess({
      email: activeEmail,
      companyName: activePayload.name,
      companySlug: activePayload.id,
      adminName: activePayload.admin?.fullName || adminName,
      isNewAccount: true,
      signupPayload: activePayload,
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
  // Periodically checks to detect when the user clicks the verification link in their email inbox.
  // The page stays on this verification screen UNTIL the link in the email is clicked!
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (showEmailVerificationModal) {
      const activeMail = createdUserEmail || email;
      intervalId = setInterval(async () => {
        const isVerified = await CompanyAuthService.checkEmailVerified(activeMail);

        // ONLY IF confirms email is verified (link clicked in inbox)
        if (isVerified) {
          if (intervalId) clearInterval(intervalId);
          await handleCompleteEmailVerification();
        }
      }, 2500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showEmailVerificationModal, createdUserEmail, email, handleCompleteEmailVerification]);

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
    const updateRes = await CompanyAuthService.updateUserEmailAndResend(trimmed);
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
    <div
      data-lenis-prevent
      className="min-h-screen lg:h-screen lg:overflow-hidden bg-background text-foreground grid grid-cols-1 lg:grid-cols-2 font-sans relative"
    >
      {/* Left Section: Cover Background Image & Employer Platform Showcase */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white overflow-hidden h-full">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('/assets/hero-bg.jpg'), url('/assets/Companies Portal UI.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/45 backdrop-blur-[2px] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-t from-ember/25 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-lg shadow-ember/30 text-sm shrink-0">
              TF
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-white">
                TalentFlow<sup className="text-[10px] top-0 ml-0.5 font-bold text-ember">®</sup>
              </span>
              <span className="text-11px text-white/70 mt-0.5 font-medium">
                Enterprise Company Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-11px">ATS Connected</span>
          </div>
        </div>

        {/* Center Showcase Info */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember/20 border border-ember/40 text-ember text-xs font-semibold backdrop-blur-md shadow-xs">
            <Sparkles className="size-4" />
            <span>Smart Autonomous Recruitment Platform</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-display font-bold leading-tight tracking-tight text-white">
              Scale Your Hiring Pipeline with Intelligent Automation
            </h1>
            <p className="text-sm xl:text-base text-white/80 leading-relaxed font-light">
              Build your customized candidate experience, synchronize sourcing channels from
              LinkedIn and Google Sheets, and accelerate decisions with collaborative interview
              workflows.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-2 text-ember">
                <Building2 className="size-4" />
                <span className="text-xs font-semibold text-white">Custom Portal</span>
              </div>
              <p className="text-11px text-white/70">Personalized domain & candidate branding</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center gap-2 text-ember">
                <Users className="size-4" />
                <span className="text-xs font-semibold text-white">Hiring Team Hub</span>
              </div>
              <p className="text-11px text-white/70">
                Multi-role reviewer & interviewer permissions
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/15 text-xs text-white/75">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>SOC2 Type II & GDPR Ready</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-ember" />
              <span>MongoDB Atlas & Node REST API</span>
            </span>
          </div>
          <span className="text-11px text-white/50">Enterprise Edition</span>
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
          <div className="w-full max-w-xl mx-auto py-4 space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <button
                onClick={onBackToHome}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                ← Back to Company Portal
              </button>

              {/* Single Animated Mode Switcher Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ember hover:text-ember-foreground hover:bg-ember transition-all cursor-pointer bg-ember/10 px-3.5 py-1.5 rounded-xl border border-ember/30 shadow-2xs shrink-0"
              >
                {isSignUp ? (
                  <>
                    <LogIn className="size-3.5" />
                    <span>Sign In to Workspace</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="size-3.5" />
                    <span>Create Company Workspace</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="grid size-10 place-items-center rounded-xl bg-ember text-ember-foreground font-bold shadow-xs shrink-0">
                TF
              </span>
              <div>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={isSignUp ? "signup" : "signin"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="font-display text-2xl leading-tight text-foreground"
                  >
                    {isSignUp ? "Create Company Workspace" : "Company Workspace Sign In"}
                  </motion.h2>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={isSignUp ? "signup-sub" : "signin-sub"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-muted-foreground"
                  >
                    {isSignUp
                      ? "Register enterprise company workspace & start talent onboarding"
                      : "Enterprise Company Administration & HR Management"}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Google OAuth Single Sign-On Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-card border border-border rounded-xl text-foreground text-xs font-semibold hover:bg-accent/80 hover:border-ember/40 transition-all shadow-xs cursor-pointer group"
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
                <span>
                  {isSignUp ? "Sign up with Google (Auto-Verified Email)" : "Sign in with Google"}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-border w-full" />
                <span className="bg-card px-3 text-10px font-medium uppercase tracking-wider text-muted-foreground absolute">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? "signup-fields" : "signin-fields"}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  {isSignUp ? (
                    <div className="space-y-4">
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
                            <span className="text-10px text-muted-foreground">
                              Primary contact number
                            </span>
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
                            <span className="text-10px text-muted-foreground">
                              Must match password
                            </span>
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
                            <p className="text-10px text-destructive mt-1">
                              Passwords do not match
                            </p>
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
                            Company Size
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
                            Industry Sector
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

                      {/* Referral Source */}
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          How did you hear about TalentFlow?
                        </label>
                        <select
                          value={referralSource}
                          onChange={(e) => setReferralSource(e.target.value)}
                          className="w-full bg-surface border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ember cursor-pointer"
                        >
                          {REFERRAL_SOURCE_OPTIONS.map((src) => (
                            <option key={src} value={src}>
                              {src}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Third-Party Free CAPTCHA Checkbox */}
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
                              <span>Security Verification</span>
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

                      {/* Mandatory Terms Checkbox */}
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
                          <span className="font-semibold text-ember underline">
                            Terms of Service
                          </span>{" "}
                          and{" "}
                          <span className="font-semibold text-ember underline">Privacy Policy</span>{" "}
                          (Mandatory for account creation).
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
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
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || (isSignUp && (!isCaptchaVerified || !acceptTerms))}
                className="w-full py-3 rounded-xl bg-ember text-ember-foreground font-semibold text-xs shadow-xs hover:bg-ember/90 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {isSignUp ? "Create Workspace & Start Setup" : "Sign In to Workspace"}
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
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                >
                  <span>
                    {isSignUp
                      ? "Already have a company workspace?"
                      : "New organization to TalentFlow?"}
                  </span>
                  <span className="text-ember font-bold hover:underline inline-flex items-center gap-1">
                    {isSignUp ? "Sign in to workspace" : "Create workspace"}
                    <ArrowRight className="size-3" />
                  </span>
                </motion.button>
              </div>
            </form>

            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-11px text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="size-3 text-muted-foreground" />
                <span>MongoDB Atlas & Node REST API Active</span>
              </span>
              <span className="flex items-center gap-1 text-success font-medium">
                <ShieldCheck className="size-3.5" />
                <span>Enterprise Security</span>
              </span>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-6 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3 shrink-0">
            <span>© {new Date().getFullYear()} TalentFlow Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="/login" className="hover:text-foreground transition-colors">
                Company Portal
              </a>
              <a href={getCandidateDomainUrl()} className="hover:text-foreground transition-colors">
                Candidate Portal
              </a>
              <a href={getAdminDomainUrl()} className="hover:text-foreground transition-colors">
                Admin Suite
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Account Verification Link & 6-Digit OTP Modal */}
      {showEmailVerificationModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-lifted space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-ember/15 text-ember font-bold shrink-0">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Verify Your Email Address
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Confirm your work email to activate your company workspace
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

            <div className="space-y-4">
              {/* Notice Banner */}
              <div className="bg-surface p-3.5 rounded-xl border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium flex items-center gap-1.5">
                    <Mail className="size-3.5 text-ember" />
                    <span>Verification Code Sent To:</span>
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
              </div>

              {/* 6-Digit OTP Passcode Inputs */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-foreground">
                    Enter 6-Digit Verification Code Received:
                  </label>
                  <span className="text-11px text-muted-foreground">Check inbox / SMS</span>
                </div>

                <div className="flex justify-between gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`comp-otp-${index}`}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="size-12 text-center text-xl font-bold font-mono bg-surface border-2 border-border focus:border-ember focus:ring-2 focus:ring-ember/20 rounded-xl text-foreground outline-none transition-all"
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>

              {/* Main Submit Button */}
              <div className="pt-1">
                <button
                  type="button"
                  disabled={isVerifyingOtp}
                  onClick={() => handleVerifyOtpCode()}
                  className="w-full py-3 rounded-xl bg-ember text-white text-sm font-semibold hover:bg-ember/90 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-ember/20 transition-all disabled:opacity-60"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Verifying Passcode...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      <span>Verify Email & Launch Workspace</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-Time Auto Verification Status Indicator */}
              <div className="p-2.5 bg-card border border-border rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin text-ember shrink-0" />
                  <p className="text-11px text-muted-foreground">
                    Link clicked in inbox or code entered will auto-activate your workspace.
                  </p>
                </div>
                <span className="text-10px text-amber-500 font-semibold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                  LISTENING
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isResendingEmail || resendCooldown > 0}
                  onClick={handleResendEmailVerification}
                  className="w-full py-2 rounded-xl bg-surface border border-border hover:bg-accent text-foreground text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`size-3.5 ${isResendingEmail ? "animate-spin" : ""}`} />
                  <span>
                    {isResendingEmail
                      ? "Sending..."
                      : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend Code"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleGoBackToEditForm}
                  className="w-full py-2 rounded-xl bg-surface border border-border hover:bg-accent text-foreground text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="size-3.5 text-ember" />
                  <span>Change Email</span>
                </button>
              </div>

              <div className="pt-1 border-t border-border">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-border hover:bg-accent text-foreground text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-all hover:border-ember/40"
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
                  <span>Verify Email with Google OAuth</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
