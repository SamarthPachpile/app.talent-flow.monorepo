import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const principles = [
  {
    title: "Designed for Desirability",
    desc: "Seamless integration between design and engineering, creating digital products and experiences people love.",
  },
  {
    title: "Engineered for Excellence",
    desc: "Pioneering and innovating engineering from chip to cloud.",
  },
  {
    title: "Curated for Intelligence",
    desc: "Powering the intelligent enterprise with a formidable advantage in data + AI and content engineering.",
  },
];

export default function DesignPrinciplesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="pb-20 ">
      <div className="max-w-[1800px] mx-auto pl-25">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xl text-black max-w-[420px] leading-relaxed">
              Croton provides unique experience and expertise at the intersection of data, design,
              and Customer Relations
            </p>
          </motion.div>

          {/* RIGHT CONTENT */}
          <div className="flex gap-10">
            {/* VERTICAL LINE */}
            <div className="hidden lg:block w-[3px] bg-gray-300 self-stretch" />
            {/* PRINCIPLES */}
            <div className="space-y-10">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 * i }}
                >
                  <h3 className="text-3xl sm:text-5xl text-muted-foreground mb-3">{p.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-[520px]">
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
