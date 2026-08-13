"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { ConsentBanner } from "./ConsentBanner";
import { readConsent, writeConsent, type Consent } from "@/lib/consent";

/**
 * Analityka (Vercel, bez ciasteczek) ładowana TYLKO po zgodzie. Niezbędne
 * ciasteczka (sesja działacza, język) działają niezależnie od tego wyboru.
 * Wybór trzymamy w localStorage, więc baner nie wraca po decyzji.
 */
export function AnalyticsConsent() {
  const [state, setState] = useState<{ ready: boolean; consent: Consent | null }>({
    ready: false,
    consent: null,
  });

  // localStorage jest dostępny dopiero po stronie klienta.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ready: true, consent: readConsent() });
  }, []);

  const choose = (c: Consent) => {
    writeConsent(c);
    setState({ ready: true, consent: c });
  };

  return (
    <>
      {state.consent === "accepted" && <Analytics />}
      {state.ready && state.consent === null && (
        <ConsentBanner onAccept={() => choose("accepted")} onReject={() => choose("rejected")} />
      )}
    </>
  );
}
