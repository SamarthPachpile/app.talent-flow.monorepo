import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onAnimationComplete={() => {
          const el = document.querySelector<HTMLElement>(
            `[data-page-transition="${location.pathname}"]`,
          );
          if (el) {
            el.style.filter = "none";
            el.style.willChange = "auto";
            el.style.transform = "none";
          }
        }}
        data-page-transition={location.pathname}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
