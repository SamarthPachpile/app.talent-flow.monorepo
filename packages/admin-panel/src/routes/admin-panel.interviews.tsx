import { createFileRoute } from "@tanstack/react-router";
import { InterviewsPage } from "@/components/pages/interviews-page";

export const Route = createFileRoute("/admin-panel/interviews")({
  head: () => ({
    meta: [{ title: "Interviews & Scheduling Calendar — Admin Panel" }],
  }),
  component: InterviewsPage,
});
