import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface SectionInfo {
  id: string;
  label: string;
}

export default function SectionNavigator() {
  const location = useLocation();
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [active, setActive] = useState(0);

  const formatLabel = (str: string) => {
    if (!str) return "";
    return str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const collectSections = useCallback(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const seen = new Set<string>();
    const next: SectionInfo[] = [];

    nodes.forEach((n) => {
      const id = n.id || n.dataset.section || "";
      if (!id || seen.has(id)) return;
      seen.add(id);

      if (!n.id) n.id = id;

      const rawLabel = n.dataset.label || formatLabel(n.dataset.section || "");
      next.push({ id, label: rawLabel });
    });

    setSections((prev) => {
      if (
        prev.length === next.length &&
        prev.every((item, idx) => item.id === next[idx].id && item.label === next[idx].label)
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setSections([]);
    setActive(0);

    collectSections();
    const t1 = setTimeout(collectSections, 200);
    const t2 = setTimeout(collectSections, 600);
    const t3 = setTimeout(collectSections, 1500);

    const observer = new MutationObserver(collectSections);
    observer.observe(document.body, { childList: true, subtree: true });

    const handleScroll = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      if (nodes.length === 0) return;

      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let currentIdx = 0;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const rect = node.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        if (absoluteTop <= scrollPos) {
          currentIdx = i;
        }
      }

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        currentIdx = nodes.length - 1;
      }

      setActive(currentIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, collectSections]);

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
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 max-md:hidden flex flex-col items-end gap-3 pointer-events-auto select-none"
    >
      {sections.map((s, i) => {
        const isActive = active === i;

        return (
          <button
            key={s.id + i}
            onClick={() => goTo(s.id)}
            aria-label={`Scroll to section: ${s.label}`}
            className="group relative flex items-center justify-end gap-3 py-1 cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          >
            <span
              className={`text-[10px] uppercase tracking-[0.22em] font-semibold whitespace-nowrap px-2 py-0.5 rounded transition-all duration-300 ${
                isActive
                  ? "opacity-100 translate-x-0 text-primary bg-background/80 backdrop-blur-sm shadow-sm"
                  : "opacity-0 translate-x-3 text-muted-foreground group-hover:opacity-100 group-hover:translate-x-0 bg-background/60 backdrop-blur-sm"
              }`}
            >
              {s.label}
            </span>

            <div className="relative w-4 h-4 flex items-center justify-center">
              <span
                className={`absolute rounded-full border transition-all duration-300 ${
                  isActive
                    ? "w-4 h-4 border-primary/50 scale-100"
                    : "w-2.5 h-2.5 border-transparent scale-75 group-hover:scale-100 group-hover:border-primary/30"
                }`}
              />

              <motion.span
                layout
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`rounded-full block transition-all duration-300 ${
                  isActive
                    ? "w-2.5 h-2.5 bg-primary shadow-[0_0_12px_rgba(255,90,31,0.6)]"
                    : "w-1.5 h-1.5 bg-foreground/40 group-hover:bg-primary/80 group-hover:w-2 group-hover:h-2"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
