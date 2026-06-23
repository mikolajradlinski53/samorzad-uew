import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StypendiumDetailContent } from "@/components/pages/StypendiumDetailContent";

export const metadata: Metadata = {
  title: "Stypendium socjalne",
  description:
    "Stypendium socjalne dla studentów UEW w trudniejszej sytuacji materialnej — jak złożyć wniosek przez USOSweb, jaką dokumentację przygotować i o czym pamiętać.",
};

export default function StypendiumSocjalnePage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta · Stypendia"
        title="Stypendium socjalne"
        lead="Dla studentów znajdujących się w trudniejszej sytuacji materialnej. Świadczenie przyznawane na podstawie dochodu w rodzinie studenta."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Stypendia", href: "/stypendia" },
          { label: "Stypendium socjalne" },
        ]}
      />
      <StypendiumDetailContent
        eyebrow="Stypendium socjalne"
        heading="Wsparcie, gdy budżet domowy nie domyka się sam"
        intro="Stypendium socjalne przysługuje studentom znajdującym się w trudnej sytuacji materialnej. Wysokość świadczenia zależy od dochodu przypadającego na osobę w rodzinie, obliczanego zgodnie z regulaminem świadczeń."
        notes={[
          {
            title: "Składasz po raz pierwszy?",
            desc: "Osoby ubiegające się o stypendium po raz pierwszy muszą złożyć wydrukowany i podpisany wniosek wraz z oświadczeniem o dochodach oraz pełną dokumentacją potwierdzającą dochody rodziny.",
          },
          {
            title: "Pełnoletnie rodzeństwo, które się uczy",
            desc: "Jeśli masz uczące się pełnoletnie rodzeństwo, do wniosku na semestr letni dołącz aktualne zaświadczenie o kontynuacji nauki.",
          },
          {
            title: "Zmiana sytuacji w rodzinie",
            desc: "Zgłoś zmiany takie jak zgon, urodzenie dziecka, ukończenie nauki przez pełnoletnie rodzeństwo lub zawarcie małżeństwa — wpływają one na wysokość świadczenia.",
          },
          {
            title: "Wypłata po odebraniu decyzji",
            desc: "Stypendium wypłacane jest po odebraniu decyzji w systemie USOSweb. Powiadomienia wysyłane są na uczelniany adres e-mail.",
          },
        ]}
      />
    </>
  );
}
