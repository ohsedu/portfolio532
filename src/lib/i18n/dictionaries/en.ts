/**
 * English UI strings. This file is the source of truth for the dictionary
 * shape — every other locale must satisfy `Dictionary`.
 *
 * Only *chrome* lives here (nav labels, buttons, headings). Résumé content
 * (jobs, projects, bio) lives in `src/lib/data/*` as `{ ko, en }` pairs so the
 * two languages stay side by side while you edit.
 */
export const en = {
  meta: {
    /** Job title. Composed with the name from `site.ts` to build page titles. */
    role: "Frontend Engineer",
    description:
      "Frontend engineer building fast, accessible interfaces with React, TypeScript and Next.js. Selected work, writing and experience.",
    keywords: [
      "frontend engineer",
      "React",
      "TypeScript",
      "Next.js",
      "portfolio",
      "web performance",
      "accessibility",
    ],
  },

  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
  },

  theme: {
    toggle: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    /* Composed as "System · Follows your OS setting — Dark". */
    systemHint: "Follows your OS setting",
  },

  locale: {
    switch: "Change language",
  },

  hero: {
    eyebrow: "Available for new work",
    headlinePrefix: "I build interfaces that feel",
    /** Cycled through, one word at a time, in the headline. */
    headlineWords: ["instant", "obvious", "accessible", "considered"],
    lede:
      "Frontend engineer with a bias for performance and detail. I turn ambiguous product ideas into shipped, measurable interfaces.",
    ctaPrimary: "View my work",
    ctaSecondary: "Get in touch",
    scrollHint: "Scroll",
    stats: {
      years: "Years shipping",
      projects: "Projects delivered",
      commits: "Commits last year",
    },
  },

  about: {
    label: "About",
    heading: "A short version",
    readMore: "Read more",
    readLess: "Read less",
    factsHeading: "At a glance",
    facts: {
      location: "Location",
      role: "Role",
      focus: "Current focus",
      languages: "Languages",
    },
  },

  skills: {
    label: "Skills",
    heading: "What I work with",
    lede:
      "The tools I reach for by default, grouped by where they sit in the stack.",
    levelLabel: "Comfort",
    /** Accessible name for the decorative skill ticker. */
    tickerLabel: "Everything I work with, as a scrolling list",
    levels: {
      1: "Learning",
      2: "Working knowledge",
      3: "Comfortable",
      4: "Strong",
      5: "Deep",
    },
  },

  projects: {
    label: "Projects",
    heading: "Selected work",
    lede:
      "A few things I have built end to end. Each one has a write-up on the decisions and trade-offs.",
    all: "All",
    featured: "Featured",
    viewCase: "Read the case study",
    viewLive: "Live site",
    viewSource: "Source",
    empty: "Nothing matches that filter yet.",
    backToProjects: "All projects",
    indexHeading: "Every project",
    indexLede: "The full list, newest first.",
    metaRole: "Role",
    metaYear: "Year",
    metaStack: "Stack",
    metaTeam: "Team",
    nextProject: "Next project",
    prevProject: "Previous project",
    tableOfContents: "On this page",
  },

  experience: {
    label: "Experience",
    heading: "Where I have worked",
    lede: "Roles, in reverse order.",
    present: "Present",
    highlightsLabel: "Highlights",
    stackLabel: "Technologies used",
    downloadResume: "Download résumé",
  },

  contact: {
    label: "Contact",
    heading: "Let's build something",
    lede:
      "Open to full-time roles, contract work and interesting conversations. I reply to everything.",
    emailLabel: "Email",
    locationLabel: "Based in",
    copyEmail: "Copy email address",
    copied: "Copied",
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.com",
      message: "Message",
      messagePlaceholder: "Tell me what you are working on…",
      submit: "Send message",
      submitting: "Sending…",
      success: "Thanks — I'll get back to you shortly.",
      error: "Something went wrong. Email me directly instead?",
      required: "This field is required",
      invalidEmail: "That does not look like an email address",
      /** Shown when no form endpoint is configured, so the form falls back to mailto:. */
      mailtoFallback: "Opens in your email client",
    },
    socialsLabel: "Elsewhere",
  },

  footer: {
    builtWith: "Built with Next.js and Tailwind CSS",
    rights: "All rights reserved",
    backToTop: "Back to top",
    sourceCode: "Source code",
  },

  notFound: {
    label: "404",
    heading: "This page does not exist",
    lede: "The link may be out of date, or the page may have moved.",
    cta: "Back home",
  },

  error: {
    heading: "Something broke",
    lede: "An unexpected error occurred. Trying again usually helps.",
    retry: "Try again",
  },
};

/** The shape every locale must implement. */
export type Dictionary = typeof en;
