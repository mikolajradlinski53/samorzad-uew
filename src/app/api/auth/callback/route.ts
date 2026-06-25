import { type NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  STATE_COOKIE,
  ALLOWED_DOMAIN,
  isAuthConfigured,
  signSession,
} from "@/lib/auth";

export const runtime = "nodejs";

/** Powrót z Google — wymiana kodu, walidacja domeny, ustawienie sesji. */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = req.cookies.get(STATE_COOKIE)?.value;
  const locale = state?.split(".")[1] === "en" ? "en" : "pl";

  const back = (error?: string) => {
    const u = new URL(`/${locale}/strefa-dzialacza`, url.origin);
    if (error) u.searchParams.set("error", error);
    const res = NextResponse.redirect(u);
    res.cookies.delete(STATE_COOKIE);
    return res;
  };

  // CSRF: state z query musi zgadzać się ze state z ciasteczka.
  if (!code || !state || !stateCookie || state !== stateCookie || !isAuthConfigured()) {
    return back("auth");
  }

  let email = "";
  let name = "";
  let verified = false;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${url.origin}/api/auth/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) throw new Error("token exchange failed");
    const tokens = (await tokenRes.json()) as { id_token?: string };
    if (!tokens.id_token) throw new Error("no id_token");

    // id_token przyszedł bezpośrednio od Google przez TLS (poufny klient) →
    // ufamy zawartości bez ponownej weryfikacji podpisu.
    const payload = tokens.id_token.split(".")[1];
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
    };
    email = (claims.email ?? "").toLowerCase();
    name = claims.name ?? email;
    verified = Boolean(claims.email_verified);
  } catch {
    return back("auth");
  }

  if (!verified || !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
    return back("domain");
  }

  const token = await signSession({ email, name });
  const res = NextResponse.redirect(new URL(`/${locale}/strefa-dzialacza`, url.origin));
  res.cookies.delete(STATE_COOKIE);
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
