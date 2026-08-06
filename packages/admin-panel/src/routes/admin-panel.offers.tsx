import { createFileRoute } from "@tanstack/react-router";
import { OffersPage } from "@/components/pages/offers-page";

export const Route = createFileRoute("/admin-panel/offers")({
  head: () => ({
    meta: [{ title: "Offers & E-Signature — Admin Panel" }],
  }),
  component: OffersPage,
});
