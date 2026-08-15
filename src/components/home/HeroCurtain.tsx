"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HomeExperience.module.css";

/**
 * Kurtyna otwierająca — adaptacja wzorca „split reveal".
 *
 * Wspólny mianownik referencji, które przysłał Samorząd, to jeden gest:
 * coś się rozsuwa i odsłania scenę. Bierzemy sam gest, nie implementację.
 *
 * Czego świadomie NIE przenosimy z oryginału:
 * - siedmiu sekund choreografii. Strona ma prowadzić studenta do sprawy, a nie
 *   kazać mu czekać. Cała sekwencja trwa ok. 1,4 s;
 * - biblioteki. To Web Animations API i CSS — zero nowych zależności, zero
 *   kilobajtów doliczonych do telefonu;
 * - kroju z Google Fonts. Mamy własne, self-hostowane.
 *
 * Trzy decyzje, bez których taka kurtyna szkodzi:
 *
 * 1. Renderuje się DOPIERO po zamontowaniu w przeglądarce. Gdyby była w HTML
 *    z serwera, awaria JavaScriptu zostawiłaby stronę zasłoniętą na zawsze.
 *    Tak może się tylko pojawić — nigdy zaciąć.
 * 2. Pokazuje się RAZ na sesję. Kurtyna przy dziesiątym wejściu tego samego
 *    dnia to nie efekt, tylko przeszkoda.
 * 3. Przy `prefers-reduced-motion` nie pojawia się w ogóle.
 *
 * Treść pod spodem jest w DOM od początku, kurtyna jest `aria-hidden` i nie
 * przyjmuje kliknięć — czytnik ekranu i wyszukiwarka jej nie widzą.
 */

const SESSION_KEY = "ssuew-hero-curtain";
const TOTAL_MS = 1400;

export function HeroCurtain({ wordmark }: { wordmark: string }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const skip =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Boolean(sessionStorage.getItem(SESSION_KEY));

    if (skip) {
      // Przez `requestAnimationFrame`, bo synchroniczne `setState` w efekcie
      // wywołuje kaskadę renderów.
      const id = requestAnimationFrame(() => setPhase("done"));
      return () => cancelAnimationFrame(id);
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    const start = requestAnimationFrame(() => setPhase("playing"));
    const end = window.setTimeout(() => setPhase("done"), TOTAL_MS);
    return () => {
      cancelAnimationFrame(start);
      window.clearTimeout(end);
    };
  }, []);

  if (phase === "done" || phase === "idle") return null;

  return (
    <div ref={rootRef} className={styles.curtain} aria-hidden="true">
      <div className={styles.curtainHalf} data-half="top">
        <span className={styles.curtainWord}>
          {Array.from(wordmark).map((char, i) => (
            <span key={`${char}-${i}`} style={{ animationDelay: `${i * 38}ms` }}>
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      </div>
      <div className={styles.curtainHalf} data-half="bottom">
        <span className={styles.curtainWord} aria-hidden="true">
          {Array.from(wordmark).map((char, i) => (
            <span key={`${char}-${i}`} style={{ animationDelay: `${i * 38}ms` }}>
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      </div>
      <span className={styles.curtainLine} />
    </div>
  );
}
