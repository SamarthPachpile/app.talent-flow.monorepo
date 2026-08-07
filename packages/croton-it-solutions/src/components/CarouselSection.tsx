import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const carousel1 = "/assets/carousel-1.jpg";
const carousel2 = "/assets/carousel-2.jpg";
const carousel3 = "/assets/carousel-3.jpg";

const slides = [
  {
    img: carousel1,
    caption: "CRM Strategy, Sales Cloud, Service Cloud, Customer Experience",
  },
  {
    img: carousel2,
    caption: "Salesforce, HubSpot & Zoho Implementation, Migration, Integration",
  },
  {
    img: carousel3,
    caption: "AI Copilots, Predictive Lead Scoring, Conversation Intelligence",
  },
];

export default function CarouselSection() {
  const [current, setCurrent] = useState(1);

  const prevSlide = () => {
    setCurrent((p) => Math.max(0, p - 1));
  };

  const nextSlide = () => {
    setCurrent((p) => Math.min(slides.length - 1, p + 1));
  };

  return (
    <section
      id="capabilities-preview"
      data-section="capabilities-preview"
      data-label="Capabilities"
      className="h-screen w-full flex flex-col justify-center max-w-[1400px] mx-auto px-2 sm:px-2 py-10"
    >
      {/* Desktop (Single Row with flex-nowrap and exact width math) */}
      <div className="hidden md:flex flex-nowrap gap-2 overflow-hidden flex-1 max-h-[78vh]">
        {slides.map((slide, i) => {
          const active = i === current;

          return (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                active ? "w-[calc(60%-0.5rem)]" : "w-[calc(20%-0.5rem)]"
              }`}
            >
              {/* Image animation unchanged */}
              <img
                src={slide.img}
                alt={slide.caption}
                className="w-full h-full object-cover"
                loading="lazy"
                width={1280}
                height={900}
              />

              {/* Text animation after card resize */}
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={slide.caption}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.72,
                        duration: 0.25,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                    className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  >
                    <motion.p
                      initial={{
                        y: 30,
                        opacity: 0,
                        filter: "blur(8px)",
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        transition: {
                          delay: 0.82,
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }}
                      exit={{
                        y: 20,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      className="text-white text-base sm:text-lg max-w-2xl"
                    >
                      {slide.caption}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="hidden max-md:flex flex-1 items-center">
        <div className="relative rounded-2xl overflow-hidden w-full h-[70vh]">
          <img
            src={slides[current].img}
            alt={slides[current].caption}
            className="w-full h-full object-cover"
            loading="lazy"
            width={768}
            height={1024}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={slides[current].caption}
              initial={{ opacity: 0, y: 25 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              exit={{
                opacity: 0,
                y: 20,
                transition: { duration: 0.2 },
              }}
              className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent"
            >
              <p className="text-white text-sm">{slides[current].caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Progress Bar */}
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${((current + 1) / slides.length) * 100}%`,
            }}
          />
        </div>

        {/* Prev */}
        <button
          onClick={prevSlide}
          disabled={current === 0}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Next */}
        <button
          onClick={nextSlide}
          disabled={current === slides.length - 1}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
