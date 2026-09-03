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
        <div className="grid grid-rows-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <img
              src={peopleImg}
              alt="People-first culture"
              className="w-full object-cover clip-path-nav-sm"
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
            <p className="text-12px sm:text-14px md:text-base lg:text-lg tracking-widest text-muted-foreground mb-3 sm:mb-4 uppercase">
              People & Culture
            </p>
            <h2 className="text-28px sm:text-40px md:text-6xl lg:text-7xl xl:text-7xl leading-[1.1] mb-4 sm:mb-6 font-semibold">
              A <span className="text-primary">people-first</span> HR software culture
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Graviton is built on dedicated product designers, HR technologists, and distributed
              systems engineers who care about every candidate and employee journey. We invest in
              continuous innovation, empathy, and inclusive teams — because empowered people create
              exceptional workplace software.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
