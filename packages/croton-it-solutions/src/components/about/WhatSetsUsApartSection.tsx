import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const cards = [
  {
    title: "Multi-Platform CRM Expertise",
    desc: "Deep, certified expertise across Salesforce, HubSpot, Zoho and Microsoft Dynamics — we recommend what fits, not what we sell.",
  },
  {
    title: "AI Built into the Workflow",
    desc: "We ship AI inside the CRM where reps and agents already work — copilots, scoring, summarization and agentic automations.",
  },
  {
    title: "Outcome-Based Engagements",
    desc: "Programs are scoped around revenue, retention and CSAT outcomes — not vague hours or generic deliverables.",
  },
  {
    title: "From Strategy to Managed Ops",
    desc: "Strategy, implementation and ongoing managed CRM operations — with one accountable team across the full lifecycle.",
  },
  {
    title: "Data You Can Trust",
    desc: "Master data, deduplication, governance and analytics are built into every rollout — not retrofitted later.",
  },
  {
    title: "Industry-Proven Playbooks",
    desc: "Repeatable accelerators for SaaS, financial services, healthcare, manufacturing and retail mean faster time-to-value.",
  },
];

export default function WhatSetsUsApartSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [topHover, setTopHover] = useState<number | null>(null);
  const [bottomHover, setBottomHover] = useState<number | null>(null);

  const getColumn = (index: number) => index % 3;
  const isTopRow = (index: number) => index < 3;

  return (
    <section ref={ref} className="py-10">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-6xl mb-16"
        >
          What sets us apart
        </motion.h2>

        {/* Top Divider (only reacts to first row) */}
        <div className="grid grid-cols-3 mb-7">
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className={`border-[2px] transition-colors duration-300 ${
                topHover !== null && getColumn(topHover) === col
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              onMouseEnter={() => {
                if (isTopRow(i)) {
                  setTopHover(i);
                } else {
                  setBottomHover(i);
                }
              }}
              onMouseLeave={() => {
                if (isTopRow(i)) {
                  setTopHover(null);
                } else {
                  setBottomHover(null);
                }
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group"
            >
              <h3 className="text-4xl text-gray-500 group-hover:text-black transition-colors mb-4">
                {card.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed max-w-[90%]">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Divider (only reacts to second row) */}
        <div className="grid grid-cols-3 mt-7">
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className={`border-[2px] transition-colors duration-300 ${
                bottomHover !== null && getColumn(bottomHover) === col
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
