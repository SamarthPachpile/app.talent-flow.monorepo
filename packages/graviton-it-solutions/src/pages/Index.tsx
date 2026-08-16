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
    "Graviton — CRM Consultancy & Applied AI",
    "Graviton, a Tapasys Group company, is a CRM consultancy and applied-AI partner helping revenue, marketing and service teams turn customer data into measurable growth.",
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
