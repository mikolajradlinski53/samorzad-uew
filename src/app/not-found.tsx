import Link from "next/link";
import { ArrowRight, House } from "@phosphor-icons/react/dist/ssr";
import { AuroraField } from "@/components/AuroraField";

const links = [
  { label: "Strefa studenta", href: "/dla-studenta" },
  { label: "Nasza działalność", href: "/nasza-dzialalnosc" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 outline-none"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -inset-x-0 -top-[10%] h-[120%]">
          <AuroraField />
        </div>
        <div className="grain" />
      </div>

      <div className="relative z-10 mx-auto max-w-[640px] text-center">
        <p className="font-display text-[clamp(5rem,16vw,11rem)] font-semibold leading-none tracking-[-0.03em] text-accent">
          404
        </p>
        <h1 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary">
          Tej strony nie znaleźliśmy
        </h1>
        <p className="mx-auto mt-4 max-w-[44ch] text-[1.0625rem] leading-[1.7] text-ink-secondary">
          Być może adres się zmienił albo strona została przeniesiona. Wróć na
          stronę główną lub skorzystaj z poniższych skrótów.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
          >
            <House size={20} weight="regular" aria-hidden="true" />
            Strona główna
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent transition-colors hover:text-accent-dim"
              >
                {link.label}
                <ArrowRight size={16} weight="regular" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
