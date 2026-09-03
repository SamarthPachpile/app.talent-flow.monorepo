import Header from "@graviton/components/Header";
import Footer from "@graviton/components/Footer";
const insight1 = "/assets/insight-1.jpg";
const insight2 = "/assets/insight-2.jpg";
const insight3 = "/assets/insight-3.jpg";
const insight4 = "/assets/insight-4.jpg";
import { usePageMeta } from "@graviton/lib/use-page-meta";
import Slider from "@graviton/components/insights/Slider";
import CTASection from "@graviton/components/CTASection";

const carouselItems = [
  {
    img: insight1,
    title: "The Next Generation of Recruitment: How AI & Dragonfly DB Supercharge Candidate CRM",
    tags: ["Recruitment CRM", "AI Screening", "Dragonfly DB"],
    date: "24 April 2026",
  },
  {
    img: insight2,
    title: "Transforming the Employee Lifecycle: From Digital Offer Letters to Tenured Growth",
    tags: ["Employee HRMS", "Onboarding", "Retention"],
    date: "20 April 2026",
  },
  {
    img: insight3,
    title: "Building Multi-Tenant Candidate & Employer Portals with Real-Time Data Sync",
    tags: ["Candidate Portal", "Workforce Architecture"],
    date: "18 April 2026",
  },
];

const articles = [
  {
    img: insight1,
    tag: "Blogs",
    title: "From Manual Sourcing to Autonomous ATS: The Modern Recruitment Playbook",
    date: "7 April 2026",
    author: "Graviton",
    tags: ["Recruitment ATS", "HR Automation"],
  },
  {
    img: insight2,
    tag: "Case Studies",
    title: "Global Tech Enterprise cuts hiring cycle by 45% with AI candidate matching",
    date: "5 April 2026",
    author: "Graviton",
    tags: ["Candidate Matching", "ATS CRM"],
  },
  {
    img: insight3,
    tag: "Blogs",
    title:
      "Clean candidate data and instant Dragonfly DB caching: The secret to sub-second ATS portals",
    date: "2 April 2026",
    author: "Graviton",
    tags: ["Dragonfly DB", "HR Data"],
  },
  {
    img: insight4,
    tag: "Case Studies",
    title:
      "Accelerating Day-1 readiness: Digital onboarding & background verification for 10,000+ staff",
    date: "28 March 2026",
    author: "Graviton",
    tags: ["Digital Onboarding", "Compliance"],
  },
];

const tabs = ["All", "Case Studies", "Blogs", "White Papers"];

export default function Insights() {
  usePageMeta(
    "HR CRM & Workforce Insights — Graviton",
    "Fresh perspectives on recruitment ATS, employee lifecycle management, and applied HR AI.",
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        id="insights-hero"
        data-section="insights-hero"
        data-label="Overview"
        className="max-w-[1500px] mx-auto px-4 sm:px-6 py-32 sm:py-40"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Workforce Insights</p>
        <h1 className="text-3xl sm:text-4xl md:text-7xl mb-10 max-w-6xl">
          Fresh thinking on HR CRM, <br /> candidate management, and workforce AI
        </h1>
      </section>

      <section id="insights-featured" data-section="insights-featured" data-label="Featured">
        <Slider items={carouselItems} />
      </section>

      {/* 🔽 EXISTING CONTENT */}
      <section
        id="insights-library"
        data-section="insights-library"
        data-label="Library"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12"
      >
        <div className="flex gap-6 mb-8 border-b border-border overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 text-sm font-medium ${
                i === 0 ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <a key={i} href="#" className="group">
              <div className="relative rounded-xl overflow-hidden mb-3">
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-black text-xs px-2 py-1 rounded">
                  {article.tag}
                </span>
              </div>

              <div className="text-xs text-muted-foreground mb-1 flex gap-2">
                <span>{article.author}</span>
                {article.date && <span>{article.date}</span>}
              </div>

              <h3 className="text-sm font-medium group-hover:text-primary mb-2">{article.title}</h3>

              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-10px px-2 py-0.5 border rounded-full text-primary border-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
      <CTASection />
      <Footer />
    </div>
  );
}
