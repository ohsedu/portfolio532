export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

/** Label shown in the language switcher. */
export const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
};

/** Short label for the compact toggle. */
export const localeShortLabels: Record<Locale, string> = {
  ko: "KO",
  en: "EN",
};

/** Value for <html lang> and hreflang. */
export const localeHtmlLang: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
};

/** Value for Open Graph og:locale. */
export const localeOgLocale: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
};

/**
 * Type guard used to narrow the `locale` route param before it is used to index
 * the dictionary map. Named to match the Next.js i18n guide's convention.
 *
 * This module is deliberately dependency-free — `src/proxy.ts`, Server
 * Components and the client-side language switcher all import from it, and the
 * proxy runs in its own bundle.
 */
export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Picks the best locale for an `Accept-Language` header.
 *
 * Hand-rolled rather than pulling in `@formatjs/intl-localematcher`: with two
 * locales the whole negotiation is "does a tag start with ko or en", and this
 * keeps the proxy bundle at zero dependencies.
 *
 * Handles quality values (`en;q=0.8`) and region subtags (`ko-KR` → `ko`).
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const quality = q === undefined ? 1 : Number.parseFloat(q);
      return {
        tag: tag.trim().toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (tag === "*") return defaultLocale;
    const base = tag.split("-")[0];
    const match = locales.find((locale) => locale === base);
    if (match) return match;
  }

  return defaultLocale;
}

/** `/ko/projects/x` → `{ locale: 'ko', rest: '/projects/x' }`. */
export function splitLocaleFromPath(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  const segments = pathname.split("/");
  const first = segments[1] ?? "";
  if (hasLocale(first)) {
    return { locale: first, rest: `/${segments.slice(2).join("/")}` };
  }
  return { locale: null, rest: pathname };
}

/** Build an absolute in-site path for a locale, e.g. `('en', '/projects')`. */
export function localePath(locale: Locale, rest = "/"): string {
  const normalized = rest === "/" ? "" : rest.replace(/\/$/, "");
  return `/${locale}${normalized}`;
}

/** A string that exists in every supported language. */
export type LocalizedString = Record<Locale, string>;

/** Pick the right variant of a localized string. */
export function l(value: LocalizedString, locale: Locale): string {
  return value[locale] ?? value[defaultLocale];
}
