"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  UsersThree,
  Megaphone,
  Handshake,
  ChartLineUp,
  ArrowRight,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { Tilt } from "../Tilt";
import { Marquee } from "../Marquee";
import { MagneticButton } from "../MagneticButton";
import { PartnerEffect } from "../partners/PartnerEffect";
import type { Partner } from "../partners/partnerEffects";

interface Benefit {
  title: string;
  desc: string;
  icon: Icon;
}

const benefits: Benefit[] = [
  { title: "Dotarcie do 11 000 studentów", desc: "Bezpośredni kanał do najliczniejszej społeczności studenckiej UEW.", icon: UsersThree },
  { title: "Obecność na wydarzeniach", desc: "Adapciak, Bal UEW, TEDxUEW, UE Party — Twoja marka tam, gdzie studenci.", icon: Megaphone },
  { title: "Wizerunek marki przyjaznej studentom", desc: "Współpraca z samorządem to realne wsparcie środowiska akademickiego.", icon: Handshake },
  { title: "Dostęp do młodych talentów", desc: "Rekrutacja, staże i programy ambasadorskie wśród przyszłych ekonomistów.", icon: ChartLineUp },
];

// Sloty placeholderowe. category/color = przykłady do podmiany na realnych partnerów.
const slots: Partner[] = [
  { name: "Twoja marka" },
  { name: "Partner", category: "aviation", color: "#2C4BFF" },
  { name: "Sponsor" },
  { name: "Współpraca" },
  { name: "Patron" },
  { name: "Mecenas" },
];

function PartnerModal({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-modal-title"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 280, damping: 24 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border-soft bg-bg-surface p-8 text-center"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-bg-elevated hover:text-ink-primary"
        >
          <X size={20} weight="regular" aria-hidden="true" />
        </button>

        {/* Animowany efekt partnera */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center">
          <PartnerEffect partner={partner} />
        </div>

        <h3 id="partner-modal-title" className="mt-6 font-display text-[1.5rem] text-ink-primary">
          {partner.name}
        </h3>
        <p className="mx-auto mt-2 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink-secondary">
          Tu mogłoby znaleźć się Twoje logo. Dołącz do grona partnerów
          wspierających ponad 11 000 studentów UEW.
        </p>
        <a
          href="mailto:kontakt@samorzad.ue.wroc.pl?subject=Wsp%C3%B3%C5%82praca%20z%20Samorz%C4%85dem%20UEW"
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
        >
          Zostań partnerem
          <ArrowRight size={20} weight="regular" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.div>
  );
}

export function PartnerzyContent() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<Partner | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = (partner: Partner) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setSelected(partner);
  };
  const close = () => {
    setSelected(null);
    triggerRef.current?.focus();
  };

  return (
    <>
      {/* Benefits */}
      <section className="section-padding" aria-labelledby="korzysci-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              Współpraca
            </p>
            <h2
              id="korzysci-heading"
              className="mt-3 max-w-[22ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              Dlaczego warto współpracować z Samorządem
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => {
              const Glyph = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Tilt className="h-full" max={6}>
                    <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                        <Glyph size={24} weight="regular" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                        {benefit.desc}
                      </p>
                    </div>
                  </Tilt>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ambient marquee + interactive logo wall */}
      <section
        className="section-padding border-y border-border-subtle bg-bg-surface py-16"
        aria-labelledby="partnerzy-heading"
      >
        <div className="mx-auto mb-10 max-w-[1200px]">
          <h2
            id="partnerzy-heading"
            className="text-center font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-ink-primary"
          >
            Grono partnerów rośnie
          </h2>
          <p className="mt-2 text-center text-[0.9375rem] text-ink-secondary">
            Kliknij wolne miejsce, by zobaczyć, jak może wyglądać Twoja obecność.
          </p>
        </div>

        <Marquee>
          {slots.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-dashed border-border-medium text-[0.875rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary"
            >
              {s.name}
            </div>
          ))}
        </Marquee>

        {/* Interactive wall */}
        <div className="mx-auto mt-8 grid max-w-[1200px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {slots.map((p) => (
            <motion.button
              key={p.name}
              type="button"
              onClick={() => open(p)}
              whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex h-24 items-center justify-center rounded-xl border border-border-subtle bg-bg-base text-[0.8125rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary transition-colors hover:border-accent hover:text-accent"
            >
              {p.name}
            </motion.button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" aria-labelledby="partner-cta-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <div className="flex flex-col items-start gap-8 rounded-2xl border border-border-subtle bg-bg-surface p-10 md:flex-row md:items-center md:justify-between">
              <div>
                <h2
                  id="partner-cta-heading"
                  className="max-w-[24ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
                >
                  Zbudujmy coś razem
                </h2>
                <p className="mt-3 max-w-[48ch] text-[1rem] leading-[1.6] text-ink-secondary">
                  Opowiedz nam o swoim pomyśle na współpracę — przygotujemy ofertę
                  dopasowaną do Twoich celów.
                </p>
              </div>
              <MagneticButton
                href="/wspolpracuj-z-nami"
                ariaLabel="Przejdź do strony Współpracuj z nami"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-colors hover:bg-accent-dim"
              >
                Współpracuj z nami
                <ArrowRight size={20} weight="regular" aria-hidden="true" />
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <AnimatePresence>
        {selected && <PartnerModal partner={selected} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
