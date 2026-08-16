import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
import CTASection from "@graviton/components/CTASection";
import { usePageMeta } from "@graviton/lib/use-page-meta";
import CareersHero from "@graviton/components/careers/CareersHero";
import FindMatchSection from "@graviton/components/careers/FindMatchSection";
import CareersCTA from "@graviton/components/careers/CareersCTA";
import CareersFAQ from "@graviton/components/careers/CareersFaq";
import CareersIntro from "@graviton/components/careers/CareersIntro";
import CareersStats from "@graviton/components/careers/CareersStats";
import PeopleFirst from "@graviton/components/careers/PeopleFirst";
import RecentPostings from "@graviton/components/careers/RecentPostings";
import RecruitmentProcess from "@graviton/components/careers/RecruitmentProcess";
import FiveReasons from "@graviton/components/careers/FiveReasons";
import SmartBoldHuman from "@graviton/components/careers/SmartBoldHuman";
import Testimonials from "@graviton/components/careers/Testimonials";
import ZeroDistance from "@graviton/components/careers/ZeroDistance";
import CareersSearch from "@graviton/components/careers/CareersSearch";

export default function Careers() {
  usePageMeta("Careers — Graviton", "Join Graviton — a CRM and applied-AI consultancy.");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <CareersHero />
      <CareersSearch />
      <RecentPostings />
      <CareersIntro />
      <CareersStats />
      <PeopleFirst />
      <SmartBoldHuman />
      <FiveReasons />
      <RecruitmentProcess />
      <ZeroDistance />
      <Testimonials />
      <CareersFAQ />
      <CareersCTA />
      <Footer />
    </div>
  );
}
