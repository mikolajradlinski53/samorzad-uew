import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PrawaStudentaContent } from "@/components/pages/PrawaStudentaContent";
import { Faq, type QA } from "@/components/Faq";
import { ogMeta } from "@/lib/og";

const faq: QA[] = [
  {
    q: "Skąd biorą się moje prawa jako studenta?",
    a: "Z Ustawy 2.0 (Konstytucji dla Nauki) oraz regulaminu studiów UEW. Ustawa gwarantuje m.in. prawo do przeszkolenia z zakresu praw i obowiązków studenta.",
  },
  {
    q: "Czym jest indywidualna organizacja studiów (IOS)?",
    a: "To możliwość elastycznego dostosowania programu i organizacji studiów do Twojej sytuacji. O IOS wnioskujesz na warunkach określonych w regulaminie uczelni.",
  },
  {
    q: "Czy mogę przystąpić do egzaminu komisyjnego?",
    a: "Tak. Masz prawo do egzaminu komisyjnego, przy udziale wskazanego przez Ciebie obserwatora.",
  },
  {
    q: "Gdzie zgłosić, że moje prawa są łamane?",
    a: "Skontaktuj się z Rzecznikiem Praw Studenta — pomoże zinterpretować przepisy i, jeśli trzeba, reprezentuje Cię wobec jednostek uczelni.",
  },
];

export const metadata: Metadata = {
  title: "Prawa studenta",
  description:
    "Poznaj swoje prawa na Uniwersytecie Ekonomicznym we Wrocławiu — od indywidualnej organizacji studiów po egzamin komisyjny. Ustawa 2.0 w przystępnej formie.",
  ...ogMeta("Prawa studenta", "Strefa studenta"),
};

export default function PrawaStudentaPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Prawa studenta"
        lead="Studia to nie tylko obowiązki. Poznaj prawa, które przysługują Ci na każdym etapie nauki — i wiedz, gdzie szukać wsparcia, gdy są łamane."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Prawa studenta" },
        ]}
      />
      <PrawaStudentaContent />
      <Faq items={faq} heading="Prawa studenta — najczęstsze pytania" />
    </>
  );
}
