import { motion } from "framer-motion";

export default function CareersHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fff3ec] via-background to-[#ffe6d6]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-10px sm:text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Careers at Graviton
          </p>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold leading-[0.95] tracking-tight">
            Make your <br />
            <span className="text-primary">impact.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-muted-foreground max-w-md justify-self-start lg:justify-self-end"
        >
          Build CRM and applied-AI products that move revenue for the world's most ambitious
          companies. Smart, bold, human teams — shipping work that matters.
        </motion.p>
      </div>
    </section>
  );
}
