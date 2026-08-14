/**
 * Backend formularzy Samorządu Studentów UEW.
 *
 * Wklej ten plik do Apps Script przypiętego do arkusza Google na koncie
 * Samorządu. Skrypt zapisuje każde zgłoszenie do arkusza i wysyła
 * powiadomienie na wskazany adres.
 *
 * INSTRUKCJA W docs/WRZUC-TUTAJ.md — tutaj jest tylko kod.
 */

const CONFIG = {
  // Ten sam ciąg co APPS_SCRIPT_SECRET w Vercelu. Wygeneruj losowy, długi.
  SEKRET: "WSTAW_TEN_SAM_SEKRET_CO_W_VERCELU",

  // Gdzie ma przyjść powiadomienie o nowym zgłoszeniu.
  // Każdy formularz może mieć inny adres — dzięki temu sprawy do Rzecznika
  // nie lądują we wspólnej skrzynce.
  ADRESACI: {
    kontakt: "kontakt@samorzad.ue.wroc.pl",
    rzecznik: "rps@samorzad.ue.wroc.pl",
    partnerzy: "zuzanna.bak@samorzad.ue.wroc.pl",
  },

  // Nazwa zakładki w arkuszu. Zostanie utworzona, jeśli nie istnieje.
  ARKUSZ: "Zgloszenia",
};

function doPost(e) {
  try {
    const dane = JSON.parse(e.postData.contents);

    // Bez zgodnego sekretu nie przyjmujemy niczego — inaczej każdy, kto pozna
    // adres wdrożenia, mógłby wysyłać wiadomości w imieniu serwisu.
    if (dane.secret !== CONFIG.SEKRET) {
      return odpowiedz({ ok: false, blad: "brak_autoryzacji" });
    }

    const formularz = String(dane.formularz || "kontakt");
    const wiersz = [
      new Date(),
      formularz,
      String(dane.name || ""),
      String(dane.email || ""),
      String(dane.subject || ""),
      String(dane.message || ""),
    ];

    zapiszWiersz(wiersz);
    wyslijPowiadomienie(formularz, dane);

    return odpowiedz({ ok: true });
  } catch (err) {
    // Zgłoszenie zapisane, ale mail nie poszedł — nadal zwracamy błąd, żeby
    // strona nie obiecała użytkownikowi, że wiadomość dotarła.
    return odpowiedz({ ok: false, blad: String(err) });
  }
}

function zapiszWiersz(wiersz) {
  const plik = SpreadsheetApp.getActiveSpreadsheet();
  let arkusz = plik.getSheetByName(CONFIG.ARKUSZ);
  if (!arkusz) {
    arkusz = plik.insertSheet(CONFIG.ARKUSZ);
    arkusz.appendRow(["Data", "Formularz", "Imię", "E-mail", "Temat", "Wiadomość"]);
    arkusz.setFrozenRows(1);
  }
  arkusz.appendRow(wiersz);
}

function wyslijPowiadomienie(formularz, dane) {
  const adres = CONFIG.ADRESACI[formularz] || CONFIG.ADRESACI.kontakt;
  const temat = "[" + formularz + "] " + (dane.subject || "Nowe zgłoszenie ze strony");

  const tresc =
    "Nowe zgłoszenie z formularza: " + formularz + "\n\n" +
    "Imię:    " + (dane.name || "—") + "\n" +
    "E-mail:  " + (dane.email || "—") + "\n" +
    "Temat:   " + (dane.subject || "—") + "\n\n" +
    "Wiadomość:\n" + (dane.message || "—") + "\n\n" +
    "— wysłane automatycznie ze strony samorzad.ue.wroc.pl";

  MailApp.sendEmail({
    to: adres,
    subject: temat,
    body: tresc,
    // Dzięki temu „Odpowiedz" w kliencie poczty pisze do studenta, a nie do
    // skrzynki skryptu.
    replyTo: String(dane.email || ""),
  });
}

function odpowiedz(obiekt) {
  return ContentService.createTextOutput(JSON.stringify(obiekt)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
