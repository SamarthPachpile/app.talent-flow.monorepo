import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      x: pos.x,
      y: pos.y,
    });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });

    let isVisible = false;

    const isEmbeddedRoute = () => {
      const path = window.location.pathname;
      return (
        path.startsWith("/admin-panel") ||
        path.startsWith("/companies") ||
        path.startsWith("/company") ||
        path.startsWith("/candidates") ||
        path.startsWith("/candidate-portal")
      );
    };

    const enableCustomCursor = () => {
      if (isEmbeddedRoute()) {
        document.documentElement.classList.remove("custom-cursor-active");
        if (dot && ring) gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
        return;
      }
      document.documentElement.classList.add("custom-cursor-active");
    };

    const updatePosition = (clientX: number, clientY: number) => {
      if (isEmbeddedRoute()) {
        document.documentElement.classList.remove("custom-cursor-active");
        if (isVisible) {
          isVisible = false;
          gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
        }
        return;
      }

      pos.x = clientX;
      pos.y = clientY;

      if (!isVisible) {
        isVisible = true;
        document.documentElement.classList.add("custom-cursor-active");
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      }

      xTo(pos.x);
      yTo(pos.y);
      xRingTo(pos.x);
      yRingTo(pos.y);
    };

    const checkHoverState = (target: HTMLElement | null) => {
      if (isEmbeddedRoute()) return;
      if (
        target &&
        target.closest(
          "a, button, [role=button], input, textarea, select, .cursor-hover, [data-cursor]",
        )
      ) {
        gsap.to(ring, {
          scale: 1.6,
          borderColor: "rgba(245, 158, 11, 0.9)",
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          duration: 0.2,
        });
        gsap.to(dot, { scale: 0.5, duration: 0.2 });
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(245, 158, 11, 0.7)",
          backgroundColor: "rgba(245, 158, 11, 0.05)",
          duration: 0.2,
        });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    const onMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
        const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
        checkHoverState(target);
      }
    };

    const onTouchEnd = () => {
      if (isVisible) {
        isVisible = false;
        gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
      }
    };

    const onOver = (e: MouseEvent) => {
      checkHoverState(e.target as HTMLElement);
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (
        t &&
        t.closest("a, button, [role=button], input, textarea, select, .cursor-hover, [data-cursor]")
      ) {
        checkHoverState(null);
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      document.documentElement.classList.remove("custom-cursor-active");
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const onMouseEnter = () => {
      if (!isEmbeddedRoute()) {
        enableCustomCursor();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    enableCustomCursor();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 h-8 w-8 rounded-full border-2 border-amber-500/80 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-colors"
        style={{ zIndex: 99999999, pointerEvents: "none" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
        style={{ zIndex: 99999999, pointerEvents: "none" }}
      />
    </>,
    document.body,
  );
}
