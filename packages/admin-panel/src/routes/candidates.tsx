import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/candidates")({
  component: CandidatesLayout,
});

function CandidatesLayout() {
  return <Outlet />;
}
