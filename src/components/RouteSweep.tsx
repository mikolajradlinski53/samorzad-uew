import styles from "./RouteSweep.module.css";

interface RouteSweepProps {
  /** Komunikat dla czytnika ekranu i podpis pod pociągnięciami. */
  label: string;
}

/**
 * Zasłona przejścia między stronami.
 *
 * Renderowana przez `loading.tsx`, więc React pokazuje ją NATYCHMIAST po
 * kliknięciu w odnośnik, zanim nowa strona dojedzie. Bez niej nawigacja na
 * telefonie wyglądała jak zawieszenie: zmierzone 1700 ms do zmiany adresu
 * i 2077 ms do nagłówka nowej strony, przez cały ten czas bez reakcji.
 *
 * Dwie ścieżki o miękkim esowatym przebiegu leżą na wysokości y≈30 i y≈70,
 * więc przy pełnej grubości kreski przykrywają razem cały ekran. Grubość
 * rośnie od 7 do 63 — dzięki temu kreska ZAMIATA, zamiast wypełnić się od
 * razu. Bez bibliotek animacji: całość to jedna klatkowana animacja CSS.
 */
export function RouteSweep({ label }: RouteSweepProps) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <svg
        className={styles.strokes}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className={styles.stroke}
          pathLength={1}
          d="M -20 34 C 10 16, 34 50, 56 32 S 88 20, 120 30"
          stroke="var(--sweep-neutral)"
        />
        <path
          className={`${styles.stroke} ${styles.lower}`}
          pathLength={1}
          d="M -20 68 C 14 84, 38 52, 60 70 S 90 82, 120 66"
          stroke="var(--accent)"
        />
      </svg>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
