"use client";

import { motion, useReducedMotion } from "motion/react";
import { InitialsAvatar } from "../InitialsAvatar";
import { ScrollReveal } from "../ScrollReveal";
import { PersonCard } from "../PersonCard";

const dziekan = {
  name: "dr hab. Wawrzyniec Michalczyk, prof. UEW",
  role: "Dziekan ds. Studenckich",
};

const prodziekani = [
  {
    name: "dr Wioletta Turowska",
    kierunki: [
      "Finanse i rachunkowość",
      "Rachunkowość i controlling",
      "Rachunkowość i podatki",
      "Zarządzanie",
    ],
  },
  {
    name: "dr inż. Monika Wereńska",
    kierunki: [
      "Controlling",
      "E-biznes",
      "Informatyka w biznesie",
      "Konsulting prawny i gospodarczy",
      "Logistyka",
      "Zarządzanie i Inżynieria Produkcji",
      "Zarządzanie projektami",
      "Informatyka w zarządzaniu produkcją",
    ],
  },
  {
    name: "dr hab. Sebastian Bobowski, prof. UEW",
    kierunki: [
      "Wszystkie kierunki anglojęzyczne",
      "Analityka gospodarcza",
      "Ekobiznes",
      "Ekonomia",
      "Komunikacja społeczna",
      "Międzynarodowe stosunki gospodarcze",
      "Nieruchomości i gospodarka przestrzenna",
    ],
  },
];

export function DziekaniContent() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" aria-labelledby="dziekani-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            Władze dziekańskie
          </p>
          <h2
            id="dziekani-heading"
            className="mt-3 max-w-[26ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            Znajdź prodziekana swojego kierunku
          </h2>
          <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
            Sprawy studenckie — od indywidualnej organizacji studiów po odwołania —
            prowadzą prodziekani przypisani do poszczególnych kierunków. Sprawdź,
            kto odpowiada za Twój.
          </p>
        </ScrollReveal>

        {/* Dziekan — featured */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center gap-5 rounded-2xl border border-accent/40 bg-bg-surface p-8 text-center sm:flex-row sm:text-left"
        >
          <InitialsAvatar name={dziekan.name} size={88} />
          <div>
            <h3 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-ink-primary">
              {dziekan.name}
            </h3>
            <p className="mt-2 text-[0.9375rem] font-medium uppercase tracking-[0.06em] text-accent">
              {dziekan.role}
            </p>
          </div>
        </motion.div>

        {/* Prodziekani */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {prodziekani.map((p, i) => (
            <motion.div
              key={p.name}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <PersonCard name={p.name} role="Prodziekan ds. Studenckich" meta={p.kierunki} plain className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
