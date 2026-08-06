import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-panel")({
  head: () => ({
    meta: [
      { title: "Global ATS Pipeline Board — Admin CRM" },
      {
        name: "description",
        content:
          "Global recruiter pipeline board showing all candidate micro-stages across all client companies.",
      },
    ],
  }),
  component: AdminPanelLayout,
});

function AdminPanelLayout() {
  return <Outlet />;
}
