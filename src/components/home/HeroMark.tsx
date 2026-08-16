"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { MARK_GROUPS, MARK_ORDER, MARK_VIEWBOX, type MarkGroup } from "@/lib/mark";
import styles from "./HeroMark.module.css";

/**
 * Sygnet SSUEW jako obiekt w przestrzeni.
 *
 * ⚠ OBECNIE NIEUŻYWANY. Hero strony głównej to od decyzji zamawiającego ściana
 * kadrów (`HeroWall`). Komponent zostaje w repozytorium świadomie: jest
 * samodzielny, nie ma zależności poza `src/lib/mark.ts` i wraca jedną linią
 * `<HeroMark words={[...]} label={...} />` w dowolnym miejscu strony.
 * Naturalne miejsca powrotu to sekcja „O nas" albo stopka.
 *
 * SKĄD SIĘ WZIĄŁ POMYSŁ I DLACZEGO TAK, A NIE PRZEZ SILNIK 3D
 *
 * Samorząd chciał obiektu 3D reagującego na kursor, wzorowanego na scenie ze
 * Spline'a. Zamiast siatki wygenerowanej z obrazka rysujemy WŁASNY znak w SVG
 * i ustawiamy go w prawdziwej przestrzeni CSS. Powody, w tej kolejności:
 *
 * 1. Znak jednostki musi być DOKŁADNY. Siatka wygenerowana z podglądu logotypu
 *    jest do niego „podobna" — a to znaczy: nieprawdziwa. Tutaj są dosłownie
 *    te same ścieżki co w pliku źródłowym.
 * 2. Waga. Silnik 3D to ok. 150 KB, siatka z generatora bywa wielomegabajtowa.
 *    Tu cały obiekt to kilka kilobajtów wektorów.
 * 3. Ostrość i motyw. Wektor jest ostry na każdym ekranie i zmienia kolor
 *    razem z motywem strony. Wyrenderowana siatka ma kolor wypalony w teksturze.
 * 4. Bez WebGL-a działa u każdego, także tam, gdzie karta graficzna jest
 *    zablokowana przez politykę sprzętową.
 *
 * Przestrzeń jest prawdziwa, nie udawana: trzy grupy znaku to trzy osobne
 * warstwy na różnych głębokościach `translateZ`. Przy pochyleniu za kursorem
 * przesuwają się względem siebie — to paralaksa, której płaski obrazek nie
 * potrafi udać.
 *
 * TRZY GRUPY = TRZY SŁOWA HASŁA. Podział wynika z budowy znaku, nie z chęci
 * dopasowania do hasła — uzasadnienie przy `MARK_GROUPS` w src/lib/mark.ts.
 */

/** Głębokość każdej warstwy. Ludzie z przodu, podstawa najgłębiej. */
const LAYER_Z: Record<MarkGroup, number> = {
  dzialamy: 0,
  wspieramy: -26,
  inspirujemy: 30,
};

/** O ile stopni znak kładzie się za kursorem. Celowo mało — to nie zabawka. */
const TILT = 13;

interface HeroMarkProps {
  /** Trzy słowa hasła, w kolejności. */
  words: string[];
  label: string;
}

export function HeroMark({ words, label }: HeroMarkProps) {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  /**
   * Pochylenie tylko tam, gdzie jest PRECYZYJNY wskaźnik. Na telefonie nie ma
   * kursora, więc nasłuch byłby martwym kodem, a na tablecie z rysikiem znak
   * skakałby przy każdym dotknięciu.
   */
  const [pointer, setPointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });
  const rotateY = useTransform(sx, [-1, 1], [-TILT, TILT]);
  const rotateX = useTransform(sy, [-1, 1], [TILT, -TILT]);

  useEffect(() => {
    if (!pointer || reduce) return;
    const host = hostRef.current;
    if (!host) return;

    // Nasłuch na oknie, nie na samym znaku: kursor ma prowadzić obiekt z całego
    // hero, a nie dopiero po najechaniu na kilkadziesiąt pikseli grafiki.
    const onMove = (event: PointerEvent) => {
      const box = host.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      // Normalizujemy do [-1, 1] względem połowy okna — dalej i tak przycinamy.
      px.set(Math.max(-1, Math.min(1, (event.clientX - cx) / (window.innerWidth / 2))));
      py.set(Math.max(-1, Math.min(1, (event.clientY - cy) / (window.innerHeight / 2))));
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [pointer, reduce, px, py]);

  return (
    <div className={styles.host} ref={hostRef}>
      <motion.div
        className={styles.space}
        style={pointer && !reduce ? { rotateX, rotateY } : undefined}
        role="img"
        aria-label={label}
      >
        {MARK_ORDER.map((group, layer) => (
          <svg
            key={group}
            className={styles.layer}
            viewBox={MARK_VIEWBOX}
            aria-hidden="true"
            focusable="false"
            style={{
              // Warstwa siedzi na swojej głębokości; opóźnienie składania
              // odpowiada kolejności słów w haśle.
              transform: `translateZ(${LAYER_Z[group]}px)`,
              animationDelay: `${layer * 220}ms`,
            }}
            data-layer={group}
          >
            <g className={styles.ink}>
              {MARK_GROUPS[group].map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </svg>
        ))}
      </motion.div>

      {/* Hasło. Każde słowo zapala się razem ze swoją warstwą znaku — dlatego
          jest listą uporządkowaną, a nie trzema ozdobnymi napisami. */}
      <ol className={styles.motto}>
        {words.map((word, i) => (
          <li key={word} style={{ animationDelay: `${i * 220 + 260}ms` }}>
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            {word}
          </li>
        ))}
      </ol>
    </div>
  );
}
