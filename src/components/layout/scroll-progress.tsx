"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Hairline reading-progress bar pinned under the header.
 *
 * `useSpring` smooths the raw scroll value so fast flicks do not make the bar
 * snap; `transform-origin: 0` keeps it growing from the left edge.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduceMotion ? scrollYProgress : smoothed }}
      className="from-brand-600 via-brand-400 to-brand-600 fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r"
    />
  );
}
