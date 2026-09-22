import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { AuthScreen } from "./components/AuthScreen";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { OnboardingState } from "./types/onboarding";
import { Candidate } from "./components/CompanyPipelineBoard";
import { toast } from "./lib/sweetalert";
import { Building2, ArrowLeft, Plus } from "lucide-react";
import { getDefaultOnboardingState } from "./lib/defaultOnboardingState";
import {
  CompanyApiService,
  CompanyAuthService,
  CompanyDocument,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "@talent-flow/api";
import { getCandidateDomainUrl } from "@talent-flow/utilities";

import SmoothScrollProvider from "./components/SmoothScrollProvider";

const getCompanyBasePath = () => {
  if (typeof window === "undefined") return "";
  const p = window.location.pathname;
  if (p.startsWith("/companies")) return "/companies";
  if (p.startsWith("/company")) return "/company";
  return "";
};

const buildCompanyUrl = (subpath: string) => {
  const base = getCompanyBasePath();
  let cleanSub = subpath.startsWith("/") ? subpath : `/${subpath}`;
  if (!base) {
    cleanSub = cleanSub.replace(/^\/(companies|company)/, "") || "/";
    return cleanSub;
  }
  if (cleanSub === "/" || cleanSub === "") return base;
  return `${base}${cleanSub.replace(/^\/(companies|company)/, "")}`;
};

export const App: React.FC = () => {
  const [, setCurrentPath] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.pathname : "/",
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    Boolean(
      getStorageItem<string | null>("talentflow_company_auth", null) === "true" &&
      getStorageItem<Record<string, unknown> | null>("talentflow_company_profile", null),
    ),
  );

  const [activeTab, setActiveTab] = useState<string>("home");
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [dashboardSubTab, setDashboardSubTab] = useState<string>("dashboard");

  const [companyNotFound, setCompanyNotFound] = useState<boolean>(false);
  const [companyNotFoundName, setCompanyNotFoundName] = useState<string>("");

  const [state, setState] = useState<OnboardingState>(() => {
    const parsed = getStorageItem<Record<string, any> | null>("talentflow_company_profile", null);
    if (parsed && (parsed.name || parsed.profile?.name)) {
      const compName = parsed.profile?.name || parsed.name || "";
      const compEmail = parsed.admin?.workEmail || parsed.email || "";
      const compAdminName = parsed.admin?.fullName || parsed.adminName || "";
      const baseState = getDefaultOnboardingState(compName, compEmail, compAdminName);
      const fullDocState = (parsed.fullOnboardingState || parsed) as Partial<OnboardingState>;
      const slug = parsed.subdomain || parsed.id || baseState.profile.subdomain;
      return {
        ...baseState,
        ...fullDocState,
        profile: {
          ...baseState.profile,
          ...(fullDocState.profile || {}),
          name: compName || baseState.profile.name,
          subdomain: slug,
          domain: parsed.domain || fullDocState.profile?.domain || baseState.profile.domain,
          industry: parsed.industry || fullDocState.profile?.industry || baseState.profile.industry,
          size: parsed.size || fullDocState.profile?.size || baseState.profile.size,
          brandColor:
            parsed.brandColor || fullDocState.profile?.brandColor || baseState.profile.brandColor,
          headquarters:
            parsed.headquarters ||
            fullDocState.profile?.headquarters ||
            baseState.profile.headquarters,
        },
        admin: {
          ...baseState.admin,
          ...(fullDocState.admin || {}),
          fullName: compAdminName || baseState.admin.fullName,
          workEmail: compEmail || baseState.admin.workEmail,
          phone: parsed.admin?.phone || fullDocState.admin?.phone || baseState.admin.phone,
        },
        isCompleted: parsed.isCompleted ?? fullDocState.isCompleted ?? false,
      };
    }
    return getDefaultOnboardingState("", "", "");
  });

  // Helper to load company profile for authenticated session
  const loadAuthenticatedCompanyData = useCallback(async (userEmail?: string, userUid?: string) => {
    const saved = getStorageItem<Record<string, any> | null>("talentflow_company_profile", null);
    const emailToUse = userEmail || saved?.admin?.workEmail || saved?.email;

    if (!emailToUse) return null;

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

        let isLocallyCompleted = false;
        if (typeof window !== "undefined") {
          try {
            const savedStr = localStorage.getItem("talentflow_company_profile");
            if (savedStr) {
              const parsed = JSON.parse(savedStr);
              if (parsed.isCompleted === true) isLocallyCompleted = true;
            }
          } catch {
            // ignore
          }
        }

        const isCompleted = isLocallyCompleted || doc.isCompleted !== false;

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
            url: `${getCandidateDomainUrl()}/${slug}`,
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
          isCompleted: isCompleted,
        };

        setState(loadedState);

        setStorageItem("talentflow_company_profile", {
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
          isCompleted: isCompleted,
        });
        setStorageItem("talentflow_active_company_id", doc.id || slug);
        return loadedState;
      }
    } catch (err) {
      console.warn("Error loading authenticated company data:", err);
    }
    return null;
  }, []);

  // Listen to Auth state updates with strict company role verification
  useEffect(() => {
    const unsubscribe = CompanyAuthService.onAuthChange(async (user) => {
      if (user && user.email) {
        // Verify this user is an authorized company admin/member
        const compDoc = await CompanyApiService.getCompanyByEmailOrUid(user.email, user.uid);
        if (compDoc) {
          setIsAuthenticated(true);
          setStorageItem("talentflow_company_auth", "true");
          await loadAuthenticatedCompanyData(user.email, user.uid);
        } else {
          // User is not a company workspace account
          const storedAuth =
            getStorageItem<string | null>("talentflow_company_auth", null) === "true" &&
            Boolean(
              getStorageItem<Record<string, unknown> | null>("talentflow_company_profile", null),
            );
          if (!storedAuth) {
            setIsAuthenticated(false);
          }
        }
      } else {
        const hasAuthFlag =
          getStorageItem<string | null>("talentflow_company_auth", null) === "true" &&
          Boolean(
            getStorageItem<Record<string, unknown> | null>("talentflow_company_profile", null),
          );
        if (!hasAuthFlag) {
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadAuthenticatedCompanyData]);

  // Route PopState & Navigation handler
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      const isAuth =
        isAuthenticated ||
        (getStorageItem<string | null>("talentflow_company_auth", null) === "true" &&
          Boolean(
            getStorageItem<Record<string, unknown> | null>("talentflow_company_profile", null),
          ));

      const savedProf = getStorageItem<Record<string, unknown> | null>(
        "talentflow_company_profile",
        null,
      );
      const isComp =
        savedProf?.isCompleted !== undefined ? Boolean(savedProf.isCompleted) : state.isCompleted;

      const cleanPath = path.split("?")[0].replace(/\/+$/, "");
      const isSubpath = cleanPath.startsWith("/companies") || cleanPath.startsWith("/company");
      const relativeClean = isSubpath
        ? cleanPath.replace(/^\/(companies|company)/, "") || "/"
        : cleanPath || "/";
      const segments = relativeClean.split("/").filter(Boolean);

      const searchParams = new URLSearchParams(window.location.search);
      const urlSubTab = searchParams.get("tab");
      if (
        urlSubTab &&
        [
          "pipeline",
          "create-job",
          "jobs-list",
          "jobs",
          "connectors",
          "interactions",
          "overview",
          "settings",
          "team",
          "branding",
          "email-templates",
        ].includes(urlSubTab)
      ) {
        setDashboardSubTab(urlSubTab);
      }

      // Root route "/" or "/companies" -> Home
      if (segments.length === 0) {
        setCompanyNotFound(false);
        setCompanyNotFoundName("");
        setActiveTab("home");
        return;
      }

      // Explicit static auth routes
      if (segments[0] === "login" || segments[0] === "signin" || segments[0] === "auth") {
        setCompanyNotFound(false);
        setCompanyNotFoundName("");
        setAuthMode("signin");
        setActiveTab("auth");
        return;
      }
      if (segments[0] === "signup" || segments[0] === "register") {
        setCompanyNotFound(false);
        setCompanyNotFoundName("");
        setAuthMode("register");
        setActiveTab("auth");
        return;
      }

      if (segments[0] === "dashboard") {
        setCompanyNotFound(false);
        setCompanyNotFoundName("");
        if (!isAuth) {
          toast.error("Authentication required. Please sign in to access your company dashboard.");
          const loginTarget = buildCompanyUrl("/login");
          window.history.pushState({}, "", loginTarget);
          setAuthMode("signin");
          setActiveTab("auth");
        } else {
          setActiveTab(isComp ? "dashboard" : "wizard");
        }
        return;
      }

      const requestedSlug = segments[0];
      const action = segments[1];

      // Handle company sub-paths: /:companySlug or /:companySlug/login or /:companySlug/dashboard
      if (action === "login" || action === "signin" || action === "auth") {
        setAuthMode("signin");
        setActiveTab("auth");
      } else if (action === "signup" || action === "register") {
        setAuthMode("register");
        setActiveTab("auth");
      } else if (action === "dashboard") {
        if (!isAuth) {
          toast.error("Authentication required. Please sign in to access your company dashboard.");
          const loginTarget = buildCompanyUrl(`/${requestedSlug}/login`);
          window.history.pushState({}, "", loginTarget);
          setAuthMode("signin");
          setActiveTab("auth");
        } else {
          setActiveTab(isComp ? "dashboard" : "wizard");
        }
      } else if (relativeClean === "/register" || relativeClean === "/signup") {
        setAuthMode("register");
        setActiveTab("auth");
      } else if (
        relativeClean === "/login" ||
        relativeClean === "/signin" ||
        relativeClean === "/auth"
      ) {
        setAuthMode("signin");
        setActiveTab("auth");
      } else if (relativeClean === "/dashboard") {
        if (!isAuth) {
          toast.error("Authentication required. Please sign in to access your company dashboard.");
          const loginTarget = buildCompanyUrl("/login");
          window.history.pushState({}, "", loginTarget);
          setAuthMode("signin");
          setActiveTab("auth");
        } else {
          setActiveTab(isComp ? "dashboard" : "wizard");
        }
      } else {
        // Query MongoDB Atlas to verify company existence in database
        CompanyApiService.getCompanyByNameOrDocId(requestedSlug).then((comp) => {
          if (!comp) {
            setCompanyNotFound(true);
            setCompanyNotFoundName(requestedSlug);
          } else {
            setCompanyNotFound(false);
            setActiveTab(isComp ? "dashboard" : "wizard");
          }
        });
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAuthenticated, state.isCompleted]);

  const navigateTo = (path: string, targetTab?: string, isCompletedOverride?: boolean) => {
    if (path.includes("/register") || path.includes("/signup")) {
      setAuthMode("register");
    } else if (path.includes("/login") || path.includes("/auth")) {
      setAuthMode("signin");
    }

    const isAuth =
      isAuthenticated ||
      (getStorageItem<string | null>("talentflow_company_auth", null) === "true" &&
        Boolean(
          getStorageItem<Record<string, unknown> | null>("talentflow_company_profile", null),
        ));

    const savedProf = getStorageItem<Record<string, unknown> | null>(
      "talentflow_company_profile",
      null,
    );
    const isComp =
      isCompletedOverride !== undefined
        ? isCompletedOverride
        : savedProf?.isCompleted !== undefined
          ? Boolean(savedProf.isCompleted)
          : state.isCompleted;

    const targetUrl = buildCompanyUrl(path);

    // Strict Auth Check for protected tabs/routes
    if (
      (path.includes("/dashboard") || targetTab === "wizard" || targetTab === "dashboard") &&
      !isAuth
    ) {
      toast.error("Authentication required. Please sign in to access your company dashboard.");
      const loginUrl = buildCompanyUrl("/login");
      window.history.pushState({}, "", loginUrl);
      setCurrentPath(loginUrl);
      setAuthMode("signin");
      setActiveTab("auth");
      return;
    }

    // MANDATORY ONE-TIME WIZARD ENFORCEMENT:
    // Once the setup wizard is completed (isComp = true), user can NEVER navigate back to wizard.
    if (isAuth && isComp && (targetTab === "wizard" || path.includes("/wizard"))) {
      targetTab = "dashboard";
      const activeSlug =
        state.profile.subdomain ||
        state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "company";
      path = `/${activeSlug}/dashboard`;
    }

    // Uncompleted setup enforcement
    if (isAuth && !isComp && (targetTab === "dashboard" || path.includes("/dashboard"))) {
      toast.warning("Mandatory Step: Complete company setup before accessing the dashboard.");
      const activeSlug =
        state.profile.subdomain ||
        state.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "company";
      const wizPath = `/${activeSlug}/dashboard`;
      const fullWizUrl = buildCompanyUrl(wizPath);
      window.history.pushState({}, "", fullWizUrl);
      setCurrentPath(fullWizUrl);
      setActiveTab("wizard");
      return;
    }

    const searchParams = new URLSearchParams(path.includes("?") ? path.split("?")[1] : "");
    const urlSubTab = searchParams.get("tab");
    if (
      urlSubTab &&
      [
        "pipeline",
        "create-job",
        "jobs-list",
        "jobs",
        "connectors",
        "interactions",
        "overview",
        "team",
        "settings",
      ].includes(urlSubTab)
    ) {
      setDashboardSubTab(urlSubTab);
    }

    window.history.pushState({}, "", targetUrl);
    setCurrentPath(targetUrl);

    if (targetTab) {
      setActiveTab(targetTab);
    } else if (path.endsWith("/login") || path === "/login" || path.startsWith("/auth")) {
      setActiveTab("auth");
    } else if (path.includes("/dashboard") || path === "/dashboard") {
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
    signupPayload?: Partial<CompanyDocument>;
  }) => {
    setStorageItem("talentflow_company_auth", "true");
    setIsAuthenticated(true);

    const slug =
      data.companySlug ||
      getStorageItem<string | null>("talentflow_active_company_id", null) ||
      (data.companyName ? data.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "company");

    setStorageItem("talentflow_active_company_id", slug);

    if (data.isNewAccount) {
      // New Company Account created -> Mandatory Setup Wizard
      const newCompanyName = data.companyName || "New Enterprise Co";
      const payload = data.signupPayload || {};
      const newState: OnboardingState = getDefaultOnboardingState(
        newCompanyName,
        data.email,
        data.adminName || "Company Admin",
        {
          industry: payload.industry,
          size: payload.size,
          country: payload.country,
          headquarters: payload.headquarters,
          phone: payload.admin?.phone,
          subdomain: slug,
          referralSource: payload.referralSource,
        },
      );
      newState.isCompleted = false;
      newState.systemMetadata.companyId = slug;

      setState(newState);
      setStorageItem("talentflow_company_profile", {
        ...newState,
        id: slug,
        name: newCompanyName,
        subdomain: newState.profile.subdomain,
        domain: newState.profile.domain,
        industry: newState.profile.industry,
        size: newState.profile.size,
        brandColor: newState.profile.brandColor,
        headquarters: newState.profile.headquarters,
        email: data.email,
        adminName: data.adminName,
        isCompleted: false,
      });

      toast.info(
        `Email Verified! Please complete the setup wizard to submit your workspace details for ${newCompanyName}.`,
      );
      navigateTo(`/${slug}/dashboard`, "wizard");
    } else {
      // Existing User Login mode -> Fetch company data
      const loadedDoc = await loadAuthenticatedCompanyData(data.email);

      const saved = getStorageItem<Record<string, any> | null>("talentflow_company_profile", null);
      let isComp = loadedDoc ? loadedDoc.isCompleted !== false : true;
      let compSlug = loadedDoc?.profile?.subdomain || loadedDoc?.systemMetadata?.companyId || slug;
      if (saved) {
        if (saved.isCompleted !== undefined) {
          isComp = saved.isCompleted !== false;
        }
        if (saved.subdomain || saved.id) {
          compSlug = saved.subdomain || saved.id;
        }
      }

      if (!isComp) {
        toast.warning("Mandatory Step: Complete your company setup wizard.");
        navigateTo(`/${compSlug}/dashboard`, "wizard");
      } else {
        setDashboardSubTab("dashboard");
        toast.success(
          `Welcome back to ${loadedDoc?.profile?.name || data.companyName || "Workspace"}`,
        );
        navigateTo(`/${compSlug}/dashboard`, "dashboard");
      }
    }
  };

  const saveCompletedCompanyAndRedirect = (completedState: OnboardingState) => {
    const finalCompletedState: OnboardingState = {
      ...completedState,
      isCompleted: true,
    };
    setState(finalCompletedState);

    const activeCompanyId =
      getStorageItem<string | null>("talentflow_active_company_id", null) ||
      finalCompletedState.systemMetadata?.companyId ||
      finalCompletedState.profile.subdomain ||
      finalCompletedState.profile.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    setStorageItem("talentflow_active_company_id", activeCompanyId);

    setStorageItem("talentflow_company_profile", {
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
    });

    // Direct redirect to Dashboard
    setDashboardSubTab("dashboard");
    navigateTo(`/${activeCompanyId}/dashboard`, "dashboard", true);
    toast.success("🎉 Setup complete! Welcome to your Company Dashboard.");

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
      isCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save in database and run cron asynchronously in background
    CompanyApiService.saveCompany(docData)
      .then(() => {
        const allMembers = [
          ...finalCompletedState.hrTeam,
          ...finalCompletedState.teamInvites.map((t) => ({
            name: t.email.split("@")[0],
            email: t.email,
            role: t.role,
          })),
        ];
        if (allMembers.length > 0) {
          CompanyApiService.scheduleDashboardAccessEmailsCron(activeCompanyId, allMembers);
        }
      })
      .catch((err) => {
        console.warn("Error saving company in background:", err);
      });
  };

  const handleWizardCompleted = (completedState?: OnboardingState) => {
    saveCompletedCompanyAndRedirect(completedState || state);
  };

  const handleLogout = async () => {
    await CompanyAuthService.signOut();
    removeStorageItem("talentflow_company_auth");
    removeStorageItem("talentflow_company_profile");
    removeStorageItem("talentflow_active_company_id");
    setIsAuthenticated(false);
    toast.info("Company workspace session signed out.");
    navigateTo("/login", "auth");
  };

  const [candidates] = useState<Candidate[]>([]);

  const [interactionsLog] = useState<
    { id: string; at: string; actor: string; action: string; channel: string }[]
  >([]);

  const totalSteps = 17;
  const progressPercent = Math.round((state.currentStep / totalSteps) * 100);

  return (
    <SmoothScrollProvider>
      <div className="talentflow-company-onboarding-scope min-h-screen bg-background text-foreground flex flex-col font-sans">
        {/* Header Navigation for Company Portal */}
        {activeTab !== "home" && activeTab !== "auth" && activeTab !== "dashboard" && (
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
        <main className={`flex-1 ${activeTab === "dashboard" ? "h-full overflow-hidden" : ""}`}>
          {companyNotFound ? (
            <div className="talentflow-company-onboarding-scope min-h-screen bg-background font-sans text-foreground flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
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
                      navigateTo("/", "home");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ember text-ember-foreground hover:bg-ember/90 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Companies Home</span>
                  </button>
                  <button
                    onClick={() => {
                      setCompanyNotFound(false);
                      navigateTo("/register", "auth");
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
                    navigateTo("/register", "auth");
                  }}
                  onSignIn={() => {
                    navigateTo("/login", "auth");
                  }}
                  onSelectPlan={() => {
                    navigateTo("/register", "auth");
                  }}
                />
              )}

              {activeTab === "auth" && (
                <AuthScreen
                  initialIsSignUp={authMode === "register"}
                  onSuccess={handleAuthSuccess}
                  onBackToHome={() => {
                    navigateTo("/", "home");
                  }}
                />
              )}

              {(activeTab === "wizard" || (activeTab === "dashboard" && !state.isCompleted)) &&
                !state.isCompleted && (
                  <OnboardingWizard
                    state={state}
                    setState={setState}
                    onComplete={handleWizardCompleted}
                  />
                )}

              {(activeTab === "dashboard" || (activeTab === "wizard" && state.isCompleted)) &&
                state.isCompleted && (
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
                    onLogout={handleLogout}
                  />
                )}
            </>
          )}
        </main>
      </div>
    </SmoothScrollProvider>
  );
};
