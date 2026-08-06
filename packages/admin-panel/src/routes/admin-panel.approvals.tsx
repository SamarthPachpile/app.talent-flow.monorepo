import { createFileRoute } from "@tanstack/react-router";
import { ApprovalsPage } from "@/components/pages/approvals-page";

export const Route = createFileRoute("/admin-panel/approvals")({
  head: () => ({
    meta: [{ title: "Candidate Approvals — Admin Panel" }],
  }),
  component: ApprovalsPage,
});
