import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

function CharSpan({
  char,
  index,
  totalChars,
  scrollYProgress,
  highlight = false,
}: {
  char: string;
  index: number;
  totalChars: number;
  scrollYProgress: MotionValue<number>;
  highlight?: boolean;
}) {
  const start = index / totalChars;
  const end = (index + 1) / totalChars + 0.02;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [50, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block whitespace-pre ${highlight ? "text-[#ff5a1f] font-normal" : ""}`}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

export default function TransformSection() {
  const sectionRef = useRef(null);

  const firstText = "Today, we help transform businesses and refine industries through ";
  const secondText = "intelligent products, platforms, and services ...";

  const fullText = firstText + secondText;
  const totalChars = fullText.length;

  /* More scroll range so second line fully animates */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 35%", "end 90%"],
  });

  const renderLetters = (text: string, startIndex = 0, highlight = false) => {
    return text.split("").map((char, i) => {
      const index = startIndex + i;
      return (
        <CharSpan
          key={`${char}-${index}`}
          char={char}
          index={index}
          totalChars={totalChars}
          scrollYProgress={scrollYProgress}
          highlight={highlight}
        />
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      id="about-intro"
      data-section="about-intro"
      data-label="About"
      className="w-screen min-h-screen bg-[#f3f3f3] flex items-center overflow-hidden"
    >
      <div className="w-full h-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16 flex flex-col justify-between">
        {/* Top */}
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#7b8196] mb-5">
            The Tapasys Group Company
          </p>

          <p className="max-w-[720px] text-[#33456b] text-[16px] sm:text-[22px] lg:text-[30px] leading-[1.22] tracking-[-0.02em]">
            Croton is a trusted digital transformation partner helping ambitious businesses
            modernize customer relationships and scale smarter.
          </p>
        </div>

        {/* Full Scroll Animation */}
        <div className="flex-1 flex items-center">
          <h2 className="text-[#454d72] font-light leading-[0.93] tracking-[-0.055em] text-[3rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem] xl:text-[9rem] max-w-[1800px] flex flex-wrap">
            {renderLetters(firstText)}
            {renderLetters(secondText, firstText.length, true)}
          </h2>
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button className="group flex items-center gap-4 text-[#0e1730] text-base sm:text-xl lg:text-3xl font-medium tracking-[-0.02em]">
            Learn more about what sets us apart
            <span className="text-[#ff5a1f] text-3xl lg:text-5xl transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
