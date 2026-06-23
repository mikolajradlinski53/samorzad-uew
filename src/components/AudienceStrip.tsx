"use client";

import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import {
  Student,
  ChalkboardTeacher,
  Handshake,
  Compass,
  ArrowRight,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";

interface Audience {
  eyebrow: string;
  title: string;
  desc: string;
  /** Example destinations — information scent, not links (card is one target). */
  scent: string;
  href: string;
  icon: Icon;
}

const audiences: Audience[] = [
  {
    eyebrow: "Jesteś studentem?",
    title: "Strefa studenta",
    desc: "Załatw sprawę szybko — wszystko, czego potrzebujesz w trakcie studiów.",
    scent: "Stypendia · Prawa studenta · Rzecznik · Mapa kampusu",
    href: "/dla-studenta",
    icon: Student,
  },
  {
    eyebrow: "Pracujesz na Uczelni?",
    title: "Samorząd i struktura",
    desc: "Poznaj organy Samorządu, regulacje i osoby reprezentujące studentów.",
    scent: "Struktura · RUSS · Regulacje · Władze",
    href: "/nasza-dzialalnosc",
    icon: ChalkboardTeacher,
  },
  {
    eyebrow: "Reprezentujesz firmę?",
    title: "Współpraca i partnerstwo",
    desc: "Dotrzyj do ponad 11 000 studentów. Zobacz, jak możemy działać razem.",
    scent: "Partnerzy · Współpracuj z nami · Kontakt B2B",
    href: "/partnerzy",
    icon: Handshake,
  },
  {
    eyebrow: "Chcesz nas poznać?",
    title: "Kim jesteśmy",
    desc: "Misja, ludzie i projekty, które realnie zmieniają studenckie życie.",
    scent: "Nasze projekty · O nas · Działalność",
    href: "/nasze-projekty",
    icon: Compass,
  },
];

export function AudienceStrip() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding pt-0" aria-labelledby="audience-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            Szybkie wejście
          </p>
          <h2
            id="audience-heading"
            className="mt-3 max-w-[20ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            Kim jesteś? Wskażemy Ci drogę
          </h2>
        </ScrollReveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, i) => {
            const Glyph = a.icon;
            return (
              <motion.li
                key={a.href}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                whileHover={
                  reduce
                    ? undefined
                    : { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-glow text-accent">
                  <Glyph size={26} weight="regular" aria-hidden="true" />
                </span>
                <p className="mt-5 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
                  {a.eyebrow}
                </p>
                <h3 className="mt-2 text-[1.125rem] font-semibold tracking-[-0.01em] text-ink-primary">
                  {a.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                  {a.desc}
                </p>
                <p className="mt-4 text-[0.75rem] leading-[1.5] text-ink-tertiary">
                  {a.scent}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent">
                  Przejdź
                  <ArrowRight
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </span>
                <Link
                  href={a.href}
                  aria-label={`${a.title} — ${a.eyebrow}`}
                  className="absolute inset-0 rounded-xl"
                />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
