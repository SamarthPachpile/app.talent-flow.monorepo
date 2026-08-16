import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

const text =
  "Today, we help transform businesses and refine industries through intelligent products, platforms, and services    ";

function WordSpan({
  word,
  index,
  totalWords,
  scrollYProgress,
}: {
  word: string;
  index: number;
  totalWords: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / totalWords;
  const end = start + 0.15;
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
  const y = useTransform(scrollYProgress, [start, end], [40, 0]);

  const isHighlight = ["intelligent", "products,", "platforms,", "and", "services"].includes(word);

  return (
    <motion.span style={{ opacity, y }} className={isHighlight ? "text-orange-500" : ""}>
      {word}
    </motion.span>
  );
}

export default function CareersIntro() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 40%", "end 90%"],
  });

  const words = text.split(" ");
  const topOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const topY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);
  const bottomOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const bottomY = useTransform(scrollYProgress, [0.5, 0.8], [40, 0]);

  return (
    <section
      ref={ref}
      id="intro"
      data-section="intro"
      data-label="Life at Graviton"
      className="bg-[#f3efea] py-24 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Top text */}
        <motion.p
          style={{
            opacity: topOpacity,
            y: topY,
          }}
          className="text-sm text-gray-600 max-w-md mb-10 leading-relaxed"
        >
          Graviton is a trusted digital engineering partner helping forward-thinking companies build
          impactful solutions
        </motion.p>

        {/* Animated heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight text-[#484f6b] max-w-7xl flex flex-wrap gap-x-3">
          {words.map((word, index) => (
            <WordSpan
              key={index}
              word={word}
              index={index}
              totalWords={words.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </h2>

        {/* Bottom paragraph */}
        <motion.div
          style={{
            opacity: bottomOpacity,
            y: bottomY,
          }}
          className="mt-12 flex justify-end"
        >
          <div className="max-w-md text-gray-600 text-base leading-relaxed">
            <p className="mb-6">
              Since 2020, we’ve been at the forefront of innovation—helping create scalable and
              impactful digital experiences used worldwide.
            </p>

            <button className="flex items-center gap-2 text-black font-medium group">
              Learn more about what sets us apart
              <span className="text-orange-500 group-hover:translate-x-1 transition">→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
