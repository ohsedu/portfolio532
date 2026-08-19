import {
  BriefcaseBusiness,
  Compass,
  Languages,
  MapPin,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { bio, facts } from "@/lib/data/profile";
import { getDictionary, l, type Locale } from "@/lib/i18n";
import { person } from "@/lib/site";
import { AboutBio } from "./about-bio";

const factIconClass = "text-brand-accent mt-0.5 size-4 shrink-0";

/**
 * Prose on the left, an "At a glance" card on the right.
 *
 * Hero already spends the page's decoration budget, so this section stays quiet:
 * one bloom behind the card, and the card itself sits forward on `ring-edge`
 * rather than on another gradient.
 */
export function About({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  /* The two strongest paragraphs stay open; the tail is the toggle's job. */
  const [lead, second, ...tail] = bio.map((paragraph) => l(paragraph, locale));

  const factItems: { term: string; detail: string; icon: LucideIcon }[] = [
    {
      term: dict.about.facts.location,
      detail: l(person.location, locale),
      icon: MapPin,
    },
    {
      term: dict.about.facts.role,
      detail: dict.meta.role,
      icon: BriefcaseBusiness,
    },
    {
      term: dict.about.facts.focus,
      detail: l(facts.focus, locale),
      icon: Compass,
    },
    {
      term: dict.about.facts.languages,
      detail: l(facts.languages, locale),
      icon: Languages,
    },
  ];

  /*
   * The file is served as `/resume.pdf`, which is impossible to find again in a
   * downloads folder — `download` renames it to something identifiable.
   */
  return (
    <Section id="about">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="bloom absolute top-1/4 -right-24 size-[24rem] opacity-30 dark:opacity-50" />
      </div>

      <SectionHeader label={dict.about.label} heading={dict.about.heading} />

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* ── Bio ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <Reveal>
            {/* Slightly larger and at full contrast, so the eye starts here. */}
            <p className="max-w-2xl text-lg leading-relaxed sm:text-xl">
              {lead}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-fg-muted mt-6 max-w-2xl text-base leading-relaxed">
              {second}
            </p>
          </Reveal>

          {tail.length > 0 ? (
            <Reveal delay={0.16}>
              <AboutBio paragraphs={tail} className="max-w-2xl" />
            </Reveal>
          ) : null}
        </div>

        {/* ── At a glance ───────────────────────────────────────────────────── */}
        <Reveal from="left" delay={0.12} className="lg:col-span-5">
          <aside className="border-line bg-surface ring-edge overflow-hidden rounded-2xl border">
            <h3 className="border-line text-fg-subtle border-b px-6 py-4 font-mono text-[11px] tracking-[0.18em] uppercase">
              {dict.about.factsHeading}
            </h3>

            <dl className="divide-line divide-y">
              {factItems.map((fact) => (
                <div key={fact.term} className="flex gap-4 px-6 py-5">
                  <fact.icon aria-hidden className={factIconClass} />
                  {/* `min-w-0` lets long Korean values wrap instead of pushing
                      the icon out of the card. */}
                  <div className="min-w-0">
                    <dt className="text-fg-subtle font-mono text-[10.5px] tracking-[0.14em] uppercase">
                      {fact.term}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed">
                      {fact.detail}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
