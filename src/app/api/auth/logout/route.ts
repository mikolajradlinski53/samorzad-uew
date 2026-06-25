import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

/** Wylogowanie — kasuje ciasteczko sesji. */
export function GET(req: NextRequest) {
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") === "en" ? "en" : "pl";
  const res = NextResponse.redirect(new URL(`/${locale}/strefa-dzialacza`, url.origin));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
