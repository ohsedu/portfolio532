# portfolio

한국어 / 영어 이중 언어 포트폴리오 사이트. 백엔드 없이 전부 정적으로 프리렌더되며 Vercel에 그대로 배포됩니다.

브랜드 컬러는 `#4f46e5` — Tailwind의 `indigo-600`과 정확히 같은 값이라 인디고 스케일 전체를 그대로 씁니다.

## 스택

| 항목      | 버전   | 비고                                              |
| --------- | ------ | ------------------------------------------------- |
| Next.js   | 16.3.1 | App Router, Turbopack(기본 번들러)                |
| React     | 19.2   | Server Components                                 |
| Tailwind  | v4.3   | CSS-first 설정, `@theme` / `@utility`             |
| motion    | 13.1   | `framer-motion`의 후속 패키지, `motion/react`     |
| MDX       | —      | `@next/mdx` + remark-gfm, rehype-slug             |
| Shiki     | 4.4    | 코드블록 하이라이팅, 라이트/다크 동시 출력         |

## 시작하기

```bash
npm install
npm run dev          # http://localhost:3000 → Accept-Language에 따라 /ko 또는 /en
npm run build        # 19개 페이지 정적 생성
npm run lint
npx tsc --noEmit
```

`npm run build`는 `next/font`가 Google Fonts에서 Inter와 JetBrains Mono를 내려받으므로 최초 빌드에 네트워크가 필요합니다.

## 내 정보로 바꾸기

바꿀 파일은 네 개입니다. 코드는 건드릴 필요 없습니다.

| 파일                             | 들어 있는 것                                             |
| -------------------------------- | -------------------------------------------------------- |
| `src/lib/site.ts`                | **여기부터.** 이름, 이메일, 지역, 이니셜, 저장소 링크    |
| `src/lib/data/profile.ts`        | 소개글, 기술 스택, 경력, 소셜 링크, Hero 숫자            |
| `src/lib/data/projects.ts`       | 프로젝트 메타데이터 (제목, 연도, 역할, 태그, 링크)       |
| `src/lib/i18n/dictionaries/*.ts` | UI 문구. `en.ts`가 타입 기준이라 키를 빼먹으면 컴파일 에러 |

이름은 `site.ts` 한 곳에만 있습니다. 거기서 바꾸면 헤더·푸터·페이지 타이틀·sitemap·JSON-LD·OG 이미지가 전부 따라옵니다.

이력서/프로젝트 **내용**은 `{ ko, en }` 형태로 데이터 파일에 나란히 들어 있고, 버튼 라벨 같은 **UI 문구**만 딕셔너리에 있습니다. 두 언어를 나란히 보면서 고칠 수 있게 일부러 이렇게 나눴습니다.

### 케이스 스터디 추가

1. `src/content/projects/<slug>.ko.mdx` 와 `<slug>.en.mdx` 작성
2. `src/lib/content.ts` 레지스트리에 두 줄 추가
3. `src/lib/data/projects.ts`에서 해당 프로젝트의 `caseStudy: true`

MDX에는 frontmatter가 없습니다 (`@next/mdx`가 기본 지원하지 않음). 메타데이터는 전부 `projects.ts`에 있고 MDX는 본문만 담습니다.

## 배포

Vercel에 저장소를 연결하면 끝입니다. `vercel.json`도, 빌드 설정도 필요 없습니다.

프로덕션 환경변수에 `NEXT_PUBLIC_SITE_URL=https://내도메인.com`만 넣어주세요 — canonical URL, hreflang, sitemap, OG 이미지 주소가 여기서 나옵니다. 안 넣으면 Vercel이 주입하는 `VERCEL_PROJECT_PRODUCTION_URL`로 폴백합니다. 나머지는 `.env.example` 참고.

## 구조에서 특이한 부분

Next 16에서 바뀐 것들이라 일부러 이렇게 되어 있습니다. 되돌리면 깨집니다.

- **`src/app/layout.tsx`가 없습니다.** 루트 레이아웃은 `src/app/[locale]/layout.tsx`이고 `<html>`/`<body>`도 거기서 렌더합니다. 상위에 레이아웃이 없어야 `[locale]`이 root param이 되고, 그래야 `next/root-params`로 읽을 수 있습니다 (404 페이지가 그렇게 언어를 알아냅니다).
- **`middleware.ts`가 아니라 `src/proxy.ts`입니다.** Next 16에서 이름이 바뀌었고, 함수도 `proxy`로 export해야 합니다. 둘 다 있으면 빌드가 죽습니다(E900).
- **`sitemap.ts` / `robots.ts` / `manifest.ts` / `icon.tsx`는 `src/app/` 루트**에 있습니다. `[locale]` 안에 넣으면 `/ko/sitemap.xml`로 서빙됩니다.
- **`opengraph-image.tsx`는 자기 `generateStaticParams`를 따로 export**합니다. 메타데이터 파일은 독립 라우트로 컴파일돼서 레이아웃 것을 물려받지 않습니다.
- **`data-scroll-behavior="smooth"`가 `<html>`에 붙어 있습니다.** globals.css가 `scroll-behavior: smooth`를 켜는데, Next 16은 이 속성 없이는 라우팅 시 즉시 스크롤 오버라이드를 걸지 않아서 페이지 이동마다 길게 스크롤됩니다.
- **MDX 플러그인은 문자열로 지정**합니다 (`remarkPlugins: ["remark-gfm"]`). Turbopack이 MDX 파이프라인을 Rust로 넘기기 때문에 import한 함수는 전달되지 않습니다.
- **코드블록은 Shiki가 두 테마를 동시에 출력**합니다. `defaultColor: false`로 토큰마다 `--shiki-light`/`--shiki-dark`를 심고 `.dark` 클래스로 골라 쓰므로, 테마를 바꿔도 다시 하이라이팅하지 않고 번들도 하나입니다.
- **404는 `src/app/global-not-found.tsx` 하나입니다** (`experimental.globalNotFound`). 루트 레이아웃이 동적 세그먼트(`[locale]`) 아래에 있으면 `notFound()`가 안착할 바운더리가 없어서, `[locale]/not-found.tsx`를 두더라도 문서 셸이 Next 기본 에러 페이지로 떨어집니다. 그래서 알 수 없는 로케일·slug는 `dynamicParams = false`로 **라우터 단계에서 거부**해 전부 이 한 페이지로 보냅니다. props를 받을 수 없어 로케일을 알 수 없으므로 **한국어와 영어를 함께** 보여줍니다.
  - 부수 효과: 거부된 파라미터마다 서버 로그에 `Internal: NoFallbackError`가 한 줄 남습니다. Next 내부 신호이고 사용자에게는 정상 404(+스타일)가 나갑니다 — Vercel 로그에서 보이더라도 정상입니다.
  - `generateMetadata`에서는 절대 `notFound()`를 호출하지 마세요. 메타데이터는 레이아웃보다 위 바운더리에서 렌더돼서, 거기서 던진 404는 세그먼트 바운더리를 건너뜁니다. `notFoundMetadata()`를 반환하세요.
- **`lucide-react` v1에는 브랜드 아이콘이 없습니다.** GitHub·LinkedIn 등은 전부 삭제됐어서 `src/components/icons/brand.tsx`에 직접 넣었습니다.

## 디자인 시스템

색은 전부 `src/app/globals.css`의 시맨틱 토큰에서 나옵니다. 컴포넌트에는 `bg-slate-800` 같은 원시 팔레트 색이 없습니다.

`bg-bg` `bg-surface` `text-fg` `text-fg-muted` `text-fg-subtle` `border-line` `bg-brand` `text-brand-accent` 등을 쓰고, 라이트/다크는 토큰 값이 바뀌므로 대부분 `dark:` 프리픽스가 필요 없습니다.

**대비 관련 주의 하나**: 다크 모드에서 `#4f46e5`를 본문 텍스트로 쓰면 3.1:1로 AA 미달입니다. 그래서 `--brand-accent`가 라이트에서는 indigo-600, 다크에서는 indigo-400(6.6:1)으로 갈라집니다. **텍스트에는 `text-brand-accent`만** 쓰고, `bg-brand`는 항상 `text-brand-fg`와 함께 쓰세요.

## 아직 안 채워진 것

의도적으로 비워둔 것들입니다. 없어도 사이트는 정상 동작합니다.

- **`public/resume.pdf`** — `site.ts`의 `resumePath`가 `null`이라 이력서 다운로드 버튼이 렌더되지 않습니다. PDF를 넣고 `resumePath: "/resume.pdf"`로 바꾸면 켜집니다. 404 나는 버튼을 배포하지 않으려고 이렇게 했습니다.
- **프로젝트 커버 이미지** — 없으면 각 프로젝트의 `accent` 색으로 그라데이션 카드가 생성됩니다. 실제 이미지를 쓰려면 `public/projects/`에 넣고 `projects.ts`의 `cover`를 채우세요. `next/image`를 쓸 때 Next 16에서는 `priority` prop이 deprecated이니 `loading="eager"` / `fetchPriority="high"`를 쓰세요.
- **OG 이미지의 한글** — 링크 미리보기 카드는 라틴 문자 전용입니다. `ImageResponse` 기본 폰트에 한글이 없고 라우트 전체가 500KB 제한이라, 한글은 `og:title`/`og:description`으로 전달하고 이미지는 브랜드 카드로 뒀습니다. 이미지에도 한글을 넣으려면 서브셋한 TTF/OTF를 커밋하고 `ImageResponse`의 `fonts` 옵션으로 넘기세요 (woff2는 Satori가 못 읽습니다).
- **`asOf`** — `site.ts`의 `asOf: "2026-08"`이 현재 재직 중인 경력의 기간 계산 기준입니다. 프리렌더 페이지에서는 `new Date()`를 쓸 수 없어서 상수로 뒀습니다. 사이트 갱신할 때 같이 올려주세요.

## 접근성

- 모든 인터랙티브 요소에 `focus-visible` 링, 본문 건너뛰기 링크
- `prefers-reduced-motion`을 켜면 스크롤 리빌은 애니메이션 없이 그냥 표시됩니다 (opacity 0에 갇히지 않도록)
- JS가 없어도 리빌 콘텐츠와 접힌 소개글이 보입니다 (`<noscript>` 오버라이드 + 접힌 문단도 HTML에 포함)
- 기술 숙련도는 색만이 아니라 눈금 개수 + 텍스트로 표시
- 연락 폼은 `aria-invalid` / `aria-describedby` 연결, 제출 결과는 `aria-live`로 안내
