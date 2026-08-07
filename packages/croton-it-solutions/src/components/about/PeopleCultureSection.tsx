import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const peopleImg = "/assets/about-people.jpg";

export default function PeopleCultureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="culture"
      data-section="culture"
      data-label="Culture"
      className="py-16 sm:py-20 bg-background"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <img
              src={peopleImg}
              alt="People-first culture"
              className="w-full rounded-xl"
              loading="lazy"
              width={640}
              height={640}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[10px] sm:text-xl tracking-widest text-muted-foreground mb-3 sm:mb-4 ">
              People & Culture
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-8xl leading-[100px] mb-4 sm:mb-6">
              A <span className="text-primary">people-first</span> consultancy
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Croton is built on certified consultants, architects and engineers who care about the
              customer behind every record. We invest in continuous learning, certifications and
              inclusive teams — because better people build better CRMs.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
