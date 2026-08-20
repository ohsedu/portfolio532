import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_KR } from "next/font/google";
import { notFound } from "next/navigation";

import { DictionaryProvider } from "@/components/layout/dictionary-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { getDictionary, hasLocale, localeHtmlLang, locales } from "@/lib/i18n";
import { buildMetadata, notFoundMetadata, personJsonLd } from "@/lib/metadata";
import { person, siteUrl } from "@/lib/site";

import "../globals.css";

/*
 * This is the ROOT layout: it renders <html> and <body>.
 *
 * There is deliberately no `src/app/layout.tsx`. In Next 16 a top-level dynamic
 * segment only becomes a "root param" — readable via `next/root-params`, and
 * prerenderable per value — when no layout sits above it. Adding a layout at
 * `src/app/` would silently take that away.
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

/*
 * The Korean face. Inter and JetBrains Mono are Latin-only, so without this
 * every Hangul character on the page was resolved by the OS — Malgun Gothic at
 * best, 굴림체 wherever the stack ended at generic `monospace`.
 *
 * No `subsets`, and `preload: false` to go with it. Google serves CJK families
 * as ~100 numbered `unicode-range` slices rather than the named subsets
 * next/font wants, so there is nothing to name; with preloading off, next/font
 * keeps all of the slices and the browser downloads only the two or three the
 * page's Hangul actually lands in. Preloading them all would be ~1MB of font for
 * a page that uses a few hundred syllables.
 */
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

/**
 * Prerenders `/ko` and `/en` at build time. Without this the locale segment
 * falls back to rendering on demand.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Rejects any locale outside `generateStaticParams` at the ROUTER, before
 * anything renders, so the request falls through to `global-not-found.tsx`.
 *
 * This is what makes the 404 story consistent. `notFound()` raised from a page
 * in this app cannot produce a good 404: with no root layout above `[locale]`
 * there is no boundary for it to land in, so the document shell degrades to
 * Next's built-in error page even when `not-found.tsx` renders inside it.
 * Refusing the route instead means every 404 — unknown locale, unknown slug,
 * unmatched URL — is served by the same styled bilingual page.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  /* Not `notFound()` — see the note on `notFoundMetadata`. */
  if (!hasLocale(locale)) return notFoundMetadata();

  return {
    /*
     * Required once any metadata field uses a relative URL, which all of ours
     * do — it is what lets the same code resolve correctly on localhost, on a
     * Vercel preview URL and in production.
     */
    metadataBase: new URL(siteUrl),
    /*
     * No `title.template` on purpose — `buildMetadata` already composes the
     * full "Page · Name" string, and a template would append the name twice.
     */
    ...buildMetadata({ locale }),
    authors: [{ name: person.name[locale], url: `${siteUrl}/${locale}` }],
    creator: person.name[locale],
    formatDetection: { telephone: false, address: false, email: false },
  };
}

/**
 * `themeColor` and `colorScheme` belong here, not in `metadata` — they have been
 * deprecated on the metadata object since Next 14 and are ignored there.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08080f" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html
      lang={localeHtmlLang[locale]}
      /*
       * next-themes writes `class` on <html> from a blocking inline script
       * before React hydrates, which is what prevents the light-mode flash.
       * React must be told not to complain about the resulting mismatch.
       */
      suppressHydrationWarning
      /*
       * globals.css sets `scroll-behavior: smooth`. Next 16 no longer overrides
       * that for router navigations unless this attribute is present, and
       * without it every route change animates a long smooth scroll.
       */
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansKr.variable}`}
    >
      <body className="bg-bg text-fg min-h-dvh antialiased">
        <ThemeProvider>
          <DictionaryProvider dict={dict} locale={locale}>
            {/*
              Reveal animations start at opacity 0 and collapsibles start at
              height 0. Neither ever animates open without JavaScript, so both
              are forced to their finished state in that case — the content is
              already in the HTML, it just needs to be visible.
            */}
            <noscript>
              <style>{`[data-reveal]{opacity:1 !important;transform:none !important;filter:none !important}[data-collapsible]{height:auto !important;opacity:1 !important}`}</style>
            </noscript>

            <a
              href="#main"
              className="bg-brand text-brand-fg focus-visible:outline-ring sr-only rounded-full px-4 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {dict.nav.skipToContent}
            </a>

            <ScrollProgress />
            <Header />

            <div id="top" />
            <main id="main" className="pt-16">
              {children}
            </main>

            <Footer locale={locale} />
          </DictionaryProvider>
        </ThemeProvider>

        <script
          type="application/ld+json"
          /*
           * JSON.stringify output is inserted as-is. It contains no user input —
           * only the constants in `src/lib/site.ts` and `src/lib/data` — so
           * there is nothing here for a visitor to inject.
           */
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd(locale)),
          }}
        />
      </body>
    </html>
  );
}
