import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PartnerzyContent } from "@/components/pages/PartnerzyContent";
import { Faq, type QA } from "@/components/Faq";
import { ogMeta } from "@/lib/og";

const faq: QA[] = [
  {
    q: "Jak rozpocząć współpracę z Samorządem?",
    a: "Napisz do osoby odpowiedzialnej za relacje zewnętrzne — przygotujemy ofertę skrojoną pod Twoje cele. Kontakt: Karol Vogel, karol.vogel@samorzad.ue.wroc.pl, tel. 511 599 376.",
  },
  {
    q: "Jakie formy współpracy oferujecie?",
    a: "Organizację eventów i strefy partnerskie, promocję w social media (TikTok, Instagram, Facebook) oraz kampanie marketingowe skrojone pod studenta UEW.",
  },
  {
    q: "Do ilu studentów docieracie?",
    a: "Reprezentujemy ponad 11 000 studentów Uniwersytetu Ekonomicznego we Wrocławiu.",
  },
  {
    q: "Czy przygotujecie ofertę pod konkretny cel?",
    a: "Tak — ofertę dopasowujemy do Twojego produktu lub usługi oraz do celów kampanii.",
  },
];

export const metadata: Metadata = {
  title: "Partnerzy i współpraca",
  description:
    "Dołącz do grona partnerów Samorządu Studentów UEW. Dotrzyj do 11 000 studentów, bądź obecny na największych wydarzeniach i wspieraj młode talenty.",
  ...ogMeta("Partnerzy i współpraca", "Współpraca"),
};

export default function PartnerzyPage() {
  return (
    <>
      <PageHero
        eyebrow="Współpraca"
        title="Partnerzy"
        lead="Łączymy markę z najliczniejszą społecznością studencką UEW. Sprawdź, jak możemy działać razem."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Partnerzy" },
        ]}
      />
      <PartnerzyContent />
      <Faq items={faq} heading="Współpraca — najczęstsze pytania" />
    </>
  );
}
