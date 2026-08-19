"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDictionary } from "@/components/layout/dictionary-provider";
import { cn } from "@/lib/utils";

/**
 * Copies `value` to the clipboard and confirms it inline.
 *
 * `navigator.clipboard` needs a secure context, so there is a `document.execCommand`
 * fallback for plain-HTTP previews. The confirmation timer is cleared on unmount
 * to avoid setting state on a gone component.
 */
export function CopyButton({
  value,
  className,
  label,
}: {
  value: string;
  className?: string;
  /** Accessible name. Falls back to the dictionary's "copy email" string. */
  label?: string;
}) {
  const dict = useDictionary();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked by the browser — leave the UI unchanged rather than
      // claiming a copy that did not happen.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ?? dict.contact.copyEmail}
      className={cn(
        "text-fg-subtle hover:text-brand-accent focus-visible:outline-ring inline-flex items-center gap-1.5 rounded-md text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="text-brand-accent size-3.5" aria-hidden />
          <span className="text-brand-accent">{dict.contact.copied}</span>
        </>
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {/* Announce the change without moving focus. */}
      <span aria-live="polite" className="sr-only">
        {copied ? dict.contact.copied : ""}
      </span>
    </button>
  );
}
