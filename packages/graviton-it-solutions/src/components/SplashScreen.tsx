import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const HOLD_MS = 2000; // 2 seconds intro for smooth and snappy UX

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety fallback: if GSAP is blocked or slow, ensure done is set
    const fallbackTimer = setTimeout(() => {
      setDone(true);
    }, HOLD_MS + 800);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (orbitRef.current) {
        tl.from(orbitRef.current.querySelectorAll(".orbit"), {
          scale: 0,
          opacity: 0,
          rotate: -90,
          duration: 0.6,
          stagger: 0.08,
          ease: "expo.out",
        });
      }

      if (logoRef.current) {
        tl.from(
          logoRef.current.querySelectorAll(".letter"),
          {
            y: 40,
            opacity: 0,
            rotateX: -90,
            duration: 0.5,
            stagger: 0.03,
          },
          "-=0.4",
        );
      }

      if (subRef.current) {
        tl.from(subRef.current, { opacity: 0, y: 10, duration: 0.4 }, "-=0.2");
      }

      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: 100,
          duration: Math.max(0.6, HOLD_MS / 1000 - 0.8),
          ease: "none",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(counter.v).toString().padStart(3, "0");
            }
            if (barRef.current) {
              barRef.current.style.width = `${counter.v}%`;
            }
          },
        },
        0.3,
      );

      if (overlayRef.current) {
        tl.to(
          overlayRef.current,
          {
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => setDone(true),
          },
          `>-0.05`,
        );
      }

      if (orbitRef.current) {
        gsap.to(orbitRef.current.querySelectorAll(".orbit"), {
          rotate: "+=360",
          duration: 14,
          repeat: -1,
          ease: "none",
          stagger: { each: 2 },
        });
      }
    }, overlayRef);

    return () => {
      clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  const word = "GRAVITON";

  return (
    <>
      {!done && (
        <div
          ref={overlayRef}
          onClick={() => setDone(true)}
          data-splash="active"
          className="fixed inset-0 z-[100000] overflow-hidden cursor-pointer"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #2a1340 0%, #140628 40%, #08020f 100%)",
          }}
          aria-hidden="true"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Orbits */}
          <div
            ref={orbitRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="orbit absolute w-300px h-300px md:w-520px md:h-520px rounded-full border border-primary/30" />
            <div className="orbit absolute w-[220px] h-[220px] md:w-380px md:h-380px rounded-full border border-primary/20">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_20px_var(--gl-orange)]" />
            </div>
            <div className="orbit absolute w-140px h-140px md:w-240px md:h-240px rounded-full border border-primary-foreground/20">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-foreground" />
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pointer-events-none">
            <div ref={logoRef} className="overflow-hidden">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-primary-foreground tracking-tight flex">
                {word.split("").map((c, i) => (
                  <span key={i} className="letter inline-block">
                    {c === "T" && i === 6 ? <span className="text-primary">{c}</span> : c}
                  </span>
                ))}
              </h1>
            </div>
            <p
              ref={subRef}
              className="mt-3 text-10px sm:text-xs uppercase tracking-[0.4em] text-primary-foreground/60"
            >
              A Tapasys Group Company
            </p>

            {/* Loader */}
            <div className="mt-12 w-260px sm:w-360px">
              <div className="flex items-end justify-between mb-2 text-10px uppercase tracking-widest text-primary-foreground/50">
                <span>Initializing CRM Intelligence</span>
                <span ref={counterRef} className="text-primary-foreground tabular-nums">
                  000
                </span>
              </div>
              <div className="h-2px bg-primary-foreground/10 overflow-hidden">
                <div ref={barRef} className="h-full bg-primary" style={{ width: "0%" }} />
              </div>
            </div>
          </div>

          {/* Corner marks */}
          <div className="absolute top-6 left-6 text-10px uppercase tracking-widest text-primary-foreground/40">
            GR / 2026
          </div>
          <div className="absolute top-6 right-6 text-10px uppercase tracking-widest text-primary-foreground/40">
            CRM × AI
          </div>
          <div className="absolute bottom-6 left-6 text-10px uppercase tracking-widest text-primary-foreground/40">
            Tapasys Group
          </div>
          <div className="absolute bottom-6 right-6 text-10px uppercase tracking-widest text-primary-foreground/40">
            Engineering Relationships
          </div>
        </div>
      )}

      {children}
    </>
  );
}
