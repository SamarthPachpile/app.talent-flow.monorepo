import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import {
  emptyCandidatePortalState,
  createCandidatePortalStateFromDoc,
} from "./data/mockCandidateData";
import { CandidatePortalState, StageId, HardwareSelection } from "./types/candidate";
import { CandidateAuthScreen, CandidateAuthSuccessData } from "./components/CandidateAuthScreen";
import { CandidateOnboardingWizard } from "./components/CandidateOnboardingWizard";
import { CandidateCompanySelector } from "./components/CandidateCompanySelector";
import { CandidateDashboardLayout } from "./components/CandidateDashboardLayout";
import { toast } from "./lib/sweetalert";
import { Building2, ArrowLeft, Plus } from "lucide-react";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import {
  CandidateApiService,
  CandidateDocument,
  CandidateAuthService,
  CompanyApiService,
  CompanyDocument,
} from "@talent-flow/api";

type CandidatePortalView = "companies_list" | "auth" | "wizard" | "dashboard" | "company_root";

const getRouteInfo = (pathname: string) => {
  const clean = pathname.split("?")[0].replace(/\/+$/, "");
  const segments = clean.split("/").filter(Boolean);

  if (
    segments.length === 0 ||
    (segments.length === 1 &&
      (segments[0] === "candidates-portal" ||
        segments[0] === "candidate-portal" ||
        segments[0] === "candidates"))
  ) {
    return { targetView: "companies_list" as CandidatePortalView, companySlug: null };
  }

  if (
    segments[0] === "candidates-portal" ||
    segments[0] === "candidate-portal" ||
    segments[0] === "candidates"
  ) {
    if (segments[1] === "login" || segments[1] === "auth") {
      return { targetView: "auth" as CandidatePortalView, companySlug: null };
    }
    if (segments[1] === "dashboard") {
      return { targetView: "dashboard" as CandidatePortalView, companySlug: null };
    }
    if (segments[1] === "wizard") {
      return { targetView: "wizard" as CandidatePortalView, companySlug: null };
    }

    const companySlug = segments[1];
    const action = segments[2];

    if (action === "login" || action === "auth") {
      return { targetView: "auth" as CandidatePortalView, companySlug };
    }
    if (action === "wizard") {
      return { targetView: "wizard" as CandidatePortalView, companySlug };
    }
    if (action === "dashboard") {
      return { targetView: "dashboard" as CandidatePortalView, companySlug };
    }

    // Default root route for company portal: /candidates-portal/<company_name>/
    return { targetView: "company_root" as CandidatePortalView, companySlug };
  }

  return { targetView: "companies_list" as CandidatePortalView, companySlug: null };
};

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "/candidates-portal";
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("talentflow_candidate_auth");
  });

  const [activeCompany, setActiveCompany] = useState<CompanyDocument | null>(null);

  const [portalState, setPortalState] = useState<CandidatePortalState>(emptyCandidatePortalState);

  const [candidateProfile, setCandidateProfile] = useState<Partial<CandidateDocument>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("talentflow_candidate_profile");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {
      fullName: "Candidate User",
      email: "candidate@example.com",
      isCompleted: true,
    };
  });

  const [activeStageId, setActiveStageId] = useState<StageId>("application");
  const [darkMode, setDarkMode] = useState(false);

  const [isCompanyLoading, setIsCompanyLoading] = useState<boolean>(false);
  const [isCompanyNotFound, setIsCompanyNotFound] = useState<boolean>(false);

  // Load Company document when companySlug changes
  useEffect(() => {
    const route = getRouteInfo(currentPath);
    if (route.companySlug) {
      setIsCompanyLoading(true);
      let isMounted = true;
      CompanyApiService.getCompanyByNameOrDocId(route.companySlug).then((comp) => {
        if (isMounted) {
          setIsCompanyLoading(false);
          if (comp) {
            setActiveCompany(comp);
            setIsCompanyNotFound(false);
            setPortalState((prev) => ({
              ...prev,
              candidate: {
                ...prev.candidate,
                companyName: comp.name || prev.candidate.companyName,
              },
            }));
          } else {
            setActiveCompany(null);
            setIsCompanyNotFound(true);
          }
        }
      });
      return () => {
        isMounted = false;
      };
    } else {
      setActiveCompany(null);
      setIsCompanyNotFound(false);
      setIsCompanyLoading(false);
    }
  }, [currentPath]);

  // Helper to load candidate data dynamically from Firestore 'candidates' collection
  const loadAuthenticatedCandidateData = useCallback(
    async (emailToUse?: string, uidToUse?: string) => {
      let email = emailToUse;
      if (!email && typeof window !== "undefined") {
        const authStr = localStorage.getItem("talentflow_candidate_auth");
        if (authStr) {
          try {
            const parsed = JSON.parse(authStr);
            email = parsed.email;
          } catch {
            // ignore
          }
        }
      }

      if (!email) return;

      try {
        const candDoc = await CandidateApiService.getCandidateByEmailOrUid(email, uidToUse);
        if (candDoc) {
          let isLocallyCompleted = false;
          if (typeof window !== "undefined") {
            try {
              const savedStr = localStorage.getItem("talentflow_candidate_profile");
              if (savedStr) {
                const parsed = JSON.parse(savedStr);
                if (parsed.isCompleted === true) isLocallyCompleted = true;
              }
            } catch {
              // ignore
            }
          }

          const finalCandDoc = {
            ...candDoc,
            isCompleted: isLocallyCompleted || candDoc.isCompleted !== false,
          };
          setCandidateProfile(finalCandDoc);
          localStorage.setItem("talentflow_candidate_profile", JSON.stringify(finalCandDoc));
          const dynamicState = createCandidatePortalStateFromDoc(finalCandDoc, activeCompany);
          setPortalState(dynamicState);
          setActiveStageId(dynamicState.candidate.currentStageId || "application");
        }
      } catch (err) {
        console.warn("Error fetching candidate from Firestore 'candidates' collection:", err);
      }
    },
    [activeCompany],
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadAuthenticatedCandidateData();
    }
  }, [isAuthenticated, loadAuthenticatedCandidateData]);

  // Listen to Firebase Auth state updates with candidate role verification
  useEffect(() => {
    const unsubscribe = CandidateAuthService.onAuthChange(async (user) => {
      if (user && user.email) {
        // Verify this user is an authorized candidate
        const candDoc = await CandidateApiService.getCandidateByEmailOrUid(user.email, user.uid);
        if (candDoc) {
          setIsAuthenticated(true);
          await loadAuthenticatedCandidateData(user.email, user.uid);
        } else {
          // User is not a candidate account (could be a company admin active in auth)
          const storedAuth = localStorage.getItem("talentflow_candidate_auth");
          if (!storedAuth) {
            setIsAuthenticated(false);
          }
        }
      } else {
        const storedAuth = localStorage.getItem("talentflow_candidate_auth");
        if (!storedAuth) {
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadAuthenticatedCandidateData]);

  // Handle direct visits to company routes when unauthenticated
  useEffect(() => {
    const route = getRouteInfo(currentPath);
    if (
      (route.targetView === "dashboard" ||
        route.targetView === "company_root" ||
        route.targetView === "wizard") &&
      !isAuthenticated
    ) {
      const slug = route.companySlug || "company";
      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/login")) {
        window.history.pushState({}, "", `/candidates-portal/${slug}/login`);
        setCurrentPath(`/candidates-portal/${slug}/login`);
      }
    }
  }, [currentPath, isAuthenticated]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
    }
    setCurrentPath(path);
  };

  const handleSelectCompanyFromList = (company: CompanyDocument) => {
    const slug = (company.subdomain || company.id || company.name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    setActiveCompany(company);
    setPortalState((prev) => ({
      ...prev,
      candidate: { ...prev.candidate, companyName: company.name },
    }));
    navigateTo(`/candidates-portal/${slug}/login`);
  };

  const handleAuthSuccess = async (data: CandidateAuthSuccessData) => {
    setIsAuthenticated(true);
    localStorage.setItem(
      "talentflow_candidate_auth",
      JSON.stringify({ authenticated: true, email: data.email }),
    );

    const initialDoc: Partial<CandidateDocument> = {
      fullName: data.fullName || "Candidate User",
      email: data.email,
      isCompleted: !data.isNewAccount,
    };
    const dynamicState = createCandidatePortalStateFromDoc(initialDoc, activeCompany);
    setPortalState(dynamicState);
    setActiveStageId(dynamicState.candidate.currentStageId || "application");

    const companySlug =
      activeCompany?.subdomain ||
      activeCompany?.id ||
      (activeCompany?.name ? activeCompany.name.toLowerCase().replace(/[^a-z0-9]/g, "-") : "acme");

    if (data.isNewAccount) {
      const newCandDoc: CandidateDocument = {
        id: (data.email || data.fullName || "cand").toLowerCase().replace(/[^a-z0-9]/g, ""),
        fullName: data.fullName || "Candidate User",
        email: data.email,
        isCompleted: false, // Setup Wizard pending
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCandidateProfile(newCandDoc);
      localStorage.setItem("talentflow_candidate_profile", JSON.stringify(newCandDoc));
      await CandidateApiService.saveCandidateToFirestore(newCandDoc);

      toast.info("Account verified! Please complete your candidate setup wizard.");
      navigateTo(`/candidates-portal/${companySlug}/wizard`);
    } else {
      await loadAuthenticatedCandidateData(data.email);
      const stored = localStorage.getItem("talentflow_candidate_profile");
      let isComp = true;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          isComp = parsed.isCompleted ?? true;
        } catch {
          // ignore
        }
      }

      if (!isComp) {
        toast.warning("Mandatory Step: Please complete your candidate setup wizard.");
        navigateTo(`/candidates-portal/${companySlug}/wizard`);
      } else {
        navigateTo(`/candidates-portal/${companySlug}/dashboard`);
      }
    }
  };

  const handleWizardCompleted = async (completedCandidate: CandidateDocument) => {
    const updatedCandidate = { ...completedCandidate, isCompleted: true };
    setCandidateProfile(updatedCandidate);
    if (typeof window !== "undefined") {
      localStorage.setItem("talentflow_candidate_profile", JSON.stringify(updatedCandidate));
    }

    await CandidateApiService.saveCandidateToFirestore(updatedCandidate);

    const companySlug =
      activeCompany?.subdomain ||
      activeCompany?.id ||
      (activeCompany?.name
        ? activeCompany.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
        : "company");

    if (companySlug) {
      await CompanyApiService.registerCandidateToCompany(companySlug, updatedCandidate);
    }

    const dynamicState = createCandidatePortalStateFromDoc(updatedCandidate, activeCompany);
    setPortalState(dynamicState);
    setActiveStageId(dynamicState.candidate.currentStageId || "application");

    toast.success(
      `Candidate profile for ${completedCandidate.fullName} saved to Firestore & registered under company!`,
    );
    navigateTo(`/candidates-portal/${companySlug}/dashboard`);
  };

  const handleUpdateCandidateAvatar = async (newAvatarUrl: string) => {
    setPortalState((prev) => ({
      ...prev,
      candidate: {
        ...prev.candidate,
        avatarUrl: newAvatarUrl,
      },
    }));

    const updatedProfile = {
      ...candidateProfile,
      avatarUrl: newAvatarUrl,
    };
    setCandidateProfile(updatedProfile);

    if (typeof window !== "undefined") {
      localStorage.setItem("talentflow_candidate_profile", JSON.stringify(updatedProfile));
    }

    if (updatedProfile.email || updatedProfile.id) {
      try {
        await CandidateApiService.saveCandidateToFirestore(updatedProfile as CandidateDocument);
      } catch (err) {
        console.warn("Failed to persist avatar to Firestore:", err);
      }
    }
  };

  const handleLogout = async () => {
    await CandidateAuthService.signOut();
    localStorage.removeItem("talentflow_candidate_auth");
    localStorage.removeItem("talentflow_candidate_profile");
    setIsAuthenticated(false);
    toast.info("Signed out of candidate portal");

    const companySlug =
      activeCompany?.subdomain ||
      activeCompany?.id ||
      (activeCompany?.name ? activeCompany.name.toLowerCase().replace(/[^a-z0-9]/g, "-") : null);

    if (companySlug) {
      navigateTo(`/candidates-portal/${companySlug}/login`);
    } else {
      navigateTo("/candidates-portal");
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAcceptOffer = (signedName: string) => {
    setPortalState((prev) => {
      const updatedOffer = {
        ...prev.offer,
        status: "accepted" as const,
        signedAt: new Date().toISOString(),
        signedName,
      };

      const updatedStages = prev.stages.map((s) =>
        s.id === "offer"
          ? { ...s, status: "completed" as const, badge: "Signed & Accepted" }
          : s.id === "background_check"
            ? { ...s, status: "action_required" as const, badge: "Form Pending" }
            : s,
      );

      return {
        ...prev,
        offer: updatedOffer,
        stages: updatedStages,
        candidate: { ...prev.candidate, currentStageId: "background_check" },
      };
    });

    toast.success("Offer contract e-signed successfully!");
    setActiveStageId("background_check");
  };

  const handleUpdateHardware = (updated: Partial<HardwareSelection>) => {
    setPortalState((prev) => ({
      ...prev,
      hardware: {
        ...prev.hardware,
        ...updated,
        status: "ordered",
        trackingNumber: "FX-9823419082-US",
        carrier: "FedEx Express",
        estimatedDelivery: "Tomorrow by 10:30 AM",
      },
    }));
    toast.success("Hardware choices confirmed & order dispatched to IT!");
  };

  const routeInfo = getRouteInfo(currentPath);

  const renderViewContent = () => {
    // 0. Dedicated 404 - Company Not Found View when an invalid/non-existent company route is accessed
    if (routeInfo.companySlug && !isCompanyLoading && isCompanyNotFound) {
      return (
        <div className="talentflow-candidate-portal-scope min-h-screen bg-background font-sans text-foreground flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="max-w-md w-full bg-card border border-border/80 rounded-2xl p-8 shadow-xl space-y-6">
            <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto ring-8 ring-destructive/5">
              <Building2 className="size-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-mono font-semibold rounded-full uppercase tracking-wider">
                404 — Page Not Found
              </span>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Company Portal Not Found
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No company workspace matching{" "}
                <code className="text-ember font-mono bg-ember/10 px-1.5 py-0.5 rounded font-semibold">
                  "{routeInfo.companySlug}"
                </code>{" "}
                was found in the database.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigateTo("/candidates-portal")}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ember text-ember-foreground hover:bg-ember/90 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Available Companies</span>
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/companies/register";
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border hover:bg-accent text-foreground font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="size-4 text-ember" />
                <span>Register Company</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 1. Companies Selection Landing View at /candidates-portal
    if (routeInfo.targetView === "companies_list") {
      return (
        <div className="talentflow-candidate-portal-scope min-h-screen bg-background font-sans text-foreground">
          <CandidateCompanySelector
            onSelectCompany={handleSelectCompanyFromList}
            onCompanyOnboardingLink={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/companies/register";
              }
            }}
          />
        </div>
      );
    }

    // 2. Candidate Auth Screen View (/candidates-portal/<company_name>/login)
    if (
      routeInfo.targetView === "auth" ||
      ((routeInfo.targetView === "dashboard" ||
        routeInfo.targetView === "company_root" ||
        routeInfo.targetView === "wizard") &&
        !isAuthenticated)
    ) {
      return (
        <div className="talentflow-candidate-portal-scope min-h-screen bg-background font-sans text-foreground">
          <CandidateAuthScreen
            company={activeCompany}
            onSuccess={handleAuthSuccess}
            onBackToCompanies={() => navigateTo("/candidates-portal")}
            onBackToHome={() => navigateTo("/candidates-portal")}
          />
        </div>
      );
    }

    // 3. Mandatory One-Time Setup Wizard View (ONLY when account has not completed setup wizard)
    const isCandidateSetupDone = candidateProfile.isCompleted !== false;

    if (isAuthenticated && !isCandidateSetupDone) {
      return (
        <div className="talentflow-candidate-portal-scope min-h-screen bg-background font-sans text-foreground">
          <CandidateOnboardingWizard
            candidateData={candidateProfile}
            onComplete={handleWizardCompleted}
          />
        </div>
      );
    }

    // 4. Candidate Dashboard View (Once setup wizard is completed)
    return (
      <div className="talentflow-candidate-portal-scope min-h-screen bg-background font-sans text-foreground">
        <CandidateDashboardLayout
          portalState={portalState}
          setPortalState={setPortalState}
          company={activeCompany}
          activeStageId={activeStageId}
          setActiveStageId={setActiveStageId}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onLogout={handleLogout}
          onAcceptOffer={handleAcceptOffer}
          onUpdateHardware={handleUpdateHardware}
          onUpdateAvatar={handleUpdateCandidateAvatar}
        />
      </div>
    );
  };

  return <SmoothScrollProvider>{renderViewContent()}</SmoothScrollProvider>;
}
