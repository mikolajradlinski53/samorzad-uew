"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CaretDown } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Marquee } from "./Marquee";
import { heroPhotos as photos } from "@/lib/photos";

const lineVariants: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};


function PhotoTile({ src, sizes }: { src: string; sizes: string }) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-elevated">
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" aria-hidden />
    </div>
  );
}

function GalleryColumn({
  items,
  duration,
  reverse,
}: {
  items: string[];
  duration: number;
  reverse?: boolean;
}) {
  return (
    <div className="flex-1">
      <div
        className="flex flex-col gap-4 animate-marquee-y"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((src, i) => (
          <PhotoTile key={`${src}-${i}`} src={src} sizes="22vw" />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations("hero");
  const headlineLines = [t("line1"), t("line2")];
  const stats = t.raw("stats") as string[];

  return (
    <section
      aria-label="Wprowadzenie"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-[72px]"
    >
      {/* Ambient — techniczna siatka (engineered) + akcent + ziarno */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="hero-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_28%_34%,black_0%,transparent_72%)]" />
        <div
          className="absolute -right-[8%] top-[4%] h-[58%] w-[46%] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)",
          }}
        />
        <div className="grain" />
        <span className="absolute bottom-6 right-6 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-tertiary lg:block">
          51.10°N · 17.04°E · Wrocław
        </span>
      </div>

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Content */}
        <div className="relative z-10 py-12">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-accent"
          >
            <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
            {t("eyebrow")}
          </motion.p>

          <h1 className="font-display text-[clamp(3rem,6vw,5.25rem)] font-extrabold leading-[1.0] tracking-[-0.045em] text-ink-primary">
            {headlineLines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  className={`block ${i === 1 ? "text-accent" : ""}`}
                  custom={i}
                  variants={reduce ? undefined : lineVariants}
                  initial={reduce ? false : "hidden"}
                  animate={reduce ? undefined : "visible"}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[480px] text-[1.0625rem] leading-[1.75] text-ink-secondary"
          >
            {t("lead")}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#o-nas"
              className="inline-flex h-12 items-center rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
            >
              {t("cta1")}
            </a>
            <Link
              href="/dla-studenta"
              className="inline-flex h-12 items-center rounded-lg px-3 text-base font-medium text-ink-secondary transition-colors hover:text-ink-primary"
            >
              {t("cta2")} &rarr;
            </Link>
          </motion.div>

          {/* Stat chips */}
          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {stats.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border-subtle bg-bg-surface px-4 py-1.5 text-[0.8125rem] font-medium text-ink-secondary"
              >
                {s}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Desktop gallery */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden h-[100dvh] lg:block"
          aria-hidden="true"
        >
          <div className="absolute inset-0 -rotate-6 scale-[1.18] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_85%)]">
            <div className="flex h-full gap-4">
              <GalleryColumn items={photos.slice(0, Math.ceil(photos.length / 2))} duration={42} />
              <GalleryColumn items={photos.slice(Math.ceil(photos.length / 2))} duration={52} reverse />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile gallery strip */}
      <div className="mt-4 pb-10 lg:hidden" aria-hidden="true">
        <Marquee speed={40}>
          {photos.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated"
            >
              <Image src={src} alt="" fill sizes="192px" className="object-cover" />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Scroll indicator */}
      <a
        href="#o-nas"
        aria-label={t("scroll")}
        className="absolute bottom-6 left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-ink-tertiary transition-colors hover:text-ink-primary lg:flex"
      >
        <CaretDown size={22} weight="regular" className="chevron-bob" aria-hidden="true" />
      </a>
    </section>
  );
}
