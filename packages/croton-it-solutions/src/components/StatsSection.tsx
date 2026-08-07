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

      {/* Card Wrapper */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-end px-4 sm:px-8 lg:px-16">
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
                  className="mt-4 text-[#33456b] text-lg sm:text-2xl leading-tight tracking-[-0.02em] max-w-[320px]"
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
