"use client";

import { useEffect, useState } from "react";
import styles from "./HomeExperience.module.css";

/**
 * Pasek przyrządowy w hero — sygnał „to działa teraz", nie dekoracja.
 *
 * Pomysł bierze się z identyfikacji serwisu: technicznej, z krojem mono i
 * współrzędnymi Wrocławia w rogu. Zamiast dokładać kolejny efekt, dokładamy
 * *informację, która żyje*: zegar idzie, numer tygodnia akademickiego się
 * zgadza, licznik kadru zmienia się razem ze zdjęciem. Rzeczy, które
 * naprawdę się aktualizują, czytają się jako dopracowane; animacja bez
 * treści czyta się jako ozdobnik.
 *
 * Zegar renderujemy dopiero po zamontowaniu. Serwer i przeglądarka nigdy nie
 * pokażą tej samej sekundy, więc renderowanie go od razu dałoby błąd
 * hydracji — a przy okazji sekundę wstecz.
 */

/** Tydzień roku akademickiego (start 1 października). */
function academicWeek(now: Date): number {
  const year = now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
  const start = new Date(year, 9, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return Math.max(1, Math.floor(days / 7) + 1);
}

interface HeroInstrumentProps {
  /** Numer aktualnego kadru w hero, liczony od 1. */
  frame: number;
  /** Ile kadrów jest łącznie. */
  frames: number;
  labels: { week: string; frame: string };
}

export function HeroInstrument({ frame, frames, labels }: HeroInstrumentProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Pierwszy odczyt w `requestAnimationFrame`, nie od razu w efekcie —
    // synchroniczne `setState` w efekcie wywołuje kaskadę renderów.
    const first = requestAnimationFrame(() => setNow(new Date()));
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(id);
    };
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Warsaw",
      }).format(now)
    : "--:--:--";

  return (
    <dl className={styles.instrument}>
      <div>
        <dt>51.10°N · 17.04°E</dt>
        <dd>Wrocław</dd>
      </div>
      <div>
        {/* `tabular-nums` — bez tego cyfry mają różne szerokości i zegar drga. */}
        <dt>{labels.week}</dt>
        <dd className={styles.instrumentNum}>{now ? academicWeek(now) : "--"}</dd>
      </div>
      <div>
        <dt>{labels.frame}</dt>
        <dd className={styles.instrumentNum}>
          {String(frame).padStart(2, "0")}/{String(frames).padStart(2, "0")}
        </dd>
      </div>
      <div>
        <dt aria-hidden="true">UTC+1</dt>
        <dd className={styles.instrumentNum} suppressHydrationWarning>
          {time}
        </dd>
      </div>
    </dl>
  );
}
