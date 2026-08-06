import { createFileRoute } from "@tanstack/react-router";
import { App as CandidatePortalApp } from "@talent-flow/candidate-portal";

export const Route = createFileRoute("/candidate-portal/dashboard")({
  component: CandidatePortalApp,
});
