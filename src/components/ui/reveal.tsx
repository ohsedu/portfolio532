"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

export type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before starting. Use for manual staggers. */
  delay?: number;
  duration?: number;
  from?: Direction;
  /** How much of the element must be visible before it animates, 0–1. */
  amount?: number;
  /** Animate every time it scrolls into view instead of only the first time. */
  repeat?: boolean;
};

/**
 * Fades content in as it scrolls into view.
 *
 * Two fallbacks matter here, because the animation starts at `opacity: 0`:
 *   - `prefers-reduced-motion` renders the children with no motion wrapper at
 *     all, so there is no chance of them being left invisible.
 *   - `data-reveal` lets the `<noscript>` block in the layout force everything
 *     visible when JavaScript never runs.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  from = "up",
  amount = 0.25,
  repeat = false,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const { x, y } = offsets[from];

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

const listVariants: Variants = {
  hidden: {},
  shown: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Staggers its direct `RevealItem` children. Prefer this over hand-computing a
 * `delay` for each item — the timing stays right when the list length changes.
 */
export function RevealList({
  children,
  className,
  amount = 0.15,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={{
        ...listVariants,
        shown: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div data-reveal="" className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/**
 * Splits a string into words and floats them up one by one. Used once, on the
 * hero headline — it is deliberately expensive-looking, so do not scatter it.
 */
export function RevealWords({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      data-reveal=""
      className={cn("inline", className)}
      initial="hidden"
      animate="shown"
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: 0.05, delayChildren: delay } },
      }}
    >
      {/*
        The per-word spans are hidden from assistive tech and the real string is
        exposed once, as text. `aria-label` on a plain <span> is not reliably
        announced, so this is the safer of the two options.
      */}
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={cn("inline-block", wordClassName)}
          variants={{
            hidden: { opacity: 0, y: "0.4em", filter: "blur(6px)" },
            shown: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          aria-hidden
        >
          {word}
          {index < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </motion.span>
  );
}
