"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * `next-themes` inlines a blocking script that sets `<html class>` before paint,
 * which is what stops the light-mode flash on a dark-mode reload. The `<html>`
 * element it mutates needs `suppressHydrationWarning` — see the root layout.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
