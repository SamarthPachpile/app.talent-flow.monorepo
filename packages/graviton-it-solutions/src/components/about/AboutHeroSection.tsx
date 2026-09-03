import { motion } from "framer-motion";
const aboutHero = "/assets/about-hero.jpg";

export default function AboutHeroSection() {
  return (
    <section
      id="about-hero"
      data-section="about-hero"
      data-label="Intro"
      className="relative min-h-[100vh] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img src={aboutHero} alt="" className="w-full h-full object-cover" />

        {/* ✅ NEW bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 w-full py-16 sm:py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-10px sm:text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4"
        >
          About Graviton
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-foreground max-w-5xl"
        >
          <span className="font-semibold block mb-2">Graviton Solutions :</span>
          <span className="text-primary">Enterprise HR CRM</span> & Complete Workforce Software
          Suite
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 sm:mt-8 max-w-2xl"
        >
          <p className="text-xl text-muted-foreground leading-relaxed">
            Graviton powers modern organizations with full-scale HR portal software—delivering
            seamless candidate tracking, automated candidature screening, digital onboarding, and
            unified employee lifecycle management.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
