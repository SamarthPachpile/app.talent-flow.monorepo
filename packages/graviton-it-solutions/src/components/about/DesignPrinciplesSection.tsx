import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const principles = [
  {
    title: "Candidate-First Experience",
    desc: "Intuitive self-service applicant tracking, transparent hiring stages, and real-time recruitment status updates.",
  },
  {
    title: "Unified Employee Lifecycle",
    desc: "Seamless transition from job offer to digital onboarding, appraisals, leave tracking, and career growth.",
  },
  {
    title: "Real-Time Dragonfly DB Architecture",
    desc: "Sub-millisecond data fetching, instant multi-tenant sync, and bank-grade enterprise security.",
  },
];

export default function DesignPrinciplesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="pb-20 w-full">
      <div className="w-full sm:px-12 lg:px-16 xl:px-20">
        {/* FLEX CONTAINER FOR LEFT AND RIGHT SECTIONS */}
        <div className="flex flex-row items-stretch justify-between gap-8 md:gap-16 w-full ">
          {/* LEFT TEXT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="w-1/3 max-w-162.5 shrink-0 "
          >
            <p className="text-xl sm:text-2xl text-black leading-relaxed">
              Graviton delivers complete portal software and HR services at the intersection of
              candidate acquisition, employee management, and high-performance cloud architecture.
            </p>
          </motion.div>

          {/* RIGHT GROUP (DIVIDER + PRINCIPLES ALIGNED AT END) */}
          <div className="flex flex-row items-stretch gap-8 sm:gap-10 lg:gap-14 ml-auto flex-1 max-w-172.5 justify-end">
            {/* VERTICAL DIVIDER */}
            <div className="w-0.75 bg-primary self-stretch shrink-0 rounded-full" />

            {/* RIGHT SECTION (STACKED VERTICALLY) */}
            <div className="space-y-12 flex-1">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 * i }}
                >
                  <h3 className="text-3xl sm:text-5xl text-muted-foreground mb-3">{p.title}</h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-600px">
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
