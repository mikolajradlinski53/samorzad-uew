"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { board, viceChairs, russMembers } from "@/lib/people";
import styles from "./Register.module.css";

/**
 * Rejestr zakresów działania — druga po hero „scena" strony głównej.
 *
 * CO BYŁO NIE TAK Z POPRZEDNIĄ WERSJĄ
 *
 * Sekcja mówiła do studenta jego własnym głosem: „Coś utknęło", „Potrzebuję
 * rozmowy", „Chcę coś uruchomić". Brzmiało to jak aplikacja konsumencka, a nie
 * jak organ uczelni — a Samorząd jest organem i to jest jego siła, nie wstyd.
 * Zamawiający polecił przemianować całość na język instytucjonalny.
 *
 * NA CZYM STOI NOWY UKŁAD
 *
 * Rejestr, a nie lista kafli: po lewej numerowany spis zakresów, po prawej
 * rozwinięcie wybranej pozycji. Format jest wzięty z raportu rocznego — duża
 * liczba jako typografia, dane techniczne krojem mono, organ właściwy podany
 * wprost. Efekt „wow" niesie tu SKALA LICZBY, nie animacja ozdobna.
 *
 * KAŻDA LICZBA JEST LICZONA, NIE WPISANA
 *
 * Tam, gdzie dane są w repozytorium (`people.ts`), rejestr je zlicza — więc po
 * zmianie składu Zarządu albo RUSS liczba zmieni się sama i nikt nie musi o tym
 * pamiętać. Pozostałe wartości mają w komentarzu podane źródło, którym są
 * istniejące podstrony; nie ma tu ani jednej liczby wziętej z sufitu.
 */

/**
 * Ile osób obsadza organy wykonawcze: osoba przewodnicząca + wiceprzewodniczący
 * + pozostały zarząd. Osoba przewodnicząca jest w `people.ts` osobnym
 * eksportem, a nie elementem listy, więc dolicza się ją jawnie — stąd „1 +".
 */
const PEOPLE_IN_OFFICE = 1 + viceChairs.length + board.length;

/**
 * Liczby, których nie da się policzyć z modułu, ale KAŻDA odpowiada istniejącym
 * podstronom — a nie oszacowaniu:
 *
 * - infopacki: src/app/[locale]/infopacki/{biblioteka, dyplomowanie, podania,
 *   regulamin-studiow, sprawy-studenckie, usos, zaliczenie-semestru,
 *   zycie-studenckie} = 8
 * - projekty: lista w NaszeProjektyContent = 9 („dziewięć formatów" jest też
 *   napisane na tej stronie)
 * - stypendia: rodzaje wsparcia opisane na /stypendia = 4
 */
const COUNT_INFOPACKS = 8;
const COUNT_PROJECTS = 9;
const COUNT_AID = 4;

interface Scope {
  key: string;
  href: string;
  /** Wartość pokazywana wielką cyfrą. */
  metric: number;
}

const scopes: Scope[] = [
  { key: "studies", href: "/dla-studenta", metric: COUNT_INFOPACKS },
  { key: "rights", href: "/prawa-studenta", metric: 0 },
  { key: "aid", href: "/stypendia", metric: COUNT_AID },
  { key: "health", href: "/pomoc-psychologiczna", metric: 0 },
  { key: "initiatives", href: "/nasze-projekty", metric: COUNT_PROJECTS },
  { key: "representation", href: "/transparentnosc", metric: PEOPLE_IN_OFFICE + russMembers.length },
];

/** Co ile milisekund rejestr przechodzi do następnej pozycji sam z siebie. */
const ADVANCE_MS = 6000;

export function Register() {
  const t = useTranslations("register");
  const [active, setActive] = useState(0);

  /**
   * Rejestr przewija się sam, żeby sekcja żyła, zanim ktokolwiek jej dotknie.
   * Dwa warunki, bez których byłoby to wrogie:
   * - przy `prefers-reduced-motion` nie rusza wcale;
   * - PIERWSZE kliknięcie zatrzymuje go NA STAŁE. Spis, który przeskakuje pod
   *   palcem czytającego, jest gorszy od statycznego.
   */
  const [taken, setTaken] = useState(false);
  useEffect(() => {
    if (taken) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % scopes.length),
      ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [taken]);

  const current = scopes[active];

  return (
    <section id="zakresy" className={styles.register} aria-labelledby="register-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h2 id="register-title" className={styles.heading}>
          {t("heading")}
        </h2>
        <p className={styles.lead}>{t("lead")}</p>
      </div>

      <div className={styles.body}>
        {/* Spis. Pozycje są przyciskami, nie odnośnikami: przełączają widok,
            a do podstrony prowadzi jeden odnośnik w rozwinięciu — pełnowymiarowy
            i opisany, zamiast sześciu drobnych celów. */}
        <ol className={styles.index}>
          {scopes.map((scope, i) => (
            <li key={scope.key}>
              <button
                type="button"
                aria-pressed={i === active}
                aria-controls="register-detail"
                className={styles.row}
                data-active={i === active ? "true" : undefined}
                onClick={() => {
                  setTaken(true);
                  setActive(i);
                }}
              >
                <span className={styles.rowNumber}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.rowName}>{t(`scopes.${scope.key}.name`)}</span>
                <span className={styles.rowOrgan}>{t(`scopes.${scope.key}.organ`)}</span>
              </button>
            </li>
          ))}
        </ol>

        <div id="register-detail" className={styles.detail} aria-live="polite">
          <div key={current.key} className={styles.detailInner}>
            <p className={styles.detailOrgan}>{t(`scopes.${current.key}.organ`)}</p>
            <h3 className={styles.detailName}>{t(`scopes.${current.key}.name`)}</h3>

            {/* Wielka liczba jest tu treścią, nie ozdobą — dlatego pozycje bez
                sensownej metryki (wsparcie psychologiczne, prawa studenta) jej
                NIE dostają. Wpisanie tam czegokolwiek byłoby wypełnianiem
                układu liczbą bez znaczenia. */}
            {current.metric > 0 ? (
              <p className={styles.metric}>
                <span>{current.metric}</span>
                <em>{t(`scopes.${current.key}.metric`)}</em>
              </p>
            ) : null}

            <p className={styles.detailBody}>{t(`scopes.${current.key}.body`)}</p>

            <Link href={current.href} className={styles.detailLink}>
              {t(`scopes.${current.key}.cta`)}
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
