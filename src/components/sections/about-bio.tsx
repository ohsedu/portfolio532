"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { useDictionary } from "@/components/layout/dictionary-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The collapsed tail of the bio, plus the control that opens it.
 *
 * This toggle is the only interactive thing in About, so it is the only part
 * that crosses into the client. The paragraphs arrive already resolved to one
 * language, which keeps the other locale's prose out of the bundle.
 */
export function AboutBio({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  const dict = useDictionary();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div className={className}>
      {/*
        The paragraphs stay mounted whether or not the panel is open, so they are
        present in the prerendered HTML — a crawler and a reader with no
        JavaScript both still get the full bio. Collapsing is done with height
        rather than by unmounting, and the `<noscript>` rule in the root layout
        forces `[data-collapsible]` back open when the toggle can never run.

        `inert` while closed keeps the hidden prose out of the accessibility tree
        and out of the tab order, which `height: 0` alone would not do.
      */}
      <motion.div
        id={regionId}
        data-collapsible=""
        className="overflow-hidden"
        inert={!open}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        /*
         * Opacity finishes first and the box keeps easing open, so the text
         * never looks like it is outrunning the space it lands in. Reduced
         * motion collapses both to an instant swap rather than a fade, because
         * the fade is the effect being opted out of.
         */
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.28, ease: "linear" },
              }
        }
      >
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-fg-muted mt-6 text-base leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* The negative margin pulls the ghost button's padding back so its label
          sits on the same optical line as the prose above it. */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={regionId}
        className="label-xs mt-6 -ml-4"
      >
        {open ? dict.about.readLess : dict.about.readMore}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 transition-transform duration-300",
            open && "-rotate-180",
          )}
        />
      </Button>
    </div>
  );
}
