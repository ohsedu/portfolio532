import type { Locale, LocalizedString } from "@/lib/i18n/config";

/* ────────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT — replace with your own.
 *
 *  Each project's *metadata* lives here; its long-form case study lives in
 *  `src/content/projects/<slug>.<locale>.mdx`. Set `caseStudy: false` and the
 *  card stops linking to a detail page.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Filter chips on the projects section, in display order. */
export const projectTags = [
  "web",
  "design-system",
  "performance",
  "data-viz",
  "open-source",
] as const;

export type ProjectTag = (typeof projectTags)[number];

export type Project = {
  slug: string;
  /** Product name — normally not translated. */
  title: string;
  tagline: LocalizedString;
  description: LocalizedString;
  year: number;
  role: LocalizedString;
  team: LocalizedString;
  stack: string[];
  tags: ProjectTag[];
  featured: boolean;
  /** Whether `src/content/projects/<slug>.<locale>.mdx` exists. */
  caseStudy: boolean;
  links: {
    live?: string;
    source?: string;
  };
  /**
   * Two hex stops for the card's gradient wash. Pick something adjacent to the
   * brand indigo so the grid still reads as one family.
   */
  accent: [string, string];
  /**
   * Optional cover image. Drop the file in `public/projects/` and reference it
   * as `/projects/<file>`. Leave `undefined` and the card renders a generated
   * gradient plate instead, which is why the site looks fine with no assets.
   */
  cover?: {
    src: string;
    width: number;
    height: number;
    alt: LocalizedString;
  };
};

export const projects: Project[] = [
  {
    slug: "atlas-design-system",
    title: "Atlas",
    tagline: {
      ko: "여섯 개 제품 팀이 함께 쓰는 디자인 시스템",
      en: "A design system six product teams share",
    },
    description: {
      ko: "40여 개 컴포넌트, 접근성 검증, 그리고 다크 모드를 처음부터 전제로 설계한 사내 디자인 시스템입니다. 토큰을 한 번 바꾸면 모든 제품에 반영됩니다.",
      en: "Forty-odd components with accessibility baked in and dark mode assumed from day one. Change a token once and every product picks it up.",
    },
    year: 2024,
    role: { ko: "설계 및 개발 리드", en: "Lead — architecture and build" },
    team: { ko: "4명", en: "4 people" },
    stack: ["TypeScript", "React", "Tailwind CSS", "Storybook", "Vitest"],
    tags: ["design-system", "web"],
    featured: true,
    caseStudy: true,
    links: { source: "https://github.com/sdoh" },
    accent: ["#4f46e5", "#7c3aed"],
  },
  {
    slug: "pulse-analytics",
    title: "Pulse",
    tagline: {
      ko: "1초 안에 첫 차트가 그려지는 분석 대시보드",
      en: "An analytics dashboard whose first chart lands in under a second",
    },
    description: {
      ko: "수백만 행의 이벤트를 다루면서도 즉각적으로 느껴지도록, 스트리밍 렌더링과 서버 집계를 조합해 재구축했습니다. LCP 4.1초에서 1.3초로 줄였습니다.",
      en: "Rebuilt around streaming rendering and server-side aggregation so millions of event rows still feel instant. LCP went from 4.1s to 1.3s.",
    },
    year: 2024,
    role: { ko: "프론트엔드 담당", en: "Frontend owner" },
    team: { ko: "6명", en: "6 people" },
    stack: ["Next.js", "React", "D3", "PostgreSQL", "Vercel"],
    tags: ["performance", "data-viz", "web"],
    featured: true,
    caseStudy: true,
    links: { live: "https://example.com" },
    accent: ["#4338ca", "#0ea5e9"],
  },
  {
    slug: "checkout-rebuild",
    title: "One-Step Checkout",
    tagline: {
      ko: "3단계 결제를 1단계로 줄인 이야기",
      en: "Collapsing a three-step checkout into one",
    },
    description: {
      ko: "월 300만 세션 규모 커머스의 결제 퍼널을 재설계했습니다. 폼 검증, 결제 수단, 에러 복구를 한 화면에서 처리하면서 모바일 전환율을 11% 개선했습니다.",
      en: "Redesigned the checkout funnel of a 3M-session-a-month store. Validation, payment methods and error recovery all on one screen, for an 11% lift in mobile conversion.",
    },
    year: 2022,
    role: { ko: "프론트엔드 개발", en: "Frontend engineer" },
    team: { ko: "8명", en: "8 people" },
    stack: ["React", "Redux", "Node.js", "Playwright"],
    tags: ["web", "performance"],
    featured: true,
    caseStudy: true,
    links: {},
    accent: ["#6366f1", "#db2777"],
  },
  {
    slug: "tokens-cli",
    title: "tokens-cli",
    tagline: {
      ko: "Figma 변수를 CSS 커스텀 프로퍼티로 내보내는 도구",
      en: "Ship Figma variables straight to CSS custom properties",
    },
    description: {
      ko: "디자이너가 Figma에서 토큰을 바꾸면 PR이 열립니다. 디자인 시스템 작업 중 반복되던 수작업을 없애려고 만들었고, 지금은 오픈소스로 공개했습니다.",
      en: "A designer changes a token in Figma and a pull request opens. Built to kill the manual step in our design-system loop, now open source.",
    },
    year: 2023,
    role: { ko: "개인 프로젝트", en: "Solo project" },
    team: { ko: "1명", en: "1 person" },
    stack: ["TypeScript", "Node.js", "Figma API", "GitHub Actions"],
    tags: ["open-source", "design-system"],
    featured: false,
    caseStudy: false,
    links: { source: "https://github.com/sdoh" },
    accent: ["#4f46e5", "#14b8a6"],
  },
  {
    slug: "signal-map",
    title: "Signal Map",
    tagline: {
      ko: "서울 지하철 혼잡도를 실시간으로 보는 지도",
      en: "A live map of how crowded the Seoul metro is",
    },
    description: {
      ko: "공개 API를 캔버스 기반 지도에 올린 주말 프로젝트입니다. 6만 개 좌표를 60fps로 그리기 위해 렌더링을 직접 관리했습니다.",
      en: "A weekend project putting an open API onto a canvas map. Rendering is hand-managed to hold 60fps across sixty thousand points.",
    },
    year: 2023,
    role: { ko: "개인 프로젝트", en: "Solo project" },
    team: { ko: "1명", en: "1 person" },
    stack: ["Canvas", "TypeScript", "Vite"],
    tags: ["data-viz", "performance"],
    featured: false,
    caseStudy: false,
    links: { live: "https://example.com", source: "https://github.com/sdoh" },
    accent: ["#7c3aed", "#f59e0b"],
  },
  {
    slug: "campaign-microsites",
    title: "Campaign Microsites",
    tagline: {
      ko: "18개 캠페인 사이트, 전부 Lighthouse 90점 이상",
      en: "Eighteen campaign sites, none below a Lighthouse 90",
    },
    description: {
      ko: "에이전시에서 2년간 납품한 브랜드 캠페인 사이트 모음입니다. 매번 새로 시작하지 않도록 공통 인터랙션 프리셋과 빌드 템플릿을 만들었습니다.",
      en: "Two years of agency brand campaigns. I built shared interaction presets and a build template so each one did not start from scratch.",
    },
    year: 2019,
    role: { ko: "웹 개발", en: "Web developer" },
    team: { ko: "3-5명", en: "3-5 people" },
    stack: ["JavaScript", "GSAP", "Three.js"],
    tags: ["web"],
    featured: false,
    caseStudy: false,
    links: {},
    accent: ["#4338ca", "#8b5cf6"],
  },
];

/* ── Derived helpers ─────────────────────────────────────────────────────── */

/** Newest first, then featured before the rest within the same year. */
export const projectsByRecency = [...projects].sort(
  (a, b) => b.year - a.year || Number(b.featured) - Number(a.featured),
);

export const featuredProjects = projectsByRecency.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Slugs that have a case study page, in display order. */
export const caseStudySlugs = projectsByRecency
  .filter((p) => p.caseStudy)
  .map((p) => p.slug);

/**
 * Previous/next links on a case study page, wrapping at the ends so the reader
 * never hits a dead stop.
 */
export function getProjectNeighbours(slug: string) {
  const list = projectsByRecency.filter((p) => p.caseStudy);
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}

/** Tags that at least one project actually uses, so no chip is ever empty. */
export function getUsedTags(): ProjectTag[] {
  return projectTags.filter((tag) => projects.some((p) => p.tags.includes(tag)));
}

/** Human label for a tag chip. */
export const projectTagLabels: Record<ProjectTag, LocalizedString> = {
  web: { ko: "웹", en: "Web" },
  "design-system": { ko: "디자인 시스템", en: "Design system" },
  performance: { ko: "성능", en: "Performance" },
  "data-viz": { ko: "데이터 시각화", en: "Data viz" },
  "open-source": { ko: "오픈소스", en: "Open source" },
};

/** `2024` → `2024` in en, `2024년` in ko. Small touch, reads much better. */
export function formatYear(year: number, locale: Locale): string {
  return locale === "ko" ? `${year}년` : String(year);
}
