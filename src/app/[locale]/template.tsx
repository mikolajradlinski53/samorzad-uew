"use client";

import type { ReactNode } from "react";

/**
 * Szablon trasy — trzyma punkt orientacyjny <main>, czyli cel odnośnika
 * „przejdź do treści".
 *
 * BEZ <ViewTransition>. Przejście robi komponent TraceTransition, który
 * zamalowuje ekran, przełącza stronę pod zasłoną i dopiero potem odsłania.
 * Gdy działało jeszcze przejście widoku przeglądarki, stary i nowy zrzut
 * strony stały na ekranie JEDNOCZEŚNIE w pełnym kryciu — widać to było jako
 * dwie nałożone na siebie strony. Samo `animation: none` tego nie gasi:
 * usuwa animację, ale przejścia nie odwołuje.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      {children}
    </main>
  );
}
