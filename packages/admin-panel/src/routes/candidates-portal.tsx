import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/candidates-portal")({
  head: () => ({
    meta: [
      { title: "Candidate Portal — TalentFlow Hub" },
      {
        name: "description",
        content: "Track application progress, interview schedules, offers, and onboarding.",
      },
    ],
  }),
  component: CandidatesPortalLayout,
});

function CandidatesPortalLayout() {
  return <Outlet />;
}
