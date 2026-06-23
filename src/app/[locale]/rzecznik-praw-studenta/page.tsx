import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RzecznikContent } from "@/components/pages/RzecznikContent";
import { Faq, type QA } from "@/components/Faq";
import { ogMeta } from "@/lib/og";

const faq: QA[] = [
  {
    q: "Kim jest Rzecznik Praw Studenta?",
    a: "To osoba, która wspiera studentów w interpretacji przepisów i reprezentuje ich w kontaktach z jednostkami administracyjnymi uczelni. Funkcję pełni Jakub Buchta.",
  },
  {
    q: "Kiedy się do niego zgłosić?",
    a: "Gdy nie potrafisz zinterpretować przepisów, nie udało Ci się załatwić sprawy w dziekanacie albo masz wątpliwości co do swoich praw i obowiązków jako student.",
  },
  {
    q: "Jak się skontaktować?",
    a: "Napisz na rps@samorzad.ue.wroc.pl lub skorzystaj z formularza kontaktu. Wcześniej zbierz fakty: co się stało, z kim rozmawiałeś i jakich przepisów dotyczy sprawa.",
  },
  {
    q: "Co Rzecznik może dla mnie zrobić?",
    a: "Pomoże zinterpretować przepisy, skieruje do właściwych źródeł informacji, a w razie potrzeby reprezentuje Cię wobec uczelni.",
  },
];

export const metadata: Metadata = {
  title: "Rzecznik Praw Studenta",
  description:
    "Rzecznik Praw Studenta UEW — Jakub Buchta — wspiera studentów w interpretacji przepisów i reprezentuje ich wobec uczelni. Sprawdź, jak skorzystać z pomocy.",
  ...ogMeta("Rzecznik Praw Studenta", "Strefa studenta"),
};

export default function RzecznikPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Rzecznik Praw Studenta"
        lead="Gdy przepisy są niejasne, a sprawa utknęła — Rzecznik pomoże Ci je zrozumieć i stanie po Twojej stronie."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Rzecznik Praw Studenta" },
        ]}
      />
      <RzecznikContent />
      <Faq items={faq} heading="Rzecznik — najczęstsze pytania" />
    </>
  );
}
