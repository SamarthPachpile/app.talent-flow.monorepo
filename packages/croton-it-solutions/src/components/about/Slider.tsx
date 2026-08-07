import { ArrowRight } from "lucide-react";

// 👉 Replace with your actual logo paths
const logos = [
  "/assets/slider/salesforce.svg",
  "/assets/slider/zoho.svg",
  "/assets/slider/tableau.svg",
  "/assets/slider/hubspot.svg",
  "/assets/slider/dynamics.svg",
  "/assets/slider/oracle.svg",
  "/assets/slider/sap.svg",
  "/assets/slider/aws.svg",
  "/assets/slider/google-cloud.svg",
  "/assets/slider/azure.svg",
  "/assets/slider/slack.svg",
  "/assets/slider/notion.svg",
  "/assets/slider/zendesk.svg",
  "/assets/slider/freshworks.svg",
  "/assets/slider/pipedrive.svg",
  "/assets/slider/intercom.svg",
  "/assets/slider/segment.svg",
  "/assets/slider/snowflake.svg",
  "/assets/slider/openai.png",
];

function LogoRow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

      <div className={`flex gap-6 min-w-max ${reverse ? "marquee-reverse" : "marquee"}`}>
        {[...logos, ...logos].map((logo, i) => (
          <img
            key={i}
            src={logo}
            className="h-10 w-auto object-contain opacity-50 hover:opacity-100 transition shrink-0"
            alt=""
          />
        ))}
      </div>

      <style>
        {`
          .marquee {
            animation: marquee 30s linear infinite;
          }

          .marquee-reverse {
            animation: marquee-reverse 30s linear infinite;
          }

          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }

          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
        `}
      </style>
    </div>
  );
}

export default function PurposeHero() {
  return (
    <div className="min-h-screen flex flex-col justify-center gap-6">
      {/* 🔼 Top Slider */}
      <div className="pt-4">
        <LogoRow />
      </div>

      {/* Hero */}
      <section className="flex items-center justify-center text-center px-4">
        <div className="max-w-5xl">
          <h1 className="text-[34px] sm:text-[48px] md:text-[64px] lg:text-[72px] leading-tight font-medium text-[#4a5166] tracking-tight">
            Our purpose is to create a positive impact for society and the planet
          </h1>

          <div className="mt-6">
            <button className="group inline-flex items-center gap-6 bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-orange-600 transition">
              Play Video
              <span className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 🔽 Bottom Slider */}
      <div className="pb-4">
        <LogoRow reverse />
      </div>

      {/* Floating Chat */}
      <div className="fixed bottom-6 right-6">
        <div className="flex items-center gap-3 bg-white border border-orange-300 px-4 py-3 rounded-full shadow-md">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            +
          </div>
          <span className="text-sm text-gray-700">How can I help you?</span>
        </div>
      </div>
    </div>
  );
}
