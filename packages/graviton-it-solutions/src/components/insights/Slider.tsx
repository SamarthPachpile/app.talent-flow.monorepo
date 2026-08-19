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

  const extended = [...items, ...items, ...items];

  // Detect loop boundary for seamless infinite wrap
  useEffect(() => {
    if (index >= items.length * 2) {
      setNeedsReset("end");
    }
    if (index <= items.length - 1) {
      setNeedsReset("start");
    }
  }, [index, items.length]);

  const handleNext = () => {
    setIsTransitioning(true);
    setIndex((prev: number) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setIndex((prev: number) => prev - 1);
  };

  return (
    <section className="w-full py-12 overflow-hidden">
      <div className="overflow-hidden relative">
        {/* SLIDER TRACK */}
        <motion.div
          className="flex gap-4px px-[15vw]"
          style={{ willChange: "transform" }}
          animate={{
            x: `calc(-${index} * (70vw + 4px))`,
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
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={item.img} alt={item.title} className="w-full h-600px object-cover" />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content */}
                  {isActive && (
                    <div className="absolute bottom-8 left-8 right-8 text-white max-w-2xl">
                      <div className="flex gap-2 flex-wrap mb-3">
                        {item.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">
                        {item.title}
                      </h2>

                      <p className="text-sm text-white/80 mt-2 font-medium">{item.date}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ARROWS */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors text-2xl"
        >
          ‹
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors text-2xl"
        >
          ›
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-8 flex justify-center px-4">
        <div className="w-full max-w-md h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            key={index}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="h-full bg-primary"
            onAnimationComplete={() => {
              handleNext();
            }}
          />
        </div>
      </div>
    </section>
  );
}
