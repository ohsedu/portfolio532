import { MapPin } from "lucide-react";

import { BrandIcon } from "@/components/icons/brand";
import { ContactForm } from "@/components/sections/contact-form";
import { CopyButton } from "@/components/ui/copy-button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { socials } from "@/lib/data/profile";
import { getDictionary, l, type Locale } from "@/lib/i18n";
import { contactEndpoint, person } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Matches the stat labels in the hero, so small type reads as one system. */
const termClasses =
  "label-xs text-fg-subtle";

/**
 * The closing section: the direct channel first, the form second.
 *
 * Someone who already knows what they want should not have to fill in a form to
 * reach an address they can copy, so the card leads and the form supports it.
 *
 * `contactEndpoint` is read here and passed down rather than imported by the
 * form, which keeps `site.ts` — and the non-public env vars it also reads — on
 * the server side of the boundary.
 */
export function Contact({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <Section id="contact" className="overflow-hidden">
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Dots rather than the hero's grid: quieter, and visibly the other end. */}
        <div className="bg-dots mask-fade-b absolute inset-0 opacity-50 dark:opacity-25" />
        <div className="bloom absolute -bottom-40 left-1/4 size-[32rem] opacity-50 dark:opacity-70" />
      </div>

      <SectionHeader
        label={dict.contact.label}
        heading={dict.contact.heading}
        lede={dict.contact.lede}
      />

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-14">
        {/* ── Direct channels ────────────────────────────────────────────── */}
        <Reveal className="lg:col-span-2">
          <div className="border-line bg-surface/70 ring-edge rounded-3xl border p-7 backdrop-blur-sm sm:p-8">
            {/* `address` is the element for "how to reach the author" — the
                browser default italic is the only reason for `not-italic`. */}
            <address className="not-italic">
              <dl>
                <dt className={termClasses}>{dict.contact.emailLabel}</dt>
                <dd className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <a
                    href={`mailto:${person.email}`}
                    className="text-fg hover:text-brand-accent focus-visible:outline-ring text-lg font-medium tracking-tight break-all transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xl"
                  >
                    {person.email}
                  </a>
                  <CopyButton value={person.email} />
                </dd>

                <dt className={cn(termClasses, "mt-7")}>
                  {dict.contact.locationLabel}
                </dt>
                <dd className="text-fg-muted mt-2.5 flex items-center gap-2 text-sm">
                  <MapPin className="text-fg-subtle size-4 shrink-0" aria-hidden />
                  {l(person.location, locale)}
                </dd>
              </dl>
            </address>

            <h3 className={cn(termClasses, "border-line mt-8 border-t pt-7")}>
              {dict.contact.socialsLabel}
            </h3>
            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border-line bg-surface text-fg-muted hover:text-brand-accent hover:border-brand/40 hover:bg-surface-hover focus-visible:outline-ring grid size-11 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {/* `title` is the link's only accessible name. */}
                    <BrandIcon
                      name={social.icon}
                      title={social.label}
                      className="size-[1.05rem]"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* ── Form ───────────────────────────────────────────────────────── */}
        <Reveal delay={0.1} className="lg:col-span-3">
          <ContactForm endpoint={contactEndpoint} recipient={person.email} />
        </Reveal>
      </div>
    </Section>
  );
}
