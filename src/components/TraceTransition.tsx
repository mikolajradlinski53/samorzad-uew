"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./TraceTransition.module.css";

/**
 * Przejście między stronami: kreski zamalowują ekran, pod zasłoną zmienia się
 * strona, potem kreski schodzą i odsłaniają gotową treść.
 *
 * DLACZEGO NIE PRZEJŚCIE WIDOKU. Wcześniejsza wersja animowała maskę na
 * `::view-transition-new`, przez co nowa treść wjeżdżała RAZEM z efektem
 * i nachodziła na niego. Tutaj takty są rozdzielone: dopóki trwa
 * zamalowywanie, stara strona stoi nieruchomo; nawigacja rusza dopiero po
 * pełnym zakryciu. Efekt i treść nigdy nie są widoczne jednocześnie.
 *
 * PRZY OKAZJI ROZWIĄZUJE ZACIĘCIE. Zasłona wisi, dopóki nowa strona się nie
 * pojawi, więc doczytywanie dzieje się POD nią. Zmierzone wcześniej 1700 ms
 * bez żadnej reakcji zamienia się w czas wypełniony ruchem.
 *
 * Ruch odtwarzamy w `requestAnimationFrame`, a nie w keyframe'ach CSS, bo
 * druga faza musi zaczekać na nawigację o nieznanym czasie trwania —
 * animacja CSS nie umie się zatrzymać i poczekać.
 */

/** Ile trwa zamalowanie i ile odsłonięcie. */
const COVER_MS = 700;
const REVEAL_MS = 700;
/** Po tylu ms zakrycia pokazujemy podpis — tyle znaczy „to trwa dłużej". */
const LABEL_AFTER_MS = 550;
/** Bezpiecznik: gdyby nawigacja nigdy nie doszła do skutku, odsłaniamy mimo to. */
const STUCK_MS = 8000;

/** Grubość kreski: cienki ślad na starcie, pełne zakrycie na końcu. */
const SW_MIN = 7;
const SW_MAX = 72;

/**
 * Dwie krzywe leżą na wysokości y≈28 i y≈74. Przy pełnej grubości każda
 * przykrywa pas wyższy niż połowa kadru, więc razem zakrywają wszystko —
 * a że wchodzą z przesunięciem, czyta się to jak dwa ruchy ręki.
 */
const PATHS = [
  "M -15 28 C 22 5, 46 52, 70 26 S 104 8, 132 33",
  "M -15 74 C 20 97, 48 49, 72 76 S 106 93, 132 65",
];

/** Łagodne rozpędzenie i wyhamowanie. */
const ease = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Rysowanie kresek. Funkcje są MODUŁOWE i przyjmują ścieżki argumentem, a nie
 * sięgają po refa z domknięcia — reguła `react-hooks/immutability` słusznie
 * zabrania mutowania wartości przekazanej do hooka.
 */
type Sciezki = (SVGPathElement | null)[];

function rysuj(sciezki: Sciezki, postep: number, kierunek: "in" | "out"): void {
  const e = ease(Math.min(1, Math.max(0, postep)));
  for (const p of sciezki) {
    if (!p) continue;
    if (kierunek === "in") {
      // Kreska wjeżdża od lewej i grubieje aż do pełnego zakrycia.
      p.style.strokeDashoffset = String(1 - e);
      p.style.strokeWidth = String(SW_MIN + (SW_MAX - SW_MIN) * e);
    } else {
      // Odsłanianie: kreska ucieka w lewo i chudnie.
      p.style.strokeDashoffset = String(-e);
      p.style.strokeWidth = String(SW_MAX - (SW_MAX - SW_MIN) * e);
    }
  }
}

function schowaj(sciezki: Sciezki): void {
  for (const p of sciezki) {
    if (!p) continue;
    p.style.strokeDashoffset = "1";
    p.style.strokeWidth = String(SW_MIN);
  }
}

type Phase = "idle" | "cover" | "held" | "reveal";

export function TraceTransition() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("idle");
  // Gotowość podpisu przechowujemy, ale WIDOCZNOŚĆ wyliczamy z fazy — dzięki
  // temu nie trzeba go gasić stanem w efekcie odsłaniania (kaskada renderów).
  const [labelReady, setLabelReady] = useState(false);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const raf = useRef(0);
  const cel = useRef<string | null>(null);

  // Przechwycenie kliknięcia w wewnętrzny odnośnik.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      // Środkowy przycisk, Ctrl/Cmd i Shift otwierają w nowej karcie — tego
      // nie wolno przechwytywać, bo użytkownik świadomie prosi o co innego.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;

      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      // Tylko nasze strony i tylko realna zmiana adresu — kotwice na tej samej
      // stronie mają działać zwyczajnie.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      cel.current = url.pathname + url.search + url.hash;
      setLabelReady(false);
      setPhase("cover");
    };

    // FAZA PRZECHWYTYWANIA. React obsługuje kliknięcia w korzeniu aplikacji,
    // czyli wewnątrz `document`; nasłuch w fazie bąbelkowania dostałby
    // zdarzenie DOPIERO po tym, jak router zdąży już ruszyć z nawigacją,
    // i `preventDefault` przyszłoby za późno.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Takt pierwszy: zamalowanie, a po nim nawigacja.
  useEffect(() => {
    if (phase !== "cover") return;
    const t0 = performance.now();
    const krok = (now: number) => {
      const p = (now - t0) / COVER_MS;
      rysuj(pathRefs.current, p, "in");
      if (p < 1) {
        raf.current = requestAnimationFrame(krok);
      } else {
        setPhase("held");
        // Nawigacja rusza DOPIERO po pełnym zakryciu — inaczej nowa treść
        // mignęłaby pod niedomkniętą zasłoną.
        if (cel.current) router.push(cel.current);
      }
    };
    raf.current = requestAnimationFrame(krok);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, router]);

  // Podpis i bezpiecznik na czas oczekiwania pod zasłoną.
  useEffect(() => {
    if (phase !== "held") return;
    const podpis = window.setTimeout(() => setLabelReady(true), Math.max(0, LABEL_AFTER_MS - COVER_MS));
    const bezpiecznik = window.setTimeout(() => setPhase("reveal"), STUCK_MS);
    return () => {
      window.clearTimeout(podpis);
      window.clearTimeout(bezpiecznik);
    };
  }, [phase]);

  // Nowa strona doszła — odsłaniamy.
  useEffect(() => {
    if (phase !== "held") return;
    if (cel.current && !cel.current.startsWith(pathname)) return;
    setPhase("reveal");
  }, [pathname, phase]);

  // Takt drugi: odsłonięcie.
  useEffect(() => {
    if (phase !== "reveal") return;
    const t0 = performance.now();
    const krok = (now: number) => {
      const p = (now - t0) / REVEAL_MS;
      rysuj(pathRefs.current, p, "out");
      if (p < 1) {
        raf.current = requestAnimationFrame(krok);
      } else {
        schowaj(pathRefs.current);
        cel.current = null;
        setPhase("idle");
      }
    };
    raf.current = requestAnimationFrame(krok);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  const widoczne = phase !== "idle";
  const labelOn = phase === "held" && labelReady;

  return (
    <div
      className={`${styles.overlay} ${widoczne ? styles.blocking : ""}`}
      aria-hidden={!widoczne}
      // Zasłona jest wizualna; o postępie nawigacji mówi podpis niżej, który
      // ma własny region komunikatów.
      style={{ visibility: widoczne ? "visible" : "hidden" }}
    >
      <svg
        className={styles.strokes}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {PATHS.map((d, i) => (
          <path
            key={d}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            className={styles.stroke}
            pathLength={1}
            d={d}
            stroke={i === 0 ? "var(--sweep-neutral, #e4e4e7)" : "var(--accent)"}
            style={{ strokeDashoffset: 1, strokeWidth: SW_MIN }}
          />
        ))}
      </svg>
      <p className={`${styles.label} ${labelOn ? styles.labelVisible : ""}`} role="status">
        {labelOn ? t("loadingPage") : ""}
      </p>
    </div>
  );
}
