"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Per-route template — owns the <main> landmark (skip-link target) and wraps it
 * in React's <ViewTransition> so route navigations crossfade smoothly (native
 * View Transitions API). Reduced motion is handled in globals.css.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition>
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </ViewTransition>
  );
}
