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
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Label */}
        <p className="text-[#33456b] text-lg sm:text-2xl mb-10 tracking-[-0.02em]">
          Our industries
        </p>

        {/* Industry List */}
        <div className="max-w-[1700px] leading-[0.95] tracking-[-0.055em] flex flex-wrap">
          {industries.map((industry, i) => {
            const isActive = active === i;

            return (
              <span key={i} className="inline-flex items-center" onMouseEnter={() => setActive(i)}>
                {/* Text */}
                <button
                  className={`inline-flex items-center text-left transition-colors duration-300 ${
                    isActive ? "text-[#111625]" : "text-[#8b90a5] hover:text-[#6d7388]"
                  } text-[3rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.8rem] font-light`}
                >
                  {industry}
                </button>

                {/* Arrow / Dot transition */}
                {i < industries.length - 1 && (
                  <span className="relative mx-2 sm:mx-3 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                        <motion.span
                          key="arrow"
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 30, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute"
                        >
                          <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-[#ff5a1f]" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="dot"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.3, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="absolute text-[#8b90a5] text-[3rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] xl:text-[7.8rem] leading-none"
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
