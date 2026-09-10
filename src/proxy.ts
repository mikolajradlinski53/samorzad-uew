import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * ZAMKNIĘCIE SERWISU.
 *
 * Serwis jest ZAMKNIĘTY DOMYŚLNIE. Otwiera go wyłącznie jawne ustawienie
 * zmiennej `SITE_LOCK` na `off`. Taki kierunek jest celowy: wdrożenie samo
 * z siebie zamyka stronę, bez żadnego kroku w panelu, więc nic nie zostanie
 * odsłonięte przez przeoczenie. Odblokowanie wymaga świadomej decyzji.
 *
 * PODGLĄD DLA ZESPOŁU. Jeśli ustawisz `SITE_LOCK_KEY`, wejście z parametrem
 * `?klucz=…` zapisuje ciasteczko i przepuszcza tę przeglądarkę dalej. To
 * wygodna furtka na czas prac, a NIE zabezpieczenie — klucz jedzie w adresie,
 * więc trafia do historii przeglądarki i logów. Nie chroń nim niczego, czego
 * nie można pokazać.
 */

const KLUCZ_CIASTECZKA = "ssuew-podglad";

/** Ścieżki, których next-intl nie obsługuje: API, zasoby Next, pliki z kropką. */
const POZA_TLUMACZENIAMI = /^\/(?:api|_next|_vercel)(?:\/|$)|\/[^/]+\.[^/]+$/;

const intl = createMiddleware(routing);

function czyZamkniete(): boolean {
  return process.env.SITE_LOCK !== "off";
}

function stronaZamkniecia(): string {
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Serwis niedostępny</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0; min-height: 100vh;
    display: grid; place-items: center;
    padding: 24px;
    background: #f6f8fc; color: #0b1322;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.6;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #0a0d14; color: #eef2f8; }
    .sub { color: #9ba6b7 !important; }
  }
  main { max-width: 34rem; text-align: center; }
  h1 { font-size: 1.5rem; line-height: 1.25; margin: 0 0 12px; letter-spacing: -0.02em; }
  p { margin: 0 0 10px; }
  .sub { color: #475467; font-size: 0.9375rem; }
  a { color: #2c4bff; }
</style>
</head>
<body>
<main>
  <h1>Serwis jest chwilowo niedostępny</h1>
  <p class="sub">Trwają prace techniczne. Prosimy spróbować później.</p>
  <p class="sub">W pilnych sprawach: <a href="mailto:kontakt@samorzad.ue.wroc.pl">kontakt@samorzad.ue.wroc.pl</a></p>
  <p class="sub" lang="en">This site is temporarily unavailable. Please try again later.</p>
</main>
</body>
</html>`;
}

export function proxy(request: NextRequest) {
  if (czyZamkniete()) {
    const klucz = process.env.SITE_LOCK_KEY;
    const podany = request.nextUrl.searchParams.get("klucz");
    const zCiasteczka = request.cookies.get(KLUCZ_CIASTECZKA)?.value;

    // Furtka podglądu — tylko gdy klucz w ogóle ustawiono.
    if (klucz && (podany === klucz || zCiasteczka === klucz)) {
      const odpowiedz = przepusc(request);
      if (podany === klucz) {
        odpowiedz.cookies.set(KLUCZ_CIASTECZKA, klucz, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          path: "/",
          maxAge: 60 * 60 * 12,
        });
      }
      // Podgląd nie może trafić do żadnego cache po drodze ani do wyszukiwarek.
      odpowiedz.headers.set("Cache-Control", "no-store, must-revalidate");
      odpowiedz.headers.set("X-Robots-Tag", "noindex, nofollow");
      return odpowiedz;
    }

    // 503, a nie 200 z komunikatem: wyszukiwarki traktują to jako przerwę
    // techniczną i NIE podmieniają zaindeksowanej treści na tę stronę.
    return new NextResponse(stronaZamkniecia(), {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Bez `no-store` blokada zostałaby w cache CDN-u i przeglądarek także
        // po odblokowaniu serwisu.
        "Cache-Control": "no-store, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
        "Retry-After": "3600",
      },
    });
  }

  return przepusc(request);
}

/**
 * Zachowanie przy otwartym serwisie.
 *
 * Dopasowanie w `config` obejmuje teraz WSZYSTKO, żeby zamknięcie łapało też
 * API i zasoby. Gdy serwis jest otwarty, ścieżki spoza zakresu tłumaczeń muszą
 * więc przelecieć nietknięte — inaczej next-intl próbowałby dokleić prefiks
 * języka do `/api/...` i do plików statycznych.
 */
function przepusc(request: NextRequest): NextResponse {
  if (POZA_TLUMACZENIAMI.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return intl(request) as NextResponse;
}

export const config = {
  // Wszystko. Przy zamkniętym serwisie nie może istnieć ścieżka, która go omija.
  matcher: "/:path*",
};
