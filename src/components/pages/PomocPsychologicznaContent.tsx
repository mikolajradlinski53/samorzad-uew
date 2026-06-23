"use client";

import {
  Heart,
  Buildings,
  MapPin,
  ChatCircleDots,
  Phone,
  FilePdf,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";

interface Item {
  title: string;
  icon: Icon;
}

const contains: Item[] = [
  { title: "Miejsca na uczelni, które udzielają pomocy", icon: Buildings },
  { title: "Instytucje i punkty wsparcia we Wrocławiu", icon: MapPin },
  { title: "Kontakty do organizacji — telefony, czaty i inne formy", icon: ChatCircleDots },
];

const helplines = [
  { number: "116 123", tel: "116123", desc: "Telefon zaufania dla osób dorosłych w kryzysie emocjonalnym" },
  { number: "116 111", tel: "116111", desc: "Telefon zaufania dla dzieci i młodzieży" },
  { number: "800 70 2222", tel: "800702222", desc: "Centrum Wsparcia dla osób w kryzysie psychicznym — całodobowo" },
  { number: "112", tel: "112", desc: "Numer alarmowy — w sytuacji bezpośredniego zagrożenia życia" },
];

const INFOPACK =
  "https://drive.google.com/file/d/1qn2UQmuCBG1VYPP46opdvh6vMqQnBTAW/view?usp=sharing";

export function PomocPsychologicznaContent() {
  return (
    <>
      {/* Reassuring message */}
      <section className="section-padding" aria-labelledby="pomoc-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <div className="rounded-2xl border border-border-subtle bg-bg-surface p-8 sm:p-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-glow text-accent">
                <Heart size={26} weight="fill" aria-hidden="true" />
              </span>
              <h2
                id="pomoc-heading"
                className="prose-constrained mt-6 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-ink-primary"
              >
                Jeśli jest Ci teraz trudno, nie musisz radzić sobie z tym sam.
              </h2>
              <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
                Nie bój się prosić o wsparcie. Przygotowaliśmy infopack, w którym
                zebraliśmy najważniejsze informacje o dostępnych formach pomocy —
                na uczelni i poza nią.
              </p>
              <a
                href={INFOPACK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
              >
                <FilePdf size={20} weight="regular" aria-hidden="true" />
                Otwórz infopack
              </a>
            </div>
          </ScrollReveal>

          {/* What's inside */}
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {contains.map((item, i) => {
              const Glyph = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="flex h-full items-start gap-4 rounded-xl border border-border-subtle bg-bg-surface p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-glow text-accent">
                      <Glyph size={24} weight="regular" aria-hidden="true" />
                    </span>
                    <p className="pt-1.5 text-[0.9375rem] leading-[1.55] text-ink-secondary">
                      {item.title}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Helplines */}
      <section
        className="section-padding border-t border-border-subtle pt-16"
        aria-labelledby="telefony-heading"
      >
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              Potrzebujesz pomocy teraz
            </p>
            <h2
              id="telefony-heading"
              className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              Telefony wsparcia
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {helplines.map((line, i) => (
              <ScrollReveal key={line.number} delay={Math.min(i, 3) * 0.06}>
                <a
                  href={`tel:${line.tel}`}
                  className="group flex h-full items-center gap-5 rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-glow text-accent">
                    <Phone size={24} weight="fill" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-[1.75rem] leading-none tracking-[-0.01em] text-ink-primary tabular-nums">
                      {line.number}
                    </p>
                    <p className="mt-2 text-[0.875rem] leading-[1.5] text-ink-secondary">
                      {line.desc}
                    </p>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <p className="mt-8 text-[0.875rem] leading-[1.6] text-ink-tertiary">
              W sytuacji bezpośredniego zagrożenia życia lub zdrowia zawsze dzwoń
              pod numer alarmowy <strong className="text-ink-secondary">112</strong>.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
