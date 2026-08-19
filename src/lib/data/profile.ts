import type { LocalizedString } from "@/lib/i18n/config";
import type { BrandIconName } from "@/components/icons/brand";

/* ────────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT — replace with your own.
 *  The shapes are what the components rely on; the values are examples.
 * ──────────────────────────────────────────────────────────────────────────── */

/* ── Socials ─────────────────────────────────────────────────────────────── */

export type Social = {
  id: string;
  label: string;
  href: string;
  icon: BrandIconName;
};

export const socials: Social[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/ohsedu",
    icon: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sdoh",
    icon: "linkedin",
  },
  { id: "x", label: "X", href: "https://x.com/sdoh", icon: "x" },
  { id: "velog", label: "Velog", href: "https://velog.io/@sdoh", icon: "rss" },
];

/* ── About ───────────────────────────────────────────────────────────────── */

/**
 * Bio paragraphs. The first two are always visible; the rest are revealed by
 * the "Read more" toggle, so put the strongest material first.
 */
export const bio: LocalizedString[] = [
  {
    ko: "안녕하세요, 사용자가 기다리지 않는 웹을 만드는 데 관심이 많은 프론트엔드 엔지니어입니다. 6년 동안 커머스와 데이터 플랫폼을 오가며, 디자인 시스템을 세우고 렌더링 성능을 다듬는 일을 주로 해왔습니다.",
    en: "I am a frontend engineer who cares most about the web not making people wait. Over six years across commerce and data platforms I have mostly been the person building the design system and sanding down the rendering performance.",
  },
  {
    ko: "기획이 아직 흐릿한 단계에서 합류해 프로토타입으로 논의를 정리하고, 그대로 프로덕션까지 끌고 가는 방식을 좋아합니다. 화면 하나를 만들 때도 로딩 상태, 빈 상태, 에러 상태, 키보드 동작까지 같이 설계합니다.",
    en: "I like joining while the spec is still blurry, settling the argument with a prototype, then carrying that same prototype through to production. When I build a screen I design its loading, empty, error and keyboard states in the same pass.",
  },
  {
    ko: "최근에는 React Server Components와 스트리밍 렌더링을 실제 트래픽에서 어떻게 써야 이득인지 실험하고 있습니다. 번들 크기를 줄이는 것보다 무엇을 언제 보여줄지 정하는 게 체감 성능에 훨씬 크게 작용한다는 걸 배웠습니다.",
    en: "Lately I have been working out where React Server Components and streaming actually pay off under real traffic. The lesson so far: deciding what to show when moves perceived performance far more than shaving the bundle does.",
  },
  {
    ko: "일 밖에서는 필름 카메라로 도시의 간판을 찍고, 사둔 기계식 키보드를 계속 분해합니다. 오픈소스에는 문서 오타 수정부터 시작해 조금씩 기여하고 있습니다.",
    en: "Outside work I photograph shop signage on film and keep taking apart mechanical keyboards I already own. I contribute to open source in small doses, having started with documentation typos.",
  },
];

/** Short key/value pairs shown in the "At a glance" card. */
export const facts = {
  focus: {
    ko: "React Server Components, Core Web Vitals, 디자인 시스템",
    en: "React Server Components, Core Web Vitals, design systems",
  } satisfies LocalizedString,
  languages: {
    ko: "한국어(모국어), 영어(업무 가능)",
    en: "Korean (native), English (professional)",
  } satisfies LocalizedString,
};

/** Numbers in the hero. Keep these honest — they are the first thing read. */
export const stats = {
  years: 6,
  projects: 24,
  commits: 1840,
};

/* ── Skills ──────────────────────────────────────────────────────────────── */

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type Skill = {
  name: string;
  level: SkillLevel;
};

/** Keys map to an icon in the `Skills` section. */
export type SkillGroupIconName =
  | "layout"
  | "server"
  | "palette"
  | "wrench"
  | "gauge";

export type SkillGroup = {
  id: string;
  label: LocalizedString;
  icon: SkillGroupIconName;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "core",
    label: { ko: "언어 · 프레임워크", en: "Languages & frameworks" },
    icon: "layout",
    skills: [
      { name: "TypeScript", level: 5 },
      { name: "React", level: 5 },
      { name: "Next.js", level: 5 },
      { name: "JavaScript (ES2023)", level: 5 },
      { name: "Vue 3", level: 3 },
      { name: "Svelte", level: 2 },
    ],
  },
  {
    id: "styling",
    label: { ko: "스타일 · 디자인", en: "Styling & design" },
    icon: "palette",
    skills: [
      { name: "Tailwind CSS", level: 5 },
      { name: "CSS Architecture", level: 4 },
      { name: "Motion / Framer Motion", level: 4 },
      { name: "Figma", level: 3 },
      { name: "Accessibility (WCAG 2.2)", level: 4 },
    ],
  },
  {
    id: "platform",
    label: { ko: "백엔드 · 인프라", en: "Backend & infrastructure" },
    icon: "server",
    skills: [
      { name: "Node.js", level: 4 },
      { name: "PostgreSQL", level: 3 },
      { name: "GraphQL", level: 3 },
      { name: "Vercel", level: 4 },
      { name: "Docker", level: 3 },
    ],
  },
  {
    id: "quality",
    label: { ko: "테스트 · 품질", en: "Testing & quality" },
    icon: "gauge",
    skills: [
      { name: "Vitest", level: 4 },
      { name: "Playwright", level: 4 },
      { name: "Testing Library", level: 4 },
      { name: "Lighthouse CI", level: 4 },
      { name: "Sentry", level: 3 },
    ],
  },
  {
    id: "tooling",
    label: { ko: "도구 · 워크플로", en: "Tooling & workflow" },
    icon: "wrench",
    skills: [
      { name: "Git", level: 5 },
      { name: "Turborepo", level: 3 },
      { name: "GitHub Actions", level: 4 },
      { name: "Storybook", level: 4 },
      { name: "pnpm", level: 4 },
    ],
  },
];

/* ── Experience ──────────────────────────────────────────────────────────── */

export type Experience = {
  id: string;
  company: string;
  companyUrl?: string;
  role: LocalizedString;
  location: LocalizedString;
  /** `YYYY-MM`. */
  start: string;
  /** `YYYY-MM`, or `null` for a current role. */
  end: string | null;
  summary: LocalizedString;
  highlights: LocalizedString[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    id: "enliple",
    company: "Enliple",
    companyUrl: "https://www.enliple.com",
    role: { ko: "프론트엔드 엔지니어", en: "Frontend Engineer" },
    location: { ko: "서울", en: "Seoul" },
    start: "2022-03",
    end: null,
    summary: {
      ko: "마케팅 자동화 플랫폼의 대시보드를 담당하며, 사내 디자인 시스템을 설계해 여섯 개 제품 팀에 배포했습니다.",
      en: "Own the dashboard of a marketing automation platform, and built the in-house design system now used by six product teams.",
    },
    highlights: [
      {
        ko: "레거시 대시보드를 Next.js App Router로 점진적 마이그레이션 — LCP 4.1초에서 1.3초로 단축",
        en: "Migrated the legacy dashboard to the Next.js App Router incrementally, taking LCP from 4.1s to 1.3s",
      },
      {
        ko: "40여 개 컴포넌트로 구성된 디자인 시스템을 Storybook과 함께 배포, 신규 화면 개발 시간 절반으로 감소",
        en: "Shipped a 40-component design system with Storybook, halving the time to build a new screen",
      },
      {
        ko: "Playwright 기반 E2E 파이프라인 도입, 배포 후 롤백 건수 연 12건에서 2건으로 감소",
        en: "Introduced a Playwright E2E pipeline, cutting post-deploy rollbacks from 12 a year to 2",
      },
    ],
    stack: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Playwright"],
  },
  {
    id: "commerce-labs",
    company: "Commerce Labs",
    role: { ko: "프론트엔드 개발자", en: "Frontend Developer" },
    location: { ko: "서울", en: "Seoul" },
    start: "2020-01",
    end: "2022-02",
    summary: {
      ko: "월 300만 세션 규모의 커머스 프론트엔드를 유지보수하고, 결제 및 상품 상세 플로우를 개편했습니다.",
      en: "Maintained a commerce frontend at 3M sessions a month and rebuilt the checkout and product detail flows.",
    },
    highlights: [
      {
        ko: "상품 상세 페이지를 SSR로 전환해 검색 유입 트래픽 34% 증가",
        en: "Moved product detail pages to SSR, lifting organic search traffic 34%",
      },
      {
        ko: "결제 퍼널을 3단계에서 1단계로 축소, 모바일 전환율 11% 개선",
        en: "Collapsed a three-step checkout funnel into one, improving mobile conversion 11%",
      },
      {
        ko: "이미지 최적화 파이프라인 구축으로 전체 페이지 무게 평균 62% 감소",
        en: "Built an image optimization pipeline that cut average page weight 62%",
      },
    ],
    stack: ["React", "Redux", "Node.js", "SCSS", "AWS"],
  },
  {
    id: "studio-parallel",
    company: "Studio Parallel",
    role: { ko: "웹 개발자", en: "Web Developer" },
    location: { ko: "서울", en: "Seoul" },
    start: "2018-07",
    end: "2019-12",
    summary: {
      ko: "브랜드 캠페인 사이트와 인터랙티브 마이크로사이트를 제작했습니다. 짧은 주기로 많은 것을 배운 시기입니다.",
      en: "Built brand campaign sites and interactive microsites. Short cycles, steep learning curve.",
    },
    highlights: [
      {
        ko: "18개 캠페인 사이트 납품, 전 프로젝트 Lighthouse 90점 이상 유지",
        en: "Delivered 18 campaign sites, holding every one above a Lighthouse score of 90",
      },
      {
        ko: "WebGL과 Canvas를 활용한 인터랙션 구현 및 사내 가이드 문서화",
        en: "Built WebGL and Canvas interactions, and documented the approach as an internal guide",
      },
    ],
    stack: ["JavaScript", "GSAP", "Three.js", "WordPress"],
  },
];
