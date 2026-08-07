import { ArrowRight } from "lucide-react";
const insight1 = "/assets/insight-1.jpg";
const insight2 = "/assets/insight-2.jpg";
const insight3 = "/assets/insight-3.jpg";
const insight4 = "/assets/insight-4.jpg";

const insights = [
  {
    img: insight1,
    tag: "Case Studies",
    title: "How a B2B SaaS firm cut sales cycle by 38% with AI lead scoring on Salesforce",
    author: "Croton",
  },
  {
    img: insight2,
    tag: "Blogs",
    title: "From RevOps to AgentOps: the next chapter of CRM operations",
    author: "Croton",
  },
  {
    img: insight3,
    tag: "Blogs",
    title: "Clean data is the new CRM superpower — a practical playbook",
    author: "Croton",
  },
  {
    img: insight4,
    tag: "Case Studies",
    title: "Voice-AI for service: 4× faster ticket triage on HubSpot Service Hub",
    author: "Croton",
  },
];

export default function InsightsSection() {
  return (
    <section id="insights" data-section="insights" data-label="Insights" className="py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 sm:mb-10 gap-4">
          <h2 className="text-xl sm:text-2xl font-medium">Featured insights</h2>
          <a
            href="/insights"
            className="text-sm text-primary flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {insights.map((item, i) => (
            <a key={i} href="/insights" className="group">
              <div className="relative rounded-xl overflow-hidden mb-3">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={768}
                  height={512}
                />
                <span className="absolute top-3 left-3 bg-primary-foreground/90 text-foreground text-xs px-2 py-1 rounded">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{item.author}</p>
              <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                {item.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
