import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Pomija API, pliki statyczne i wewnętrzne ścieżki Next.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
