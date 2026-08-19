import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
      });

      lenisRef.current = lenis;
      window.__lenis = lenis;

      const onScroll = () => {
        ScrollTrigger.update();
      };

      lenis.on("scroll", onScroll);

      const updateLenis = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      // Refresh ScrollTrigger positions after Lenis setup
      ScrollTrigger.refresh();

      const handleNavigation = () => {
        setTimeout(() => {
          lenis.resize();
          ScrollTrigger.refresh();
        }, 60);
      };

      window.addEventListener("popstate", handleNavigation);

      return () => {
        window.removeEventListener("popstate", handleNavigation);
        gsap.ticker.remove(updateLenis);
        lenis.off("scroll", onScroll);
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
