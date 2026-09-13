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
            node?.hasAttribute?.("data-lenis-prevent") || !!node?.closest?.("[data-lenis-prevent]")
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

      let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
      const debouncedResize = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          lenis.resize();
        }, 50);
      };

      // Watch for layout & content dimension changes dynamically
      const resizeObserver = new ResizeObserver(() => {
        debouncedResize();
      });

      if (document.body) {
        resizeObserver.observe(document.body);
      }
      if (document.documentElement) {
        resizeObserver.observe(document.documentElement);
      }

      window.addEventListener("popstate", debouncedResize);
      window.addEventListener("resize", debouncedResize);
      window.addEventListener("lenis-resize", debouncedResize);

      // Trigger initial resize after elements settle
      setTimeout(() => {
        lenis.resize();
      }, 100);

      return () => {
        cancelAnimationFrame(rafId);
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeObserver.disconnect();
        window.removeEventListener("popstate", debouncedResize);
        window.removeEventListener("resize", debouncedResize);
        window.removeEventListener("lenis-resize", debouncedResize);
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
