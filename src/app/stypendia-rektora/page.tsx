import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StypendiumDetailContent } from "@/components/pages/StypendiumDetailContent";

export const metadata: Metadata = {
  title: "Stypendium rektora",
  description:
    "Stypendium rektora UEW za bardzo dobre wyniki w nauce oraz osiągnięcia naukowe, sportowe i artystyczne. Jak złożyć wniosek przez USOSweb i gdzie znaleźć regulamin.",
};

export default function StypendiumRektoraPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta · Stypendia"
        title="Stypendium rektora"
        lead="Za bardzo dobre wyniki w nauce oraz osiągnięcia naukowe, sportowe lub artystyczne. Nagroda dla najlepszych studentów Uniwersytetu."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Stypendia", href: "/stypendia" },
          { label: "Stypendium rektora" },
        ]}
      />
      <StypendiumDetailContent
        eyebrow="Stypendium rektora"
        heading="Dla tych, którzy dają z siebie więcej"
        intro="Stypendium rektora przyznawane jest najlepszym studentom za wysokie wyniki w nauce oraz osiągnięcia naukowe, artystyczne lub sportowe. Szczegółowe kryteria i sposób punktowania osiągnięć określa regulamin świadczeń stypendialnych."
        notes={[
          {
            title: "Co się liczy",
            desc: "Pod uwagę brane są średnia ocen oraz udokumentowane osiągnięcia naukowe, artystyczne i sportowe — zgodnie z zasadami oceny zawartymi w regulaminie.",
          },
          {
            title: "Stypendium z Własnego Funduszu Stypendialnego",
            desc: "Oprócz stypendium rektora UEW przyznaje jednorazowe wsparcie z własnego funduszu za dobre wyniki akademickie — wniosek obsługiwany jest w systemie LBD.",
          },
        ]}
      />
    </>
  );
}
