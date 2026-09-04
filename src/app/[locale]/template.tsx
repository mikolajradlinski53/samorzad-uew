"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Szablon trasy — trzyma punkt orientacyjny <main>, czyli cel odnośnika
 * „przejdź do treści", i opakowuje go w reactowe <ViewTransition>, żeby
 * zmiana strony przenikała łagodnie zamiast przeskakiwać.
 *
 * Świadomie BEZ własnej choreografii. Zamalowywanie pędzlem, które tu przez
 * chwilę stało, było za mocne jak na charakter serwisu. Zredukowany ruch
 * obsługuje globals.css, zerując czas przejścia.
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
