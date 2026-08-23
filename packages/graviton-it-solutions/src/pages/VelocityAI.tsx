import { ArrowRight } from "lucide-react";
import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
import { usePageMeta } from "@graviton/lib/use-page-meta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@graviton/components/ui/accordion";

const CAPABILITIES = [
  {
    tag: "AI strategy",
    title: "AI-powered solutions",
    desc: "Co-create roadmaps that turn AI ambition into deployed CRM workflows.",
  },
  {
    tag: "Data engineering",
    title: "Trusted data, ready for AI",
    desc: "Pipelines, governance, and feature stores that make your CRM AI-ready.",
  },
  {
    tag: "Build & deploy",
    title: "Production-grade AI",
    desc: "Ship copilots, agents and scoring models with measurable impact.",
  },
];

const METRICS = [
  { value: "75%", label: "increase in overall product KPIs" },
  { value: "12x", label: "reduction in time to market" },
  { value: "20%", label: "lower operational costs" },
];

const STORIES = [
  {
    title: "Reimagining onboarding for a global bank",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Predictive deal scoring for a SaaS leader",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Agentic ops for a Fortune 500 retailer",
    img: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&q=80&auto=format&fit=crop",
  },
];

const FAQS = [
  {
    q: "What is Graviton VelocityAI?",
    a: "Graviton VelocityAI is our applied-AI practice that helps enterprises move from AI experimentation to production-grade outcomes inside their CRM and revenue stack.",
  },
  {
    q: "How does VelocityAI accelerate AI adoption?",
    a: "We combine reusable accelerators, governance frameworks, and senior AI engineers to compress time-to-value from months to weeks.",
  },
  {
    q: "What kinds of clients does VelocityAI support?",
    a: "From mid-market SaaS to Fortune 500 enterprises across financial services, healthcare, retail, and technology.",
  },
  {
    q: "Which CRMs and AI platforms are supported?",
    a: "Salesforce, HubSpot, Zoho, Microsoft Dynamics — paired with OpenAI, Azure AI, AWS Bedrock, and Google Vertex.",
  },
  {
    q: "How does VelocityAI enable safe AI adoption?",
    a: "Built-in guardrails, evaluation harnesses, and human-in-the-loop workflows ensure responsible deployment at scale.",
  },
];

export default function VelocityAI() {
  usePageMeta(
    "Graviton VelocityAI — From bold ideas to measurable impact",
    "Graviton VelocityAI harnesses AI, digital and human-centered design to turn bold ideas into production-ready realities.",
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section
        id="velocity-hero"
        data-section="velocity-hero"
        data-label="Hero"
        className="relative pt-32 sm:pt-40 pb-20 bg-gradient-to-br from-[#ffe5d4] via-[#ffd4b8] to-[#ffb892] overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
          <p className="text-sm text-foreground/70 mb-6">Graviton VelocityAI</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-medium leading-[0.95] tracking-tight text-foreground max-w-5xl">
            Beyond Bold Ideas
            <br />
            to <em className="italic font-light">Measurable Impact</em>
          </h1>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-40 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,#ff5a1f_0%,transparent_60%)]" />
      </section>

      {/* INTRO */}
      <section
        id="velocity-intro"
        data-section="velocity-intro"
        data-label="Overview"
        className="py-20 sm:py-24 bg-background"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-foreground/60 mb-8">
            Reimagining business with VelocityAI
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight max-w-5xl tracking-tight">
            Graviton VelocityAI harnesses the intersecting power of{" "}
            <span className="text-primary">AI, digital,</span> and{" "}
            <span className="text-primary">human-centered design</span> to turn bold ideas into
            production-ready realities. We help your business move from experimentation to{" "}
            <span className="text-primary">measurable impact, faster.</span>
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section
        id="velocity-capabilities"
        data-section="velocity-capabilities"
        data-label="Capabilities"
        className="py-16 bg-muted/40"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPABILITIES.map((c) => (
            <div
              key={c.title}
              className="bg-background rounded-2xl p-8 border border-border/60 hover:border-primary/40 transition-colors"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4">{c.tag}</p>
              <h3 className="text-xl font-medium text-foreground mb-3">{c.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-5">{c.desc}</p>
              <a
                href="#"
                className="text-sm text-primary inline-flex items-center gap-1 font-medium"
              >
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section
        id="velocity-metrics"
        data-section="velocity-metrics"
        data-label="Impact"
        className="py-20 bg-background"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <p className="text-sm text-foreground/60 mb-10">
            <span className="text-primary font-medium">VelocityAI</span> can deliver
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border/60 pt-10">
            {METRICS.map((m) => (
              <div key={m.label}>
                <p className="text-5xl sm:text-6xl font-medium text-primary mb-3 tracking-tight">
                  {m.value}
                </p>
                <p className="text-sm text-foreground/70 max-w-240px">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section
        id="velocity-stories"
        data-section="velocity-stories"
        data-label="Stories"
        className="py-16 bg-muted/40"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <p className="text-sm text-foreground/60 mb-8">Stories</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORIES.map((s) => (
              <article
                key={s.title}
                className="bg-background rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <a href="#" className="text-sm text-primary inline-flex items-center gap-1">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONCEPT TO REALITY BANNER */}
      <section
        id="velocity-banner"
        data-section="velocity-banner"
        data-label="Concept"
        className="relative py-32 bg-gradient-to-br from-[#ffd4b8] to-[#ff8855] overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <p className="text-sm text-foreground/70 mb-4">From Concept</p>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-medium text-foreground leading-[0.95] tracking-tight">
            Let's turn ideas
            <br />
            into impact, <em className="italic font-light text-primary">together.</em>
          </h2>
          <a
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-4 rounded-full font-medium hover:scale-105 transition-transform"
          >
            Get in touch
            <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-foreground" />
            </span>
          </a>
        </div>
      </section>

      {/* INDUSTRIES TRANSFORMED */}
      <section
        id="velocity-industries"
        data-section="velocity-industries"
        data-label="Industries"
        className="py-20 bg-background"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-medium text-foreground leading-tight tracking-tight mb-6">
              Industries Transformed.
              <br />
              <span className="text-primary italic font-light">Impact Delivered.</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-6">
              Reimagining industries with intelligent automation and human-centered AI experiences
              across financial services, healthcare, retail, manufacturing, and technology.
            </p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>• Financial services</li>
              <li>• Healthcare & life sciences</li>
              <li>• Retail & consumer</li>
              <li>• Technology & SaaS</li>
            </ul>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop"
              alt="Industries transformed"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ITERATIVE PROGRESS */}
      <section
        id="velocity-progress"
        data-section="velocity-progress"
        data-label="Process"
        className="py-20 bg-muted/30"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop"
              alt="Iterative progress"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl font-medium text-foreground leading-tight tracking-tight mb-2">
              <span className="text-primary">Iterative Progress.</span>
              <br />
              <span className="text-primary">Real Impact.</span>
            </h2>
            <p className="text-2xl sm:text-3xl text-foreground mb-6 mt-4">
              Your Enterprise AI Journey with Impact IQ.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              A continuous loop of discovery, build, measure, and scale — anchored on outcomes your
              business actually cares about.
            </p>
          </div>
        </div>
      </section>

      {/* OUTCOMES NOT FEATURES */}
      <section
        id="velocity-outcomes"
        data-section="velocity-outcomes"
        data-label="Outcomes"
        className="py-20 bg-background"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-medium text-foreground leading-tight tracking-tight mb-6">
              <span className="text-primary">Outcomes, not Features.</span>
              <br />
              Modern Product Practices approach helps deliver what's important to the business,
              faster.
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              We embed product thinking, design systems, and engineering excellence so that every
              release compounds into a measurable business outcome.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop"
              alt="Modern product practices"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section
        id="velocity-platform"
        data-section="velocity-platform"
        data-label="Platform"
        className="py-20 bg-muted/30"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
            <h2 className="text-4xl sm:text-5xl font-medium text-foreground leading-tight tracking-tight">
              The Platform that Powers our <span className="text-primary">Enterprise-Grade AI</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              A composable platform with reusable accelerators, observability, and governance — so
              each new use case ships in weeks, not quarters.
            </p>
          </div>
          <div className="aspect-[16/7] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1600&q=80&auto=format&fit=crop"
              alt="Enterprise AI platform"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="velocity-faq"
        data-section="velocity-faq"
        data-label="FAQ"
        className="py-20 bg-background"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-medium text-foreground leading-tight tracking-tight">
              Your questions about <span className="text-primary">VelocityAI</span> – Answered
            </h2>
          </div>
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base sm:text-lg font-medium">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* GET MOVING BANNER */}
      <section
        id="velocity-get-started"
        data-section="velocity-get-started"
        data-label="Get Started"
        className="bg-[#3f4b6b] py-20 sm:py-28"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-medium text-white leading-[0.95] tracking-tight">
            Get moving with Graviton{" "}
            <span className="text-primary italic font-light">VelocityAI</span>
          </h2>
          <div className="flex lg:justify-end">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform"
            >
              Get in touch
              <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-foreground" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
