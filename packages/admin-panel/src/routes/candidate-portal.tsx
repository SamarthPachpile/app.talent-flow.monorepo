import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/candidate-portal")({
  head: () => ({
    meta: [
      { title: "Candidate Portal — TalentFlow Hub" },
      {
        name: "description",
        content: "Track application progress, interview schedules, offers, and onboarding.",
      },
    ],
  }),
  component: CandidatePortalLayout,
});

function CandidatePortalLayout() {
  return <Outlet />;
}
