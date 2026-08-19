import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const industries = [
  "Private Equity",
  "Retail & Consumer",
  "Communications & Network Providers",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Industrial & Energy",
  "Media & Entertainment",
  "Mobility",
  "Technology",
];

export default function IndustriesSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="industries"
      data-section="industries"
      data-label="Industries"
      className="w-screen min-h-screen bg-[#f3f3f3] flex items-start py-14 sm:py-20 overflow-hidden"
    >
      <div className="w-full mx-auto px-6 sm:px-10 lg:px-16">
        {/* Label */}
        <p className="text-[#33456b] text-lg sm:text-2xl mb-10 tracking-[-0.02em]">
          Our industries
        </p>

        {/* Industry List */}
        <div className="leading-[0.95] tracking-[-0.055em] flex flex-wrap items-center">
          {industries.map((industry, i) => {
            const isActive = active === i;
            const isLast = i === industries.length - 1;

            return (
              <span
                key={i}
                className="inline-flex items-center my-2"
                onMouseEnter={() => setActive(i)}
              >
                {/* Text */}
                <button
                  className={`inline-flex items-center text-left transition-colors duration-300 ${
                    isActive ? "text-[#111625]" : "text-[#8b90a5] hover:text-[#6d7388]"
                  } text-[2.5rem] sm:text-[2.2rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[4.8rem] font-light cursor-pointer`}
                >
                  {industry}
                </button>

                {/* Arrow / Dot Slot */}
                {(isActive || !isLast) && (
                  <span className="relative mx-3 sm:mx-4 lg:mx-6 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                        <motion.span
                          key="arrow"
                          initial={{ x: -20, opacity: 0, scale: 0.7 }}
                          animate={{ x: 0, opacity: 1, scale: 1 }}
                          exit={{ x: 20, opacity: 0, scale: 0.7 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute flex items-center justify-center text-[#ff5a1f]"
                        >
                          <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 stroke-[2.5]" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="dot"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute text-[#8b90a5]/60 text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem] leading-none select-none"
                        >
                          ·
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
