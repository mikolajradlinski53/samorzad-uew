"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { projectPhotos, projectPhotosAreAuthentic } from "@/lib/photos";
import styles from "./ProjectCoverflow.module.css";

/**
 * Talia projektów — coverflow 3D na całą szerokość okna.
 *
 * Dlaczego akurat tutaj: strona projektów od początku mówi „dziewięć wydarzeń,
 * dziewięć różnych energii". Lista trzech kafli na stronie głównej tego nie
 * niosła. Talia niesie — widać naraz cały dorobek, a nie wycinek.
 *
 * ŚWIADOME ODSTĘPSTWA OD WZORCA, Z KTÓREGO TO BIERZEMY:
 *
 * 1. Nie przechwytujemy przewijania strony. Wzorzec każe zablokować scroll
 *    i zamienić kółko myszy w sterowanie talią. Student, który chce dojść do
 *    stypendium, zostałby wtedy uwięziony w karuzeli — a klawiatura i czytnik
 *    ekranu tracą wyjście. Pionowe kółko przewija stronę jak wszędzie.
 *    Talią steruje się przeciąganiem, strzałkami, kropkami i poziomym gestem
 *    gaźnika (trackpad), który i tak nic innego tutaj nie robi.
 * 2. Automat co 3,6 s, nie co 2 s. Dwie sekundy to mniej, niż zajmuje
 *    przeczytanie podpisu — ruch byłby wtedy szumem, nie informacją.
 * 3. Pierwsza interakcja zatrzymuje automat NA STAŁE (WCAG 2.2.2). Karuzela,
 *    która rusza dalej, kiedy ktoś ją właśnie czyta, jest przeszkodą.
 *
 * Ruch liczymy w jednej pętli `requestAnimationFrame` i malujemy prosto po
 * `ref`, bez `setState` na klatkę. Stan Reacta trzyma wyłącznie numer aktywnej
 * karty, bo tylko on zmienia treść podpisu.
 */

interface Deck {
  key: string;
  name: string;
  type: string;
  photo?: string;
}

const DECK: Omit<Deck, "photo">[] = [
  { key: "adapciak", name: "Adapciak", type: "start" },
  { key: "animalia", name: "Animalia", type: "impact" },
  { key: "bal", name: "Bal UEW", type: "community" },
  { key: "dni", name: "Dni Adaptacyjne", type: "learning" },
  { key: "graduetion", name: "GradUEtion", type: "ceremony" },
  { key: "mosty", name: "Mosty Ekonomiczne", type: "mobility" },
  { key: "test", name: "Test Wiedzy Ekonomicznej", type: "knowledge" },
  { key: "tedx", name: "TEDxUEW", type: "ideas" },
  { key: "party", name: "UE Party", type: "culture" },
];

const N = DECK.length;

/** Automat. Wolniej niż wzorzec — patrz komentarz nagłówkowy. */
const AUTOPLAY_MS = 3600;
/** Wygaszanie wykładnicze; niezależne od częstotliwości odświeżania ekranu. */
const EASE_SPEED = 8.5;
/** Ile pikseli poziomego gestu domyka jeden krok. */
const WHEEL_THRESHOLD = 42;
/** Po tylu ms bezruchu gest uznajemy za zakończony i odblokowujemy kolejny. */
const GESTURE_IDLE_MS = 240;
/** Powyżej tylu pikseli ruch to przeciąganie, nie kliknięcie. */
const DRAG_SLOP = 8;
/** Ile pikseli w głąb cofa się karta na każdy krok od środka. */
const DEPTH_STEP = 70;
/** Dalej niż tyle kart od środka nic już się nie cofa ani nie blednie. */
const FAR = 4;

/** Najkrótsza odległość od `pos` do karty `i` na okręgu — stąd bierze się pętla. */
function wrap(i: number, pos: number): number {
  const half = N / 2;
  return (((i - pos) % N) + N + half) % N - half;
}

export function ProjectCoverflow() {
  const t = useTranslations("coverflow");
  const tp = useTranslations("naszeProjekty");
  const authentic = projectPhotosAreAuthentic();

  const cards = useMemo<Deck[]>(
    () => DECK.map((item) => ({ ...item, photo: projectPhotos(item.key)[0] })),
    [],
  );

  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  const deckRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadowRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /** Bieżąca pozycja ułamkowa i cel. Poza stanem Reacta — zmieniają się co klatkę. */
  const pos = useRef(0);
  const target = useRef(0);
  const pitch = useRef(200);

  /** Automat gaśnie po pierwszym dotknięciu i już nie wraca. */
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(true);

  const stopAutoplay = useCallback(() => {
    autoplayRef.current = false;
    setAutoplay(false);
  }, []);

  /**
   * Krok o dokładnie jedną kartę.
   *
   * Liczymy od karty NAJBLIŻSZEJ ŚRODKOWI, a nie od poprzedniego celu. Bez tego
   * gest złapany w połowie trwającego przejścia przeskakiwałby o dwie karty.
   */
  const step = useCallback((dir: number) => {
    target.current = Math.round(pos.current) + dir;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /**
   * Rozstaw kart liczymy przy zmianie okna — nigdy w pętli animacji.
   *
   * Nie wystarczy stały procent szerokości karty. Perspektywa ŚCIĄGA odległe
   * karty do środka: przy `perspective: 1150px` karta cofnięta o 280 px jest
   * rzutowana na ok. 80% swojego odsunięcia. Zmierzone na 1280 px: talia
   * kończyła się 92 px przed krawędzią okna z każdej strony, czyli dokładnie
   * to, czego ta sekcja miała nie robić — mała karuzela na środku strony.
   *
   * Dlatego rozstaw dobieramy tak, żeby SKRAJNA karta wypadła za krawędzią
   * okna PO rzutowaniu, a wynik trzymamy w rozsądnych widełkach: poniżej
   * dolnej karty przestałyby na siebie zachodzić, powyżej rozjechałyby się
   * na luźne kafle.
   */
  useEffect(() => {
    const measure = () => {
      const card = slotRefs.current[0]?.firstElementChild as HTMLElement | null;
      const width = card?.offsetWidth ?? 240;
      const mobile = window.innerWidth < 720;

      const perspective = mobile ? 900 : 1150;
      const foreshorten = perspective / (perspective + FAR * DEPTH_STEP);
      const floor = width * (mobile ? 0.72 : 0.68);
      const needed = window.innerWidth / 2 / (FAR * foreshorten);

      pitch.current = Math.min(Math.max(floor, needed), width * 0.95);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /** Jedna pętla na wszystko: automat i ręka sterują tym samym celem. */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const paint = () => {
      const p = pos.current;
      for (let i = 0; i < N; i += 1) {
        const slot = slotRefs.current[i];
        if (!slot) continue;
        const o = wrap(i, p);
        const a = Math.abs(o);
        const depth = Math.min(a, FAR);

        const x = o * pitch.current;
        const z = -depth * DEPTH_STEP;
        const rotY = -Math.sign(o) * Math.min(a, 1) * 72;
        const scale = 1 - depth * 0.05;
        const opacity = Math.max(0, 1 - depth * 0.13);

        slot.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
        slot.style.opacity = String(opacity);
        slot.style.zIndex = String(1000 - Math.round(a * 100));

        const shadow = shadowRefs.current[i];
        if (shadow) {
          // Cień jedzie osobno i płasko — nie obraca się z kartą, bo leży na
          // „podłodze". Skalujemy go zamiast animować `box-shadow`, żeby nie
          // wywoływać przemalowania całej sceny na każdej klatce.
          shadow.style.transform = `translate3d(${x}px, 0, 0) scale(${1 - depth * 0.11}, ${1 - depth * 0.16})`;
          shadow.style.opacity = String(Math.max(0, 0.5 - depth * 0.1));
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const diff = target.current - pos.current;
      if (Math.abs(diff) < 0.0005) {
        pos.current = target.current;
      } else {
        // 1 - exp(-v·dt): to samo tempo na 60, 120 i 144 Hz.
        pos.current += diff * (reduce ? 1 : 1 - Math.exp(-EASE_SPEED * dt));
      }

      paint();

      const next = ((Math.round(pos.current) % N) + N) % N;
      setActive((current) => (current === next ? current : next));

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  /** Automat. Milknie, gdy karta przeglądarki jest schowana, i po pierwszym geście. */
  useEffect(() => {
    if (!autoplay || reduce) return;
    let id = 0;

    const start = () => {
      id = window.setInterval(() => {
        if (!autoplayRef.current) return;
        target.current = Math.round(pos.current) + 1;
      }, AUTOPLAY_MS);
    };
    const onVisibility = () => {
      window.clearInterval(id);
      if (!document.hidden && autoplayRef.current) start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoplay, reduce]);

  /**
   * Poziomy gest gaźnika. Pionowe kółko zostawiamy stronie — patrz nagłówek.
   * Blokada gestu: jeden ruch trackpada to dokładnie jedna karta, także wtedy,
   * gdy bezwładność sypie jeszcze przez pół sekundy kolejnymi zdarzeniami.
   */
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;

    let acc = 0;
    let locked = false;
    let idle = 0;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      stopAutoplay();

      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        locked = false;
        acc = 0;
      }, GESTURE_IDLE_MS);

      if (locked) return;
      acc += event.deltaX;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;

      step(Math.sign(acc));
      locked = true;
      acc = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(idle);
    };
  }, [step, stopAutoplay]);

  /** Przeciąganie: karty idą za palcem, po puszczeniu siadają na najbliższej. */
  const drag = useRef<{ id: number; x: number; from: number; moved: boolean } | null>(null);

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    stopAutoplay();
    drag.current = { id: event.pointerId, x: event.clientX, from: pos.current, moved: false };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x;
    if (Math.abs(dx) > DRAG_SLOP) d.moved = true;
    const next = d.from - dx / pitch.current;
    pos.current = next;
    target.current = next;
  };

  const endDrag = (event: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    target.current = Math.round(pos.current);
    drag.current = null;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    stopAutoplay();
    step(event.key === "ArrowRight" ? 1 : -1);
  };

  const current = cards[active];

  return (
    <section className={styles.stage} aria-labelledby="coverflow-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h2 id="coverflow-title" className={styles.heading}>
          {t("heading")}
        </h2>
      </div>

      <div
        ref={deckRef}
        className={styles.deck}
        role="group"
        aria-roledescription={t("roleCarousel")}
        aria-label={t("regionLabel")}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Szeroki, miękki cień pod całą talią. Radialny gradient, nie box-shadow
            — prostokątny cień rysowałby pod kartami szarą belkę. */}
        <span className={styles.deckShadow} aria-hidden="true" />

        <div className={styles.shadows} aria-hidden="true">
          {cards.map((card, i) => (
            <span
              key={card.key}
              ref={(node) => {
                shadowRefs.current[i] = node;
              }}
              className={styles.cardShadow}
            />
          ))}
        </div>

        <div className={styles.rail}>
          {cards.map((card, i) => (
            <div
              key={card.key}
              ref={(node) => {
                slotRefs.current[i] = node;
              }}
              className={styles.slot}
              role="group"
              aria-roledescription={t("roleSlide")}
              aria-label={t("slideLabel", { index: i + 1, total: N })}
            >
              <button
                type="button"
                className={styles.card}
                data-active={i === active ? "true" : undefined}
                // Karta z boku wjeżdża na środek. Aktywna nic nie robi — jej
                // odnośnik leży w podpisie, gdzie jest czytelny i pełnowymiarowy.
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => {
                  if (drag.current?.moved) return;
                  stopAutoplay();
                  target.current = Math.round(pos.current) + wrap(i, pos.current);
                }}
              >
                {card.photo ? (
                  <Image
                    src={card.photo}
                    alt=""
                    fill
                    preload={i < 3}
                    sizes="(max-width: 719px) 70vw, 24vw"
                    className={styles.cardImage}
                    draggable={false}
                  />
                ) : (
                  <span className={styles.cardPoster} />
                )}
                <span className={styles.cardWash} />
                <span className={styles.cardIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.cardName}>{card.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.caption} aria-live="polite">
        <div key={current.key} className={styles.captionInner} data-reduce={reduce ? "true" : undefined}>
          <p className={styles.title}>{current.name}</p>
          <p className={styles.subtitle}>{tp(`projects.${current.key}.signature`)}</p>
          <dl className={styles.meta}>
            <div>
              <dt>{t("metaType")}</dt>
              <dd>{tp(`types.${current.type}`)}</dd>
            </div>
            <div>
              <dt>{t("metaFrame")}</dt>
              <dd>
                {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </dd>
            </div>
          </dl>
          <Link href={`/nasze-projekty#projekt-${current.key}`} className={styles.captionLink}>
            {t("open", { project: current.name })}
            <ArrowUpRight size={17} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.dots}>
          {cards.map((card, i) => (
            <button
              key={card.key}
              type="button"
              className={styles.dot}
              data-active={i === active ? "true" : undefined}
              aria-current={i === active ? "true" : undefined}
              aria-label={t("goTo", { project: card.name })}
              onClick={() => {
                stopAutoplay();
                target.current = Math.round(pos.current) + wrap(i, pos.current);
              }}
            />
          ))}
        </div>

        <p className={styles.hint}>{t("hint")}</p>
      </div>

      {!authentic ? <p className={styles.disclaimer}>{t("photoNote")}</p> : null}
    </section>
  );
}
