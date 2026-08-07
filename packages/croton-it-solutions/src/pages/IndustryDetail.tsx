import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@croton/components/Header";
import Footer from "@croton/components/Footer";
import CTASection from "@croton/components/CTASection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@croton/components/ui/accordion";
import { usePageMeta } from "@croton/lib/use-page-meta";
import { getIndustryBySlug, INDUSTRIES } from "@croton/data/industries";

export default function IndustryDetail() {
  const { slug } = useParams();
  const industry = getIndustryBySlug(slug);

  usePageMeta(
    industry ? `${industry.name} — Graviton` : "Graviton Industries",
    industry ? industry.intro.slice(0, 155) : "Industry solutions and digital transformation.",
  );

  if (!industry) return <Navigate to="/industries" replace />;

  const others = INDUSTRIES.filter((i) => i.slug !== industry.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      {/* HERO */}
      <section className="bg-background min-h-screen">
        <div className="h-screen mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* LEFT CONTENT */}
            <div className="px-4 sm:px-6 lg:pr-20 pb-24 sm:pl-20 flex flex-col justify-end">
              <p className="text-sm text-foreground/60 mb-6">
                <Link to="/industries" className="hover:text-primary">
                  Industries
                </Link>{" "}
                {">"} {industry.name}
              </p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium leading-[0.95] tracking-tight text-foreground">
                {industry.name}
              </h1>

              <p className="mt-8 text-lg text-foreground/70 max-w-xl leading-relaxed">
                {industry.intro}
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${industry.heroImg})`,
              }}
            />
          </div>
        </div>
      </section>
      {/* BELOW HERO SECTION */}
      <section className="bg-[#f5f5f6] py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          {/* TOP LARGE TEXT */}
          <div className="max-w-[1250px]">
            <h2 className="text-[48px] sm:text-[64px] md:text-[52px] leading-[0.95] tracking-[-0.04em] font-medium text-[#40486b]">
              We partner with {industry.name} sponsors across the deal lifecycle, delivering
              strategic support from
              <span className="text-[#4a46ff]"> {industry.feature.title} </span> during the hold
              period to targeted, technology-driven sell-side preparation
            </h2>
          </div>

          {/* BOTTOM RIGHT TEXT */}
          <div className="flex justify-end mt-20">
            <div className="max-w-[520px]">
              <p className="text-[18px] leading-[1.65] text-[#40486b]/85 text-left">
                {industry.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARD */}
      <section className="py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src={industry.feature.img}
              alt={industry.feature.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-wider text-foreground/60 mb-4">
              {industry.feature.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight tracking-tight text-foreground">
              {industry.feature.title}
              <span style={{ color: industry.accent }}>{industry.feature.titleHighlight}</span>
            </h2>
            <p className="mt-6 text-foreground/70 leading-relaxed max-w-md">
              {industry.feature.body}
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-primary font-medium"
            >
              Explore opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSFORMATION BLOCK */}
      <section className="py-20 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight text-foreground">
              {industry.transformation.title}
              <span style={{ color: industry.accent }}>{industry.transformation.highlight}</span>
            </h2>
            <p className="mt-6 text-foreground/70 max-w-md leading-relaxed">
              {industry.transformation.body}
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-primary font-medium"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src={industry.transformation.img}
              alt={industry.transformation.highlight}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      {/* TESTIMONIAL QUOTE SECTION */}
      <section className="bg-[#4d5678] py-28 sm:py-36">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          {/* QUOTE */}
          <h2 className="text-white text-[42px] sm:text-[58px] md:text-[52px] leading-[1.25] tracking-tight font-medium max-w-[1280px]">
            “The goal was to find a group of people that could contribute to the very strategy of
            the company... It was important to find a partner that not only had experience, but also
            the flexibility and the willingness to grow with us.”
          </h2>

          {/* AUTHOR */}
          <div className="mt-20 flex flex-col sm:flex-row gap-3 sm:gap-20 text-white/85 text-sm sm:text-base">
            <p>{industry.quote?.author || "Bob McCarter"}</p>
            <p>{industry.quote?.role || "CTO, Navex"}</p>
          </div>
        </div>
      </section>
      {/* CAPABILITIES */}
      <section className="py-20 bg-background border-t border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground/60 mb-4">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-medium leading-tight text-foreground">
              Explore intelligent {industry.name.toLowerCase()} products, platforms, and services
            </h2>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {industry.capabilities.map((c) => (
              <div key={c.title} className="border-t border-border pt-5">
                <h3 className="text-lg font-medium text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-medium text-foreground mb-10">
            Accelerate the {industry.name.toLowerCase()} digital product lifecycle
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl border border-border p-8 sm:p-12">
            {industry.stats.map((s) => (
              <div key={s.label}>
                <p
                  className="text-4xl sm:text-5xl font-medium text-foreground"
                  style={{ color: industry.accent }}
                >
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-20 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl sm:text-4xl font-medium text-foreground">Case studies</h2>
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 text-primary font-medium"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.caseStudies.map((cs) => (
              <article key={cs.title} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <img
                    src={cs.img}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-background/95 text-foreground text-xs px-3 py-1 rounded">
                    {cs.tag}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {cs.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED INSIGHTS */}
      <section className="py-16 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-medium text-foreground mb-10">
            Featured Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.insights.map((f) => (
              <article key={f.title} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-background/95 text-foreground text-xs px-3 py-1 rounded">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GRAVITON */}
      <section className="py-20 bg-background border-t border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground/60 mb-4">
              Why Graviton?
            </p>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={industry.heroImg}
                alt="Why Graviton"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {industry.why.map((w) => (
              <div key={w.title} className="border-t border-border pt-5">
                <h3 className="text-lg font-medium text-foreground mb-2">{w.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-medium text-foreground mb-10">
            Your {industry.name.toLowerCase()} solutions questions, answered
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {industry.faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-base sm:text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* OTHER INDUSTRIES */}
      <section className="py-16 bg-[#f3f3f3]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-medium text-foreground mb-8">
            Explore other industries
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/industries/${o.slug}`}
                className="group p-5 bg-white rounded-xl border border-border hover:border-primary transition-colors"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary">
                  {o.name}
                </p>
                <ArrowRight className="w-4 h-4 mt-3 text-foreground/40 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
