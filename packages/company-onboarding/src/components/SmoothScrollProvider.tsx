import { useEffect, useRef } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.__lenis) {
      return;
    }

    try {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        prevent: (node) => {
          if (!node || !(node instanceof HTMLElement)) return false;
          return (
            node.hasAttribute("data-lenis-prevent") ||
            Boolean(node.closest("[data-lenis-prevent]")) ||
            Boolean(node.closest(".overflow-y-auto")) ||
            Boolean(node.closest(".overflow-x-auto")) ||
            Boolean(node.closest(".overflow-auto"))
          );
        },
      });

      lenisRef.current = lenis;
      window.__lenis = lenis;

      let rafId = 0;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        window.__lenis = undefined;
      };
    } catch {
      // Fallback
    }
  }, []);

  return <>{children}</>;
}
