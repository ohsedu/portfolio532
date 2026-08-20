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

type ThemeValue = (typeof options)[number]["value"];

/**
 * Three-state segmented control: light / dark / follow the OS.
 *
 * Until hydration the control renders with nothing selected rather than
 * returning `null`, which would shift the header layout on mount.
 */
export function ThemeToggle({
  className,
  /**
   * Render each option's name next to its icon.
   *
   * Used in the mobile drawer. The icon-only control leans on `title` to
   * explain itself, and a touch device has no hover to show one — so on the
   * surface that is only ever touched, the labels are visible instead.
   */
  labelled = false,
}: {
  className?: string;
  labelled?: boolean;
}) {
  const dict = useDictionary();
  const { theme, setTheme, resolvedTheme } = useTheme();

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

  const labels: Record<ThemeValue, string> = {
    light: dict.theme.light,
    dark: dict.theme.dark,
    system: dict.theme.system,
  };

  /**
   * The accessible name, and the tooltip.
   *
   * "System" is the one option whose effect can be invisible: on a machine set
   * to light it paints exactly what "Light" paints, so an icon on its own gives
   * the user no way to tell the two apart — the button reads as broken. This
   * says what it tracks, and names the theme the OS is reporting right now, so
   * pressing it has a stated consequence either way.
   */
  function describe(value: ThemeValue) {
    if (value !== "system") return labels[value];

    const hint = `${labels.system} · ${dict.theme.systemHint}`;
    if (!mounted) return hint;

    const now = resolvedTheme === "dark" ? labels.dark : labels.light;
    return `${hint} — ${now}`;
  }

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
        const description = describe(value);
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={description}
            title={description}
            onClick={() => setTheme(value)}
            className={cn(
              "focus-visible:outline-ring relative flex h-7 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              labelled ? "gap-1.5 px-2.5 text-xs font-medium" : "w-7",
              active
                ? "bg-brand text-brand-fg"
                : "text-fg-subtle hover:text-fg hover:bg-surface-hover",
            )}
          >
            <Icon className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
            {labelled ? <span aria-hidden>{labels[value]}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
