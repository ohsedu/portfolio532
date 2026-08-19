import { en } from "./dictionaries/en";
import { ko } from "./dictionaries/ko";
import type { Locale } from "./config";

export type { Dictionary } from "./dictionaries/en";
export * from "./config";

const dictionaries = { en, ko } as const;

/**
 * Dictionaries are plain modules rather than dynamic `import()`s: the whole
 * site is prerendered at build time, so there is no request-time cost to pay,
 * and this keeps `getDictionary` synchronous and usable from anywhere.
 */
export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
