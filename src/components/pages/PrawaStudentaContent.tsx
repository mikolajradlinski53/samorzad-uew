"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Megaphone, FileText, CaretDown } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "../ScrollReveal";

const rights = [
  {
    title: "Powtarzanie zajęć",
    desc: "Prawo do powtarzania określonych zajęć w przypadku niezadowalających wyników w nauce, na warunkach z regulaminu uczelni.",
    expl: "Jeśli oblejesz przedmiot, masz prawo go powtórzyć na zasadach z regulaminu studiów — nie wylatujesz automatycznie.",
  },
  {
    title: "Indywidualna organizacja studiów",
    desc: "Możliwość ubiegania się o IOS — elastyczne dostosowanie programu kształcenia do Twoich potrzeb.",
    expl: "Pracujesz, trenujesz wyczynowo albo masz inną ważną sytuację życiową? Możesz wnioskować o elastyczny plan i indywidualne terminy zaliczeń.",
  },
  {
    title: "Usprawiedliwienie nieobecności",
    desc: "Prawo do usprawiedliwienia nieobecności i urlopu od zajęć, w tym przystąpienia do egzaminów w innym terminie.",
    expl: "Choroba lub ważne zdarzenie losowe? Masz prawo usprawiedliwić nieobecność i podejść do egzaminu w innym terminie.",
  },
  {
    title: "Zmiana kierunku studiów",
    desc: "Ustawa umożliwia zmianę kierunku studiów przy zachowaniu określonych procedur.",
    expl: "Czujesz, że to nie ten kierunek? Możesz go zmienić, a już zaliczone przedmioty zostaną Ci uznane zgodnie z procedurą.",
  },
  {
    title: "Przenoszenie i uznawanie punktów ECTS",
    desc: "Prawo do przenoszenia i uznawania punktów ECTS z innych uczelni — krajowych i zagranicznych — zgodnie z zasadami mobilności.",
    expl: "Punkty zdobyte na innej uczelni, też zagranicznej (np. Erasmus), mogą zostać Ci uznane — nie zaliczasz tego samego drugi raz.",
  },
  {
    title: "Egzamin komisyjny",
    desc: "Prawo do przystąpienia do egzaminu komisyjnego, przy udziale wskazanego przez Ciebie obserwatora.",
    expl: "Nie zgadzasz się z oceną z egzaminu? Możesz żądać egzaminu komisyjnego, a na nim ma prawo być wskazany przez Ciebie obserwator.",
  },
  {
    title: "Zmiana trybu studiów",
    desc: "Możliwość przeniesienia się między studiami stacjonarnymi a niestacjonarnymi, zgodnie z regulaminem uczelni.",
    expl: "Zmieniła się Twoja sytuacja (np. praca)? Możesz przejść ze studiów stacjonarnych na niestacjonarne lub odwrotnie, zgodnie z regulaminem.",
  },
];

export function PrawaStudentaContent() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" aria-labelledby="prawa-lista-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            Ustawa 2.0 — Konstytucja dla Nauki
          </p>
          <h2
            id="prawa-lista-heading"
            className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            Każdy student ma prawo poznać swoje prawa
          </h2>
          <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
            Dzięki Ustawie 2.0 każdy student ma prawo do przeszkolenia w zakresie
            swoich praw i obowiązków. Za organizację tego szkolenia odpowiada
            samorząd studencki we współpracy z Parlamentem Studentów
            Rzeczypospolitej Polskiej.
          </p>
        </ScrollReveal>

        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {rights.map((right, i) => (
            <motion.li
              key={right.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              whileHover={
                reduce
                  ? undefined
                  : { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
              }
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: Math.min(i, 4) * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex gap-5 rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[1.75rem] font-medium leading-none text-accent tabular-nums"
              >
                §{i + 1}
              </span>
              <div>
                <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                  {right.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink-secondary">
                  {right.desc}
                </p>
                <details className="group/expl mt-3">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-accent [&::-webkit-details-marker]:hidden">
                    Co to znaczy
                    <CaretDown
                      size={12}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-open/expl:rotate-180"
                    />
                  </summary>
                  <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                    {right.expl}
                  </p>
                </details>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* CTA row */}
        <ScrollReveal>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20180001668/U/D20181668Lj.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
            >
              <FileText size={20} weight="regular" aria-hidden="true" />
              Pełny tekst ustawy (PDF)
            </a>
            <Link
              href="/rzecznik-praw-studenta"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-border-medium px-7 text-base font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
            >
              <Megaphone size={20} weight="regular" aria-hidden="true" />
              Rzecznik Praw Studenta
            </Link>
            <Link
              href="/dla-studenta"
              className="inline-flex h-12 items-center gap-1.5 px-3 text-base font-medium text-accent transition-colors hover:text-accent-dim"
            >
              Wróć do Strefy studenta
              <ArrowUpRight size={18} weight="regular" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
