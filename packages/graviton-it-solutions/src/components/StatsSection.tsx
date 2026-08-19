import { motion } from "framer-motion";
const statsBg = "/assets/analytics bg.jpg";

const stats = [
  { number: "67", label: "product engineering centers" },
  { number: "587", label: "active clients" },
  { number: "32,000+", label: "professionals in 26 countries" },
  { number: "2,100+", label: "product releases per year" },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.25,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function StatsSection() {
  const duplicatedStats = [...stats, ...stats, ...stats, ...stats, ...stats, ...stats];

  return (
    <section
      id="stats"
      data-section="stats"
      data-label="Impact"
      className="relative w-screen min-h-screen overflow-hidden bg-[#ececef]"
    >
      {/* Background */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
        className="absolute inset-0"
      >
        <img
          src={statsBg}
          alt="Analytics background"
          className="w-full h-full object-cover object-left"
        />
      </motion.div>

      {/* ================= DESKTOP VIEW (EXACT ORIGINAL LAYOUT) ================= */}
      <div className="hidden sm:flex relative z-10 w-full min-h-screen items-center justify-end px-4 sm:px-8 lg:px-16 py-12">
        <motion.div
          initial={{ opacity: 0, x: 120, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          className="w-full max-w-[980px] bg-[#f7f7f7]/95 p-8 sm:p-12 lg:p-20 shadow-xl clip-path-card"
        >
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="grid grid-cols-2 gap-x-12 gap-y-14 sm:gap-y-20"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={item}>
                {/* Number */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.15 + 0.2,
                    duration: 0.7,
                  }}
                  className="text-[#111625] text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] leading-none font-light tracking-[-0.05em]"
                >
                  {stat.number}
                </motion.h3>

                {/* Label */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.15 + 0.45,
                    duration: 0.7,
                  }}
                  className="mt-4 text-[#33456b] text-lg sm:text-2xl leading-tight tracking-[-0.02em] max-w-320px"
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ================= MOBILE VIEW (NO BG CONTAINER, LARGE HEADING & INFINITE CAROUSEL) ================= */}
      <div className="flex sm:hidden relative z-10 w-full min-h-screen flex-col justify-center py-12 gap-8">
        {/* Large Heading at Top */}
        <div className="px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl font-light text-[#111625] tracking-[-0.03em] leading-tight"
          >
            Key Impact Metrics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 text-15px text-[#33456b]"
          >
            Driving digital transformation and measurable outcomes globally.
          </motion.p>
        </div>

        {/* Full Viewport Infinite Scrolling Carousel Slider */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="flex gap-4 animate-stats-slide">
            {duplicatedStats.map((stat, i) => (
              <div
                key={`mobile-stat-${i}`}
                className="w-260px flex-shrink-0 p-6 rounded-20px bg-white/85 backdrop-blur-md border border-white/90 shadow-lg flex flex-col justify-between"
              >
                <h3 className="text-[#111625] text-42px font-light tracking-[-0.05em] leading-none">
                  {stat.number}
                </h3>
                <p className="mt-4 text-[#33456b] text-15px leading-snug tracking-[-0.01em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
