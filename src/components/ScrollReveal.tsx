"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE, REVEAL_OFFSET } from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Ciche wejście bloku treści w kadr.
 *
 * §9 wizji zakazuje „identycznych fade + slide na każdej sekcji" i wymaga
 * najwyżej jednego dominującego momentu ruchu na widok. Ten komponent jest
 * świadomie tym cichym tłem, a nie momentem: krótki czas i mały dystans, żeby
 * powtórzenie na wielu sekcjach nie męczyło. Rolę akcentu pełni `Impulse`.
 *
 * Nagłówków sekcji celowo nim nie owijamy — nagłówek to nawigacja, ma być na
 * miejscu od razu.
 */

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: REVEAL_OFFSET }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration: DURATION.reveal,
              delay,
              ease: EASE,
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
