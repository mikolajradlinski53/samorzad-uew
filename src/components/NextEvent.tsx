"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";
import { SplitFlap } from "./SplitFlap";

// Placeholder — docelowo zaciągane z Google Calendar (Faza 3 roadmapy).
const events = [
  { name: "Adapciak 2026", date: "2026-10-03", tag: "Integracja" },
  { name: "Bal UEW", date: "2026-11-21", tag: "Gala" },
  { name: "TEDxUEW", date: "2026-12-05", tag: "Konferencja" },
  { name: "UE Party", date: "2027-03-14", tag: "Impreza" },
];

type EventItem = (typeof events)[number] & { ts: number };

function nextEvent(now: number): EventItem | null {
  const future = events
    .map((e) => ({ ...e, ts: new Date(`${e.date}T00:00:00`).getTime() }))
    .filter((e) => e.ts >= now)
    .sort((a, b) => a.ts - b.ts);
  return future[0] ?? null;
}

function daysLabel(days: number): string {
  if (days <= 0) return "DZIŚ";
  return `ZA ${days} ${days === 1 ? "DZIEŃ" : "DNI"}`;
}

export function NextEvent() {
  const [state, setState] = useState<{ ev: EventItem | null; days: number }>({
    ev: null,
    days: 0,
  });

  useEffect(() => {
    const now = Date.now();
    const e = nextEvent(now);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ev: e, days: e ? Math.ceil((e.ts - now) / 86_400_000) : 0 });
  }, []);

  const { ev, days } = state;
  if (!ev) return null;

  const dateLabel = new Date(ev.ts).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="section-padding" aria-labelledby="event-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-accent">
            Kalendarz
          </p>
          <h2
            id="event-heading"
            className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            Najbliżej w kalendarzu
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface">
            <div className="flex items-center justify-between gap-3 bg-[#0B1322] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70">
              <span>Najbliższe wydarzenie</span>
              <span>{ev.tag}</span>
            </div>
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <SplitFlap text={ev.name.toUpperCase()} size="lg" />
              <div className="shrink-0 sm:text-right">
                <p className="font-mono text-[0.8125rem] text-ink-secondary">{dateLabel}</p>
                <p className="mt-1 font-display text-[1.5rem] font-extrabold tracking-[-0.02em] text-accent">
                  {daysLabel(days)}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <a
            href="https://www.facebook.com/samorzad.ue/events"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 font-medium text-accent transition-colors hover:text-accent-dim"
          >
            Wszystkie wydarzenia
            <ArrowUpRight size={18} weight="regular" aria-hidden="true" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
