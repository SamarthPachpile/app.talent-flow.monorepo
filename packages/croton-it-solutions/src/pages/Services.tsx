import Header from "@croton/components/Header";
import Footer from "@croton/components/Footer";
import { usePageMeta } from "@croton/lib/use-page-meta";

const services = [
  {
    title: "CRM Strategy & Advisory",
    desc: "Vendor selection, roadmaps, RevOps design and CRM operating model.",
  },
  {
    title: "Salesforce Implementation",
    desc: "Sales Cloud, Service Cloud, Marketing Cloud and Data Cloud rollouts.",
  },
  {
    title: "HubSpot & Zoho",
    desc: "Sales, marketing and service hubs configured around your buyer journey.",
  },
  {
    title: "Microsoft Dynamics 365",
    desc: "Enterprise-grade Dynamics deployments with Power Platform extensions.",
  },
  {
    title: "CRM Migration & Integration",
    desc: "Clean data migrations and pre-built integrations to your stack.",
  },
  {
    title: "AI & Agentic Automation",
    desc: "Predictive scoring, copilots, agentic workflows and conversation intelligence.",
  },
  {
    title: "Analytics & RevOps",
    desc: "Dashboards, attribution and revenue analytics teams actually use.",
  },
  {
    title: "Managed CRM Operations",
    desc: "Ongoing admin, optimization and enhancements as a managed service.",
  },
];

export default function Services() {
  usePageMeta(
    "Services — Croton",
    "End-to-end CRM consulting, implementation and AI services from Croton.",
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section
        id="services"
        data-section="services"
        data-label="Services"
        className="py-16 sm:py-20 max-w-[1400px] mx-auto px-4 sm:px-6"
      >
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary mb-3">
          What we do
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
        <p className="text-muted-foreground max-w-xl mb-12">
          End-to-end CRM consulting, implementation and AI — across Salesforce, HubSpot, Zoho and
          Microsoft Dynamics.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="border border-border rounded-xl p-5 sm:p-6 hover:border-primary/40 hover:shadow-md transition"
            >
              <div className="w-8 h-8 rounded bg-primary/10 mb-4 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
