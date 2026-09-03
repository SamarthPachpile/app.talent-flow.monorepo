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

    // Reuse existing Lenis instance if already initialized by parent/root
    if (window.__lenis) {
      return;
    }

    try {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
        prevent: (node) => {
          return (
            node?.hasAttribute?.("data-lenis-prevent") ||
            !!node?.closest?.("[data-lenis-prevent]") ||
            !!node?.closest?.(".overflow-y-auto") ||
            !!node?.closest?.(".overflow-auto")
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

      const handleNavigation = () => {
        setTimeout(() => {
          lenis.resize();
        }, 60);
      };

      window.addEventListener("popstate", handleNavigation);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("popstate", handleNavigation);
        lenis.destroy();
        if (window.__lenis === lenis) {
          window.__lenis = undefined;
        }
      };
    } catch {
      // Fallback
    }
  }, []);

  return <>{children}</>;
}
