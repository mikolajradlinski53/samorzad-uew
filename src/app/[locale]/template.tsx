"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Szablon trasy — trzyma punkt orientacyjny <main> (cel odnośnika „przejdź do
 * treści") i opakowuje go w reactowe <ViewTransition>, czyli natywne przejścia
 * widoku. Zredukowany ruch obsługuje globals.css.
 *
 * `name` jest tu KONIECZNE. Bez niego React nadaje własne, generowane nazwy
 * (`_t_0_`, `_t_1_`), których nie da się przewidzieć w arkuszu stylów —
 * sprawdzone przez `document.getAnimations()`: reguły pisane na `root` nie
 * dotyczyły wtedy treści strony i animacja przejścia nigdy się nie
 * uruchamiała. Ustalona nazwa daje stabilne `::view-transition-new(strona)`.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition name="strona">
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </ViewTransition>
  );
}
