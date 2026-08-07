import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
const heroBg = "/assets/hero-bg.jpg";

/* ---------- Brand-style SVG marks ---------- */

const SalesforceMark = () => (
  <svg viewBox="0 0 64 48" className="w-9 h-9" aria-hidden="true">
    <path
      fill="#00A1E0"
      d="M27 9a11 11 0 0 1 19.5 4 9 9 0 0 1 11.4 12.6A8.5 8.5 0 0 1 52 41a9 9 0 0 1-13-1 10 10 0 0 1-17 1 9.5 9.5 0 0 1-15-9A9 9 0 0 1 14 17a11 11 0 0 1 13-8z"
    />
  </svg>
);

const TableauMark = () => (
  <svg viewBox="0 0 64 64" className="w-9 h-9" aria-hidden="true">
    <g fill="#E97627">
      <rect x="29" y="6" width="6" height="14" rx="1" />
      <rect x="29" y="44" width="6" height="14" rx="1" />
      <rect x="6" y="29" width="14" height="6" rx="1" />
      <rect x="44" y="29" width="14" height="6" rx="1" />
    </g>
    <g fill="#5B879B">
      <rect x="30" y="22" width="4" height="20" rx="1" />
      <rect x="22" y="30" width="20" height="4" rx="1" />
    </g>
    <circle cx="32" cy="32" r="3" fill="#1F3A4D" />
  </svg>
);

const AISparkMark = () => (
  <svg viewBox="0 0 64 64" className="w-9 h-9" aria-hidden="true">
    <defs>
      <linearGradient id="aiGrad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#FF7A1A" />
        <stop offset="100%" stopColor="#FFB36B" />
      </linearGradient>
    </defs>
    <path
      fill="url(#aiGrad)"
      d="M32 4l4.6 14.4L51 23l-14.4 4.6L32 42l-4.6-14.4L13 23l14.4-4.6L32 4z"
    />
    <circle cx="50" cy="50" r="5" fill="url(#aiGrad)" opacity="0.85" />
  </svg>
);

/* ---------- Floating icon component ---------- */

type FloatProps = {
  children: React.ReactNode;
  label: string;
  className: string;
  delay?: number;
  duration?: number;
};

function FloatingIcon({ children, label, className, delay = 0, duration = 6 }: FloatProps) {
  return (
    <motion.div
      className={`absolute hidden md:flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 24, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        className=" group flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-foreground/10 px-3 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] cursor-none"
      >
        {/* Icon with glow */}
        <div className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-inner">
          <span className="absolute inset-0 rounded-xl bg-foreground/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          {children}
        </div>

        {/* Animated Label */}
        <motion.span
          className="text-xs font-medium text-foreground/70 tracking-wide pr-1"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ x: 4 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      data-section="hero"
      data-label="Home"
      className="relative h-screen w-full flex items-end pb-12 sm:pb-16 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Graviton CRM consulting"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-background/30" />
        <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-56 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      {/* Floating brand icons */}
      <FloatingIcon
        label="Boost Sales with Salesforce"
        className="top-[18%] left-[6%]"
        delay={0.3}
        duration={50}
      >
        <SalesforceMark />
      </FloatingIcon>

      <FloatingIcon
        label="See Data Clearly with Tableau"
        className="top-[24%] right-[7%]"
        delay={0.5}
        duration={50}
      >
        <TableauMark />
      </FloatingIcon>

      <FloatingIcon
        label="Automate with AI"
        className="top-[55%] left-[10%]"
        delay={0.7}
        duration={50}
      >
        <AISparkMark />
      </FloatingIcon>

      <FloatingIcon
        label="Grow Faster with HubSpot"
        className="top-[50%] right-[9%]"
        delay={0.9}
        duration={50}
      >
        <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden="true">
          <circle cx="34" cy="14" r="4" fill="#FF7A59" />
          <path
            d="M30 22a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
            fill="#FF7A59"
          />
          <path d="M30 22V16" stroke="#FF7A59" strokeWidth="3" strokeLinecap="round" />
          <circle cx="14" cy="32" r="3" fill="#FF7A59" />
          <path d="M17 32h7" stroke="#FF7A59" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </FloatingIcon>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-xs sm:text-sm uppercase tracking-[0.35em] text-foreground/60 mb-6"
        >
          CRM Consultancy · Applied AI · RevOps
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(3rem,8vw,12rem)] leading-[0.9] tracking-[-0.0001em] text-foreground text-center mb-10 sm:mb-12"
        >
          Engineering Impact
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <button className="group flex items-center gap-3 bg-foreground/10 backdrop-blur-md text-foreground pl-7 pr-2 py-2 rounded-full text-base sm:text-lg font-medium border border-foreground/15 hover:bg-foreground/15 transition-all">
            Get to know us
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-background flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
