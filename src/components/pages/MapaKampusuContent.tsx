"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { MapPin, NavigationArrow, DownloadSimple } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { documents } from "@/lib/documents";

const locationKeys = ["office", "campus"];

export function MapaKampusuContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("mapa");

  return (
    <section className="section-padding" aria-labelledby="mapa-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="mapa-heading"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("heading")}
            </h2>
            {documents.mapa.href && (
              <a
                href={documents.mapa.href}
                {...(documents.mapa.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { download: true })}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border-medium px-6 text-[0.9375rem] font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
              >
                <DownloadSimple size={18} weight="regular" aria-hidden="true" />
                {t("downloadButton")}
              </a>
            )}
          </div>
        </ScrollReveal>

        {/* Location pins drop in */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {locationKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={reduce ? false : { opacity: 0, y: -28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                reduce
                  ? undefined
                  : { type: "spring", stiffness: 320, damping: 16, delay: i * 0.12 }
              }
              className="flex items-start gap-4 rounded-xl border border-border-subtle bg-bg-surface p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-glow text-accent">
                <MapPin size={24} weight="fill" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                  {t(`locations.${key}.name`)}
                </h3>
                <p className="mt-1 text-[0.9375rem] text-ink-secondary">{t(`locations.${key}.detail`)}</p>
                <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-tertiary">
                  {t(`locations.${key}.note`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive map */}
        <ScrollReveal>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border-subtle">
            <iframe
              title={t("mapTitle")}
              src="https://www.google.com/maps?q=Uniwersytet+Ekonomiczny+we+Wroc%C5%82awiu&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[420px] w-full border-0"
            />
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Uniwersytet+Ekonomiczny+we+Wroc%C5%82awiu"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 text-[0.9375rem] font-medium text-accent transition-colors hover:text-accent-dim"
          >
            <NavigationArrow size={18} weight="regular" aria-hidden="true" />
            {t("routeLink")}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
