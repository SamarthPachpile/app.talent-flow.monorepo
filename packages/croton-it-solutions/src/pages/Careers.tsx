import Header from "@croton/components/Header";
import Footer from "@croton/components/Footer";
import CTASection from "@croton/components/CTASection";
import { usePageMeta } from "@croton/lib/use-page-meta";
import CareersHero from "@croton/components/careers/CareersHero";
import FindMatchSection from "@croton/components/careers/FindMatchSection";
import CareersCTA from "@croton/components/careers/CareersCTA";
import CareersFAQ from "@croton/components/careers/CareersFaq";
import CareersIntro from "@croton/components/careers/CareersIntro";
import CareersStats from "@croton/components/careers/CareersStats";
import PeopleFirst from "@croton/components/careers/PeopleFirst";
import RecentPostings from "@croton/components/careers/RecentPostings";
import RecruitmentProcess from "@croton/components/careers/RecruitmentProcess";
import FiveReasons from "@croton/components/careers/FiveReasons";
import SmartBoldHuman from "@croton/components/careers/SmartBoldHuman";
import Testimonials from "@croton/components/careers/Testimonials";
import ZeroDistance from "@croton/components/careers/ZeroDistance";
import CareersSearch from "@croton/components/careers/CareersSearch";

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
