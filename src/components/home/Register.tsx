"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { board, viceChairs, russMembers } from "@/lib/people";
import styles from "./Register.module.css";

/**
 * Rejestr zakresów działania — druga po hero „scena" strony głównej.
 *
 * DLACZEGO NIE WEBGL, choć był dopuszczony
 *
 * Brakowało GŁĘBI i ruchu, a nie renderowania 3D. Panel leżący w przestrzeni,
 * przechylający się za kursorem, wjeżdżający z głębi, znak wodny przesuwający
 * się względem treści i liczba dobijająca do wartości — to wszystko robi CSS
 * z `perspective` plus jedna pętla `requestAnimationFrame`. Silnik 3D dołożyłby
 * ok. 150 KB do każdego wejścia na stronę i wymagałby sprawnej karty
 * graficznej, żeby pokazać dokładnie to samo. Ta droga sprawdziła się już przy
 * sygnecie w hero.
 *
 * CO TU JEST TREŚCIĄ, A CO EFEKTEM
 *
 * Treścią jest instytucja: zakres, organ właściwy i policzona liczba. Efekt ma
 * tę treść WYNIEŚĆ, a nie ją zastąpić — dlatego wielka liczba dobija licząc
 * (bo jest prawdziwa), a nie migocze.
 *
 * KAŻDA LICZBA JEST LICZONA, NIE WPISANA
 *
 * Tam, gdzie dane są w repozytorium (`people.ts`), rejestr je zlicza — po
 * zmianie składu Zarządu albo RUSS liczba zmieni się sama. Pozostałe mają w
 * komentarzu podane źródło, którym są istniejące podstrony.
 */

/**
 * Ile osób obsadza organy wykonawcze: osoba przewodnicząca + wiceprzewodniczący
 * + pozostały zarząd. Osoba przewodnicząca jest w `people.ts` osobnym
 * eksportem, a nie elementem listy, więc dolicza się ją jawnie — stąd „1 +".
 */
const PEOPLE_IN_OFFICE = 1 + viceChairs.length + board.length;

/**
 * Liczby, których nie da się policzyć z modułu, ale KAŻDA odpowiada istniejącym
 * podstronom — a nie oszacowaniu:
 *
 * - infopacki: src/app/[locale]/infopacki/{biblioteka, dyplomowanie, podania,
 *   regulamin-studiow, sprawy-studenckie, usos, zaliczenie-semestru,
 *   zycie-studenckie} = 8
 * - projekty: lista w NaszeProjektyContent = 9
 * - stypendia: rodzaje wsparcia opisane na /stypendia = 4
 */
const COUNT_INFOPACKS = 8;
const COUNT_PROJECTS = 9;
const COUNT_AID = 4;

interface Scope {
  key: string;
  href: string;
  /** Wartość pokazywana wielką cyfrą. 0 = ten zakres nie ma sensownej metryki. */
  metric: number;
}

const scopes: Scope[] = [
  { key: "studies", href: "/dla-studenta", metric: COUNT_INFOPACKS },
  { key: "rights", href: "/prawa-studenta", metric: 0 },
  { key: "aid", href: "/stypendia", metric: COUNT_AID },
  { key: "health", href: "/pomoc-psychologiczna", metric: 0 },
  { key: "initiatives", href: "/nasze-projekty", metric: COUNT_PROJECTS },
  { key: "representation", href: "/transparentnosc", metric: PEOPLE_IN_OFFICE + russMembers.length },
];

/** Co ile milisekund rejestr przechodzi do następnej pozycji sam z siebie. */
const ADVANCE_MS = 6200;
/** Jak długo liczba dobija do wartości. */
const COUNT_MS = 900;
/** O ile stopni panel kładzie się za kursorem. Celowo mało — to nie zabawka. */
const TILT = 7;

/**
 * Liczba dobijająca do wartości.
 *
 * Osobna pętla rAF, a nie `setInterval`: krok zależy od CZASU, nie od liczby
 * wywołań, więc tempo jest identyczne na 60 i 144 Hz. Przy ograniczonym ruchu
 * wartość pojawia się od razu — bez animacji, ale też bez zera na ekranie.
 */
function useCountUp(target: number, reduce: boolean): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    if (reduce) {
      // Przez `requestAnimationFrame`, nie synchronicznie: `setState` wprost
      // w efekcie wywołuje kaskadę renderów (i lint słusznie to blokuje).
      const id = requestAnimationFrame(() => {
        setValue(target);
        fromRef.current = target;
      });
      return () => cancelAnimationFrame(id);
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS);
      // easeOutCubic — szybko rusza, miękko dobija, bez przestrzelenia.
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else fromRef.current = target;
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);

  return value;
}

export function Register() {
  const t = useTranslations("register");
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const current = scopes[active];
  const shown = useCountUp(current.metric, reduce);

  /**
   * Rejestr przewija się sam, żeby sekcja żyła, zanim ktokolwiek jej dotknie.
   * Dwa warunki, bez których byłoby to wrogie:
   * - przy `prefers-reduced-motion` nie rusza wcale;
   * - PIERWSZE kliknięcie zatrzymuje go NA STAŁE. Spis, który przeskakuje pod
   *   palcem czytającego, jest gorszy od statycznego.
   */
  const [taken, setTaken] = useState(false);
  useEffect(() => {
    if (taken || reduce) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % scopes.length), ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [taken, reduce]);

  /** Pochylenie panelu za kursorem — tylko przy precyzyjnym wskaźniku. */
  const [pointer, setPointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const stageRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 110, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 110, damping: 20, mass: 0.4 });
  const rotateY = useTransform(sx, [-1, 1], [-TILT, TILT]);
  const rotateX = useTransform(sy, [-1, 1], [TILT, -TILT]);

  useEffect(() => {
    if (!pointer || reduce) return;
    const host = stageRef.current;
    if (!host) return;

    const onMove = (event: PointerEvent) => {
      const box = host.getBoundingClientRect();
      // Normalizujemy względem środka PANELU, nie okna: panel ma reagować na
      // to, gdzie kursor jest w stosunku do niego.
      px.set(Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / (box.width / 2))));
      py.set(Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / (box.height / 2))));
    };
    const reset = () => {
      px.set(0);
      py.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
    };
  }, [pointer, reduce, px, py]);

  return (
    <section id="zakresy" className={styles.register} aria-labelledby="register-title">
      <span className={styles.aura} aria-hidden="true" />

      <div className={styles.head}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h2 id="register-title" className={styles.heading}>
          {t("heading")}
        </h2>
        <p className={styles.lead}>{t("lead")}</p>
      </div>

      <div className={styles.body}>
        {/* Spis. Pozycje są przyciskami, nie odnośnikami: przełączają widok,
            a do podstrony prowadzi jeden odnośnik w panelu — pełnowymiarowy
            i opisany, zamiast sześciu drobnych celów. */}
        <ol className={styles.index}>
          {scopes.map((scope, i) => (
            <li key={scope.key}>
              <button
                type="button"
                aria-pressed={i === active}
                aria-controls="register-detail"
                className={styles.row}
                data-active={i === active ? "true" : undefined}
                onClick={() => {
                  setTaken(true);
                  setActive(i);
                }}
              >
                <span className={styles.rowNumber}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.rowName}>{t(`scopes.${scope.key}.name`)}</span>
                <span className={styles.rowOrgan}>{t(`scopes.${scope.key}.organ`)}</span>
                <span className={styles.rowRule} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>

        {/* Scena: perspektywa żyje TUTAJ, żeby panel mógł się w niej położyć. */}
        <div ref={stageRef} className={styles.stage}>
          <motion.div
            className={styles.panel}
            style={pointer && !reduce ? { rotateX, rotateY } : undefined}
          >
            {/* Numer zakresu jako znak wodny — leży GŁĘBIEJ niż treść panelu,
                więc przy pochyleniu przesuwa się względem niej. To jest cała
                sztuczka głębi: dwie warstwy na różnym `translateZ`. */}
            <span key={`mark-${current.key}`} className={styles.watermark} aria-hidden="true">
              {String(active + 1).padStart(2, "0")}
            </span>

            <div id="register-detail" className={styles.panelContent} aria-live="polite">
              {/* `key` wymusza ponowne odtworzenie wejścia przy zmianie zakresu —
                  panel wjeżdża z głębi, zamiast podmienić tekst na miejscu. */}
              <div key={current.key} className={styles.panelInner}>
                <p className={styles.panelOrgan}>{t(`scopes.${current.key}.organ`)}</p>
                <h3 className={styles.panelName}>{t(`scopes.${current.key}.name`)}</h3>

                {/* Wielka liczba jest treścią, nie ozdobą — dlatego zakresy bez
                    sensownej metryki (prawa studenta, wsparcie psychologiczne)
                    jej NIE dostają. Wpisanie tam czegokolwiek byłoby dekoracją
                    udającą informację. */}
                {current.metric > 0 ? (
                  <p className={styles.metric}>
                    <span className={styles.metricValue}>{shown}</span>
                    <em className={styles.metricLabel}>{t(`scopes.${current.key}.metric`)}</em>
                  </p>
                ) : null}

                <p className={styles.panelBody}>{t(`scopes.${current.key}.body`)}</p>

                <Link href={current.href} className={styles.panelLink}>
                  {t(`scopes.${current.key}.cta`)}
                  <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
