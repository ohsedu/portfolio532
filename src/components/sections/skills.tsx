import { Gauge, LayoutTemplate, Palette, Server, Wrench, type LucideIcon } from "lucide-react";

import { Marquee } from "@/components/ui/marquee";
import { RevealItem, RevealList } from "@/components/ui/reveal";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { Spotlight } from "@/components/ui/spotlight";
import {
  skillGroups,
  type SkillGroupIconName,
  type SkillLevel,
} from "@/lib/data/profile";
import { getDictionary, l, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Static map instead of indexing the `lucide-react` namespace by string: this
 * way the union in `SkillGroupIconName` is checked at build time, and the
 * bundler can tree-shake the 1765 icons we do not use.
 */
const groupIcons: Record<SkillGroupIconName, LucideIcon> = {
  layout: LayoutTemplate,
  palette: Palette,
  server: Server,
  gauge: Gauge,
  wrench: Wrench,
};

const levelSteps = [1, 2, 3, 4, 5] as const;

/**
 * Five ticks, `level` of them filled.
 *
 * Purely decorative — colour is never the only channel, so every caller pairs
 * this with the matching `dict.skills.levels[…]` string as real text.
 */
function LevelTicks({ level, className }: { level: SkillLevel; className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-end gap-[3px]", className)}>
      {levelSteps.map((step) => (
        <span
          key={step}
          className={cn(
            "w-[3px] rounded-full",
            /*
             * Unfilled ticks are shorter as well as dimmer, so the level reads
             * as a shape in a screenshot or on a mono display. They use
             * `fg-subtle` rather than `line-strong`: a tick that carries meaning
             * has to clear 3:1 against the card (WCAG 2.2 SC 1.4.11), and the
             * border tokens sit nearer 1.4:1.
             */
            step <= level
              ? "bg-brand-accent h-3.5"
              : "bg-fg-subtle h-2",
          )}
        />
      ))}
    </span>
  );
}

/**
 * Skills, grouped by where they sit in the stack.
 *
 * The section is `bleed` so the closing ticker can run edge to edge; everything
 * that should stay on the grid gets its own `Container`.
 */
export function Skills({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  /* The ticker repeats what the cards already say, so it exists only as texture.
   * Names are prefixed with their group id because two groups may legitimately
   * list the same tool one day. */
  const tickerItems = skillGroups.flatMap((group) =>
    group.skills.map((skill) => ({ key: `${group.id}-${skill.name}`, name: skill.name })),
  );

  return (
    <Section id="skills" bleed>
      <Container>
        <SectionHeader
          label={dict.skills.label}
          heading={dict.skills.heading}
          lede={dict.skills.lede}
        >
          {/* Legend for the tick marks — without it the indicator is a shape
              with no stated scale. */}
          <div className="border-line bg-surface/60 ring-edge rounded-2xl border px-5 py-4">
            <p className="text-fg-subtle font-mono text-[10.5px] tracking-[0.14em] uppercase">
              {dict.skills.levelLabel}
            </p>
            {/* Both ends of the ramp are drawn, so the mapping from tick count
                to label is shown rather than asserted. */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs">
              <LevelTicks level={1} />
              <span className="text-fg-muted">{dict.skills.levels[1]}</span>
              <span aria-hidden className="text-fg-subtle">
                &rarr;
              </span>
              <LevelTicks level={5} />
              <span className="text-fg-muted">{dict.skills.levels[5]}</span>
            </div>
          </div>
        </SectionHeader>

        <RevealList className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = groupIcons[group.icon];

            return (
              <RevealItem key={group.id}>
                <Spotlight className="border-line bg-surface/70 hover:border-line-strong ring-edge h-full rounded-2xl border p-6 transition-colors sm:p-7">
                  <div className="flex items-center gap-3.5">
                    <span className="border-line bg-bg-subtle text-brand-accent grid size-10 shrink-0 place-items-center rounded-xl border">
                      <Icon className="size-[1.1rem]" aria-hidden />
                    </span>
                    <h3 className="text-[15px] leading-snug font-semibold tracking-tight sm:text-base">
                      {l(group.label, locale)}
                    </h3>
                  </div>

                  {/* Name/level really are pairs, so `dl` beats a list of rows. */}
                  <dl className="divide-line mt-6 divide-y">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between gap-4 py-2.5"
                      >
                        <dt className="text-fg-muted font-mono text-[13px]">
                          {skill.name}
                        </dt>
                        <dd className="shrink-0">
                          <span className="sr-only">
                            {dict.skills.levelLabel}: {dict.skills.levels[skill.level]}
                          </span>
                          <LevelTicks level={skill.level} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Spotlight>
              </RevealItem>
            );
          })}
        </RevealList>
      </Container>

      {/* ── Closing ticker ───────────────────────────────────────────────── */}
      <Marquee
        /* The names are already readable in the cards above, so the label names
           the row rather than announcing all 26 of them a second time. */
        label={dict.skills.tickerLabel}
        duration={55}
        className="border-line mask-fade-x mt-20 border-y py-5 sm:mt-28"
      >
        {tickerItems.map((item) => (
          <span key={item.key} className="flex items-center">
            <span className="text-fg-subtle px-5 font-mono text-sm whitespace-nowrap sm:text-base">
              {item.name}
            </span>
            <span className="bg-brand/40 size-1 shrink-0 rounded-full" />
          </span>
        ))}
      </Marquee>
    </Section>
  );
}
