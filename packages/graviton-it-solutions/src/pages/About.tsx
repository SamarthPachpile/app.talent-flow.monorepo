import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
import AboutHeroSection from "@graviton/components/about/AboutHeroSection";
import InnovationSection from "@graviton/components/about/InnovationSection";
import DesignPrinciplesSection from "@graviton/components/about/DesignPrinciplesSection";
import WhatSetsUsApartSection from "@graviton/components/about/WhatSetsUsApartSection";
import PlanetSection from "@graviton/components/about/PlanetSection";
import PeopleCultureSection from "@graviton/components/about/PeopleCultureSection";
import ClientImpactSection from "@graviton/components/about/ClientImpactSection";
import AboutStatsSection from "@graviton/components/about/AboutStatsSection";
import { usePageMeta } from "@graviton/lib/use-page-meta";
import Slider from "@graviton/components/about/Slider";
import CTASection from "@graviton/components/CTASection";

export default function About() {
  usePageMeta(
    "About Us — Graviton",
    "Graviton, a Tapasys Group company, is a CRM consultancy and applied-AI partner.",
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
