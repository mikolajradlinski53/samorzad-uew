/**
 * Minimalna sesja działacza — podpisane ciasteczko (HMAC-SHA256, Web Crypto).
 * Logowanie przez Google OAuth, ograniczone do domeny Samorządu. Bez bibliotek
 * zewnętrznych (pewniejsze przy Next 16). Patrz: src/app/api/auth/*.
 */
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ssuew_session";
export const STATE_COOKIE = "ssuew_oauth_state";
export const ALLOWED_DOMAIN = "samorzad.ue.wroc.pl";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 h

export interface Session {
  email: string;
  name: string;
  exp: number;
}

/** Czy logowanie jest skonfigurowane (klucze obecne w środowisku). */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.AUTH_SECRET);
}

function b64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(norm);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET ?? "";
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Tworzy podpisany token sesji `payload.signature`. */
export async function signSession(data: Omit<Session, "exp">): Promise<string> {
  const session: Session = { ...data, exp: Date.now() + SESSION_TTL_MS };
  const payload = b64url(new TextEncoder().encode(JSON.stringify(session)));
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload) as BufferSource);
  return `${payload}.${b64url(new Uint8Array(sig))}`;
}

/** Weryfikuje token i zwraca sesję albo null (zły podpis / wygasła). */
export async function verifyToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const key = await hmacKey();
  let ok = false;
  try {
    ok = await crypto.subtle.verify("HMAC", key, b64urlDecode(sig) as BufferSource, new TextEncoder().encode(payload) as BufferSource);
  } catch {
    return null;
  }
  if (!ok) return null;
  try {
    const session = JSON.parse(new TextDecoder().decode(b64urlDecode(payload))) as Session;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

/** Bieżąca sesja (server component / route handler). */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}
