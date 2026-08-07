import Header from "@croton/components/Header";
import HeroSection from "@croton/components/HeroSection";
import CarouselSection from "@croton/components/CarouselSection";
import TransformSection from "@croton/components/TransformSection";
import StatsSection from "@croton/components/StatsSection";
import ServicesSection from "@croton/components/ServicesSection";
import IndustriesSection from "@croton/components/IndustriesSection";
import ImpactSection from "@croton/components/ImpactSection";
import WorldMapSection from "@croton/components/WorldMapSection";
import MakeImpactSection from "@croton/components/MakeImpactSection";
import InsightsSection from "@croton/components/InsightsSection";
import CTASection from "@croton/components/CTASection";
import Footer from "@croton/components/Footer";
import { usePageMeta } from "@croton/lib/use-page-meta";

export default function Index() {
  usePageMeta(
    "Croton — CRM Consultancy & Applied AI",
    "Croton, a Tapasys Group company, is a CRM consultancy and applied-AI partner helping revenue, marketing and service teams turn customer data into measurable growth.",
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
