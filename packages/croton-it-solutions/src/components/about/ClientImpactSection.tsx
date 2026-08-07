import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
const case1 = "/assets/about-case-1.jpg";
const case2 = "/assets/about-case-2.jpg";
const case3 = "/assets/about-case-3.jpg";

const cases = [
  {
    img: case1,
    tag: "AI Lead Scoring on Salesforce",
    title: "B2B SaaS firm cuts sales cycle by 38%",
  },
  {
    img: case2,
    tag: "Healthcare CRM Modernization",
    title: "Patient onboarding time reduced 4×",
  },
  {
    img: case3,
    tag: "HubSpot + Zoho Migration",
    title: "Fintech consolidates 3 CRMs into one",
  },
];

export default function ClientImpactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Top Label */}
        <p className="text-md text-gray-500 mb-6">Our case studies</p>

        {/* Header Row */}
        <div className="grid md:grid-cols-2 gap-90 mb-16 items-start">
          {/* Left Big Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl leading-tight"
          >
            Discover how we’re engineering impact with clients around the world
          </motion.h2>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md"
          >
            <p className="text-gray-600 mb-6 leading-relaxed">
              We work with the world’s largest and most innovative companies—forging deep
              collaborations to create intelligent products, platforms, and services.
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
                  className="w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
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
