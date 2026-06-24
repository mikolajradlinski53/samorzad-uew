/**
 * Centralne źródło składów osobowych SSUEW.
 *
 * TU podmieniasz prawdziwe nazwiska / e-maile — komponenty czytają z tego pliku,
 * więc nie trzeba ich dotykać. Role są tłumaczone w komponentach przez `roleKey`
 * (klucz i18n w namespace danej sekcji), dlatego tutaj trzymamy wyłącznie dane
 * osoby: imię i nazwisko, ewentualnie e-mail. Kolejność osób = kolejność na
 * stronie (i kolejność zdjęć w `public/photos/...`, patrz `src/lib/photos.ts`).
 *
 * UWAGA: część danych to jeszcze placeholdery — wymień je na prawdziwe.
 */

export interface Member {
  name: string;
  /** Klucz roli w namespace sekcji (i18n), np. "chair" → board.roles.chair. */
  roleKey?: string;
  email?: string;
}

// — Zarząd — sekcja „Zarząd" na stronie głównej (Board.tsx). roleKey ∈ board.roles.*
// Zdjęcia: public/photos/zarzad/01.jpg … (kolejność jak niżej).
export const board: Member[] = [
  { name: "Mikołaj Kowalski", roleKey: "chair" },
  { name: "Anna Nowak", roleKey: "vchair" },
  { name: "Piotr Wiśniewski", roleKey: "secretary" },
  { name: "Katarzyna Lewandowska", roleKey: "treasurer" },
  { name: "Tomasz Wójcik", roleKey: "member" },
];

// — Przewodnicząca + Wiceprzewodniczący (PrzewodniczacyContent). roleKey ∈ przewodniczacy.roles.*
export const chair: Member = {
  name: "Emilia Ćwiklińska",
  email: "emilia.cwiklinska@samorzad.ue.wroc.pl",
};

export const viceChairs: Member[] = [
  { name: "Magdalena Skoczylas", roleKey: "strategy", email: "magdalena.skoczylas@samorzad.ue.wroc.pl" },
  { name: "Daria Szewczyk", roleKey: "projects", email: "daria.szewczyk@samorzad.ue.wroc.pl" },
  { name: "Jakub Panas", roleKey: "pr", email: "jakub.panas@samorzad.ue.wroc.pl" },
];

// — Władze rektorskie (WladzeRektorskieContent). roleKey ∈ wladze.roles.*
export const rector: Member = { name: "prof. dr hab. Czesław Zając" };

export const viceRectors: Member[] = [
  { name: "dr hab. inż. Andrzej Okruszek, prof. UEW", roleKey: "student" },
  { name: "dr hab. Piotr Bednarek, prof. UEW", roleKey: "finance" },
  { name: "prof. dr hab. Bogusława Drelich-Skulska", roleKey: "intl" },
  { name: "prof. dr hab. Marek Kośny", roleKey: "science" },
];

// — Dziekani i prodziekani (DziekaniContent). `key` → kierunki: dziekani.kierunki.*
export const dean: Member = { name: "dr hab. Wawrzyniec Michalczyk, prof. UEW" };

export const viceDeans: { name: string; key: string }[] = [
  { name: "dr Wioletta Turowska", key: "turowska" },
  { name: "dr inż. Monika Wereńska", key: "werenska" },
  { name: "dr hab. Sebastian Bobowski, prof. UEW", key: "bobowski" },
];

// — RUSS, skład Rady (RUSSContent). Kolejność = zdjęcia public/photos/russ/01.jpg …
export const russMembers: string[] = [
  "Jarosław Bałut",
  "Martyna Bedlechowicz",
  "Jakub Buchta",
  "Bartosz Buczkowski",
  "Aleksandra Dauerman",
  "Oliwier Kaszewski",
  "Zuzanna Kordus",
  "Zuzanna Kuśmińska",
  "Zofia Palus",
  "Natalia Pietrzak",
  "Agata Rusak",
  "Karina Służyńska",
];

// — Studencka Komisja Wyborcza (KomisjaWyborczaContent). roleKey ∈ skw.roles.*
export const electionCommittee: Member[] = [
  { name: "Martyna Staniszewska", roleKey: "chair" },
  { name: "Katarzyna Emerych", roleKey: "memberF" },
  { name: "Hubert Gościmski", roleKey: "memberM" },
];
