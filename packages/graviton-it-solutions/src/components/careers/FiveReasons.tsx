import { ArrowRight } from "lucide-react";

const REASONS = [
  {
    title: "Culture of caring",
    desc: "We consistently put people first with our inclusive culture of acceptance and belonging.",
  },
  {
    title: "Learning and development",
    desc: "Learn and grow daily at Graviton. Try new things. Sharpen your skills. Advance your career.",
  },
  {
    title: "Interesting & meaningful work",
    desc: "Do work that matters, where each project is a unique opportunity to engage your curiosity and creative problem-solving skills to reimagine what's possible.",
  },
  {
    title: "Balance and flexibility",
    desc: "Your life extends beyond the office, and we always do our best to help you integrate and balance the best of work and life, having fun along the way!",
  },
  {
    title: "High-trust organization",
    desc: "Integrity and trust are the cornerstone of our value proposition to our clients. You will see candor and integrity in everything we do.",
  },
];

export default function FiveReasons() {
  return (
    <section
      id="five-reasons"
      data-section="five-reasons"
      data-label="Why Graviton"
      className="bg-background py-16 sm:py-24"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <p className="text-sm sm:text-base text-foreground/70 mb-8">Why join Graviton?</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-primary leading-[1.05] tracking-tight">
            5 reasons to build your career at Graviton
          </h2>

          <div className="flex flex-col justify-center gap-6 lg:pt-6">
            <p className="text-base sm:text-lg text-foreground/80 max-w-md">
              You have the talent. We have the opportunities for growth and development.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors group w-fit"
            >
              <span className="text-lg font-medium">Join us!</span>
              <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="bg-muted/60 rounded-2xl p-6 sm:p-7 min-h-340px flex flex-col"
            >
              <h3 className="text-xl sm:text-2xl font-medium text-foreground mb-6 leading-snug">
                {r.title}
              </h3>
              <p className="text-sm sm:text-15px text-foreground/70 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
