import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
import CTASection from "@graviton/components/CTASection";
import { usePageMeta } from "@graviton/lib/use-page-meta";

const services = [
  {
    title: "Candidate Application & ATS CRM",
    desc: "End-to-end recruitment tracking, multi-channel job postings, and automated candidate pipeline stages.",
  },
  {
    title: "Employee Lifecycle & HRMS",
    desc: "Central employee records, digital org charts, attendance, leave approvals, and appraisals.",
  },
  {
    title: "Smart Digital Onboarding",
    desc: "Automated document collection, background check integrations, digital signing, and Day-1 roadmaps.",
  },
  {
    title: "Candidature Screening & AI Parsing",
    desc: "Resume parsing, AI qualification scoring, and automated candidate interview scheduling.",
  },
  {
    title: "HR Helpdesk & Employee Portal",
    desc: "Self-service workforce helpdesk, policy guidance, payroll slip downloads, and 24/7 AI assistants.",
  },
  {
    title: "Payroll & Compensation Management",
    desc: "Salary structures, deductions, tax compliance filings, and automated compensation disbursements.",
  },
  {
    title: "Workforce Analytics & Intelligence",
    desc: "Hiring velocity metrics, candidate funnel drop-offs, retention analytics, and headcount forecasting.",
  },
  {
    title: "Multi-Tenant Portals & Dragonfly DB Engine",
    desc: "High-throughput candidate portals, company employer workspaces, and super admin control suites.",
  },
];

export default function Services() {
  usePageMeta(
    "HR CRM & Workforce Solutions — Graviton",
    "Comprehensive HR CRM portal software, candidate application tracking, and employee management solutions.",
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section
        id="services"
        data-section="services"
        data-label="Our Services"
        className="pt-32 sm:pt-40 pb-16 sm:pb-20 max-w-[1400px] mx-auto px-4 sm:px-6"
      >
        <p className="text-10px sm:text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Software & Services
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          HR CRM & Workforce Solutions
        </h1>
        <p className="text-muted-foreground max-w-xl mb-12">
          A complete enterprise suite for candidate application management, smart candidature
          verification, employee lifecycle HRMS, and real-time portal operations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group border border-border rounded-xl p-5 sm:p-6 hover:bg-[#ff5a1f] hover:border-[#ff5a1f] hover:shadow-md transition-colors duration-300 cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-primary/10 group-hover:bg-white/20 mb-4 flex items-center justify-center transition-colors">
                <div className="w-3 h-3 rounded-sm bg-primary group-hover:bg-white transition-colors" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      <CTASection />
      <Footer />
    </div>
  );
}
