import type { Dictionary } from "./en";

/**
 * Korean UI strings. Typed as `Dictionary`, so TypeScript will complain the
 * moment `en.ts` gains a key that is missing here.
 */
export const ko: Dictionary = {
  meta: {
    role: "프론트엔드 엔지니어",
    description:
      "React, TypeScript, Next.js로 빠르고 접근성 좋은 인터페이스를 만듭니다. 주요 작업물과 경력을 정리했습니다.",
    keywords: [
      "프론트엔드 개발자",
      "프론트엔드 엔지니어",
      "React",
      "TypeScript",
      "Next.js",
      "포트폴리오",
      "웹 성능",
      "웹 접근성",
    ],
  },

  nav: {
    home: "홈",
    about: "소개",
    skills: "기술",
    projects: "프로젝트",
    experience: "경력",
    contact: "연락",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    skipToContent: "본문으로 건너뛰기",
  },

  theme: {
    toggle: "테마 변경",
    light: "라이트",
    dark: "다크",
    system: "시스템",
  },

  locale: {
    switch: "언어 변경",
  },

  hero: {
    eyebrow: "새로운 기회를 찾고 있습니다",
    headlinePrefix: "이런 인터페이스를 만듭니다:",
    headlineWords: ["즉각적인", "직관적인", "모두를 위한", "치밀한"],
    lede:
      "성능과 디테일에 집착하는 프론트엔드 엔지니어입니다. 모호한 기획을 측정 가능한 결과물로 만들어 출시합니다.",
    ctaPrimary: "작업물 보기",
    ctaSecondary: "연락하기",
    scrollHint: "스크롤",
    stats: {
      years: "경력",
      projects: "완료한 프로젝트",
      commits: "지난 1년 커밋",
    },
  },

  about: {
    label: "소개",
    heading: "짧은 자기소개",
    readMore: "더 보기",
    readLess: "접기",
    factsHeading: "한눈에 보기",
    facts: {
      location: "지역",
      role: "직무",
      focus: "요즘 관심사",
      languages: "사용 언어",
    },
  },

  skills: {
    label: "기술",
    heading: "다루는 기술",
    lede: "기본으로 선택하는 도구들을 스택 위치별로 묶었습니다.",
    levelLabel: "숙련도",
    tickerLabel: "다루는 기술 전체 목록",
    levels: {
      1: "학습 중",
      2: "실무 가능",
      3: "능숙함",
      4: "자신 있음",
      5: "깊이 이해함",
    },
  },

  projects: {
    label: "프로젝트",
    heading: "주요 작업물",
    lede:
      "처음부터 끝까지 직접 만든 것들입니다. 각 프로젝트마다 의사결정과 트레이드오프를 정리해 두었습니다.",
    all: "전체",
    featured: "대표 작업",
    viewCase: "상세 보기",
    viewLive: "사이트 방문",
    viewSource: "소스 코드",
    empty: "해당 조건에 맞는 프로젝트가 없습니다.",
    backToProjects: "프로젝트 목록",
    indexHeading: "전체 프로젝트",
    indexLede: "최신순 전체 목록입니다.",
    metaRole: "역할",
    metaYear: "연도",
    metaStack: "기술 스택",
    metaTeam: "팀 규모",
    nextProject: "다음 프로젝트",
    prevProject: "이전 프로젝트",
    tableOfContents: "목차",
  },

  experience: {
    label: "경력",
    heading: "지나온 곳",
    lede: "최근 순으로 정리했습니다.",
    present: "현재",
    highlightsLabel: "주요 성과",
    stackLabel: "사용 기술",
    downloadResume: "이력서 다운로드",
  },

  contact: {
    label: "연락",
    heading: "함께 만들어요",
    lede:
      "정규직, 계약, 그리고 재미있는 이야기 모두 환영합니다. 받은 메일에는 전부 답장합니다.",
    emailLabel: "이메일",
    locationLabel: "활동 지역",
    copyEmail: "이메일 주소 복사",
    copied: "복사했습니다",
    form: {
      name: "이름",
      namePlaceholder: "이름을 입력해 주세요",
      email: "이메일",
      emailPlaceholder: "you@company.com",
      message: "메시지",
      messagePlaceholder: "어떤 일을 하고 계신지 알려주세요…",
      submit: "메시지 보내기",
      submitting: "보내는 중…",
      success: "감사합니다 — 곧 답장 드리겠습니다.",
      error: "전송에 실패했습니다. 이메일로 직접 보내주시겠어요?",
      required: "필수 항목입니다",
      invalidEmail: "이메일 형식이 올바르지 않습니다",
      mailtoFallback: "메일 앱이 열립니다",
    },
    socialsLabel: "다른 채널",
  },

  footer: {
    builtWith: "Next.js와 Tailwind CSS로 만들었습니다",
    rights: "All rights reserved",
    backToTop: "위로",
    sourceCode: "소스 코드",
  },

  notFound: {
    label: "404",
    heading: "존재하지 않는 페이지입니다",
    lede: "링크가 오래되었거나 페이지가 이동했을 수 있습니다.",
    cta: "홈으로",
  },

  error: {
    heading: "문제가 발생했습니다",
    lede: "예상치 못한 오류가 발생했습니다. 다시 시도하면 대개 해결됩니다.",
    retry: "다시 시도",
  },
};
