import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function SectionNavigator() {
  const location = useLocation();
  const [sections, setSections] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Reset on route change so each page gets its own nav.
    setSections([]);
    setActive(0);

    const collect = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      const seen = new Set<string>();
      const next: { id: string; label: string }[] = [];
      nodes.forEach((n) => {
        const id = n.id || n.dataset.section || "";
        if (!id || seen.has(id)) return;
        seen.add(id);
        // Make sure the element is targetable by id for scroll.
        if (!n.id) n.id = id;
        next.push({ id, label: n.dataset.label || n.dataset.section || "" });
      });
      setSections(next);
    };

    collect();
    const t1 = setTimeout(collect, 300);
    const t2 = setTimeout(collect, 1000);

    const onScroll = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      const mid = window.innerHeight / 2;
      let idx = 0;
      nodes.forEach((n, i) => {
        const r = n.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) idx = i;
      });
      setActive(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.pathname]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = (
      window as unknown as {
        __lenis?: {
          scrollTo: (target: HTMLElement, opts?: { offset?: number; duration?: number }) => void;
        };
      }
    ).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (sections.length < 2) return null;

  return (
    <div
      key={location.pathname}
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-4"
    >
      {sections.map((s, i) => {
        const isActive = active === i;

        return (
          <button
            key={s.id + i}
            onClick={() => goTo(s.id)}
            aria-label={`Go to ${s.label}`}
            className="group relative flex items-center justify-end gap-3 w-32"
          >
            <span
              className={`text-[11px] uppercase tracking-[0.22em] font-medium whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "opacity-100 translate-x-0 text-primary"
                  : "opacity-0 translate-x-2 text-muted-foreground group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {s.label}
            </span>

            <div className="relative w-4 h-4 flex items-center justify-center">
              <span
                className={`absolute rounded-full border transition-all duration-300 ${
                  isActive
                    ? "w-4 h-4 border-primary/40"
                    : "w-3 h-3 border-transparent group-hover:border-primary/20"
                }`}
              />

              <motion.span
                layout
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`rounded-full block ${
                  isActive
                    ? "w-2.5 h-2.5 bg-primary shadow-[0_0_12px_rgba(229,90,40,0.45)]"
                    : "w-2 h-2 bg-foreground/35 group-hover:bg-primary/70"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
