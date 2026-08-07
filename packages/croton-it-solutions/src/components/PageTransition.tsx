import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, filter: "blur(6px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
        onAnimationComplete={(def) => {
          // Clear inline filter so it doesn't create a containing block
          // that would break `position: sticky` for descendants.
          if (def === "animate") {
            const el = document.querySelector<HTMLElement>(
              `[data-page-transition="${location.pathname}"]`,
            );
            if (el) {
              el.style.filter = "";
              el.style.willChange = "";
              el.style.transform = "";
            }
          }
        }}
        data-page-transition={location.pathname}
        style={{ willChange: "opacity, filter" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
