"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Scales,
  GraduationCap,
  HandCoins,
  MapTrifold,
  Package,
  FirstAidKit,
  Megaphone,
  BookOpen,
  ArrowUpRight,
  ArrowSquareOut,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";

interface Resource {
  key: string;
  href: string;
  icon: Icon;
  internal?: boolean;
}

const resources: Resource[] = [
  { key: "prawa", href: "/prawa-studenta", icon: Scales, internal: true },
  { key: "stypendia", href: "/stypendia", icon: GraduationCap, internal: true },
  { key: "wsparcie", href: "/wsparcie-materialne-i-swiadczenia", icon: HandCoins, internal: true },
  { key: "mapa", href: "/mapa-kampusu", icon: MapTrifold, internal: true },
  { key: "infopacki", href: "/infopacki", icon: Package, internal: true },
  { key: "pomoc", href: "/pomoc-psychologiczna", icon: FirstAidKit, internal: true },
  { key: "rzecznik", href: "/rzecznik-praw-studenta", icon: Megaphone, internal: true },
  { key: "prawo", href: "/prawo-dla-studenta", icon: BookOpen, internal: true },
];

export function Resources() {
  const reduce = useReducedMotion();
  const t = useTranslations("resources");

  return (
    <section
      id="dla-studenta"
      aria-labelledby="dla-studenta-heading"
      className="section-padding"
    >
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            {t("eyebrow")}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2
              id="dla-studenta-heading"
              className="max-w-[18ch] font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary"
            >
              {t("heading")}
            </h2>
            <Link
              href="/dla-studenta"
              className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent transition-colors hover:text-accent-dim"
            >
              {t("seeAll")}
              <ArrowUpRight size={18} weight="regular" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((item, i) => {
            const Glyph = item.icon;
            const OutIcon = item.internal ? ArrowUpRight : ArrowSquareOut;
            return (
              <motion.div
                key={item.key}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                whileHover={
                  reduce
                    ? undefined
                    : { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i, 4) * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                  <Glyph size={24} weight="regular" aria-hidden="true" />
                </span>
                <h3 className="mt-5 flex items-center gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                  {t(`items.${item.key}.title`)}
                  <OutIcon
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="text-ink-tertiary transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </h3>
                <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                  {t(`items.${item.key}.desc`)}
                </p>
                {item.internal ? (
                  <Link
                    href={item.href}
                    aria-label={t(`items.${item.key}.title`)}
                    className="absolute inset-0 rounded-xl"
                  />
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`items.${item.key}.title`)}
                    className="absolute inset-0 rounded-xl"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
