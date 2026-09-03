import Header from "@graviton/components/Header";
import HeroSection from "@graviton/components/HeroSection";
import CarouselSection from "@graviton/components/CarouselSection";
import TransformSection from "@graviton/components/TransformSection";
import StatsSection from "@graviton/components/StatsSection";
import ServicesSection from "@graviton/components/ServicesSection";
import IndustriesSection from "@graviton/components/IndustriesSection";
import ImpactSection from "@graviton/components/ImpactSection";
import WorldMapSection from "@graviton/components/WorldMapSection";
import MakeImpactSection from "@graviton/components/MakeImpactSection";
import InsightsSection from "@graviton/components/InsightsSection";
import CTASection from "@graviton/components/CTASection";
import Footer from "@graviton/components/Footer";
import { usePageMeta } from "@graviton/lib/use-page-meta";

export default function Index() {
  usePageMeta(
    "Graviton — Enterprise HR CRM, Candidate Tracking & Workforce Solutions",
    "Graviton is an enterprise HR CRM and workforce software partner providing complete applications for candidate tracking, employee management, automated onboarding, and multi-tenant portals.",
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CarouselSection />
      <TransformSection />
      <StatsSection />
      <ServicesSection />
      <WorldMapSection />
      <IndustriesSection />
      <ImpactSection />
      <MakeImpactSection />
      <InsightsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
