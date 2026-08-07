import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const planetImg = "/assets/about-planet.jpg";

export default function PlanetSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="responsibility"
      data-section="responsibility"
      data-label="Planet"
      className="py-16 sm:py-20 bg-background"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] sm:text-xl tracking-widest text-muted-foreground mb-3 sm:mb-4">
              Responsible Bussiness
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-8xl leading-[100px] mb-4 sm:mb-6">
              Responsible <span className="text-primary">AI</span>, responsible data
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Customer data is a privilege, not a commodity. Graviton builds CRM and AI systems with
              privacy, consent and explainability designed in — so growth never comes at the cost of
              trust.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src={planetImg}
              alt="Responsible AI and data"
              className="w-full rounded-xl"
              loading="lazy"
              width={640}
              height={640}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
