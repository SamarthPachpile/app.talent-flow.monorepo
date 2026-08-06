import { createFileRoute } from "@tanstack/react-router";
import { OnboardedCompaniesPage } from "@/components/pages/companies-page";

export const Route = createFileRoute("/admin-panel/companies")({
  head: () => ({
    meta: [
      { title: "Onboarded Companies Overview — Admin Panel" },
      {
        name: "description",
        content: "Individual company candidate pipeline boards & interaction audit log.",
      },
    ],
  }),
  component: OnboardedCompaniesPage,
});
