import Header from "@croton/components/Header";
import Footer from "@croton/components/Footer";
import AboutHeroSection from "@croton/components/about/AboutHeroSection";
import InnovationSection from "@croton/components/about/InnovationSection";
import DesignPrinciplesSection from "@croton/components/about/DesignPrinciplesSection";
import WhatSetsUsApartSection from "@croton/components/about/WhatSetsUsApartSection";
import PlanetSection from "@croton/components/about/PlanetSection";
import PeopleCultureSection from "@croton/components/about/PeopleCultureSection";
import ClientImpactSection from "@croton/components/about/ClientImpactSection";
import AboutStatsSection from "@croton/components/about/AboutStatsSection";
import { usePageMeta } from "@croton/lib/use-page-meta";
import Slider from "@croton/components/about/Slider";
import CTASection from "@croton/components/CTASection";

export default function About() {
  usePageMeta(
    "About Us — Croton",
    "Croton, a Tapasys Group company, is a CRM consultancy and applied-AI partner.",
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutHeroSection />
      <Slider />
      <InnovationSection />
      <DesignPrinciplesSection />
      <WhatSetsUsApartSection />
      <PlanetSection />
      <PeopleCultureSection />
      <ClientImpactSection />
      <AboutStatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
