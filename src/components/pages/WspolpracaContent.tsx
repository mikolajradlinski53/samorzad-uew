"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Confetti,
  Megaphone,
  Target,
  EnvelopeSimple,
  Phone,
  ArrowRight,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { Tilt } from "../Tilt";
import { MagneticButton } from "../MagneticButton";

interface Kind {
  title: string;
  desc: string;
  icon: Icon;
}

const kinds: Kind[] = [
  {
    title: "Organizacja eventów",
    desc: "Wspólne wydarzenia, strefy partnerskie i obecność tam, gdzie są studenci.",
    icon: Confetti,
  },
  {
    title: "Promocja w social media",
    desc: "Dotarcie do studenckiej społeczności na TikToku, Instagramie i Facebooku.",
    icon: Megaphone,
  },
  {
    title: "Kampanie marketingowe",
    desc: "Akcje skrojone pod Twój produkt lub usługę i pod studenta UEW.",
    icon: Target,
  },
];

export function WspolpracaContent() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Offer */}
      <section className="section-padding" aria-labelledby="oferta-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <h2
              id="oferta-heading"
              className="max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              Chcesz dotrzeć ze swoją marką do studentów?
            </h2>
            <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
              Pomożemy wypromować Twój produkt lub usługę wśród studentów UEW.
              Przygotujemy ofertę skrojoną pod Twoje cele — wybierz formę
              współpracy, a resztę dograliśmy.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {kinds.map((kind, i) => {
              const Glyph = kind.icon;
              return (
                <motion.div
                  key={kind.title}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Tilt className="h-full" max={6}>
                    <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-7">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-glow text-accent">
                        <Glyph size={26} weight="regular" aria-hidden="true" />
                      </span>
                      <h3 className="mt-6 text-[1.25rem] font-semibold tracking-[-0.01em] text-ink-primary">
                        {kind.title}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-[1.6] text-ink-secondary">
                        {kind.desc}
                      </p>
                    </div>
                  </Tilt>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact person */}
      <section
        className="section-padding border-t border-border-subtle pt-16"
        aria-labelledby="kontakt-osoba-heading"
      >
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <div className="grid items-center gap-10 rounded-2xl border border-border-subtle bg-bg-surface p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
                  Kontakt w sprawie współpracy
                </p>
                <h2
                  id="kontakt-osoba-heading"
                  className="mt-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] tracking-[-0.01em] text-ink-primary"
                >
                  Karol Vogel
                </h2>
                <p className="mt-1 text-[0.9375rem] text-ink-secondary">
                  Członek Zarządu ds. relacji zewnętrznych
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-8">
                  <a
                    href="mailto:karol.vogel@samorzad.ue.wroc.pl"
                    className="flex items-center gap-3 text-[0.9375rem] text-ink-secondary transition-colors hover:text-ink-primary"
                  >
                    <EnvelopeSimple size={20} weight="regular" aria-hidden="true" className="shrink-0 text-accent" />
                    karol.vogel@samorzad.ue.wroc.pl
                  </a>
                  <a
                    href="tel:511599376"
                    className="flex items-center gap-3 text-[0.9375rem] text-ink-secondary transition-colors hover:text-ink-primary"
                  >
                    <Phone size={20} weight="regular" aria-hidden="true" className="shrink-0 text-accent" />
                    511 599 376
                  </a>
                </div>
              </div>

              <MagneticButton
                href="/kontakt"
                ariaLabel="Przejdź do formularza kontaktowego"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-colors hover:bg-accent-dim"
              >
                Wypełnij formularz
                <ArrowRight size={20} weight="regular" aria-hidden="true" />
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
