import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StypendiumDetailContent } from "@/components/pages/StypendiumDetailContent";

export const metadata: Metadata = {
  title: "Zapomoga",
  description:
    "Zapomoga to jednorazowa pomoc dla studentów UEW, którzy znaleźli się w nagłej, przejściowo trudnej sytuacji życiowej. Jak złożyć wniosek przez USOSweb.",
};

export default function ZapomogaPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta · Stypendia"
        title="Zapomoga"
        lead="Jednorazowa pomoc dla studentów, którzy z przyczyn losowych znaleźli się w przejściowo trudnej sytuacji życiowej."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Stypendia", href: "/stypendia" },
          { label: "Zapomoga" },
        ]}
      />
      <StypendiumDetailContent
        eyebrow="Zapomoga"
        heading="Doraźne wsparcie w nagłej sytuacji"
        intro="Zapomoga to jednorazowe świadczenie dla studentów, którzy przejściowo znaleźli się w trudnej sytuacji życiowej — na przykład z powodu zdarzenia losowego. Przyznawana jest niezależnie od stypendium socjalnego."
        notes={[
          {
            title: "Kiedy złożyć wniosek",
            desc: "O zapomogę wnioskujesz w związku z konkretnym, przejściowo trudnym zdarzeniem losowym. Do wniosku dołącz dokumenty potwierdzające okoliczności.",
          },
          {
            title: "Wypłata po odebraniu decyzji",
            desc: "Warunkiem wypłaty jest odebranie decyzji w systemie USOSweb. Powiadomienia wysyłane są na uczelniany adres e-mail.",
          },
        ]}
      />
    </>
  );
}
