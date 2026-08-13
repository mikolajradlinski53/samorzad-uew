import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Neutralny kontener treści.
 *
 * Treść pozostaje widoczna już w HTML z serwera. Dawny wariant ustawiał
 * `opacity: 0` przed uruchomieniem Intersection Observera, przez co awaria lub
 * opóźnienie JavaScriptu mogły pozostawić całe sekcje niewidoczne. Sygnaturowy
 * ruch realizują teraz wyłącznie elementy, które rzeczywiście go potrzebują
 * (np. `Impulse`), zamiast jednego reveal powtórzonego na całym serwisie.
 *
 * `delay` pozostaje w API przejściowo, aby istniejące wywołania nie wymagały
 * jednoczesnej, ryzykownej migracji całego serwisu.
 */

export function ScrollReveal({
  children,
  className,
}: ScrollRevealProps) {
  return <div className={className}>{children}</div>;
}
