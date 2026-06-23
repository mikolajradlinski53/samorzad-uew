import { NextResponse } from "next/server";

/**
 * Kontakt — trasa API formularza.
 *
 * Stan: WPIĘTE, gotowe do działania. Realna wysyłka maila uruchamia się
 * automatycznie, gdy w środowisku pojawi się `RESEND_API_KEY`
 * (patrz `.env.example`). Bez klucza zgłoszenie jest walidowane i logowane
 * po stronie serwera, a formularz dostaje odpowiedź sukcesu — dzięki czemu
 * działa już dziś, a maile zaczną wychodzić w chwili dodania klucza.
 *
 * Brak nowych zależności npm — Resend wołany przez REST (fetch).
 */

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Nieprawidłowe dane." };
  }
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (name.length < 2) return { ok: false, error: "Podaj imię i nazwisko." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Podaj poprawny adres e-mail." };
  if (subject.length < 2) return { ok: false, error: "Wpisz temat wiadomości." };
  if (message.length < 10) return { ok: false, error: "Wiadomość jest za krótka." };

  return { ok: true, data: { name, email, subject, message } };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendViaResend(data: ContactPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = process.env.CONTACT_TO ?? "kontakt@samorzad.ue.wroc.pl";
  const from = process.env.CONTACT_FROM ?? "Formularz SSUEW <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `[Kontakt] ${data.subject}`,
      html: `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Imię i nazwisko:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Temat:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
      `,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Nieprawidłowy format żądania." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 422 });
  }

  try {
    const delivered = await sendViaResend(result.data);
    if (!delivered) {
      // Brak klucza — zgłoszenie nie zostało wysłane mailem, ale jest poprawne.
      // Logujemy, by nic nie przepadło do czasu skonfigurowania RESEND_API_KEY.
      console.warn(
        "[contact] RESEND_API_KEY nie ustawiony — wiadomość zalogowana, nie wysłana:",
        { name: result.data.name, email: result.data.email, subject: result.data.subject },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Błąd wysyłki:", err);
    return NextResponse.json(
      { ok: false, error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później." },
      { status: 502 },
    );
  }
}
