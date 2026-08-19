import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { buttonClasses } from "@/components/ui/button";
import { getDictionary, localeLabels, locales } from "@/lib/i18n";
import { person } from "@/lib/site";

import "./globals.css";

/*
 * 404 for any URL that matches no route at all.
 *
 * Why this file rather than `[locale]/not-found.tsx`:
 *
 * `not-found.tsx` only handles a `notFound()` call raised *inside* its own
 * segment. A URL that matches nothing never enters `[locale]`, and this app has
 * no `src/app/not-found.tsx` to fall back to — there is no root layout above
 * `[locale]` for one to render inside. The Next docs name exactly this shape
 * ("your root layout is defined using top-level dynamic segments") as a case
 * where a 404 cannot be composed from `layout.tsx` + `not-found.tsx`, and point
 * here. It is enabled by `experimental.globalNotFound` in `next.config.ts`.
 *
 * Two consequences of bypassing the layout, both handled below:
 *   - global styles, fonts and the theme have to be set up again in this file
 *   - the component receives NO props, so there is no locale to read
 *
 * The missing locale is not worked around, it is embraced: a bilingual site with
 * no way to know which language was wanted should say it in both. Guessing from
 * `Accept-Language` here would need a Request-time API, which would make this
 * route dynamic for no benefit.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404",
  /* Next already injects noindex for 404 responses; this states the intent. */
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html
      /*
       * No single correct value — this page speaks both languages. `lang` is set
       * per-block below instead, so a screen reader switches voice at the right
       * point rather than reading one language with the other's pronunciation.
       */
      lang="ko"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-fg min-h-dvh antialiased">
        {/* Restores the user's saved theme, which the bypassed layout would
            normally have applied. */}
        <ThemeProvider>
          <main className="relative isolate mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
            <div
              aria-hidden
              className="bloom absolute top-0 left-1/2 -z-10 size-[28rem] -translate-x-1/2 opacity-60"
            />

            <p
              aria-hidden
              className="text-brand-accent font-mono text-6xl font-bold tracking-tighter sm:text-8xl"
            >
              404
            </p>

            {locales.map((locale) => {
              const dict = getDictionary(locale);
              return (
                <div key={locale} lang={locale} className="mt-8 first:mt-10">
                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {dict.notFound.heading}
                  </h1>
                  <p className="text-fg-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
                    {dict.notFound.lede}
                  </p>
                </div>
              );
            })}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {locales.map((locale, index) => (
                <a
                  key={locale}
                  href={`/${locale}`}
                  hrefLang={locale}
                  className={buttonClasses({
                    variant: index === 0 ? "primary" : "secondary",
                  })}
                >
                  {getDictionary(locale).notFound.cta}
                  <span className="opacity-60">· {localeLabels[locale]}</span>
                </a>
              ))}
            </div>

            <p className="text-fg-subtle mt-14 font-mono text-[11px] tracking-[0.14em] uppercase">
              {person.name.en}
            </p>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
