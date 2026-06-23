import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { KomisjaWyborczaContent } from "@/components/pages/KomisjaWyborczaContent";

export const metadata: Metadata = {
  title: "Studencka Komisja Wyborcza",
  description:
    "Studencka Komisja Wyborcza (SKW) Samorządu Studentów UEW — zadania, skład i uchwały. Organ, który przygotowuje i nadzoruje wybory samorządowe.",
};

export default function KomisjaWyborczaPage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd"
        title="Studencka Komisja Wyborcza"
        lead="Trzyosobowy organ, który przygotowuje, przeprowadza i nadzoruje wybory do organów Samorządu Studentów — tak, aby były uczciwe i przejrzyste."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Samorząd", href: "/nasza-dzialalnosc" },
          { label: "Struktura", href: "/struktura-samorzadu" },
          { label: "Studencka Komisja Wyborcza" },
        ]}
      />
      <KomisjaWyborczaContent />
    </>
  );
}
