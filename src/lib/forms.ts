/**
 * Endpointy Formspree. ZAŁÓŻ FORMULARZ na formspree.io → New Form,
 * skopiuj adres (https://formspree.io/f/xxxxxxxx) i wklej poniżej.
 * Dopóki stoi tu PLACEHOLDER, formularz pokazuje komunikat i nie wysyła.
 */
export const FORMSPREE_PLACEHOLDER = "FORMSPREE_ID_DO_UZUPELNIENIA";

export const formspree = {
  kontakt: FORMSPREE_PLACEHOLDER,
  rzecznik: FORMSPREE_PLACEHOLDER,
  partnerzy: FORMSPREE_PLACEHOLDER,
} as const;

export const formspreeUrl = (id: string) => `https://formspree.io/f/${id}`;

export const isConfigured = (id: string) => id !== FORMSPREE_PLACEHOLDER && id.length > 0;
