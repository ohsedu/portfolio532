"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { useDictionary } from "@/components/layout/dictionary-provider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

/**
 * Error boundary for everything under `[locale]`.
 *
 * It sits below the locale layout, so `DictionaryProvider` is still mounted when
 * this renders and the copy can be localized — an error boundary at the root
 * would have no provider above it and would be stuck with one language.
 *
 * Every page here is static, so in practice this catches client-side faults
 * (a failed hydration, a throw inside an interaction) rather than server errors.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dict = useDictionary();

  useEffect(() => {
    /*
     * The place to forward this to Sentry or similar. Left as a console call
     * rather than silence, so a fault is at least visible in a bug report.
     */
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {dict.error.heading}
      </h1>

      <p className="text-fg-muted mt-3 max-w-sm text-sm leading-relaxed">
        {dict.error.lede}
      </p>

      <Button onClick={reset} className="mt-8">
        <RotateCcw className="size-4" aria-hidden />
        {dict.error.retry}
      </Button>

      {/*
        The digest is the only handle on a production error whose message React
        has stripped, so it is worth showing — quietly.
      */}
      {error.digest ? (
        <p className="text-fg-subtle mt-6 font-mono text-[11px]">
          {error.digest}
        </p>
      ) : null}
    </Container>
  );
}
