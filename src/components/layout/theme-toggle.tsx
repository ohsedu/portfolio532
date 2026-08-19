"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { useDictionary } from "@/components/layout/dictionary-provider";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
  { value: "system", Icon: Monitor },
] as const;

/**
 * Three-state segmented control: light / dark / follow the OS.
 *
 * Until hydration the control renders with nothing selected rather than
 * returning `null`, which would shift the header layout on mount.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const dict = useDictionary();
  const { theme, setTheme } = useTheme();

  /*
   * `theme` is unknowable on the server, so the control renders unselected until
   * hydration. `useSyncExternalStore` expresses that with no subscription and
   * two constant snapshots — false on the server, true on the client — which
   * beats a mount effect that would setState on every first render.
   */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const labels: Record<(typeof options)[number]["value"], string> = {
    light: dict.theme.light,
    dark: dict.theme.dark,
    system: dict.theme.system,
  };

  return (
    <div
      role="radiogroup"
      aria-label={dict.theme.toggle}
      className={cn(
        "border-line bg-surface relative inline-flex items-center gap-0.5 rounded-full border p-0.5",
        className,
      )}
    >
      {options.map(({ value, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={labels[value]}
            title={labels[value]}
            onClick={() => setTheme(value)}
            className={cn(
              "focus-visible:outline-ring relative grid size-7 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              active
                ? "bg-brand text-brand-fg"
                : "text-fg-subtle hover:text-fg hover:bg-surface-hover",
            )}
          >
            <Icon className="size-3.5" strokeWidth={2} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
