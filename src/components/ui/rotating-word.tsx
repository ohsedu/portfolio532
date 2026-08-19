"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Cycles through `words` in place.
 *
 * The word is absolutely positioned over a sizing element that holds the
 * *longest* word, so the headline never reflows as the text changes — a
 * relative-width version makes the whole line jump on every swap.
 */
export function RotatingWord({
  words,
  className,
  intervalMs = 2600,
}: {
  words: string[];
  className?: string;
  intervalMs?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [reduceMotion, words.length, intervalMs]);

  const longest = words.reduce(
    (best, word) => (word.length > best.length ? word : best),
    words[0] ?? "",
  );

  if (reduceMotion) {
    return <span className={cn("text-brand-accent", className)}>{words[0]}</span>;
  }

  return (
    <span className="relative inline-grid align-bottom">
      {/* Reserves the width of the longest option and nothing else. */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {longest}
      </span>

      <span className="col-start-1 row-start-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={{ opacity: 0, y: "0.35em", filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "-0.35em", filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={cn("text-brand-accent inline-block", className)}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
