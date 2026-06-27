"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Scales,
  GraduationCap,
  Megaphone,
  BookOpen,
  Package,
  MapTrifold,
  FirstAidKit,
  Bank,
  UsersThree,
  ClipboardText,
  ArrowUpRight,
  ArrowSquareOut,
  EnvelopeSimple,
  Calculator,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { Spotlight } from "../Spotlight";

interface Tile {
  key: string;
  href: string;
  icon: Icon;
  internal?: boolean;
}

const tiles: Tile[] = [
  { key: "prawa", href: "/prawa-studenta", icon: Scales, internal: true },
  { key: "stypendia", href: "/stypendia", icon: GraduationCap, internal: true },
  { key: "kalkulator", href: "/kalkulator-sredniej", icon: Calculator, internal: true },
  { key: "rzecznik", href: "/rzecznik-praw-studenta", icon: Megaphone, internal: true },
  { key: "prawo", href: "/prawo-dla-studenta", icon: BookOpen, internal: true },
  { key: "infopacki", href: "/infopacki", icon: Package, internal: true },
  { key: "mapa", href: "/mapa-kampusu", icon: MapTrifold, internal: true },
  { key: "pomoc", href: "/pomoc-psychologiczna", icon: FirstAidKit, internal: true },
  { key: "wladze", href: "/wladze-rektorskie", icon: Bank, internal: true },
  { key: "dziekani", href: "/dziekan-i-prodziekani", icon: UsersThree, internal: true },
  { key: "ankiety", href: "https://usosweb.ue.wroc.pl/kontroler.php?_action=news/default", icon: ClipboardText },
];

const quickLinks = [
  { key: "usos", href: "https://usosweb.ue.wroc.pl/kontroler.php?_action=news/default" },
  { key: "intranet", href: "https://uewrc.sharepoint.com/sites/IntranetUEW" },
  { key: "plan", href: "https://plan.ue.wroc.pl" },
  {
    key: "harmonogram",
    href: "https://bip.ue.wroc.pl/download/attachment/3456/harmonogram-roku-akademickiego-2025-2026.pdf",
  },
];

export function DlaStudentaContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("dlaStudenta");

  return (
    <>
      {/* Tiles */}
      <section className="section-padding" aria-labelledby="kafelki-heading">
        <Spotlight />
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <ScrollReveal>
            <h2
              id="kafelki-heading"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("topicsHeading")}
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile, i) => {
              const Glyph = tile.icon;
              const OutIcon = tile.internal ? ArrowUpRight : ArrowSquareOut;
              return (
                <motion.div
                  key={tile.key}
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
                    delay: Math.min(i, 5) * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                    <Glyph size={24} weight="regular" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 flex items-center gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                    {t(`tiles.${tile.key}.title`)}
                    <OutIcon
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="text-ink-tertiary transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                    {t(`tiles.${tile.key}.desc`)}
                  </p>
                  {/* Stretched link overlay */}
                  {tile.internal ? (
                    <Link
                      href={tile.href}
                      aria-label={t(`tiles.${tile.key}.title`)}
                      className="absolute inset-0 rounded-xl"
                    />
                  ) : (
                    <a
                      href={tile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`tiles.${tile.key}.title`)}
                      className="absolute inset-0 rounded-xl"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="section-padding pt-0" aria-labelledby="szybkie-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              {t("quickEyebrow")}
            </p>
            <h2
              id="szybkie-heading"
              className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink-primary"
            >
              {t("quickHeading")}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border-medium px-5 py-2.5 text-[0.875rem] font-medium text-ink-primary transition-colors hover:border-accent hover:text-accent"
                >
                  {t(`quickLinks.${link.key}`)}
                  <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
                </a>
              ))}
            </div>
          </ScrollReveal>

          {/* Contact CTA */}
          <ScrollReveal delay={0.1}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border-subtle bg-bg-surface p-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink-primary">
                  {t("ctaHeading")}
                </h2>
                <p className="mt-2 text-[0.9375rem] leading-[1.6] text-ink-secondary">
                  {t("ctaDesc")}
                </p>
              </div>
              <a
                href="mailto:kontakt@samorzad.ue.wroc.pl"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
              >
                <EnvelopeSimple size={20} weight="regular" aria-hidden="true" />
                {t("ctaButton")}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
