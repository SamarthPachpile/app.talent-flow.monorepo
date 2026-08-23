import { useState } from "react";
import { ArrowLeft, ArrowRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const timeline = [
  {
    time: "07:30",
    suffix: "am",
    bg: "#eef7ff",
    phase: "morning",
    text: "Sales teams start the day reviewing leads, pipeline health, and priority follow-ups.",
  },
  {
    time: "08:20",
    suffix: "am",
    bg: "#eef7ff",
    phase: "morning",
    text: "Automated lead capture syncs new prospects from website forms, ads, and integrations.",
  },
  {
    time: "08:45",
    suffix: "am",
    bg: "#eef7ff",
    phase: "morning",
    text: "AI lead scoring ranks prospects based on behavior, engagement, and conversion likelihood.",
  },
  {
    time: "09:00",
    suffix: "am",
    bg: "#eef7ff",
    phase: "morning",
    text: "Sales outreach begins with personalized emails, calls, and scheduled follow-ups.",
  },
  {
    time: "10:00",
    suffix: "am",
    bg: "#f3f3f3",
    phase: "day",
    text: "Real-time pipeline updates give managers full visibility into deals and team performance.",
  },
  {
    time: "01:00",
    suffix: "pm",
    bg: "#fff5ea",
    phase: "afternoon",
    text: "Customer interactions increase with demos, meetings, and product walkthroughs.",
  },
  {
    time: "03:30",
    suffix: "pm",
    bg: "#fff5ea",
    phase: "afternoon",
    text: "Deals progress with automated reminders, document sharing, and contract tracking. Driving faster conversions and reducing sales cycle time.",
  },
  {
    time: "05:20",
    suffix: "pm",
    bg: "#fff5ea",
    phase: "afternoon",
    text: "Customer support and success teams resolve tickets and nurture relationships.",
  },
  {
    time: "07:30",
    suffix: "pm",
    bg: "#1b2135",
    phase: "night",
    text: "Automations take over—sending follow-ups, updating records, and triggering workflows.",
  },
  {
    time: "08:20",
    suffix: "pm",
    bg: "#1b2135",
    phase: "night",
    text: "Analytics dashboards process daily data to generate insights and performance reports.",
  },
  {
    time: "10:30",
    suffix: "pm",
    bg: "#1b2135",
    phase: "night",
    text: "AI-driven recommendations optimize next-day strategies for sales and marketing teams.",
  },
  {
    time: "07:00",
    suffix: "am",
    bg: "#eef7ff",
    phase: "morning",
    text: "A new day begins with smarter insights, stronger pipelines, and better customer relationships.",
  },
];

const POSITIONS = [
  { x: -620, y: 260, scale: 0.8 },
  { x: -300, y: 180, scale: 0.9 },
  { x: 0, y: 0, scale: 1 },
  { x: 300, y: 180, scale: 0.9 },
  { x: 620, y: 260, scale: 0.8 },
];

// Bézier curve math
function getPointOnCurve(t: number) {
  const x = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * 800 + t * t * 1600;

  const y = (1 - t) * (1 - t) * 320 + 2 * (1 - t) * t * 40 + t * t * 320;

  return { x, y };
}

export default function ImpactSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setActive((p) => (p + 1) % timeline.length);
  };

  const prev = () => {
    setDirection(-1);
    setActive((p) => (p - 1 + timeline.length) % timeline.length);
  };

  const current = timeline[active];
  const dark = current.phase === "night";

  return (
    <motion.section
      id="impact"
      data-section="impact"
      data-label="Daily Impact"
      animate={{ backgroundColor: current.bg }}
      transition={{ duration: 0.6 }}
      className="w-screen min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-[1920px] px-6 pt-12 relative">
        {/* HEADER SECTION */}
        <div className="max-w-[900px] mb-20 ml-12 ">
          <h1
            className={`text-[2rem] sm:text-[2rem] lg:text-[4rem] leading-[60px] tracking-[-0.02em] ${
              dark ? "text-white" : "text-[#111625]"
            }`}
          >
            We have a profound <br />
            impact on everyday life
          </h1>

          <p
            className={`mt-6 text-lg sm:text-xl leading-tight ${
              dark ? "text-white/70" : "text-[#4a5568]"
            }`}
          >
            Every day, billions of people connect with products, platforms, and services that we
            helped design and engineer.
          </p>
        </div>

        {/* CURVE */}
        <svg
          viewBox="0 0 1600 420"
          className="absolute left-0 right-0 bottom-[150px] w-full h-420px"
          preserveAspectRatio="none"
        >
          <path d="M0 320 Q800 40 1600 320" fill="none" stroke="#ff5a1f" strokeWidth="3" />

          {[-2, -1, 0, 1, 2].map((offset) => {
            const index = (active + offset + timeline.length) % timeline.length;

            // shift t based on offset (center = 0.5)
            const baseT = 0.5;
            const spacing = 0.2;
            const t = Math.max(0, Math.min(1, baseT + offset * spacing));
            const { x, y } = getPointOnCurve(t);

            return (
              <motion.circle
                key={index}
                animate={{
                  cx: x,
                  cy: y,
                  r: offset === 0 ? 15 : 8,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
                fill="#ff5a1f"
              />
            );
          })}
        </svg>

        {/* TEXT SLIDER */}
        <div className="relative z-10 h-[620px] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false}>
              {timeline.map((item, index) => {
                let offset = index - active;

                if (offset > timeline.length / 2) offset -= timeline.length;
                if (offset < -timeline.length / 2) offset += timeline.length;

                if (Math.abs(offset) > 3) return null;

                const pos = POSITIONS[offset + 2] || {
                  x: offset * 400,
                  y: 320,
                  scale: 0.7,
                };

                const center = offset === 0;

                return (
                  <motion.div
                    key={index}
                    initial={{
                      x: direction === 1 ? 400 : -400,
                      y: pos.y + 40,
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      scale: pos.scale,
                      opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.6 : 0.25,
                    }}
                    exit={{
                      x: direction === 1 ? -900 : 900,
                      opacity: 0,
                      scale: 0.6,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                    }}
                    className="absolute left-1/2 -translate-x-1/2 text-center w-320px"
                  >
                    {/* TIME */}
                    <div
                      className={`text-[4rem] sm:text-[5rem] lg:text-[6rem] leading-none tracking-[-0.05em] ${
                        center
                          ? dark
                            ? "text-white"
                            : "text-[#111625]"
                          : dark
                            ? "text-white/35"
                            : "text-[#7d8399]"
                      }`}
                    >
                      {item.time}
                      {item.suffix && center && (
                        <span className="text-[2rem] ml-1 tracking-wide opacity-50">
                          {item.suffix}
                        </span>
                      )}
                    </div>

                    {/* TEXT */}
                    <AnimatePresence mode="wait">
                      {center && (
                        <motion.div
                          key={item.time}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.35 }}
                          className="mt-6"
                        >
                          <p
                            className={`text-xl sm:text-2xl whitespace-pre-line ${
                              dark ? "text-white" : "text-[#111625]"
                            }`}
                          >
                            {item.text}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="relative z-20 flex items-center justify-center gap-11 -top-[100px]">
          <button
            onClick={prev}
            className={`hover:scale-110 transition ${dark ? "text-white" : "text-[#111625]"}`}
          >
            <ArrowLeft className="w-12 h-auto" />
          </button>

          <motion.div
            animate={{
              backgroundColor:
                current.phase === "night"
                  ? "#1e293b"
                  : current.phase === "afternoon"
                    ? "#fcd34d"
                    : "#a8d2f2",
            }}
            transition={{ duration: 0.5 }}
            className="relative w-[280px] h-[82px] rounded-full flex items-center justify-between px-3.5 shadow-md"
          >
            {/* Phase click targets & dots */}
            {[0, 1, 2].map((pIndex) => {
              const phaseIndex =
                current.phase === "afternoon" ? 1 : current.phase === "night" ? 2 : 0;
              return (
                <button
                  key={pIndex}
                  onClick={() => {
                    const targetIndex = pIndex === 0 ? 0 : pIndex === 1 ? 5 : 8;
                    setDirection(targetIndex > active ? 1 : -1);
                    setActive(targetIndex);
                  }}
                  className="w-14 h-14 rounded-full flex items-center justify-center z-10 focus:outline-none cursor-pointer"
                  aria-label={`Jump to ${pIndex === 0 ? "Morning" : pIndex === 1 ? "Afternoon" : "Night"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-opacity duration-300 ${
                      dark ? "bg-white/40" : "bg-[#111625]/30"
                    } ${phaseIndex === pIndex ? "opacity-0" : "opacity-100"}`}
                  />
                </button>
              );
            })}

            {/* Sliding White Bubble */}
            <motion.div
              className="absolute top-[13px] w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center z-20 pointer-events-none"
              animate={{
                left:
                  (current.phase === "afternoon" ? 1 : current.phase === "night" ? 2 : 0) === 0
                    ? "14px"
                    : (current.phase === "afternoon" ? 1 : current.phase === "night" ? 2 : 0) === 1
                      ? "112px"
                      : "210px",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              {dark ? (
                <Moon className="w-7 h-7 text-[#111625]" />
              ) : current.phase === "afternoon" ? (
                <Sun className="w-7 h-7 text-amber-600" />
              ) : (
                <Sun className="w-7 h-7 text-[#111625]" />
              )}
            </motion.div>
          </motion.div>

          <button
            onClick={next}
            className={`hover:scale-110 transition ${dark ? "text-white" : "text-[#111625]"}`}
          >
            <ArrowRight className="w-12 h-auto" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
