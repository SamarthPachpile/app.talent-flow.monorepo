import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
const case1 = "/assets/about-case-1.jpg";
const case2 = "/assets/about-case-2.jpg";
const case3 = "/assets/about-case-3.jpg";

const cases = [
  {
    img: case1,
    tag: "AI Candidate Screening on TalentFlow",
    title: "Global enterprise cuts hiring cycle by 45%",
  },
  {
    img: case2,
    tag: "Digital Onboarding & Candidature Verification",
    title: "Healthcare system accelerates credentialing 4×",
  },
  {
    img: case3,
    tag: "Unified Employee CRM & HRMS",
    title: "Fintech enterprise consolidates 4 HR systems into 1 portal",
  },
];

export default function ClientImpactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="client-impact"
      data-section="client-impact"
      data-label="Case Studies"
      className="py-20 bg-background"
    >
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Top Label */}
        <p className="text-md text-gray-500 mb-6">HR Transformation Case Studies</p>

        {/* Header Row */}
        <div className="grid md:grid-cols-2 gap-90 mb-8 items-start">
          {/* Left Big Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-4xl leading-tight"
          >
            Discover how we’re transforming HR services and candidate management globally
          </motion.h2>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md"
          >
            <p className="text-gray-600 mb-6 leading-relaxed">
              We partner with high-growth organizations to build intelligent HR CRM portals,
              streamline candidate application workflows, and elevate the employee experience.
            </p>

            <a
              href="/insights"
              className="inline-flex items-center gap-2 text-black font-medium group"
            >
              View all case studies
              <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition" />
            </a>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="overflow-hidden bg-white">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-320px object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="mt-4">
                <p className="text-xs text-orange-500 font-semibold mb-2">{c.tag}</p>
                <p className="text-lg font-medium leading-snug">{c.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
