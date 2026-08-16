import { ArrowRight } from "lucide-react";

export default function CareersCTA() {
  return (
    <section
      id="cta"
      data-section="cta"
      data-label="Apply"
      className="relative py-40 bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/careerscta.png')",
      }}
    >
      <div className="relative max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Text */}
        <h2 className="text-4xl sm:text-5xl md:text-7xl leading-tight text-gray-900 max-w-4xl">
          Your opportunity for <br />
          impact starts now
        </h2>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          {/* Primary Button */}
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-orange-500 text-white px-6 py-4 rounded-full font-medium shadow-md hover:bg-orange-600 transition"
          >
            Explore vacancies
            <span className="w-8 h-8 rounded-full bg-white text-orange-500 flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>

          {/* Secondary Button */}
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-gray-100 text-gray-800 px-6 py-4 rounded-full font-medium hover:bg-gray-200 transition"
          >
            Learn more about us
            <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
