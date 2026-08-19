import { NextResponse, type NextRequest } from "next/server";

import {
  hasLocale,
  negotiateLocale,
  type Locale,
} from "@/lib/i18n/config";

/**
 * Locale routing for the bare `/` URL and any path missing a locale prefix.
 *
 * Next 16 renamed `middleware.ts` to `proxy.ts` and the exported function to
 * `proxy`; a function still named `middleware` in this file throws E394 at
 * request time, and having both files fails the build with E900.
 *
 * Only this redirect is request-time (`ƒ`). Every real page still prerenders to
 * static HTML, because nothing here runs for `/ko/*` or `/en/*`.
 *
 * Do not add `export const runtime` — proxy is always the Node.js runtime in
 * v16 and configuring it throws.
 */

/**
 * Paths served by the framework or by a `src/app`-level metadata route, none of
 * which should ever be prefixed with a locale.
 */
const PASSTHROUGH_PREFIXES = ["/_next", "/api"];

/**
 * Root-level metadata routes.
 *
 * These live at `src/app/*` rather than under `[locale]`, so they must never be
 * given a locale prefix. `/icon` and `/apple-icon` matter especially: Next serves
 * them as `/icon?<hash>` with no file extension, so the extension test below
 * does not catch them and without this list the favicon 307s into `/en/icon`.
 *
 * Add an entry here whenever a new metadata file is added at `src/app/` — e.g. a
 * site-wide `opengraph-image.tsx` would need `/opengraph-image`.
 */
const PASSTHROUGH_EXACT = new Set([
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon",
  "/apple-icon",
]);

function shouldSkip(pathname: string): boolean {
  if (PASSTHROUGH_EXACT.has(pathname)) return true;
  if (PASSTHROUGH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  // Anything with a file extension is a static asset from `public/`.
  return /\.[^/]+$/.test(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * The matcher below already excludes these, but the guard is repeated here on
   * purpose: proxy still runs for `/_next/data/*` regardless of the matcher, and
   * a future matcher edit should not be able to start redirecting assets.
   */
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) {
    return NextResponse.next();
  }

  const locale: Locale = negotiateLocale(
    request.headers.get("accept-language"),
  );

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  /*
   * 307, never 308/301: the target is derived from this visitor's
   * `Accept-Language`, so a permanent redirect would pin one language into
   * browser and CDN caches for everyone. `Vary` tells shared caches the same.
   *
   * A rewrite is deliberately not used — the docs warn it causes
   * `usePathname()` hydration mismatches on prerendered pages.
   */
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  /*
   * Must be a statically analyzable literal — a matcher built from variables is
   * silently ignored.
   */
  matcher: [
    "/",
    "/((?!_next/|api/|.*\\.).*)",
  ],
};
