import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "240+", label: "CRM rollouts delivered" },
  { value: "98%", label: "client retention rate" },
  { value: "12", label: "industries served globally" },
];

export default function AboutStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      id="about-stats"
      data-section="about-stats"
      data-label="Stats"
      className="py-12 sm:py-16 bg-background"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <p className="text-4xl sm:text-5xl md:text-8xl text-primary">{s.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
