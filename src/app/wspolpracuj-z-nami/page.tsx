import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WspolpracaContent } from "@/components/pages/WspolpracaContent";

export const metadata: Metadata = {
  title: "Współpracuj z nami",
  description:
    "Dotrzyj ze swoją marką do 11 000 studentów UEW — eventy, promocja w social media i kampanie marketingowe. Skontaktuj się z Zarządem ds. relacji zewnętrznych.",
};

export default function WspolpracaPage() {
  return (
    <>
      <PageHero
        eyebrow="Współpraca"
        title="Współpracuj z nami"
        lead="Połączmy Twoją markę z najliczniejszą społecznością studencką UEW — wybierz formę współpracy, a ofertę przygotujemy pod Ciebie."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Partnerzy", href: "/partnerzy" },
          { label: "Współpracuj z nami" },
        ]}
      />
      <WspolpracaContent />
    </>
  );
}
