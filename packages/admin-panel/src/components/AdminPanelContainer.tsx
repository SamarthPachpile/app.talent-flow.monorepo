import React, { useState, useEffect } from "react";
import "../styles.css";
import { WorkspaceProvider } from "../lib/workspace-store";
import { DashboardPage } from "../routes/admin-panel.dashboard";
import { OnboardedCompaniesPage } from "./pages/companies-page";
import { InterviewsPage } from "./pages/interviews-page";
import { ApprovalsPage } from "./pages/approvals-page";
import { OffersPage } from "./pages/offers-page";
import { AdminSettingsPage } from "./pages/settings-index-page";
import { AdminLoginPage } from "./admin-login-page";
import { Toaster } from "./ui/sonner";

export function AdminPanelContainer() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "/admin-panel/login";
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const cleanPath = window.location.pathname.split("?")[0].replace(/\/+$/, "");
      if (cleanPath === "/admin-panel" || cleanPath === "" || cleanPath.endsWith("/login")) {
        localStorage.removeItem("talentflow_admin_auth");
        return false;
      }
      return !!localStorage.getItem("talentflow_admin_auth");
    }
    return false;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const renderCurrentView = () => {
    if (!isAuthenticated) {
      return <AdminLoginPage onSuccess={() => setIsAuthenticated(true)} />;
    }

    const cleanPath = currentPath.split("?")[0].replace(/\/+$/, "");

    if (cleanPath.endsWith("/login")) {
      return <AdminLoginPage onSuccess={() => setIsAuthenticated(true)} />;
    }
    if (cleanPath.endsWith("/companies")) {
      return <OnboardedCompaniesPage />;
    }
    if (cleanPath.endsWith("/interviews")) {
      return <InterviewsPage />;
    }
    if (cleanPath.endsWith("/approvals")) {
      return <ApprovalsPage />;
    }
    if (cleanPath.endsWith("/offers")) {
      return <OffersPage />;
    }
    if (cleanPath.includes("/settings")) {
      return <AdminSettingsPage />;
    }

    return <DashboardPage />;
  };

  return (
    <WorkspaceProvider>
      <div className="talentflow-admin-panel-scope min-h-screen bg-background text-foreground font-sans">
        {renderCurrentView()}
        <Toaster />
      </div>
    </WorkspaceProvider>
  );
}

export default AdminPanelContainer;
