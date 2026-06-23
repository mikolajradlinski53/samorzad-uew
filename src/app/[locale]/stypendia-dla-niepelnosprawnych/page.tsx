import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StypendiumDetailContent } from "@/components/pages/StypendiumDetailContent";

export const metadata: Metadata = {
  title: "Stypendium dla osób z niepełnosprawnością",
  description:
    "Stypendium dla studentów UEW z orzeczoną niepełnosprawnością — jak złożyć wniosek przez USOSweb i jakie orzeczenie dołączyć.",
};

export default function StypendiumNiepelnosprawniPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta · Stypendia"
        title="Stypendium dla osób z niepełnosprawnością"
        lead="Wsparcie dla studentów z orzeczoną niepełnosprawnością — niezależne od sytuacji materialnej i od pozostałych świadczeń."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Stypendia", href: "/stypendia" },
          { label: "Dla osób z niepełnosprawnością" },
        ]}
      />
      <StypendiumDetailContent
        eyebrow="Stypendium dla osób z niepełnosprawnością"
        heading="Świadczenie niezależne od dochodu"
        intro="Stypendium przysługuje studentom posiadającym aktualne orzeczenie o niepełnosprawności. Nie zależy od sytuacji materialnej i można je pobierać równolegle z innymi świadczeniami."
        notes={[
          {
            title: "Aktualne orzeczenie",
            desc: "Podstawą przyznania świadczenia jest ważne orzeczenie o stopniu niepełnosprawności. Po wygaśnięciu orzeczenia konieczne jest złożenie nowej dokumentacji.",
          },
          {
            title: "Wypłata po odebraniu decyzji",
            desc: "Tak jak przy pozostałych świadczeniach, wypłata następuje po odebraniu decyzji w systemie USOSweb. Powiadomienia trafiają na uczelniany adres e-mail.",
          },
        ]}
        extraLinks={[
          {
            label: "Biuro ds. Osób z Niepełnosprawnościami",
            href: "https://www.ue.wroc.pl/studenci/9745/biuro_ds_osob_z_niepelnosprawnosciami.html",
          },
        ]}
      />
    </>
  );
}
