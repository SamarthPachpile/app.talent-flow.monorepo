import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { INDUSTRIES as INDUSTRY_DATA } from "@graviton/data/industries";
import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
import CTASection from "@graviton/components/CTASection";
import { usePageMeta } from "@graviton/lib/use-page-meta";

const INDUSTRIES = [
  {
    title: "Private Equity",
    desc: "Engineering impact for private equity-backed companies to accelerate value creation.",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Retail & Consumer",
    desc: "Engineering impact for the retail and consumer goods industry.",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Communications & Network Providers",
    desc: "Engineering seamless connectivity and exceptional customer experiences.",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Financial Services",
    desc: "Engineering impact across banking, insurance, payments, and wealth.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Healthcare & Life Sciences",
    desc: "Engineering digital health products, platforms and services.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Industrial & Energy",
    desc: "Engineering Industrial & Energy impact with digital twins and industry 4.0.",
    img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Media & Entertainment",
    desc: "Engineering impact to captivate audiences and drive profitability.",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Mobility",
    desc: "Engineering impact for innovative partners across the mobility ecosystem.",
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80&auto=format&fit=crop",
  },
  {
    title: "Technology",
    desc: "Engineering impact with scalable technology, data analytics, and cloud solutions.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&auto=format&fit=crop",
  },
];

const FEATURED = [
  {
    tag: "White Papers",
    title: "Accelerate Your Automotive Software Innovation",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&auto=format&fit=crop",
    category: "Mobility",
  },
  {
    tag: "White Papers",
    title: "State of OTT 2024: The Race to Profitability",
    img: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80&auto=format&fit=crop",
    category: "Media & Entertainment",
  },
  {
    tag: "Blogs",
    title: "GenAI Trends in Telecommunications",
    img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80&auto=format&fit=crop",
    category: "Communications",
  },
];

export default function Industries() {
  usePageMeta(
    "Industries — Graviton",
    "Redefining industries by solving their unique challenges with CRM and applied-AI expertise.",
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section
        id="industries-hero"
        data-section="industries-hero"
        data-label="Overview"
        className="pt-32 sm:pt-50 pb-16 sm:pb-40 bg-background"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-20">
          <p className="text-sm text-foreground/60 mb-6">Industries</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight max-w-6xl text-foreground">
            Redefining industries by solving their unique challenges
          </h1>
        </div>
      </section>

      {/* INDUSTRIES GRID ON DARK */}
      <section
        id="industries-grid"
        data-section="industries-grid"
        data-label="Industries"
        className="bg-[#3f4b6b] py-16 sm:py-24"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-2 grid grid-cols-1 lg:grid-cols-3 gap-30">
          <div className="lg:col-span-1">
            <h2 className="text-3xl sm:text-5xl font-medium text-white mb-6 leading-tight">
              What industries do we help?
            </h2>
            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
              We shape industries by creating innovative products, platforms, and services. We
              provide industry-specific solutions, with teams that bring deep technical expertise
              and extensive domain experience to every sector we serve.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.title}
                to={
                  INDUSTRY_DATA.find((d) => d.name === ind.title)
                    ? `/industries/${INDUSTRY_DATA.find((d) => d.name === ind.title)!.slug}`
                    : "/industries"
                }
                className="flex gap-4 p-3 bg-white/5 hover:bg-primary transition-colors group"
              >
                <img
                  src={ind.img}
                  alt={ind.title}
                  loading="lazy"
                  className="w-30 h-30 object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="text-white font-medium text-xl mb-1 transition-colors">
                    {ind.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{ind.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TAILORED SOLUTIONS */}
      <section
        id="tailored-solutions"
        data-section="tailored-solutions"
        data-label="Solutions"
        className="py-20 sm:py-28 bg-background"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div>
            <p className="text-md text-foreground/60 mb-6">Industry Smart</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight mb-8 text-foreground">
              Tailored solutions to deliver impact
            </h2>
            <p className="text-foreground/70 max-w-md text-base sm:text-lg leading-relaxed">
              Customized digital solutions designed to address the unique challenges and
              opportunities within a particular industry to accelerate transformation.
            </p>
          </div>
          <div className="aspect-[4/5] clip-path-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80&auto=format&fit=crop"
              alt="Tailored industry solutions"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURED INSIGHTS */}
      <section
        id="featured-insights"
        data-section="featured-insights"
        data-label="Insights"
        className="py-16 sm:py-20 bg-background"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 mb-12">
            <h2 className="text-3xl sm:text-6xl font-medium text-foreground">Featured Insights</h2>
            <div>
              <p className="text-foreground/70 mb-3">
                Explore fresh thinking from some of Graviton's strategists and engineers on how
                technology is reshaping industries and what it means for business leaders.
              </p>
              <a
                href="/insights"
                className="inline-flex items-center gap-2 text-primary font-medium"
              >
                See all <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED.map((f) => (
              <article key={f.title} className="group cursor-pointer">
                <div className="relative aspect-[4/3] clip-path-nav-sm overflow-hidden mb-4">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-7 bg-background/95 text-foreground text-sm px-3 py-2 clip-path-button-sm">
                    {f.tag}
                  </span>
                </div>
                <p className="text-xs text-foreground/60 mb-2">{f.category}</p>
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
