import { createFileRoute } from "@tanstack/react-router";
import { App as CompanyOnboardingApp } from "@talent-flow/company-onboarding";

export const Route = createFileRoute("/companies/$companyName/login")({
  component: CompanyOnboardingApp,
});
