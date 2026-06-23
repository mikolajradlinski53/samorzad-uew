import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { NaszeProjektyContent } from "@/components/pages/NaszeProjektyContent";

export const metadata: Metadata = {
  title: "Nasze projekty",
  description:
    "Adapciak, Animalia, Bal UEW, Graduetion, Mosty Ekonomiczne, TEDxUEW i więcej — projekty, którymi integrujemy i rozwijamy studentów UEW.",
};

export default function NaszeProjektyPage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd Studentów"
        title="Nasze projekty"
        lead="Bo studia to coś więcej niż wykłady. Realizujemy projekty, które integrują studentów, wspierają ich rozwój i wzbogacają życie akademickie UEW."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Nasza działalność", href: "/nasza-dzialalnosc" },
          { label: "Nasze projekty" },
        ]}
      />
      <NaszeProjektyContent />
    </>
  );
}
