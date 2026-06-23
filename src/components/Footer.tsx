"use client";

import {
  TiktokLogo,
  FacebookLogo,
  LinkedinLogo,
  InstagramLogo,
  EnvelopeSimple,
  MapPin,
} from "@phosphor-icons/react";
import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

const BASE = "https://samorzad.ue.wroc.pl";

const socials = [
  { icon: TiktokLogo, label: "TikTok", href: "https://www.tiktok.com/@samorzaduew" },
  { icon: FacebookLogo, label: "Facebook", href: "https://www.facebook.com/samorzad.ue" },
  { icon: InstagramLogo, label: "Instagram", href: "https://www.instagram.com/samorzad.ue" },
  {
    icon: LinkedinLogo,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/samorząd-studentów-uniwersytetu-ekonomicznego-we-wrocławiu/",
  },
];

const linkGroups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Dla studenta",
    links: [
      { label: "Strefa studenta", href: "/dla-studenta" },
      { label: "Prawa studenta", href: "/prawa-studenta" },
      { label: "Stypendia", href: "/stypendia" },
      { label: "Prawo dla studenta", href: "/prawo-dla-studenta" },
      { label: "Infopacki", href: "/infopacki" },
      { label: "Rzecznik Praw Studenta", href: "/rzecznik-praw-studenta" },
      { label: "Mapa kampusu", href: "/mapa-kampusu" },
      { label: "Pomoc psychologiczna", href: "/pomoc-psychologiczna" },
    ],
  },
  {
    title: "Samorząd",
    links: [
      { label: "Nasza działalność", href: "/nasza-dzialalnosc" },
      { label: "Nasze projekty", href: "/nasze-projekty" },
      { label: "Struktura Samorządu", href: "/struktura-samorzadu" },
      { label: "Rada Uczelniana (RUSS)", href: "/rada-uczelniana-samorzadu-studentow" },
      { label: "Regulacje wewnętrzne", href: "/regulacje-wewnetrzne" },
      { label: "Strefa działacza", href: `${BASE}/strefa-dzialacza` },
    ],
  },
  {
    title: "Współpraca",
    links: [
      { label: "Partnerzy", href: "/partnerzy" },
      { label: "Współpracuj z nami", href: "/wspolpracuj-z-nami" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  const className =
    "text-[0.9375rem] text-ink-secondary transition-colors hover:text-ink-primary";
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

export function Footer() {
  return (
    <footer
      id="kontakt"
      aria-labelledby="kontakt-heading"
      className="section-padding border-t border-border-subtle"
    >
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            {/* Brand + contact */}
            <div>
              <h2
                id="kontakt-heading"
                className="max-w-[22ch] font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-ink-primary"
              >
                Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu
              </h2>

              <address className="mt-6 flex flex-col gap-4 not-italic">
                <div className="flex items-start gap-3 text-ink-secondary">
                  <MapPin
                    size={20}
                    weight="regular"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-ink-secondary"
                  />
                  <p className="text-[0.9375rem] leading-[1.7]">
                    ul. Kamienna 43
                    <br />
                    Budynek J, pokój 9
                    <br />
                    53-307 Wrocław
                  </p>
                </div>
                <a
                  href="mailto:kontakt@samorzad.ue.wroc.pl"
                  className="flex items-center gap-3 text-[0.9375rem] text-ink-secondary transition-colors hover:text-ink-primary"
                >
                  <EnvelopeSimple
                    size={20}
                    weight="regular"
                    aria-hidden="true"
                    className="shrink-0 text-ink-secondary"
                  />
                  kontakt@samorzad.ue.wroc.pl
                </a>
              </address>

              <ul className="mt-6 flex list-none gap-3">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${social.label} (otwiera się w nowej karcie)`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-bg-elevated hover:text-accent"
                    >
                      <social.icon size={22} weight="regular" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Link columns */}
            {linkGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-secondary">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </ScrollReveal>

        {/* Copyright */}
        <div className="mt-16 border-t border-border-subtle pt-6">
          <p className="text-[0.8125rem] text-ink-secondary">
            &copy; {new Date().getFullYear()} Samorząd Studentów Uniwersytetu
            Ekonomicznego we Wrocławiu. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
