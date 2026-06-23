"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowUp } from "@phosphor-icons/react";

/**
 * „Do góry" — pojawia się po przewinięciu, skraca drogę powrotu na długich
 * podstronach (wayfinding, efekt Zeigarnik). Reduced-motion: skok bez animacji.
 */
export function BackToTop() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShow(latest > 600);
  });

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Wróć na górę strony"
          initial={reduce ? false : { opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduce ? undefined : { y: -3 }}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border-soft bg-bg-surface text-ink-primary shadow-lg shadow-black/10 transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowUp size={20} weight="bold" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
