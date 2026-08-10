import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type SliderItem = {
  img: string;
  title: string;
  tags: string[];
  date: string;
};

export default function InfiniteSlider({ items }: { items: SliderItem[] }) {
  const [index, setIndex] = useState<number>(items.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [needsReset, setNeedsReset] = useState<false | "start" | "end">(false);
  const [isHovered, setIsHovered] = useState(false);

  const extended = [...items, ...items, ...items];

  // ✅ AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setIsTransitioning(true);
        setIndex((prev: number) => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // ✅ DETECT LOOP BOUNDARY
  useEffect(() => {
    if (index >= items.length * 2) {
      setNeedsReset("end");
    }
    if (index <= items.length - 1) {
      setNeedsReset("start");
    }
  }, [index, items.length]);

  return (
    <section
      className="w-full py-12 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden relative">
        {/* SLIDER TRACK */}
        <motion.div
          className="flex gap-4px px-[15vw]" // Exactly 4px gap
          style={{ willChange: "transform" }}
          animate={{
            x: `calc(-${index} * (70vw + 4px))`, // Important: match gap here
          }}
          transition={isTransitioning ? { duration: 0.5, ease: "easeInOut" } : { duration: 0 }}
          onAnimationComplete={() => {
            if (needsReset) {
              setIsTransitioning(false);

              if (needsReset === "end") {
                setIndex(items.length);
              }
              if (needsReset === "start") {
                setIndex(items.length * 2 - 1);
              }

              setNeedsReset(false);
            } else {
              setIsTransitioning(true);
            }
          }}
        >
          {extended.map((item, i) => {
            const isActive = i === index;

            return (
              <motion.div
                key={i}
                className="flex-shrink-0 w-[70vw]"
                animate={{
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={isTransitioning ? { duration: 0.4 } : { duration: 0 }}
              >
                <div className="relative overflow-hidden">
                  <img src={item.img} alt="" className="w-full h-600px object-cover" />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Content */}
                  {isActive && (
                    <div className="absolute bottom-6 left-6 text-white max-w-xl">
                      <div className="flex gap-2 flex-wrap mb-2">
                        {item.tags.map((tag: string) => (
                          <span key={tag} className="text-xs bg-white/20 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-semibold">{item.title}</h2>

                      <p className="text-sm text-white/80 mt-1">{item.date}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ARROWS */}
        <button
          onClick={() => {
            setIsTransitioning(true);
            setIndex((prev: number) => prev - 1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded hover:bg-black/60 transition-colors"
        >
          ‹
        </button>

        <button
          onClick={() => {
            setIsTransitioning(true);
            setIndex((prev: number) => prev + 1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded hover:bg-black/60 transition-colors"
        >
          ›
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-md h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            key={index}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    </section>
  );
}
