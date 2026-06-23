import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { MapaKampusuContent } from "@/components/pages/MapaKampusuContent";

export const metadata: Metadata = {
  title: "Mapa kampusu",
  description:
    "Znajdź najważniejsze punkty na kampusie Uniwersytetu Ekonomicznego we Wrocławiu — siedzibę Samorządu, wydziały i bibliotekę. Pobierz mapę i wyznacz trasę.",
};

export default function MapaKampusuPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Mapa kampusu"
        lead="Nie zgub się pierwszego dnia. Sprawdź, gdzie nas znajdziesz i jak poruszać się po kampusie UEW."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Mapa kampusu" },
        ]}
      />
      <MapaKampusuContent />
    </>
  );
}
