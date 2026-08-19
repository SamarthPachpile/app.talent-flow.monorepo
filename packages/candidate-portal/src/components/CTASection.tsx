import React from "react";
import { ArrowRight } from "lucide-react";

export interface CTASectionProps {
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  headingLine1?: string;
  headingLine2?: string;
  headingHighlight?: string;
  subtext?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  buttonText = "Get in touch",
  buttonHref = "/candidates-portal",
  onButtonClick,
  headingLine1 = "Let's start",
  headingLine2 = "engineering impact",
  headingHighlight = "together.",
  subtext = "GlobalLogic provides unique experience and expertise at the intersection of data, design, and engineering.",
}) => {
  return (
    <section
      id="cta"
      data-section="cta"
      data-label="Contact"
      className="w-full bg-[#e9eaee] py-20 lg:py-24 lg:pb-32 overflow-hidden relative font-sans text-slate-900"
    >
      <div className="max-w-[1700px] mx-auto px-6 sm:px-8 lg:px-16 relative">
        {/* CTA BUTTON (TOP RIGHT) */}
        <div className="sm:absolute top-8 sm:top-12 md:top-16 lg:top-20 right-6 sm:right-8 lg:right-20 mb-8 sm:mb-0 z-10">
          {onButtonClick ? (
            <button
              type="button"
              onClick={onButtonClick}
              className="inline-flex items-center gap-4 bg-[#ff5a1f] text-white px-7 py-4 rounded-full text-base sm:text-lg font-medium hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              <span>{buttonText}</span>
              <span className="size-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <ArrowRight className="text-[#111625] size-5" />
              </span>
            </button>
          ) : (
            <a
              href={buttonHref}
              className="inline-flex items-center gap-4 bg-[#ff5a1f] text-white px-7 py-4 rounded-full text-base sm:text-lg font-medium hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              <span>{buttonText}</span>
              <span className="size-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <ArrowRight className="text-[#111625] size-5" />
              </span>
            </a>
          )}
        </div>

        {/* BIG TYPOGRAPHY */}
        <div className="pt-4 sm:pt-12 lg:pt-16 select-none">
          <h2 className="text-[#111625] font-display font-medium leading-[0.9] tracking-[-0.04em] text-[3.5rem] sm:text-[5.5rem] lg:text-[8.5rem] xl:text-[9.5rem]">
            {headingLine1}
          </h2>

          <h2 className="text-[#111625] font-display font-medium leading-[0.9] tracking-[-0.04em] text-[3.5rem] sm:text-[5.5rem] lg:text-[8.5rem] xl:text-[9.5rem]">
            {headingLine2}
          </h2>

          <h2 className="text-[#ff5a1f] font-display font-medium leading-[0.9] tracking-[-0.04em] text-[3.5rem] sm:text-[5.5rem] lg:text-[8.5rem] xl:text-[9.5rem] sm:text-right">
            {headingHighlight}
          </h2>
        </div>

        {/* SUBTEXT */}
        <div className="mt-8 sm:mt-12 sm:absolute bottom-2 left-6 sm:left-8 lg:left-20 max-w-[420px]">
          <p className="text-[#5b6475] text-base sm:text-lg leading-[1.5]">{subtext}</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
