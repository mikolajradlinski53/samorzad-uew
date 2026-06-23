"use client";

import { motion, useReducedMotion } from "motion/react";
import { FileText, DownloadSimple } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";

const FILES = "https://samorzad.ue.wroc.pl/_files/ugd";

const documents = [
  { title: "Regulamin Samorządu Studentów", href: `${FILES}/3dec01_e2f5e6255f3a4e02b3486fce9345da3d.pdf` },
  { title: "Regulamin Rady Organizacji Studenckich", href: `${FILES}/3dec01_8e95b203e91e47d1b2a5be489ab3136c.pdf` },
  { title: "Regulamin Organizacyjny RUSS", href: `${FILES}/3dec01_f29102abac934f8fbb771a0e0033b71b.pdf` },
  { title: "Regulamin Rad Mieszkańca", href: `${FILES}/3dec01_ce9e1526865444b9a8b2890406b4887e.pdf` },
  { title: "Ordynacja Wyborcza", href: `${FILES}/3dec01_e1abe35d67a44e9aacecbe501da0d5a1.pdf` },
  { title: "Identyfikacja wizualna Samorządu", href: `${FILES}/3dec01_746b01182be140039f8a0930403c0df3.pdf` },
];

export function RegulacjeContent() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" aria-labelledby="regulacje-heading">
      <div className="mx-auto max-w-[860px]">
        <ScrollReveal>
          <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
            Poniżej znajdziesz najważniejsze regulacje wewnętrzne, na podstawie
            których funkcjonuje Samorząd Studentów UEW.
          </p>
          <h2 id="regulacje-heading" className="sr-only">
            Lista dokumentów
          </h2>
        </ScrollReveal>

        <ul className="mt-10 flex flex-col gap-3">
          {documents.map((doc, i) => (
            <motion.li
              key={doc.href}
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-5 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
                />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-glow text-accent">
                  <FileText size={22} weight="regular" aria-hidden="true" />
                </span>
                <span className="flex-1 text-[1rem] font-medium tracking-[-0.01em] text-ink-primary">
                  {doc.title}
                </span>
                <DownloadSimple
                  size={20}
                  weight="regular"
                  aria-hidden="true"
                  className="shrink-0 text-ink-tertiary transition-all duration-150 group-hover:translate-y-0.5 group-hover:text-accent"
                />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
