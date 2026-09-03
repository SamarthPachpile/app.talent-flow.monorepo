const makeImpactBg = "/assets/makeimpactbg.jpg";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function MakeImpactSection() {
  return (
    <section
      id="our-story"
      data-section="our-story"
      data-label="Story"
      className="relative h-[100vh] min-h-700px overflow-hidden"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img src={makeImpactBg} alt="" className="w-full h-full object-cover scale-110" />
      </div>

      {/* HUGE BACKGROUND TEXT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.h1
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="absolute top-[-80px] left-[-40px] text-[22vw] font-semibold text-white leading-none tracking-[-0.05em]"
        >
          Make
        </motion.h1>

        <motion.h1
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="absolute bottom-[-120px] right-[-40px] text-[22vw] font-semibold text-white leading-none tracking-[-0.05em]"
        >
          Impact
        </motion.h1>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 h-full flex flex-col justify-center">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-10px sm:text-xs uppercase tracking-[0.35em] text-[#fcfcfc]">
            Next-Gen HR & Workforce CRM
          </p>

          <h2 className="text-[3rem] sm:text-[5rem] lg:text-[10rem] font-semibold text-white leading-[0.95] tracking-[-0.03em]">
            Unify <span className="text-white/80">Talent</span> & Teams
          </h2>
        </motion.div>

        {/* BUTTON OUTSIDE */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-[100px] left-8"
        >
          <a
            href="/careers"
            className="flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg hover:scale-105 transition"
          >
            <span className="text-[#111625] text-2xl">Explore Careers & Portals</span>

            <span className="w-10 h-10 rounded-full bg-[#ff5a1f] flex items-center justify-center">
              <ArrowRight className="text-white w-5 h-5" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
