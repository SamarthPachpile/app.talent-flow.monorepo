"use client";
import { useState, useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    quote:
      "The engineering culture at Graviton is unmatched. I get to design high-throughput HR CRM portals and ATS engines used by thousands of hiring managers every day.",
    highlight: "Every project solves real-world workforce challenges.",
    name: "Aarti M.",
    role: "Senior HR Tech Architect · Pune",
    initials: "AM",
  },
  {
    quote:
      "Ideas turn into production features rapidly. Our AI candidate screening parser and Dragonfly DB sync went from concept to live deployment in weeks.",
    highlight: "The speed of product iteration here is electric.",
    name: "Rohan S.",
    role: "Applied AI Engineer · Remote",
    initials: "RS",
  },
  {
    quote:
      "Graviton empowers people with autonomy, HR tech domain depth, and continuous learning. We build software that directly transforms people's careers.",
    highlight: "Growth here is intentional, not accidental.",
    name: "Priya K.",
    role: "Workforce Solutions Lead · Pune",
    initials: "PK",
  },
];

const TOTAL = TESTIMONIALS.length;
const SLIDES = [TESTIMONIALS[TOTAL - 1], ...TESTIMONIALS, TESTIMONIALS[0]];

export default function Testimonials() {
  const [index, setIndex] = useState(1);
  const [animated, setAnimated] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const realIndex = index <= 0 ? TOTAL - 1 : index >= TOTAL + 1 ? 0 : index - 1;

  // Always use functional updater so interval never has stale closure
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnimated(true);
      setIndex((i) => i + 1);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTransitionEnd = () => {
    // Silently snap from clone back to real slide
    if (index >= TOTAL + 1) {
      setAnimated(false);
      setIndex(1);
    } else if (index <= 0) {
      setAnimated(false);
      setIndex(TOTAL);
    }
  };

  const next = () => {
    setAnimated(true);
    setIndex((i) => i + 1);
    startTimer();
  };

  const prev = () => {
    setAnimated(true);
    setIndex((i) => i - 1);
    startTimer();
  };

  const goTo = (i: number) => {
    setAnimated(true);
    setIndex(i + 1);
    startTimer();
  };

  return (
    <section
      id="testimonials"
      data-section="testimonials"
      data-label="Stories"
      className="py-20 px-6 sm:px-12 bg-background"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-16 gap-8 flex-wrap">
          <div>
            <p className="text-11px tracking-[0.28em] uppercase text-orange-500 font-medium mb-3">
              Employee testimonials
            </p>
            <h2 className="text-[clamp(36px,5vw,58px)] leading-[1.1] text-[#2f3a4a] font-semibold">
              Hear from <span className="text-orange-500">our people</span>
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-260px leading-relaxed text-right">
            Explore why people joined Graviton—{" "}
            <a href="#" className="text-orange-500 font-medium hover:underline">
              and what keeps them here
            </a>
          </p>
        </div>

        {/* Slider */}
        <div className="overflow-hidden rounded-2xl shadow-[0_2px_40px_rgba(47,58,74,0.08)]">
          <div
            className="flex"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: animated ? "transform 0.7s cubic-bezier(0.77,0,0.175,1)" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {SLIDES.map((item, i) => (
              <div key={i} className="min-w-full grid grid-cols-1 md:grid-cols-2 bg-white">
                {/* Left: Quote */}
                <div className="px-10 py-16 md:px-16 md:py-20 flex flex-col justify-center">
                  <div
                    className="text-100px leading-[0.6] text-orange-500 opacity-15 mb-4 select-none"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    "
                  </div>
                  <blockquote
                    className="text-[clamp(20px,2.5vw,32px)] leading-[1.45] text-[#2f3a4a] mb-10"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {item.quote} <span className="text-orange-500 italic">{item.highlight}</span>
                  </blockquote>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-8 h-2px bg-orange-500 flex-shrink-0" />
                    <div>
                      <div className="text-15px font-semibold text-[#2f3a4a]">{item.name}</div>
                      <div className="text-13px text-gray-400 mt-0.5">{item.role}</div>
                    </div>
                  </div>
                </div>

                {/* Right: Photo */}
                <div className="relative bg-[#dfe3ea] min-h-400px md:min-h-520px flex items-center justify-center overflow-hidden">
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center text-36px text-[#2f3a4a] opacity-40"
                    style={{
                      background: "linear-gradient(135deg, #e8e2db 0%, #d4cdc4 100%)",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {item.initials}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === realIndex ? "28px" : "8px",
                  background: i === realIndex ? "#f97316" : "#e8e2db",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-400 tracking-wide">
            <span className="text-[#2f3a4a] font-semibold">
              {String(realIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(TOTAL).padStart(2, "0")}
          </p>

          <div className="flex gap-2.5">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-[#e8e2db] flex items-center justify-center text-[#2f3a4a] hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-[#e8e2db] flex items-center justify-center text-[#2f3a4a] hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-colors"
              aria-label="Next"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
