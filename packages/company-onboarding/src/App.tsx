import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { AuthScreen } from "./components/AuthScreen";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { OnboardingState } from "./types/onboarding";
import { Candidate } from "./components/CompanyPipelineBoard";
import { Toaster, toast } from "sonner";
import { AlertTriangle, Building2, ArrowLeft, Plus } from "lucide-react";
import { getDefaultOnboardingState } from "./lib/defaultOnboardingState";
import { CompanyApiService, FirebaseAuthService, CompanyDocument } from "@talent-flow/api";

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "/companies";
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("talentflow_company_auth") === "true" &&
        !!localStorage.getItem("talentflow_company_profile")
      );
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<string>("home");
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [dashboardSubTab, setDashboardSubTab] = useState<string>("pipeline");

  const [companyNotFound, setCompanyNotFound] = useState<boolean>(false);
  const [companyNotFoundName, setCompanyNotFoundName] = useState<string>("");

  const [state, setState] = useState<OnboardingState>(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("talentflow_company_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name) {
            const baseState = getDefaultOnboardingState(
              parsed.name,
              parsed.email,
              parsed.adminName,
            );
            const slug = parsed.subdomain || baseState.profile.subdomain;
            return {
              ...baseState,
              profile: {
                ...baseState.profile,
                name: parsed.name || baseState.profile.name,
                subdomain: slug,
                domain: parsed.domain || baseState.profile.domain,
              },
              careerPortal: {
                ...baseState.careerPortal,
                url: `https://crotonitsolutions.com/candidates-portal/${slug}`,
              },
              admin: {
                ...baseState.admin,
                fullName: parsed.adminName || baseState.admin.fullName,
                workEmail: parsed.email || baseState.admin.workEmail,
              },
              isCompleted: parsed.isCompleted ?? false,
            };
          }
        } catch {
          // Ignore invalid JSON in localStorage
        }
      }
    }

    return getDefaultOnboardingState("", "", "");
  });

  // Helper to load company profile for authenticated session from Firebase / Firestore
  const loadAuthenticatedCompanyData = useCallback(async (userEmail?: string, userUid?: string) => {
    let emailToUse = userEmail;
    if (!emailToUse && typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("talentflow_company_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          emailToUse = parsed.admin?.workEmail || parsed.email;
        } catch {
          // Ignore
        }
      }
    }

    if (!emailToUse) return;

    try {
      const doc = await CompanyApiService.getCompanyByEmailOrUid(emailToUse, userUid);
      if (doc) {
        setCompanyNotFound(false);
        const baseState = getDefaultOnboardingState(
          doc.name,
          doc.admin?.workEmail || "",
          doc.admin?.fullName || "",
        );
        const slug = doc.subdomain || doc.id || doc.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const docRecord = doc as unknown as Record<string, unknown>;
        const fullDocState = (docRecord.fullOnboardingState || {}) as Partial<OnboardingState>;

        const loadedState: OnboardingState = {
          ...baseState,
          ...fullDocState,
          profile: {
            ...baseState.profile,
            ...(fullDocState.profile || {}),
            name: doc.name || baseState.profile.name,
            subdomain: slug,
            domain: doc.domain || baseState.profile.domain,
            industry: doc.industry || baseState.profile.industry,
            size: doc.size || baseState.profile.size,
            brandColor: doc.brandColor || baseState.profile.brandColor,
            headquarters: doc.headquarters || baseState.profile.headquarters,
          },
          careerPortal: {
            ...baseState.careerPortal,
            ...(fullDocState.careerPortal || {}),
            url: `https://crotonitsolutions.com/candidates-portal/${slug}`,
          },
          admin: {
            ...baseState.admin,
            ...(fullDocState.admin || {}),
            fullName: doc.admin?.fullName || baseState.admin.fullName,
            workEmail: doc.admin?.workEmail || baseState.admin.workEmail,
            phone: doc.admin?.phone || baseState.admin.phone,
            jobTitle: doc.admin?.jobTitle || baseState.admin.jobTitle,
            billingEmail: doc.admin?.billingEmail || baseState.admin.billingEmail,
          },
          officeLocations:
            (docRecord.officeLocations as OnboardingState["officeLocations"]) ||
            fullDocState.officeLocations ||
            baseState.officeLocations,
          hrTeam:
            (docRecord.hrTeam as OnboardingState["hrTeam"]) ||
            fullDocState.hrTeam ||
            baseState.hrTeam,
          departments:
            (docRecord.departments as OnboardingState["departments"]) ||
            fullDocState.departments ||
            baseState.departments,
          jobTitles:
            (docRecord.jobTitles as OnboardingState["jobTitles"]) ||
            fullDocState.jobTitles ||
            baseState.jobTitles,
          recruitmentWorkflow:
            (docRecord.recruitmentWorkflow as OnboardingState["recruitmentWorkflow"]) ||
            fullDocState.recruitmentWorkflow ||
            baseState.recruitmentWorkflow,
          candidateDocuments:
            (docRecord.candidateDocuments as OnboardingState["candidateDocuments"]) ||
            fullDocState.candidateDocuments ||
            baseState.candidateDocuments,
          interviewSettings:
            (docRecord.interviewSettings as OnboardingState["interviewSettings"]) ||
            fullDocState.interviewSettings ||
            baseState.interviewSettings,
          emailConfig:
            (docRecord.emailConfig as OnboardingState["emailConfig"]) ||
            fullDocState.emailConfig ||
            baseState.emailConfig,
          candidateExperience:
            (docRecord.candidateExperience as OnboardingState["candidateExperience"]) ||
            fullDocState.candidateExperience ||
            baseState.candidateExperience,
          itSetup:
            (docRecord.itSetup as OnboardingState["itSetup"]) ||
            fullDocState.itSetup ||
            baseState.itSetup,
          notificationPreferences:
            (docRecord.notificationPreferences as OnboardingState["notificationPreferences"]) ||
            fullDocState.notificationPreferences ||
            baseState.notificationPreferences,
          approvalMatrix:
            (docRecord.approvalMatrix as OnboardingState["approvalMatrix"]) ||
            fullDocState.approvalMatrix ||
            baseState.approvalMatrix,
          systemMetadata:
            (docRecord.systemMetadata as OnboardingState["systemMetadata"]) ||
            fullDocState.systemMetadata ||
            baseState.systemMetadata,
          modules: doc.modules ? { ...baseState.modules, ...doc.modules } : baseState.modules,
          integrations: doc.integrations
            ? (doc.integrations as Record<string, boolean>)
            : baseState.integrations,
          teamInvites: doc.teamInvites
            ? (doc.teamInvites as unknown as OnboardingState["teamInvites"])
            : baseState.teamInvites,
          isCompleted: doc.isCompleted ?? false,
        };

        setState(loadedState);

        localStorage.setItem(
          "talentflow_company_profile",
          JSON.stringify({
            ...loadedState,
            id: doc.id,
            name: doc.name,
            subdomain: doc.subdomain,
            domain: doc.domain,
            industry: doc.industry,
            size: doc.size,
            brandColor: doc.brandColor,
            headquarters: doc.headquarters,
            email: doc.admin?.workEmail,
            adminName: doc.admin?.fullName,
            isCompleted: doc.isCompleted ?? false,
          }),
        );
        localStorage.setItem("talentflow_active_company_id", doc.id || slug);
      }
    } catch (err) {
      console.warn("Error loading authenticated company data:", err);
    }
  }, []);

  // Listen to Firebase Auth state updates
  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthChange(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem("talentflow_company_auth", "true");
        await loadAuthenticatedCompanyData(user.email || undefined, user.uid);
      } else {
        const hasAuthFlag =
          typeof window !== "undefined" &&
          localStorage.getItem("talentflow_company_auth") === "true" &&
          !!localStorage.getItem("talentflow_company_profile");
        if (!hasAuthFlag) {
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadAuthenticatedCompanyData]);

  // Route PopState & Navigation handler with strict Authentication Guard & Wizard Lifespan Guard
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      const isAuth =
        isAuthenticated ||
        (typeof window !== "undefined" &&
          localStorage.getItem("talentflow_company_auth") === "true" &&
          !!localStorage.getItem("talentflow_company_profile"));

      const cleanPath = path.split("?")[0].replace(/\/+$/, "");
      const segments = cleanPath.split("/").filter(Boolean);

      const searchParams = new URLSearchParams(window.location.search);
      const urlSubTab = searchParams.get("tab");
      if (
        urlSubTab &&
        ["pipeline", "connectors", "interactions", "overview", "team", "settings"].includes(
          urlSubTab,
        )
      ) {
        setDashboardSubTab(urlSubTab);
      }

      // Check if path has a specific company slug (/companies/<company_slug>)
      let requestedSlug: string | null = null;
      if (segments[0] === "companies" && segments.length >= 2) {
        const potentialSlug = decodeURIComponent(segments[1]);
        if (
          ![
            "login",
            "auth",
            "dashboard",
            "dashbaord",
            "home",
            "wizard",
            "register",
            "signup",
          ].includes(potentialSlug.toLowerCase())
        ) {
          requestedSlug = potentialSlug;
        }
      }

      if (requestedSlug) {
        // Query Firestore to verify company existence in database
        CompanyApiService.getCompanyByNameOrDocId(requestedSlug).then((comp) => {
          if (!comp) {
            setCompanyNotFound(true);
            setCompanyNotFoundName(requestedSlug!);
          } else {
            setCompanyNotFound(false);
            const action = segments[2]?.toLowerCase();
            if (action === "login") {
              setAuthMode("signin");
              setActiveTab("auth");
            } else if (action === "register" || action === "signup") {
              setAuthMode("register");
              setActiveTab("auth");
            } else if (!isAuth) {
              toast.error(
                "Authentication required. Please sign in to access your company dashboard.",
              );
              window.history.pushState({}, "", "/companies/login");
              setAuthMode("signin");
              setActiveTab("auth");
            } else {
              loadAuthenticatedCompanyData();
              setActiveTab(state.isCompleted ? "dashboard" : "wizard");
            }
          }
        });
        return;
      }

      // Generic non-company-specific routes
      setCompanyNotFound(false);

      const isRegisterRoute =
        cleanPath === "/companies/register" ||
        cleanPath === "/companies/signup" ||
        cleanPath === "/register" ||
        cleanPath === "/signup" ||
        searchParams.get("mode") === "register" ||
        searchParams.get("register") === "true";

      if (isRegisterRoute) {
        setAuthMode("register");
        setActiveTab("auth");
      } else if (
        cleanPath === "/companies/login" ||
        cleanPath === "/login" ||
        cleanPath.startsWith("/auth")
      ) {
        setAuthMode("signin");
        setActiveTab("auth");
      } else if (
        cleanPath === "/companies/dashboard" ||
        cleanPath === "/companies/dashbaord" ||
        cleanPath === "/dashboard"
      ) {
        if (!isAuth) {
          toast.error("Authentication required. Please sign in to access your company dashboard.");
          window.history.pushState({}, "", "/companies/login");
          setAuthMode("signin");
          setActiveTab("auth");
        } else {
          loadAuthenticatedCompanyData();
          if (!state.isCompleted) {
            toast.warning("Mandatory Step: Complete company setup before accessing the dashboard.");
            setActiveTab("wizard");
          } else {
            setActiveTab("dashboard");
          }
        }
      } else {
        setActiveTab("home");
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    isAuthenticated,
    state.isCompleted,
    state.profile.subdomain,
    state.profile.name,
    loadAuthenticatedCompanyData,
  ]);

  const navigateTo = (path: string, targetTab?: string, isCompletedOverride?: boolean) => {
    if (path.includes("/register") || path.includes("/signup")) {
      setAuthMode("register");
    } else if (path.includes("/login") || path.includes("/auth")) {
      setAuthMode("signin");
    }

    const isAuth =
      isAuthenticated ||
      (typeof window !== "undefined" &&
        localStorage.getItem("talentflow_company_auth") === "true" &&
        !!localStorage.getItem("talentflow_company_profile"));
    const isComp = isCompletedOverride !== undefined ? isCompletedOverride : state.isCompleted;

    // Strict Auth Check for protected tabs/routes
    if (
      (path.includes("/dashboard") ||
        path.includes("/dashbaord") ||
        targetTab === "wizard" ||
        targetTab === "dashboard") &&
      !isAuth
    ) {
      toast.error("Authentication required. Please sign in to access your company dashboard.");
      window.history.pushState({}, "", "/companies/login");
      setCurrentPath("/companies/login");
      setAuthMode("signin");
      setActiveTab("auth");
      return;
    }

    // MANDATORY ONE-TIME WIZARD ENFORCEMENT:
    // Once the setup wizard is completed (isComp = true), user can NEVER navigate back to wizard.
    if (isAuth && isComp && (targetTab === "wizard" || path.includes("/wizard"))) {
      toast.info("Setup wizard is already completed for your company workspace.");
      targetTab = "dashboard";
      const activeSlug =
        state.profile.subdomain ||
        state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "company";
      path = `/companies/${activeSlug}/dashboard`;
    }

    // Uncompleted setup enforcement
    if (
      isAuth &&
      !isComp &&
      (targetTab === "dashboard" || path.includes("/dashboard") || path.includes("/dashbaord"))
    ) {
      toast.warning("Mandatory Step: Complete company setup before accessing the dashboard.");
      const activeSlug =
        state.profile.subdomain ||
        state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "company";
      const wizPath = `/companies/${activeSlug}/dashboard`;
      window.history.pushState({}, "", wizPath);
      setCurrentPath(wizPath);
      setActiveTab("wizard");
      return;
    }

    if (isAuth && (targetTab === "dashboard" || path.includes("/dashboard"))) {
      loadAuthenticatedCompanyData();
    }

    const searchParams = new URLSearchParams(path.includes("?") ? path.split("?")[1] : "");
    const urlSubTab = searchParams.get("tab");
    if (
      urlSubTab &&
      ["pipeline", "connectors", "interactions", "overview", "team", "settings"].includes(urlSubTab)
    ) {
      setDashboardSubTab(urlSubTab);
    }

    window.history.pushState({}, "", path);
    setCurrentPath(path);

    if (targetTab) {
      setActiveTab(targetTab);
    } else if (path.endsWith("/login") || path === "/login" || path.startsWith("/auth")) {
      setActiveTab("auth");
    } else if (
      path.includes("/dashboard") ||
      path.includes("/dashbaord") ||
      path === "/dashboard"
    ) {
      setActiveTab(isComp ? "dashboard" : "wizard");
    } else {
      setActiveTab("home");
    }
  };

  const handleAuthSuccess = async (data: {
    email: string;
    companyName?: string;
    companySlug?: string;
    adminName?: string;
    isNewAccount?: boolean;
  }) => {
    localStorage.setItem("talentflow_company_auth", "true");
    setIsAuthenticated(true);

    const slug =
      data.companySlug ||
      localStorage.getItem("talentflow_active_company_id") ||
      (data.companyName ? data.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "company");

    localStorage.setItem("talentflow_active_company_id", slug);

    if (data.isNewAccount) {
      // New Company Account created -> Mandatory Setup Wizard (One-time after signup)
      const newCompanyName = data.companyName || "New Enterprise Co";
      const newState: OnboardingState = getDefaultOnboardingState(
        newCompanyName,
        data.email,
        data.adminName || "Company Admin",
      );
      newState.isCompleted = false; // Mandatory Setup Wizard
      newState.systemMetadata.companyId = slug;

      setState(newState);
      localStorage.setItem(
        "talentflow_company_profile",
        JSON.stringify({
          id: slug,
          name: newCompanyName,
          subdomain: newState.profile.subdomain,
          domain: newState.profile.domain,
          email: data.email,
          adminName: data.adminName,
          isCompleted: false,
        }),
      );

      toast.info(
        `Email Verified! Please complete the setup wizard to submit your workspace details for ${newCompanyName}.`,
      );
      navigateTo(`/companies/${slug}/dashboard`, "wizard");
    } else {
      // Login mode -> Fetch authenticated user's company data from Firebase
      await loadAuthenticatedCompanyData(data.email);

      const savedStr = localStorage.getItem("talentflow_company_profile");
      let isComp = false;
      let compSlug = slug;
      if (savedStr) {
        try {
          const parsed = JSON.parse(savedStr);
          isComp = parsed.isCompleted ?? false;
          compSlug = parsed.subdomain || parsed.id || slug;
        } catch {
          // ignore
        }
      }

      if (!isComp) {
        toast.info("Please complete your company setup wizard.");
        navigateTo(`/companies/${compSlug}/dashboard`, "wizard");
      } else {
        navigateTo(`/companies/${compSlug}/dashboard`, "dashboard");
      }
    }
  };

  const saveCompletedCompanyAndRedirect = async (completedState: OnboardingState) => {
    const finalCompletedState: OnboardingState = {
      ...completedState,
      isCompleted: true,
    };
    setState(finalCompletedState);

    const activeCompanyId =
      localStorage.getItem("talentflow_active_company_id") ||
      finalCompletedState.systemMetadata?.companyId ||
      finalCompletedState.profile.subdomain ||
      finalCompletedState.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    localStorage.setItem("talentflow_active_company_id", activeCompanyId);

    localStorage.setItem(
      "talentflow_company_profile",
      JSON.stringify({
        ...finalCompletedState,
        id: activeCompanyId,
        name: finalCompletedState.profile.name,
        subdomain: finalCompletedState.profile.subdomain,
        domain: finalCompletedState.profile.domain,
        industry: finalCompletedState.profile.industry,
        size: finalCompletedState.profile.size,
        brandColor: finalCompletedState.profile.brandColor,
        headquarters: finalCompletedState.profile.headquarters,
        email: finalCompletedState.admin.workEmail,
        adminName: finalCompletedState.admin.fullName,
        isCompleted: true,
      }),
    );

    const docData: CompanyDocument = {
      id: activeCompanyId,
      name: finalCompletedState.profile.name,
      subdomain: finalCompletedState.profile.subdomain,
      domain: finalCompletedState.profile.domain,
      industry: finalCompletedState.profile.industry,
      size: finalCompletedState.profile.size,
      brandColor: finalCompletedState.profile.brandColor,
      headquarters: finalCompletedState.profile.headquarters,
      legalName: finalCompletedState.profile.legalName,
      gstNumber: finalCompletedState.profile.gstNumber,
      panNumber: finalCompletedState.profile.panNumber,
      cinNumber: finalCompletedState.profile.cinNumber,
      registrationNumber: finalCompletedState.profile.registrationNumber,
      website: finalCompletedState.profile.website,
      linkedin: finalCompletedState.profile.linkedin,
      about: finalCompletedState.profile.about,
      yearFounded: finalCompletedState.profile.yearFounded,
      employeeCount: finalCompletedState.profile.employeeCount,
      headOfficeAddress: finalCompletedState.profile.headOfficeAddress,
      state: finalCompletedState.profile.state,
      city: finalCompletedState.profile.city,
      pincode: finalCompletedState.profile.pincode,
      timezone: finalCompletedState.profile.timezone,
      businessHours: finalCompletedState.profile.businessHours,
      admin: {
        fullName: finalCompletedState.admin.fullName,
        workEmail: finalCompletedState.admin.workEmail,
        phone: finalCompletedState.admin.phone,
        jobTitle: finalCompletedState.admin.jobTitle,
        billingEmail: finalCompletedState.admin.billingEmail,
      },
      modules: finalCompletedState.modules as unknown as Record<string, unknown>,
      integrations: finalCompletedState.integrations,
      teamInvites: finalCompletedState.teamInvites as unknown as CompanyDocument["teamInvites"],
      officeLocations: finalCompletedState.officeLocations as unknown as Record<string, unknown>,
      hrTeam: finalCompletedState.hrTeam as unknown as Array<Record<string, unknown>>,
      departments: finalCompletedState.departments,
      jobTitles: finalCompletedState.jobTitles,
      recruitmentWorkflow: finalCompletedState.recruitmentWorkflow as unknown as Array<
        Record<string, unknown>
      >,
      candidateDocuments: finalCompletedState.candidateDocuments as unknown as Record<
        string,
        unknown
      >,
      interviewSettings: finalCompletedState.interviewSettings as unknown as Record<
        string,
        unknown
      >,
      emailConfig: finalCompletedState.emailConfig as unknown as Record<string, unknown>,
      careerPortal: finalCompletedState.careerPortal as unknown as Record<string, unknown>,
      candidateExperience: finalCompletedState.candidateExperience as unknown as Record<
        string,
        unknown
      >,
      itSetup: finalCompletedState.itSetup as unknown as Record<string, unknown>,
      notificationPreferences: finalCompletedState.notificationPreferences as unknown as Record<
        string,
        unknown
      >,
      approvalMatrix: finalCompletedState.approvalMatrix as unknown as Record<string, unknown>,
      systemMetadata: finalCompletedState.systemMetadata as unknown as Record<string, unknown>,
      fullOnboardingState: finalCompletedState as unknown as Record<string, unknown>,
      isCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await CompanyApiService.saveCompanyToFirestore(docData);
    if (res.success) {
      toast.success(
        `Company '${finalCompletedState.profile.name}' (${activeCompanyId}) saved in Firestore! Opening Dashboard...`,
      );
    }

    const allMembers = [
      ...finalCompletedState.hrTeam,
      ...finalCompletedState.teamInvites.map((t) => ({
        name: t.email.split("@")[0],
        email: t.email,
        role: t.role,
      })),
    ];
    if (allMembers.length > 0) {
      const cronRes = await CompanyApiService.scheduleDashboardAccessEmailsCron(
        activeCompanyId,
        allMembers,
      );
      toast.success(
        `⏰ Cron Job Executed: Sent workspace dashboard access emails to ${cronRes.dispatchedCount} member(s)!`,
      );
    }

    // Direct redirect to Dashboard after completing wizard
    setDashboardSubTab("pipeline");
    navigateTo(`/companies/${activeCompanyId}/dashboard`, "dashboard", true);
  };

  const handleWizardCompleted = () => {
    saveCompletedCompanyAndRedirect(state);
  };

  const handleLogout = async () => {
    await FirebaseAuthService.signOut();
    localStorage.removeItem("talentflow_company_auth");
    localStorage.removeItem("talentflow_company_profile");
    localStorage.removeItem("talentflow_active_company_id");
    setIsAuthenticated(false);
    toast.info("Company workspace session signed out.");
    navigateTo("/companies/login", "auth");
  };

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [interactionsLog, setInteractionsLog] = useState<
    { id: string; at: string; actor: string; action: string; channel: string }[]
  >([]);

  const totalSteps = 17;
  const progressPercent = Math.round((state.currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Toaster position="top-right" richColors />

      {/* Header Navigation for Company Portal */}
      {activeTab !== "home" && activeTab !== "auth" && (
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (!state.isCompleted && tab === "dashboard") {
              toast.warning(
                "Mandatory Step: Complete company setup before accessing the dashboard.",
              );
              setActiveTab("wizard");
            } else {
              setActiveTab(tab);
            }
          }}
          companyName={state.profile.name}
          subdomain={state.profile.subdomain}
          industry={state.profile.industry}
          size={state.profile.size}
          adminEmail={state.admin.workEmail}
          progressPercent={progressPercent}
          isCompleted={state.isCompleted}
          activeSubTab={dashboardSubTab}
          onSelectSubTab={(subTab) => setDashboardSubTab(subTab)}
          onNavigateRoute={navigateTo}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {companyNotFound ? (
          <div className="min-h-screen bg-background font-sans text-foreground flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="max-w-md w-full bg-card border border-border/80 rounded-2xl p-8 shadow-xl space-y-6">
              <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto ring-8 ring-destructive/5">
                <Building2 className="size-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-mono font-semibold rounded-full uppercase tracking-wider">
                  404 — Page Not Found
                </span>
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Company Workspace Not Found
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No company workspace matching{" "}
                  <code className="text-ember font-mono bg-ember/10 px-1.5 py-0.5 rounded font-semibold">
                    "{companyNotFoundName}"
                  </code>{" "}
                  was found in the database.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setCompanyNotFound(false);
                    navigateTo("/companies", "home");
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ember text-ember-foreground hover:bg-ember/90 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  <span>Companies Home</span>
                </button>
                <button
                  onClick={() => {
                    setCompanyNotFound(false);
                    navigateTo("/companies/register", "auth");
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border hover:bg-accent text-foreground font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Plus className="size-4 text-ember" />
                  <span>Register Company</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "home" && (
              <HomePage
                onGetStarted={() => {
                  navigateTo("/companies/register", "auth");
                }}
                onSignIn={() => {
                  navigateTo("/companies/login", "auth");
                }}
                onSelectPlan={() => {
                  navigateTo("/companies/register", "auth");
                }}
              />
            )}

            {activeTab === "auth" && (
              <AuthScreen
                initialIsSignUp={authMode === "register"}
                onSuccess={handleAuthSuccess}
                onBackToHome={() => {
                  navigateTo("/companies", "home");
                }}
              />
            )}

            {activeTab === "wizard" && !state.isCompleted && (
              <OnboardingWizard
                state={state}
                setState={setState}
                onComplete={handleWizardCompleted}
              />
            )}

            {activeTab === "dashboard" && state.isCompleted && (
              <CompanyDashboard
                state={state}
                setState={setState}
                candidates={candidates}
                onAdvanceCandidate={(id) => {
                  const cand = candidates.find((c) => c.id === id);
                  if (cand) toast.success(`Advanced ${cand.name}`);
                }}
                onFetchConnectorCandidates={() => {
                  toast.info("Connector synced new candidates");
                }}
                interactionsLog={interactionsLog}
                activeSubTab={dashboardSubTab}
                onSelectSubTab={(subTab) => setDashboardSubTab(subTab)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
