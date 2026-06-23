"use client";

import { type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds per loop. */
  speed?: number;
}

/**
 * Infinite horizontal marquee. Pauses on hover. Under reduced-motion it falls
 * back to a static wrapped row (no animation).
 */
export function Marquee({ children, speed = 32 }: MarqueeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="flex flex-wrap justify-center gap-4">{children}</div>
    );
  }

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="animate-marquee flex w-max gap-6 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {children}
        {children}
      </div>
    </div>
  );
}
