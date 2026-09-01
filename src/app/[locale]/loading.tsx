"use client";

import { useTranslations } from "next-intl";
import { RouteSweep } from "@/components/RouteSweep";

/**
 * Zasłona pokazywana podczas przechodzenia między stronami.
 *
 * Powstała z pomiaru, nie z ochoty na animację: na spowolnionym telefonie po
 * kliknięciu w menu adres zmieniał się dopiero po 1700 ms, a nagłówek nowej
 * strony po 2077 ms — i przez cały ten czas stara strona stała bez żadnej
 * reakcji. Dokumentacja tej wersji Next.js wskazuje `loading` jako właściwe
 * miejsce na taką informację zwrotną (`useLinkStatus` jest do subtelnych
 * podpowiedzi przy samym odnośniku).
 *
 * Komponent kliencki, bo `useTranslations` potrzebuje dostawcy tłumaczeń
 * z układu — a ten opakowuje treść strony, więc i tę zasłonę.
 */
export default function Loading() {
  const t = useTranslations("common");
  return <RouteSweep label={t("loadingPage")} />;
}
