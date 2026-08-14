"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import { heroPhotos } from "@/lib/photos";
import styles from "./HomeExperience.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const intents = [
  { key: "solve", href: "/dla-studenta", photo: 0, position: "50% 48%" },
  { key: "support", href: "/pomoc-psychologiczna", photo: 3, position: "50% 44%" },
  { key: "make", href: "/rekrutacja", photo: 4, position: "50% 52%" },
  { key: "verify", href: "/transparentnosc", photo: 1, position: "50% 48%" },
] as const;

const archiveStories = [
  { key: "adapciak", href: "/nasze-projekty#projekt-adapciak", photo: 4, position: "50% 55%" },
  { key: "bal", href: "/nasze-projekty#projekt-bal", photo: 1, position: "50% 48%" },
  { key: "dni", href: "/nasze-projekty#projekt-dni", photo: 0, position: "50% 44%" },
] as const;

type IntentKey = (typeof intents)[number]["key"];

export function HomeExperience() {
  const t = useTranslations("homeExperience");
  const locale = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIntent, setActiveIntent] = useState<IntentKey>("solve");

  const activeIndex = intents.findIndex((intent) => intent.key === activeIntent);
  const active = intents[activeIndex];
  const manifestoWords = t("manifesto.statement").split(/\s+/);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-hero-media]", {
          yPercent: 4,
          scale: 1.03,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        const words = gsap.utils.toArray<HTMLElement>("[data-manifest-word]");
        gsap.set(words, { color: "#9aa8bc" });
        gsap.to(words, {
          color: "#102743",
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-manifest]",
            start: "top top+=72",
            end: "+=115%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to("[data-manifest-media]", {
          yPercent: -4,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-manifest]",
            start: "top top+=72",
            end: "+=115%",
            scrub: 0.9,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-archive-panel]").forEach((panel) => {
          const image = panel.querySelector<HTMLElement>("[data-archive-media]");
          if (!image) return;
          gsap.fromTo(
            image,
            { yPercent: -7, scale: 1.08 },
            {
              yPercent: 7,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-active-frame]",
        { clipPath: "inset(0 0 100% 0)", scale: 1.03 },
        { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 0.75, ease: "power3.out" },
      );
    },
    { dependencies: [activeIntent], revertOnUpdate: true, scope: rootRef },
  );

  return (
    <div ref={rootRef} className={styles.experience}>
      <section data-hero aria-labelledby="home-experience-title" className={styles.hero}>
        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{t("hero.eyebrow")}</p>
            <h1 id="home-experience-title" className={styles.heroTitle}>
              <span className={styles.heroLine}>
                {t("hero.line1a")} {t("hero.line1b")}
              </span>
              <span className={`${styles.heroLine} ${styles.heroLineAccent}`}>{t("hero.line2")}</span>
            </h1>

            <div className={styles.heroLower}>
              <p className={styles.heroLead}>{t("hero.lead")}</p>
              <form action={`/${locale}/szukaj`} method="get" role="search" className={styles.heroSearch}>
                <label htmlFor="home-intent-search" className="sr-only">
                  {t("hero.searchLabel")}
                </label>
                <MagnifyingGlass size={20} weight="regular" aria-hidden="true" />
                <input
                  id="home-intent-search"
                  name="q"
                  type="search"
                  autoComplete="off"
                  placeholder={t("hero.searchPlaceholder")}
                />
                <button type="submit">
                  <span>{t("hero.searchSubmit")}</span>
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>

          <div data-hero-media data-active-frame className={styles.heroFrame} aria-hidden="true">
            <Image
              src={heroPhotos[active.photo]}
              alt=""
              fill
              preload={activeIndex === 0}
              sizes="(max-width: 899px) 100vw, 40vw"
              className={styles.heroFrameImage}
              style={{ objectPosition: active.position }}
            />
            <span className={styles.heroFrameWash} />
          </div>

          <div className={styles.intentRail} aria-label={t("hero.intentLabel")}>
            {intents.map((intent, index) => {
              const isActive = intent.key === activeIntent;
              return (
                <button
                  key={intent.key}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="home-intent-preview"
                  onClick={() => setActiveIntent(intent.key)}
                  className={styles.intentButton}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{t(`intents.${intent.key}.short`)}</strong>
                </button>
              );
            })}
          </div>

          <div id="home-intent-preview" aria-live="polite" className={styles.intentPreview}>
            <div>
              <p>{t(`intents.${active.key}.title`)}</p>
              <span>{t(`intents.${active.key}.description`)}</span>
            </div>
            <Link href={active.href} className={styles.intentPreviewLink}>
              {t(`intents.${active.key}.cta`)}
              <ArrowUpRight size={19} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

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

      <section aria-labelledby="archive-title" className={styles.archive}>
        <div className={styles.archiveHeader}>
          <div>
            <p>{t("archive.eyebrow")}</p>
            <h2 id="archive-title">{t("archive.heading")}</h2>
          </div>
          <div>
            <p>{t("archive.lead")}</p>
            <Link href="/nasze-projekty">
              {t("archive.all")}
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={styles.archiveAccordion}>
          {archiveStories.map((story, index) => (
            <Link
              key={story.key}
              href={story.href}
              data-archive-panel
              aria-label={t("archive.open", { project: t(`archive.stories.${story.key}.name`) })}
              className={styles.archivePanel}
            >
              <Image
                data-archive-media
                src={heroPhotos[story.photo]}
                alt=""
                fill
                sizes="(max-width: 899px) 100vw, 50vw"
                className={styles.archiveImage}
                style={{ objectPosition: story.position }}
              />
              <span className={styles.archiveShade} aria-hidden="true" />
              <span className={styles.archivePanelTop}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight size={21} weight="bold" aria-hidden="true" />
              </span>
              <span className={styles.archivePanelCopy}>
                <span>{t(`archive.stories.${story.key}.signature`)}</span>
                <strong>{t(`archive.stories.${story.key}.name`)}</strong>
              </span>
            </Link>
          ))}
        </div>
        <p className={styles.archiveNote}>{t("archive.note")}</p>
      </section>

      <section aria-labelledby="home-action-title" className={styles.action}>
        <div className={styles.actionInner}>
          <p>{t("action.eyebrow")}</p>
          <h2 id="home-action-title">{t("action.heading")}</h2>
          <p className={styles.actionLead}>{t("action.lead")}</p>
          <form action={`/${locale}/szukaj`} method="get" role="search" className={styles.actionForm}>
            <label htmlFor="home-final-search">{t("action.inputLabel")}</label>
            <div>
              <input
                id="home-final-search"
                name="q"
                type="search"
                autoComplete="off"
                placeholder={t("action.placeholder")}
              />
              <button type="submit">
                {t("action.submit")}
                <ArrowRight size={20} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </form>
          <Link href="/kontakt" className={styles.actionLink}>
            {t("action.contact")}
            <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
