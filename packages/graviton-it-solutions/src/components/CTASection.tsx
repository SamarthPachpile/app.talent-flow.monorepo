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
  buttonText = "Explore HR CRM Portals",
  buttonHref = "/contact",
  onButtonClick,
  headingLine1 = "Let’s unify",
  headingLine2 = "your workforce",
  headingHighlight = "together.",
  subtext = "Graviton provides comprehensive HR CRM portals, candidate application tracking, automated onboarding, and enterprise employee lifecycle software.",
}) => {
  return (
    <section
      id="cta"
      data-section="cta"
      data-label="Contact"
      className="w-full bg-[#e9eaee] py-24 lg:py-10 lg:pb-32 overflow-hidden relative font-sans text-slate-900"
    >
      <div className="max-w-[1700px] mx-auto px-8 lg:px-16 relative">
        {/* CTA BUTTON (TOP RIGHT) */}
        <div className="absolute top-25 right-8 lg:right-20 z-10">
          {onButtonClick ? (
            <button
              type="button"
              onClick={onButtonClick}
              className="flex items-center gap-4 bg-[#ff5a1f] text-white px-7 py-4 rounded-full text-lg font-medium hover:scale-105 transition cursor-pointer shadow-lg"
            >
              <span>{buttonText}</span>
              <span className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center shrink-0">
                <ArrowRight className="text-[#111625] w-5 h-5" />
              </span>
            </button>
          ) : (
            <a
              href={buttonHref}
              className="flex items-center gap-4 bg-[#ff5a1f] text-white px-7 py-4 rounded-full text-lg font-medium hover:scale-105 transition cursor-pointer shadow-lg"
            >
              <span>{buttonText}</span>
              <span className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center shrink-0">
                <ArrowRight className="text-[#111625] w-5 h-5" />
              </span>
            </a>
          )}
        </div>

        {/* BIG TYPOGRAPHY */}
        <div className="pt-20 lg:pt-16 select-none">
          <h2 className="text-[#111625] leading-[0.9] tracking-[-0.04em] text-[4.5rem] sm:text-[6rem] lg:text-[10rem] xl:text-[10rem]">
            {headingLine1}
          </h2>

          <h2 className="text-[#111625] leading-[0.9] tracking-[-0.04em] text-[4.5rem] sm:text-[6rem] lg:text-[10rem] xl:text-[10rem]">
            {headingLine2}
          </h2>

          <h2 className="text-primary text-[#ff5a1f] leading-[0.9] tracking-[-0.04em] text-[4.5rem] sm:text-[6rem] lg:text-[10rem] xl:text-[10rem] text-right">
            {headingHighlight}
          </h2>
        </div>

        {/* SUBTEXT */}
        <div className="absolute bottom-2 left-8 lg:left-20 max-w-[420px]">
          <p className="text-[#5b6475] text-lg leading-[1.5]">{subtext}</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
