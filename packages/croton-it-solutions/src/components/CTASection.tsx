import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section
      id="cta"
      data-section="cta"
      data-label="Contact"
      className="w-screen bg-[#e9eaee] py-24 lg:py-10 lg:pb-32 overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto px-8 lg:px-16 relative">
        {/* CTA BUTTON (TOP RIGHT) */}
        <div className="absolute top-25 right-8 lg:right-20">
          <Link
            to="/contact"
            className="flex items-center gap-4 bg-[#ff5a1f] text-white px-7 py-4 rounded-full text-lg font-medium hover:scale-105 transition"
          >
            Get in touch
            <span className="w-50px h-50px rounded-full bg-white flex items-center justify-center">
              <ArrowRight className="text-[#111625] w-5 h-5" />
            </span>
          </Link>
        </div>

        {/* BIG TYPOGRAPHY */}
        <div className="pt-20 lg:pt-16">
          <h2 className="text-[#111625]  leading-[0.9] tracking-[-0.04em] text-[4.5rem] sm:text-[6rem] lg:text-[10rem] xl:text-[10rem]">
            Let’s start
          </h2>

          <h2 className="text-[#111625] leading-[0.9] tracking-[-0.04em] text-[4.5rem] sm:text-[6rem] lg:text-[10rem] xl:text-[10rem]">
            engineering impact
          </h2>

          <h2 className="text-primary  leading-[0.9] tracking-[-0.04em] text-[4.5rem] sm:text-[6rem] lg:text-[10rem] xl:text-[10rem] text-right">
            together.
          </h2>
        </div>

        {/* SUBTEXT */}
        <div className="absolute bottom-2 left-8 lg:left-20 max-w-420px">
          <p className="text-[#5b6475] text-lg leading-[1.5]">
            GlobalLogic provides unique experience and expertise at the intersection of data,
            design, and engineering.
          </p>
        </div>
      </div>
    </section>
  );
}
