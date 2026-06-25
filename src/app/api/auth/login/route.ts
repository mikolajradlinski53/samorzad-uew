import { type NextRequest, NextResponse } from "next/server";
import { STATE_COOKIE, ALLOWED_DOMAIN, isAuthConfigured } from "@/lib/auth";

export const runtime = "nodejs";

/** Start logowania — przekierowanie do zgody Google (ograniczone do domeny). */
export function GET(req: NextRequest) {
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") === "en" ? "en" : "pl";

  if (!isAuthConfigured()) {
    return NextResponse.redirect(new URL(`/${locale}/strefa-dzialacza`, url.origin));
  }

  const state = `${crypto.randomUUID()}.${locale}`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${url.origin}/api/auth/callback`,
    response_type: "code",
    scope: "openid email profile",
    hd: ALLOWED_DOMAIN, // podpowiedź domeny (UI Google); twarda walidacja w callbacku
    state,
    prompt: "select_account",
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
