import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const columns = [
  {
    label: "CROTON",
    text: "For more than a decade, Croton has helped revenue, marketing and service teams turn fragmented customer data into a single source of truth. We sit at the intersection of CRM strategy, platform engineering and applied AI.",
  },
  {
    label: "OUR APPROACH",
    text: "We combine deep CRM domain expertise with modern engineering. Strategy, configuration, integration, data, analytics and AI agents are not separate practices — they ship as one outcome-driven program.",
  },
  {
    label: "INNOVATION",
    text: "As a Tapasys Group company, Croton taps into a wider network of data, cloud and AI specialists — co-creating with clients to solve the hardest customer-experience challenges of today.",
  },
];

export default function InnovationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="innovation"
      data-section="innovation"
      data-label="Story"
      className="sm:pb-24 bg-background"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="sm:text-3xl text-center text-primary tracking-[2.6px] mb-2 sm:mb-5"
        >
          A decade of CRM craftsmanship
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-5 px-10 sm:gap-20">
          {columns.map((col, i) => (
            <motion.div
              key={col.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <p className="sm:text-xs text-[10px] tracking-widest text-muted-foreground mb-3 uppercase">
                {col.label}
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed text-justify">
                {col.text}
              </p>{" "}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
