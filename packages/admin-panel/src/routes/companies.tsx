import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Company Onboarding & Pipeline Portal" },
      {
        name: "description",
        content: "Onboard your company workspace and manage candidate recruitment.",
      },
    ],
  }),
  component: CompaniesLayout,
});

function CompaniesLayout() {
  return <Outlet />;
}
