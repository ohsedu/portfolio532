"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDictionary, useLocale } from "@/components/layout/dictionary-provider";
import {
  locales,
  localeLabels,
  localeShortLabels,
  splitLocaleFromPath,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Swaps the locale segment of the current path, keeping the reader where they
 * are instead of dumping them back on the home page.
 *
 * Rendered as real `<Link>`s rather than a router push, so the alternate
 * language is a crawlable, middle-clickable URL. `usePathname` is read on the
 * client because a layout cannot see the pathname — it does not re-render on
 * navigation.
 */
export function LocaleToggle({ className }: { className?: string }) {
  const dict = useDictionary();
  const active = useLocale();
  const pathname = usePathname();

  const { rest } = splitLocaleFromPath(pathname);

  return (
    <div
      aria-label={dict.locale.switch}
      className={cn(
        "border-line bg-surface inline-flex items-center gap-0.5 rounded-full border p-0.5",
        className,
      )}
    >
      {locales.map((locale) => {
        const isActive = locale === active;
        const href = rest === "/" ? `/${locale}` : `/${locale}${rest}`;

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            title={localeLabels[locale]}
            className={cn(
              "focus-visible:outline-ring grid h-7 min-w-8 place-items-center rounded-full px-2 font-mono text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              isActive
                ? "bg-brand text-brand-fg"
                : "text-fg-subtle hover:text-fg hover:bg-surface-hover",
            )}
          >
            {localeShortLabels[locale]}
            <span className="sr-only"> — {localeLabels[locale]}</span>
          </Link>
        );
      })}
    </div>
  );
}
