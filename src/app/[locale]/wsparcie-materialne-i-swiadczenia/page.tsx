import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WsparcieContent } from "@/components/pages/WsparcieContent";

export const metadata: Metadata = {
  title: "Wsparcie materialne i świadczenia",
  description:
    "Przegląd wszystkich form pomocy materialnej dla studentów UEW — stypendium socjalne, rektora, dla osób z niepełnosprawnością, zapomoga oraz fundusz własny.",
};

export default function WsparcieMaterialnePage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Wsparcie materialne i świadczenia"
        lead="Stypendia, zapomogi i fundusze, z których możesz skorzystać w trakcie studiów. Zebraliśmy je w jednym miejscu, żeby łatwiej było znaleźć właściwą ścieżkę."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Wsparcie materialne i świadczenia" },
        ]}
      />
      <WsparcieContent />
    </>
  );
}
