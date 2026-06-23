import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { DziekaniContent } from "@/components/pages/DziekaniContent";

export const metadata: Metadata = {
  title: "Dziekan i prodziekani",
  description:
    "Władze dziekańskie ds. studenckich Uniwersytetu Ekonomicznego we Wrocławiu — dziekan i prodziekani przypisani do poszczególnych kierunków studiów.",
};

export default function DziekaniPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Dziekan i prodziekani"
        lead="Władze dziekańskie ds. studenckich. Sprawy takie jak IOS, urlopy czy odwołania prowadzi prodziekan przypisany do Twojego kierunku."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Dziekan i prodziekani" },
        ]}
      />
      <DziekaniContent />
    </>
  );
}
