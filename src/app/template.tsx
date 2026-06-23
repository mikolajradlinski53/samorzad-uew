"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Per-route template — re-mounts on navigation, giving every page a smooth
 * enter transition. Owns the <main> landmark (skip-link target). Reduced-motion
 * renders instantly.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.main
      id="main-content"
      tabIndex={-1}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="outline-none"
    >
      {children}
    </motion.main>
  );
}
