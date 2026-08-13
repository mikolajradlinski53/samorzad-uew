export interface LivingDocumentSource {
  title: string;
  publisher: string;
  effectiveFor: string;
  landingPage: string;
  pdf: string;
  checkedAt: string;
}

export const studyRegulationSource: LivingDocumentSource = {
  title: "Uczelniany Regulamin Studiów Uniwersytetu Ekonomicznego we Wrocławiu",
  publisher: "Biuletyn Informacji Publicznej UEW",
  effectiveFor: "rok akademicki 2025/2026",
  landingPage:
    "https://bip.ue.wroc.pl/233/268/uczelniany-regulamin-studiow-uniwersytetu-ekonomicznego-we-wroclawiu.html",
  pdf: "https://bip.ue.wroc.pl/download/attachment/3457/uczelniany-regulaminu-studiow-od-roku-akademickiego-2025_2026.pdf",
  checkedAt: "2026-08-13",
};

export const studyRegulationInfopack =
  "https://drive.google.com/file/d/1QcyoxoV15SJGrvKKONtn0JGFutQ5gRZ1/view?usp=sharing";

export const applicationsInfopack =
  "https://drive.google.com/file/d/1X5muhuWdgbxlOK1cgLz4fczzaKJwSFAC/view?usp=sharing";

export const usosInfopack =
  "https://drive.google.com/file/d/1EmTBHP5GzLrHBA782SBg82rnelb4PD7i/view?usp=sharing";

export const semesterInfopack =
  "https://drive.google.com/file/d/1R1mXDt8745vC98J_FBJ5UoKjwMbw4NYA/view?usp=sharing";

export const semesterSources = {
  fees: "https://bip.ue.wroc.pl/568/610/2026.html",
  usos: "https://usosweb.ue.wroc.pl/kontroler.php?_action=news/default",
} as const;

export const usosSources = {
  system: "https://usosweb.ue.wroc.pl/kontroler.php?_action=news/default",
  officialGuide:
    "https://international.uew.pl/wp-content/uploads/sites/62/2025/09/UEW-Welcome-guide-for-international-students-2025.pdf",
  exchangeGuide:
    "https://international.uew.pl/wp-content/uploads/sites/62/2023/11/instrukcja_dla_studentow_modulu_wymiany_studenckiej_w_usosweb.pdf",
} as const;

/**
 * The Infopack also cites a Prorector's circular dated 3 June 2025 on
 * individual student matters. No matching public BIP URL was found during the
 * 13 August 2026 verification, so the site names it without inventing a link.
 */
export const applicationsCircularReference = {
  title: "Pismo okólne nr 6/2025 w sprawie indywidualnych spraw studenckich",
  date: "2025-06-03",
  publicUrl: null,
} as const;

export function studyRegulationPage(page: number) {
  return `${studyRegulationSource.pdf}#page=${page}`;
}
