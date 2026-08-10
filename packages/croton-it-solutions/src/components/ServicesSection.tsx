import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

const services = [
  {
    title: "Product Strategy &",
    subtitle: "Experience Design",
    description: "Design and build what’s next with help from Croton, a Tapasys company.",
  },
  {
    title: "Digital Business",
    subtitle: "Transformation",
    description: "Advance your digital transformation journey.",
  },
  {
    title: "Intelligence",
    subtitle: "Engineering",
    description: "Leverage data and AI to transform products, operations, and outcomes.",
  },
  {
    title: "Software Product",
    subtitle: "Engineering",
    description: "Create high-value products faster with AI-powered and human-driven engineering.",
  },
  {
    title: "Technology",
    subtitle: "Modernization",
    description: "Modernize legacy systems with scalable cloud and platform engineering.",
  },
];

export default function ServicesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const [speed, setSpeed] = useState(0.5);

  // Infinite smooth loop
  useAnimationFrame(() => {
    const width = (contentRef.current?.scrollWidth ?? 0) / 3 || 0;

    let current = x.get();
    current -= speed;

    // loop BOTH directions
    if (current <= -width) current = 0;
    if (current >= 0) current = -width;

    x.set(current);
  });

  // Mouse movement controls speed (never stops)
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;

    // center = slow, edges = fast, supports both directions
    const newSpeed = (pos - 0.5) * 1.6;

    // prevent complete stop (dead zone)
    if (Math.abs(newSpeed) < 0.08) {
      setSpeed(newSpeed < 0 ? -0.08 : 0.08);
    } else {
      setSpeed(newSpeed);
    }
  };

  const resetSpeed = () => setSpeed(0.3);
  return (
    <section
      id="services"
      data-section="services"
      data-label="Services"
      className="w-screen min-h-screen bg-[#f3f3f3] py-12 sm:py-16 overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-14">
          <div>
            <p className="text-[#33456b] text-lg sm:text-2xl mb-6 tracking-[-0.02em]">
              What we offer
            </p>

            <h2 className="text-[#111625] font-light leading-[0.95] tracking-[-0.05em] text-[3rem] sm:text-[5rem] lg:text-[4.5rem]">
              Explore our services
            </h2>
          </div>

          <div className="lg:pt-10 lg:pl-10">
            <p className="text-[#33456b] text-lg sm:text-2xl leading-[1.35] max-w-[700px]">
              Unlock the power of data, design, and engineering to fuel innovation and drive
              meaningful outcomes for your business.
            </p>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Cards */}
      <div
        ref={wrapperRef}
        onMouseMove={handleMove}
        onMouseLeave={resetSpeed}
        className="relative overflow-hidden cursor-ew-resize select-none w-full"
      >
        <motion.div ref={contentRef} style={{ x }} className="flex gap-6 w-max">
          {[...services, ...services, ...services].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35 }}
              className="group w-[360px] sm:w-[420px] h-[460px] sm:h-[520px] bg-[#efeff1] hover:bg-[#ff5a1f] p-8 sm:p-10 flex flex-col justify-between shrink-0 clip-service transition-colors duration-300 cursor-pointer"
            >
              <div>
                <h3 className="text-[#111625] group-hover:text-white transition-colors duration-300 text-[2rem] sm:text-[2.6rem] leading-[1.05] tracking-[-0.04em] font-light">
                  {service.title}
                  <br />
                  {service.subtitle}
                </h3>

                <p className="mt-8 text-[#33456b] group-hover:text-white/90 transition-colors duration-300 text-lg sm:text-xl leading-[1.35] max-w-[300px]">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[#111625] group-hover:text-white transition-colors duration-300 text-2xl sm:text-3xl font-medium">
                Learn More
                <ArrowRight className="w-8 h-8 text-[#ff5a1f] group-hover:text-white transition-all duration-300 group-hover:translate-x-2" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
