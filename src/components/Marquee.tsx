"use client";

import { type ReactNode } from "react";

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
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-visible motion-reduce:[mask-image:none]">
      <div
        className="animate-marquee flex w-max gap-6 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {children}
        <div className="contents motion-reduce:hidden" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
