import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import {
  MOCK_CANDIDATES,
  emptyCandidatePortalState,
  createDefaultCandidateState,
} from "./data/mockCandidateData";
import { CandidatePortalState, StageId, HardwareSelection } from "./types/candidate";
import { Header } from "./components/Header";
import { CandidateHero } from "./components/CandidateHero";
import { StageStepper } from "./components/StageStepper";
import { ApplicationStageView } from "./components/stages/ApplicationStageView";
import { InterviewStageView } from "./components/stages/InterviewStageView";
import { OfferStageView } from "./components/stages/OfferStageView";
import { BackgroundCheckStageView } from "./components/stages/BackgroundCheckStageView";
import { HardwareSetupStageView } from "./components/stages/HardwareSetupStageView";
import { CredentialsStageView } from "./components/stages/CredentialsStageView";
import { DayOneStageView } from "./components/stages/DayOneStageView";
import { NotificationCenter } from "./components/NotificationCenter";
import { HelpdeskModal } from "./components/HelpdeskModal";
import { CandidateAuthScreen, CandidateAuthSuccessData } from "./components/CandidateAuthScreen";
import { CandidateOnboardingWizard } from "./components/CandidateOnboardingWizard";
import { CandidateSettingsComponent } from "./components/CandidateSettings";
import { CandidateCompanySelector } from "./components/CandidateCompanySelector";
import { Toaster, toast } from "sonner";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { Building2, ArrowLeft, Plus } from "lucide-react";
import {
  CandidateApiService,
  CompanyApiService,
  CandidateDocument,
  CompanyDocument,
  FirebaseAuthService,
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

  const [activeCandidateKey, setActiveCandidateKey] = useState<"alex" | "sarah">("alex");
  const [portalState, setPortalState] = useState<CandidatePortalState>(
    MOCK_CANDIDATES["alex"] || emptyCandidatePortalState,
  );

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
      fullName: "Alex Rivera",
      email: "alex.rivera@gmail.com",
      isCompleted: true,
    };
  });

  const [activeStageId, setActiveStageId] = useState<StageId>(
    (MOCK_CANDIDATES["alex"] || emptyCandidatePortalState).candidate.currentStageId ||
      "application",
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpdesk, setShowHelpdesk] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  // Helper to load candidate data from Firestore 'candidates' collection
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
          setCandidateProfile(candDoc);
          localStorage.setItem("talentflow_candidate_profile", JSON.stringify(candDoc));
          setPortalState((prev) => ({
            ...prev,
            candidate: {
              ...prev.candidate,
              name: candDoc.fullName || prev.candidate.name,
              email: candDoc.email || prev.candidate.email,
              phone: candDoc.phone || prev.candidate.phone,
            },
          }));
        }
      } catch (err) {
        console.warn("Error fetching candidate from Firestore 'candidates' collection:", err);
      }
    },
    [],
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadAuthenticatedCandidateData();
    }
  }, [isAuthenticated, loadAuthenticatedCandidateData]);

  // Handle direct visits to company routes when unauthenticated
  useEffect(() => {
    const route = getRouteInfo(currentPath);
    if (
      (route.targetView === "dashboard" || route.targetView === "company_root" || route.targetView === "wizard") &&
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

    const key =
      data.candidateKey || (data.email.toLowerCase().includes("sarah") ? "sarah" : "alex");
    if (MOCK_CANDIDATES[key]) {
      setActiveCandidateKey(key as "alex" | "sarah");
      setPortalState(MOCK_CANDIDATES[key]);
      setActiveStageId(MOCK_CANDIDATES[key].candidate.currentStageId || "application");
    } else {
      const customState = createDefaultCandidateState(
        data.fullName || "Candidate User",
        data.email,
      );
      setPortalState(customState);
      setActiveStageId(customState.candidate.currentStageId || "application");
    }

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
      (activeCompany?.name ? activeCompany.name.toLowerCase().replace(/[^a-z0-9]/g, "-") : "company");

    if (companySlug) {
      await CompanyApiService.registerCandidateToCompany(companySlug, updatedCandidate);
    }

    setPortalState((prev) => ({
      ...prev,
      candidate: {
        ...prev.candidate,
        name: completedCandidate.fullName,
        email: completedCandidate.email,
        phone: completedCandidate.phone || prev.candidate.phone,
        companyName: activeCompany?.name || prev.candidate.companyName,
      },
    }));

    toast.success(
      `Candidate profile for ${completedCandidate.fullName} saved to Firestore 'candidates' collection & registered under company!`,
    );
    navigateTo(`/candidates-portal/${companySlug}/dashboard`);
  };

  const handleSelectCandidate = (key: string) => {
    if (key === "alex" || key === "sarah") {
      setActiveCandidateKey(key);
      const newCandidateState = MOCK_CANDIDATES[key] || emptyCandidatePortalState;
      setPortalState(newCandidateState);
      setActiveStageId(newCandidateState.candidate.currentStageId || "application");
      if (newCandidateState.candidate.name) {
        toast.info(`Switched candidate view: ${newCandidateState.candidate.name}`);
      }
    }
  };

  const handleLogout = async () => {
    await FirebaseAuthService.signOut();
    localStorage.removeItem("talentflow_candidate_auth");
    localStorage.removeItem("talentflow_candidate_profile");
    setIsAuthenticated(false);
    setShowSettings(false);
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

  const unreadNotifCount = portalState.notifications.filter((n) => !n.read).length;

  const routeInfo = getRouteInfo(currentPath);

  // 0. Dedicated 404 - Company Not Found View when an invalid/non-existent company route is accessed
  if (routeInfo.companySlug && !isCompanyLoading && isCompanyNotFound) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <Toaster position="top-right" theme={darkMode ? "dark" : "light"} />
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
                  if (window.location.port === "3002") {
                    window.location.href = "http://localhost:3001";
                  } else {
                    window.location.href = "/companies";
                  }
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
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Toaster position="top-right" theme={darkMode ? "dark" : "light"} />
        <CandidateCompanySelector
          onSelectCompany={handleSelectCompanyFromList}
          onCompanyOnboardingLink={() => {
            if (typeof window !== "undefined") {
              if (window.location.port === "3002") {
                window.location.href = "http://localhost:3001";
              } else {
                window.location.href = "/companies";
              }
            }
          }}
        />
      </div>
    );
  }

  // 2. Candidate Auth Screen View (/candidates-portal/<company_name>/login)
  if (
    routeInfo.targetView === "auth" ||
    ((routeInfo.targetView === "dashboard" || routeInfo.targetView === "company_root" || routeInfo.targetView === "wizard") &&
      !isAuthenticated)
  ) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Toaster position="top-right" theme={darkMode ? "dark" : "light"} />
        <CandidateAuthScreen
          company={activeCompany}
          onSuccess={handleAuthSuccess}
          onBackToCompanies={() => navigateTo("/candidates-portal")}
          onBackToHome={() => navigateTo("/candidates-portal")}
        />
      </div>
    );
  }

  // 3. Setup Wizard View (/candidates-portal/<company_name>/wizard)
  if (routeInfo.targetView === "wizard" && isAuthenticated) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Toaster position="top-right" theme={darkMode ? "dark" : "light"} />
        <CandidateOnboardingWizard
          candidateData={candidateProfile}
          onComplete={handleWizardCompleted}
        />
      </div>
    );
  }

  // 4. Candidate Dashboard View (/candidates-portal/<company_name>/dashboard or /candidates-portal/<company_name>/)
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Toaster position="top-right" theme={darkMode ? "dark" : "light"} />

        {/* Top AppNav Header */}
        <Header
          candidate={portalState.candidate}
          company={activeCompany}
          activeCandidateKey={activeCandidateKey}
          onSelectCandidate={handleSelectCandidate}
          unreadCount={unreadNotifCount}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          onOpenHelpdesk={() => setShowHelpdesk(true)}
          onOpenSettings={() => setShowSettings(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onLogout={handleLogout}
        />

        {showSettings ? (
          <main className="px-6 py-6 max-w-7xl mx-auto">
            <CandidateSettingsComponent onClose={() => setShowSettings(false)} />
          </main>
        ) : (
          <>
            {/* Page Title & Stats Header Banner */}
            <CandidateHero
              candidate={portalState.candidate}
              company={activeCompany}
              stages={portalState.stages}
              onOpenStage={(stageId) => setActiveStageId(stageId as StageId)}
            />

            <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
              {/* 7-Stage Roadmap Stepper */}
              <StageStepper
                stages={portalState.stages}
                activeStageId={activeStageId}
                onSelectStage={(stageId) => setActiveStageId(stageId)}
              />

              {/* Active Stage Details View */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lifted">
                {activeStageId === "application" && (
                  <ApplicationStageView
                    application={portalState.application}
                    candidate={portalState.candidate}
                  />
                )}

                {activeStageId === "interview" && (
                  <InterviewStageView interviews={portalState.interviews} />
                )}

                {activeStageId === "offer" && (
                  <OfferStageView
                    offer={portalState.offer}
                    candidate={portalState.candidate}
                    onAcceptOffer={handleAcceptOffer}
                  />
                )}

                {activeStageId === "background_check" && (
                  <BackgroundCheckStageView
                    backgroundCheck={portalState.backgroundCheck}
                    onUploadDoc={(docId) => toast.success(`Uploaded document: ${docId}`)}
                  />
                )}

                {activeStageId === "hardware_setup" && (
                  <HardwareSetupStageView
                    hardware={portalState.hardware}
                    onUpdateHardware={handleUpdateHardware}
                  />
                )}

                {activeStageId === "credentials" && (
                  <CredentialsStageView credentials={portalState.credentials} />
                )}

                {activeStageId === "day_one" && (
                  <DayOneStageView dayOne={portalState.dayOne} candidate={portalState.candidate} />
                )}
              </div>
            </main>
          </>
        )}

        {/* Notifications Drawer */}
        {showNotifications && (
          <NotificationCenter
            notifications={portalState.notifications}
            onClose={() => setShowNotifications(false)}
            onSelectStage={(stageId) => setActiveStageId(stageId)}
          />
        )}

        {/* Helpdesk Modal */}
        {showHelpdesk && (
          <HelpdeskModal
            candidate={portalState.candidate}
            company={activeCompany}
            onClose={() => setShowHelpdesk(false)}
          />
        )}
      </div>
    </ReactLenis>
  );
}
