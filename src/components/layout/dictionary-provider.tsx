"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Dictionary, Locale } from "@/lib/i18n";

type DictionaryValue = {
  dict: Dictionary;
  locale: Locale;
};

const DictionaryContext = createContext<DictionaryValue | null>(null);

/**
 * Hands the active dictionary to Client Components.
 *
 * The alternative — importing both dictionaries in each client component and
 * picking one — ships the strings for every locale to every visitor. This way
 * the `[locale]` layout serializes one dictionary into the payload, once.
 */
export function DictionaryProvider({
  dict,
  locale,
  children,
}: DictionaryValue & { children: ReactNode }) {
  return (
    <DictionaryContext.Provider value={{ dict, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

function useDictionaryContext(): DictionaryValue {
  const value = useContext(DictionaryContext);
  if (!value) {
    throw new Error(
      "useDictionary must be used inside <DictionaryProvider>. Wrap the tree in the [locale] layout.",
    );
  }
  return value;
}

export function useDictionary(): Dictionary {
  return useDictionaryContext().dict;
}

export function useLocale(): Locale {
  return useDictionaryContext().locale;
}
