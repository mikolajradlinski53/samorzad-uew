"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Scroll,
  Stamp,
  Gavel,
  FileText,
  ChartBar,
  Coins,
  Palette,
  ArrowUpRight,
  DownloadSimple,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { documents, type DocSlot } from "@/lib/documents";

interface Category {
  key: string;
  icon: Icon;
  /** Wewnętrzna podstrona (ma własną listę dokumentów). */
  href?: string;
  /** Bezpośredni dokument z manifestu. */
  doc?: DocSlot;
}

const categories: Category[] = [
  { key: "regulacje", icon: Scroll, href: "/regulacje-wewnetrzne" },
  { key: "zarzadzenia", icon: Stamp, href: "/zarzadzenia-przewodniczacego" },
  { key: "prawo", icon: Gavel, href: "/prawo-dla-studenta" },
  { key: "russRaporty", icon: FileText, doc: documents.russResolutions },
  { key: "sprawozdania", icon: ChartBar, doc: documents.sprawozdania },
  { key: "finansowanie", icon: Coins, doc: documents.finansowanie },
  { key: "ksiega", icon: Palette, doc: documents.ksiega },
];

export function TransparentnoscContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("transparentnosc");
  const tc = useTranslations("common");

  return (
    <section className="section-padding" aria-labelledby="transp-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
            {t("intro")}
          </p>
          <h2 id="transp-heading" className="sr-only">
            {t("heroTitle")}
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const Glyph = c.icon;
            const docHref = c.doc?.href;
            const title = t(`categories.${c.key}.title`);
            const inner = (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                  <Glyph size={24} weight="regular" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink-primary">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-[0.875rem] leading-[1.6] text-ink-secondary">
                  {t(`categories.${c.key}.desc`)}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium">
                  {c.href ? (
                    <>
                      <span className="text-accent">{t("open")}</span>
                      <ArrowUpRight size={16} weight="bold" aria-hidden="true" className="text-accent transition-transform duration-150 group-hover:translate-x-0.5" />
                    </>
                  ) : docHref ? (
                    <>
                      <span className="text-accent">{t("download")}</span>
                      <DownloadSimple size={16} weight="bold" aria-hidden="true" className="text-accent transition-transform duration-150 group-hover:translate-y-0.5" />
                    </>
                  ) : (
                    <span className="rounded-full border border-border-subtle px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                      {tc("comingSoon")}
                    </span>
                  )}
                </span>
              </>
            );

            const cardClass =
              "group relative flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated";

            return (
              <motion.div
                key={c.key}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                {c.href ? (
                  <div className={cardClass}>
                    {inner}
                    <Link href={c.href} aria-label={title} className="absolute inset-0 rounded-xl" />
                  </div>
                ) : docHref ? (
                  <div className={cardClass}>
                    {inner}
                    <a
                      href={docHref}
                      {...(c.doc?.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : { download: true })}
                      aria-label={title}
                      className="absolute inset-0 rounded-xl"
                    />
                  </div>
                ) : (
                  <div className={cardClass}>{inner}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
