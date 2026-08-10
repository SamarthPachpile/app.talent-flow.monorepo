"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROCESS = [
  {
    step: "Step 1",
    title: "Apply online",
    desc: "Find a role that fits and submit your application in under five minutes.",
    bg: "#b8d4f8",
    num: "01",
  },
  {
    step: "Step 2",
    title: "Recruiter screen",
    desc: "A short conversation with our talent team about your experience and goals.",
    bg: "#fde8a0",
    num: "02",
  },
  {
    step: "Step 3",
    title: "Technical / case round",
    desc: "Practical, role-specific exercises co-designed with hiring managers.",
    bg: "#e0c9f8",
    num: "03",
  },
  {
    step: "Step 4",
    title: "Team & culture fit",
    desc: "Meet the people you'll work with day-to-day.",
    bg: "#a8e8cc",
    num: "04",
  },
  {
    step: "Step 5",
    title: "Offer & onboarding",
    desc: "Most candidates get an offer within 10 working days.",
    bg: "#ffc4a0",
    num: "05",
  },
  {
    step: "Step 6",
    title: "Document verification",
    desc: "Share required documents so we can complete pre-joining formalities quickly.",
    bg: "#ffd6e7",
    num: "06",
  },
  {
    step: "Step 7",
    title: "Training kickoff",
    desc: "Get introduced to tools, workflows, and your first 30-day success plan.",
    bg: "#c8f1ff",
    num: "07",
  },
  {
    step: "Step 8",
    title: "First day welcome",
    desc: "Meet your manager, teammates, and start your journey with confidence.",
    bg: "#dff7c2",
    num: "08",
  },
];

/**
 * Per-card animation config:
 *  targetX  — where the card's left edge lands, as a fraction of viewport width
 *  yPath    — pixel waypoints for vertical motion during the flight (4 stops)
 *  rotPath  — degree waypoints matching yPath (4 stops)
 */
const CARD_ANIMS = [
  { targetX: 0.1, yPath: [0, -60, 20, -15], rotPath: [3, -18, 8, -7] },
  { targetX: 0.1, yPath: [0, 55, -30, 12], rotPath: [2, 14, -9, 5] },
  { targetX: 0.08, yPath: [0, -60, 20, -15], rotPath: [3, -18, 8, -7] },
  { targetX: 0.1, yPath: [0, 65, -25, 8], rotPath: [4, 17, -8, 10] },
  { targetX: 0.06, yPath: [0, -75, 35, -25], rotPath: [7, -20, 12, -11] },
  { targetX: 0.18, yPath: [0, 50, -28, 18], rotPath: [-3, 12, -7, 6] },
  { targetX: 0.12, yPath: [0, -55, 22, -12], rotPath: [4, -16, 9, -5] },
  { targetX: 0.25, yPath: [0, 60, -38, 22], rotPath: [-5, 16, -10, 8] },
];

// Last card: delay = 7 * 0.08 = 0.56; reaches progress=1 when scroll progress ≈ 0.89
// Button starts fading in from that point.
const LAST_CARD_DONE_AT = 0.56 + 1 / 3; // ≈ 0.893

export default function RecruitmentProcess() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return value !== undefined ? lenis.scrollTo(value, { immediate: true }) : window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: "transform",
    });

    ScrollTrigger.defaults({ scroller: document.body });

    const stickyHeight = window.innerHeight * PROCESS.length;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${stickyHeight}`,
      pin: true,
      scrub: false,

      onUpdate: (self) => {
        const progress = self.progress;
        const vw = window.innerWidth;

        // Moving background text
        if (headerRef.current) {
          const maxMove = headerRef.current.scrollWidth - vw + 100;
          gsap.set(headerRef.current, { x: -progress * maxMove });
        }

        // Cards animation — one unique path per card
        cardsRef.current.forEach((card, index) => {
          // Stagger each card's animation start
          const delay = index * 0.08;
          // Each card's individual 0→1 progress, clamped
          const cardProgress = Math.max(0, Math.min((progress - delay) * 3, 1));

          if (cardProgress > 0) {
            const anim = CARD_ANIMS[index];

            const xStart = vw * 0.15;
            const xEnd = vw * (anim.targetX - 1);
            const x = gsap.utils.interpolate(xStart, xEnd, cardProgress);

            const { yPath, rotPath } = anim;
            const segments = yPath.length - 1;
            const yProg = cardProgress * segments;
            const yIdx = Math.min(Math.floor(yProg), segments - 1);
            const yLerp = yProg - yIdx;

            const y = gsap.utils.interpolate(yPath[yIdx], yPath[yIdx + 1], yLerp);
            const rot = gsap.utils.interpolate(rotPath[yIdx], rotPath[yIdx + 1], yLerp);

            gsap.set(card, { x, y, rotation: rot, opacity: 1 });
          } else {
            gsap.set(card, { opacity: 0 });
          }
        });

        // "Apply Now" button — slides in from the right and fades up after the
        // last card has fully landed. Progress window: LAST_CARD_DONE_AT → 1.
        if (buttonRef.current) {
          const remaining = 1 - LAST_CARD_DONE_AT;
          const btnProgress = Math.max(0, Math.min((progress - LAST_CARD_DONE_AT) / remaining, 1));

          // Ease-out cubic feel via squaring the complement
          const eased = 1 - Math.pow(1 - btnProgress, 3);

          // Start 80px to the right, slide into final position
          const xOffset = gsap.utils.interpolate(80, 0, eased);
          const opacity = eased;

          gsap.set(buttonRef.current, {
            x: xOffset,
            opacity,
            visibility: btnProgress > 0 ? "visible" : "hidden",
          });
        }
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      lenis.destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="recruitment-process"
      data-section="recruitment-process"
      data-label="Process"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "#f3f3f3",
        position: "relative",
      }}
    >
      {/* Moving background text */}
      <div
        ref={headerRef}
        style={{
          position: "absolute",
          top: -220,
          left: 0,
          width: "250vw",
          height: "100%",
          display: "flex",
          alignItems: "center",
          paddingLeft: "5vw",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <h2
          style={{
            fontSize: "22vw",
            fontWeight: 200,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: "#171a2a",
            opacity: 0.08,
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          Explore Our Recruitment Process
        </h2>
      </div>

      {/* Cards */}
      {PROCESS.map((p, index) => (
        <div
          className="clip-path-card"
          key={p.step}
          ref={(el) => {
            if (el) cardsRef.current[index] = el;
          }}
          style={{
            position: "absolute",
            left: "100%",
            top: "45%",
            transform: "translateY(-50%)",
            width: "380px",
            padding: "28px",
            background: p.bg,
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            zIndex: 10 + index,
            opacity: 0,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: "1rem",
            }}
          >
            {p.step}
          </p>

          <h3
            style={{
              fontSize: "42px",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: "1rem",
              color: "#171a2a",
            }}
          >
            {p.title}
          </h3>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(0,0,0,0.65)",
              marginBottom: "2rem",
            }}
          >
            {p.desc}
          </p>

          <div
            style={{
              fontSize: "90px",
              fontWeight: 900,
              lineHeight: 1,
              color: "rgba(0,0,0,0.08)",
            }}
          >
            {p.num}
          </div>
        </div>
      ))}

      {/* Apply Now button — right-edge, vertically centred */}
      <div
        ref={buttonRef}
        style={{
          position: "absolute",
          right: "20vw",
          top: "70%",
          transform: "translateY(-50%)",
          zIndex: 100,
          opacity: 0,
          visibility: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(23,26,42,0.45)",
            margin: 0,
          }}
        >
          Ready to join?
        </p>

        <button
          onClick={() => {
            /* hook up your router / modal here */
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "18px 36px",
            borderRadius: "100px",
            border: "none",
            background: "#171a2a",
            color: "#f3f3f3",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.02em",
            cursor: "pointer",
            boxShadow: "0 12px 40px rgba(23,26,42,0.22)",
            whiteSpace: "nowrap",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 18px 50px rgba(23,26,42,0.32)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 12px 40px rgba(23,26,42,0.22)";
          }}
        >
          Apply Now
          {/* Arrow icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
              stroke="#f3f3f3"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Subtle pulse ring around the button */}
        <style>{`
          @keyframes pulse-ring {
            0%   { transform: scale(1);   opacity: 0.25; }
            70%  { transform: scale(1.18); opacity: 0; }
            100% { transform: scale(1.18); opacity: 0; }
          }
          .apply-pulse::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 100px;
            border: 2px solid #171a2a;
            animation: pulse-ring 2s ease-out infinite;
            pointer-events: none;
          }
        `}</style>
      </div>
    </section>
  );
}
