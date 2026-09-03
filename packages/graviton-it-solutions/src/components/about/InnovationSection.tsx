import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const columns = [
  {
    label: "GRAVITON",
    text: "Graviton unifies fragmented HR data, candidate applications, and employee records into a single high-performance CRM architecture with sub-millisecond Dragonfly DB response times.",
  },
  {
    label: "OUR APPROACH",
    text: "We combine deep recruitment ATS expertise with modern workforce management. Candidate screening, digital onboarding, candidature compliance, and AI assistants work seamlessly as one integrated suite.",
  },
  {
    label: "INNOVATION",
    text: "Graviton provides dedicated portal solutions for Candidates, HR Recruiters, and Super Admins, accelerating hiring velocity and empowering modern workplaces worldwide.",
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
          A Decade of HR CRM & Workforce Innovation
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-5 px-10 sm:gap-20">
          {columns.map((col, i) => (
            <motion.div
              key={col.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <p className="sm:text-xs text-10px tracking-widest text-muted-foreground mb-3 uppercase">
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
