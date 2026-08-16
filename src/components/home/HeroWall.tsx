"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { wallPhotos } from "@/lib/photos";
import styles from "./HeroWall.module.css";

/**
 * Hero: ściana kadrów z życia Samorządu, obrócona w przestrzeni.
 *
 * Decyzja zamawiającego, podjęta świadomie po kilku podejściach do hero.
 * Wzorzec pochodzi z sekcji z opiniami klientów — my kładziemy w nim ZDJĘCIA,
 * bo Samorząd nie ma klientów wystawiających gwiazdki, tylko dorobek.
 *
 * CZTERY RZECZY, KTÓRE ROBIMY INACZEJ NIŻ WZORZEC — i dlaczego:
 *
 * 1. Kolor. Wzorzec jest fioletowo-indygowy; my mamy niebieski #2C4BFF w
 *    identyfikacji. Poświaty i akcenty idą w naszym niebieskim, bo hero z cudzą
 *    paletą jest ładne i nie nasze.
 * 2. Hero zostaje CIEMNE w obu motywach. To nie jest przeoczenie: ciemna scena
 *    jest tu treścią, tak jak ciemna sala w kinie. Reszta strony słucha motywu.
 * 3. Ściana jest DEKORACJĄ dla czytnika ekranu (`aria-hidden`). Trzydzieści dwa
 *    opisy „zdjęcie z życia Samorządu" to nie dostępność, tylko hałas —
 *    znaczenie niesie tekst obok, a zdjęcia niosą je dla oka.
 * 4. Zostaje WYSZUKIWARKA. Wzorzec ma po lewej tylko napis i akapit, ale to
 *    jest strona, na którą student wchodzi ze sprawą. Hero bez pola wyszukiwania
 *    byłoby ładniejsze i gorsze.
 */

/** Cztery kolumny na desktopie; na wąskich ekranach CSS chowa ostatnie. */
const COLUMNS = 4;

/** Rozkład kadrów po kolumnach — na zmianę, żeby sąsiednie się nie powtarzały. */
function toColumns(photos: string[]): string[][] {
  const columns: string[][] = Array.from({ length: COLUMNS }, () => []);
  photos.forEach((photo, i) => columns[i % COLUMNS].push(photo));
  return columns;
}

export function HeroWall() {
  const t = useTranslations("heroWall");
  const locale = useLocale();
  const columns = toColumns(wallPhotos);

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <span className={styles.grid} aria-hidden="true" />
      <span className={styles.glowOne} aria-hidden="true" />
      <span className={styles.glowTwo} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.pill}>
            <span className={styles.dot} aria-hidden="true" />
            {t("pill")}
          </p>

          <h1 id="home-hero-title" className={styles.title}>
            <span>{t("titleStrong")}</span>{" "}
            <span className={styles.titleMuted}>{t("titleMuted")}</span>
          </h1>

          {/* Hasło Samorządu jako podpis pod nazwą — te trzy słowa są jego
              własne i mówią o nim więcej niż zdanie opisowe. */}
          <p className={styles.motto}>{t("motto")}</p>
          <p className={styles.lead}>{t("lead")}</p>

          <form
            action={`/${locale}/szukaj`}
            method="get"
            role="search"
            className={styles.search}
          >
            <label htmlFor="home-hero-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <MagnifyingGlass size={20} weight="regular" aria-hidden="true" />
            <input
              id="home-hero-search"
              name="q"
              type="search"
              autoComplete="off"
              placeholder={t("searchPlaceholder")}
            />
            <button type="submit">
              <span>{t("searchSubmit")}</span>
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </button>
          </form>
        </div>

        {/*
          Pole animacji nie ma własnego tła, ramki ani zaokrągleń — kadry mają
          unosić się nad tłem sekcji. Wygaszenie brzegów robi maska na treści,
          a nie nałożone prostokąty z gradientem, które zdradzałyby krawędź.
        */}
        <div className={styles.field} aria-hidden="true">
          <div className={styles.stage}>
            {columns.map((column, index) => (
              <div key={index} className={styles.column} data-column={index + 1}>
                <div className={styles.track}>
                  {/* Lista leci dwa razy — to jest cały mechanizm bezszwowej
                      pętli: przesuwamy o połowę wysokości i wracamy. */}
                  {[...column, ...column].map((photo, i) => (
                    <div key={i} className={styles.card}>
                      <span className={styles.cardGlow} />
                      <Image
                        src={photo}
                        alt=""
                        fill
                        preload={index < 2 && i === 0}
                        sizes="(max-width: 700px) 45vw, (max-width: 1000px) 30vw, 260px"
                        className={styles.cardImage}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
