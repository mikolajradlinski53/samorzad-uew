"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { heroPhotos } from "@/lib/photos";
import { HeroWall } from "./HeroWall";
import { HeroCurtain } from "./HeroCurtain";
import styles from "./HomeExperience.module.css";


/**
 * Ciężka choreografia przewijania (gsap + ScrollTrigger, ok. 128 KB) ładuje się
 * dopiero wtedy, gdy ekran spełnia jej własny warunek. Wcześniej pobierał ją
 * każdy telefon, choć efekty startują od 900 px.
 */
const HomeMotion = dynamic(() => import("./HomeMotion"), { ssr: false });

const intents = [
  { key: "solve", href: "/dla-studenta", photo: 0, position: "50% 48%" },
  { key: "support", href: "/pomoc-psychologiczna", photo: 3, position: "50% 44%" },
  { key: "make", href: "/rekrutacja", photo: 4, position: "50% 52%" },
  { key: "verify", href: "/transparentnosc", photo: 1, position: "50% 48%" },
] as const;

export function HomeExperience() {
  const t = useTranslations("homeExperience");
  const rootRef = useRef<HTMLDivElement>(null);
  const manifestoWords = t("manifesto.statement").split(/\s+/);

  // Duże ekrany dostają choreografię przewijania; telefon nie pobiera jej wcale.
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setMotionReady(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div ref={rootRef} className={styles.experience}>
      {motionReady && <HomeMotion scope={rootRef} />}
      <HeroCurtain wordmark="SSUEW" />
      {/*
        HERO — DECYZJA ZAMAWIAJĄCEGO, podjęta świadomie po kilku podejściach.
        Ściana kadrów zastępuje cały dotychczasowy blok hero razem z listwą
        sytuacji: te same cztery sytuacje leżą w sekcji „Wybierz sytuację"
        bezpośrednio niżej, więc listwa w hero była ich powtórzeniem.
      */}
      <HeroWall />


      <section id="wybierz-sytuacje" aria-labelledby="routes-title" className={styles.routes}>
        <div className={styles.sectionIntro}>
          <p>{t("routes.eyebrow")}</p>
          <h2 id="routes-title">{t("routes.heading")}</h2>
          <span>{t("routes.lead")}</span>
        </div>

        <div className={styles.routeGrid}>
          {intents.map((intent, index) => (
            <Link
              key={intent.key}
              href={intent.href}
              className={`${styles.route} ${styles[`route${index + 1}`]}`}
            >
              {index === 0 ? (
                <Image
                  src={heroPhotos[intent.photo]}
                  alt=""
                  fill
                  sizes="(max-width: 899px) 100vw, 58vw"
                  className={styles.routePhoto}
                  style={{ objectPosition: intent.position }}
                />
              ) : null}
              <span className={styles.routeWash} aria-hidden="true" />
              <span className={styles.routeNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.routeBody}>
                <span className={styles.routeShort}>{t(`intents.${intent.key}.short`)}</span>
                <strong>{t(`intents.${intent.key}.title`)}</strong>
                <span>{t(`intents.${intent.key}.description`)}</span>
              </span>
              <ArrowUpRight className={styles.routeArrow} size={25} weight="bold" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section data-manifest aria-labelledby="manifest-title" className={styles.manifesto}>
        <div className={styles.manifestInner}>
          <p className={styles.manifestEyebrow}>{t("manifesto.eyebrow")}</p>
          <h2 id="manifest-title" className={styles.manifestStatement}>
            {manifestoWords.map((word, index) => (
              <span key={`${word}-${index}`} data-manifest-word>
                {word}{" "}
              </span>
            ))}
          </h2>
          <p className={styles.manifestNote}>{t("manifesto.note")}</p>
          <div data-manifest-media className={styles.manifestMedia} aria-hidden="true">
            <Image
              src={heroPhotos[2]}
              alt=""
              fill
              sizes="(max-width: 899px) 100vw, 36vw"
              className={styles.manifestImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
