# 모바일 허브-스포크 내비게이션 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 롱스크롤 단일 페이지를 홈(허브) + 5개 카테고리 페이지의 해시 라우팅 구조로 전환한다.

**Architecture:** 의존성 0의 경량 커스텀 해시 라우터(`useSyncExternalStore` + `hashchange`)로 라우트 key를 구독하고, `App` 셸이 라우트별 페이지 컴포넌트를 렌더한다. 기존 11개 섹션 컴포넌트는 거의 그대로 재사용하되, 홈(공지·기도)은 컴팩트 변형, 나머지는 5개 페이지로 묶는다. `EditMode` FAB·`Footer`는 셸에 두어 전역 유지.

**Tech Stack:** Vite 5, React 18.3(JS, `.jsx`), CSS Modules, Firebase Firestore. 빌드=`npm run build`, 로컬=`npm run dev`(http://localhost:5173).

## Global Constraints

- **테스트 러너 없음** — 각 태스크 검증 = `npm run build`(exit 0, 콘솔 에러 0) + 지정된 브라우저 프리뷰 확인. 단위테스트 프레임워크 신규 도입 금지(YAGNI·의존성 최소).
- **의존성 추가 금지** — react-router 등 미설치. 라우터는 자체 구현.
- **자산 경로는 상대경로만** — `asset()` 사용, 절대 `/경로` 금지(GH Pages 하위경로 `/21mg-mission/`).
- **데이터·규칙 불변** — `src/data/*`, `firestore.rules`, PWA, 줌고정, 세이프에어리어 정책 변경 금지.
- **색/텍스트 토큰** — `--coral`/`--violet`/`--sunny`/`--mint`/`--ink`, 위 텍스트는 토큰 AA 페어(`--on-sunny`, `--on-ink`, mint 위 `#04342C`, coral·violet 위 흰색).
- **브랜치 작업** — `feat/mobile-hub-nav`. 완성·검증 전 main 푸시 금지(main push = 자동 배포). push 시 `gh auth switch --user bbangfilm` 필요(이 계획에선 push 안 함).
- **모션** — 기존 `.reveal`/`.stagger`/`.pressable`/`.lift` 전역 클래스 재사용, 신규 모션은 `prefers-reduced-motion` 안전.
- **헤드리스 프리뷰 주의** — IntersectionObserver/CSS 전환 미발화 → 리빌·라우트전환·카운트업은 실브라우저(dev)에서만 검증 가능.

## File Structure

**신규**
- `src/lib/router.jsx` — 해시 라우터(ROUTES, parseHash, useRoute, navigate, saveScroll/getScroll, Link).
- `src/components/PageHeader.jsx` + `.module.css` — 서브페이지 상단 `← 홈` 헤더.
- `src/components/CategoryGrid.jsx` + `.module.css` — 홈 5색 메뉴.
- `src/pages/Home.jsx` + `Home.module.css`, `MinistryPage.jsx`, `PeoplePage.jsx`, `SchedulePage.jsx`, `FinancePage.jsx`, `TodoPage.jsx`.

**수정**
- `src/sections/Notices.jsx` — `limit` prop(컴팩트 + 더보기).
- `src/components/PrayerWall.jsx` — `limit` prop(+더보기).
- `src/sections/Prayers.jsx` — `wallLimit` prop 포워드.
- `src/App.jsx` — 라우터 셸로 교체.
- `src/styles/global.css` — `.routeView` 라우트 전환 애니메이션.

**제거**
- `src/components/AnchorNav.jsx` + `AnchorNav.module.css`.
- `src/sections/EmptyDynamic.jsx` + `EmptyDynamic.module.css`(이미 미사용).

---

### Task 1: 경량 해시 라우터

**Files:**
- Create: `src/lib/router.jsx`

**Interfaces:**
- Produces:
  - `ROUTES`: `{ '':{title}, ministry:{title}, people:{title}, schedule:{title}, finance:{title}, todo:{title} }`
  - `parseHash(hash: string) => routeKey: string` ('' = 홈, 미등록 폴백 포함)
  - `useRoute() => routeKey: string`
  - `navigate(key: string) => void`
  - `saveScroll(key: string) => void`, `getScroll(key: string) => number|undefined`
  - `Link({ to, className, children, ...rest }) => <a href="#/...">`

- [ ] **Step 1: 라우터 모듈 작성**

`src/lib/router.jsx`:

```jsx
import { useSyncExternalStore } from 'react'

// 라우트 레지스트리 — key, 표시 제목. 홈은 key ''(빈 문자열).
export const ROUTES = {
  '':       { title: '21MG 국내선교' },
  ministry: { title: '사역·나눔' },
  people:   { title: '참가자·팀' },
  schedule: { title: '일정·장소' },
  finance:  { title: '재정' },
  todo:     { title: '준비 To-Do' },
}

// '#/ministry' → 'ministry' / '#/','','#hero' 등 미등록 → ''(홈 폴백)
export function parseHash(hash) {
  const m = (hash || '').replace(/^#\/?/, '').split(/[/?]/)[0]
  return Object.prototype.hasOwnProperty.call(ROUTES, m) ? m : ''
}

function subscribe(cb) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getSnapshot = () => window.location.hash

// 현재 라우트 key 구독
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, getSnapshot, () => '')
  return parseHash(hash)
}

// 프로그램적 이동
export function navigate(key) {
  const next = key ? `#/${key}` : '#/'
  if (window.location.hash !== next) window.location.hash = next
}

// 라우트별 스크롤 위치 기억(홈 복원용)
const scrollPositions = new Map()
export function saveScroll(key) { scrollPositions.set(key, window.scrollY) }
export function getScroll(key) { return scrollPositions.get(key) }

// 접근성/공유용 링크 — 실제 <a href>라 미들클릭·새탭·스크린리더 OK
export function Link({ to = '', className, children, ...rest }) {
  return <a href={to ? `#/${to}` : '#/'} className={className} {...rest}>{children}</a>
}
```

- [ ] **Step 2: 빌드 검증**

Run: `npm run build`
Expected: exit 0, 에러 없음. (모듈은 아직 미사용 — 다음 태스크에서 연결.)

- [ ] **Step 3: 파싱 로직 자가 점검(코드 리딩)**

확인: `parseHash('#/ministry')==='ministry'`, `parseHash('#/')===''`, `parseHash('')===''`, `parseHash('#hero')===''`(미등록 폴백), `parseHash('#/finance?x')==='finance'`.

- [ ] **Step 4: 커밋**

```bash
git add src/lib/router.jsx
git commit -m "feat: 경량 해시 라우터(useRoute/navigate/Link)"
```

---

### Task 2: 서브페이지 헤더 컴포넌트

**Files:**
- Create: `src/components/PageHeader.jsx`, `src/components/PageHeader.module.css`

**Interfaces:**
- Consumes: `Link` (Task 1)
- Produces: `<PageHeader title={string} />`

- [ ] **Step 1: 컴포넌트 작성**

`src/components/PageHeader.jsx`:

```jsx
import { Link } from '../lib/router.jsx'
import styles from './PageHeader.module.css'

// 서브페이지 상단 고정 헤더 — '← 홈' + 페이지 제목. 노치 회피(safe-area).
export default function PageHeader({ title }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="" className={`${styles.back} pressable`} aria-label="홈으로">
          <span aria-hidden="true">←</span> 홈
        </Link>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: 스타일 작성**

`src/components/PageHeader.module.css`:

```css
.header {
  position: sticky; top: 0; z-index: 30;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
  padding-top: env(safe-area-inset-top);
}
.inner { display: flex; align-items: center; gap: 12px; height: var(--navh); }
.back {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 14px; font-weight: 600; color: var(--violet);
  text-decoration: none; flex: 0 0 auto;
}
.title { font-family: var(--font-display); font-weight: 800; font-size: 18px; margin: 0; }
```

- [ ] **Step 3: 빌드 검증**

Run: `npm run build`
Expected: exit 0. (아직 미사용.)

- [ ] **Step 4: 커밋**

```bash
git add src/components/PageHeader.jsx src/components/PageHeader.module.css
git commit -m "feat: 서브페이지 PageHeader(← 홈 + 제목, safe-area)"
```

---

### Task 3: 홈 5색 메뉴 그리드

**Files:**
- Create: `src/components/CategoryGrid.jsx`, `src/components/CategoryGrid.module.css`

**Interfaces:**
- Consumes: `Link` (Task 1)
- Produces: `<CategoryGrid />` (5개 카테고리로 이동하는 `<nav>`)

- [ ] **Step 1: 컴포넌트 작성**

`src/components/CategoryGrid.jsx` (아이콘은 기존 앱과 동일하게 이모지 사용 — 의존성·SVG 패스 위험 없음):

```jsx
import { Link } from '../lib/router.jsx'
import styles from './CategoryGrid.module.css'

// 5색 대분류 — 홈 메뉴
const CATS = [
  { to: 'ministry', label: '사역·나눔',  sub: '먹거리 · 오병이어 장터', cls: 'coral',  icon: '🍞' },
  { to: 'people',   label: '참가자·팀',  sub: '45명 · 팀 체크리스트',  cls: 'violet', icon: '👥' },
  { to: 'schedule', label: '일정·장소',  sub: '타임테이블 · 숙소',     cls: 'sunny',  icon: '📅' },
  { to: 'finance',  label: '재정',       sub: '회비 · 후원 계좌',      cls: 'mint',   icon: '💳' },
  { to: 'todo',     label: '준비 To-Do', sub: '이번주 함께 챙길 일',   cls: 'ink',    icon: '✅', wide: true },
]

export default function CategoryGrid() {
  return (
    <nav className={`${styles.grid} reveal`} aria-label="메뉴">
      {CATS.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className={`${styles.card} ${styles[c.cls]} ${c.wide ? styles.wide : ''} lift pressable`}
        >
          <span className={styles.icon} aria-hidden="true">{c.icon}</span>
          <span className={styles.text}>
            <span className={styles.label}>{c.label}</span>
            <span className={styles.sub}>{c.sub}</span>
          </span>
          {c.wide && <span className={styles.chev} aria-hidden="true">→</span>}
        </Link>
      ))}
    </nav>
  )
}
```

- [ ] **Step 2: 스타일 작성**

`src/components/CategoryGrid.module.css`:

```css
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.card {
  display: flex; flex-direction: column; justify-content: space-between;
  min-height: 104px; padding: 15px; border-radius: var(--radius);
  text-decoration: none; color: inherit;
}
.icon { font-size: 24px; }
.text { display: block; }
.label { display: block; font-family: var(--font-display); font-weight: 800; font-size: 17px; line-height: 1.1; }
.sub { display: block; font-size: 12px; margin-top: 3px; opacity: .9; }
.wide { grid-column: 1 / -1; flex-direction: row; align-items: center; gap: 12px; min-height: 0; }
.wide .text { flex: 1; }
.chev { font-size: 20px; opacity: .7; }
.coral  { background: var(--coral);  color: #fff; }
.violet { background: var(--violet); color: #fff; }
.sunny  { background: var(--sunny);  color: var(--on-sunny); }
.mint   { background: var(--mint);   color: #04342C; }
.ink    { background: var(--ink);    color: var(--on-ink); }
@media (min-width: 720px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
  .wide { grid-column: auto; flex-direction: column; align-items: stretch; }
  .wide .chev { display: none; }
}
```

- [ ] **Step 3: 빌드 검증**

Run: `npm run build`
Expected: exit 0. (아직 미사용.)

- [ ] **Step 4: 커밋**

```bash
git add src/components/CategoryGrid.jsx src/components/CategoryGrid.module.css
git commit -m "feat: 홈 5색 메뉴 그리드(CategoryGrid)"
```

---

### Task 4: 공지·기도 컴팩트 변형(holm용 limit)

기존 동작 보존이 핵심 — `limit` 미지정 시 현재와 동일하게 전체 표시(롱페이지 App가 깨지지 않음).

**Files:**
- Modify: `src/sections/Notices.jsx`
- Modify: `src/components/PrayerWall.jsx`
- Modify: `src/sections/Prayers.jsx`

**Interfaces:**
- Produces: `<Notices limit={number?} />`, `<PrayerWall limit={number?} />`, `<Prayers wallLimit={number?} />`

- [ ] **Step 1: Notices에 limit + 더보기 추가**

`src/sections/Notices.jsx` — `export default function Notices() {` 시그니처를 `Notices({ limit })`로 바꾸고, `useState(draft)` 옆에 펼침 상태를 추가, `sorted` 계산 직후 표시 목록을 분기한다.

`import { useState } ...` 는 그대로. 함수 본문 변경:

```jsx
export default function Notices({ limit }) {
  const { can, name } = useEditMode()
  const editable = can('admin')
  const { items, loading } = useCollection(PATH)
  const [draft, setDraft] = useState('')
  const [expanded, setExpanded] = useState(false)

  // 고정 먼저, 그 안에서 최신순
  const sorted = [...items].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
  })

  // 컴팩트(홈): 고정 + 최신 비고정 limit건. 더보기로 전체 펼침.
  const pinned = sorted.filter((n) => n.pinned)
  const rest = sorted.filter((n) => !n.pinned)
  const visible = (limit == null || expanded) ? sorted : [...pinned, ...rest.slice(0, limit)]
  const hidden = sorted.length - visible.length
```

그리고 목록 렌더에서 `sorted.map(...)` → `visible.map(...)` 로 바꾸고, `</ul>` 바로 다음에 더보기 버튼을 추가한다:

```jsx
        <ul className={`${styles.list} stagger`}>
          {visible.map((n) => (
            // ... (기존 li 내용 그대로) ...
          ))}
        </ul>
      )}

      {limit != null && hidden > 0 && (
        <button type="button" className={`${styles.more} pressable`} onClick={() => setExpanded(true)}>
          공지 더보기 ({hidden})
        </button>
      )}
```

`src/sections/Notices.module.css` 끝에 추가:

```css
.more {
  margin-top: 10px; width: 100%;
  border: 1px solid var(--line); background: var(--paper-2);
  border-radius: var(--radius-sm); padding: 9px 12px;
  font: inherit; font-size: 13px; color: var(--text); cursor: pointer;
}
```

- [ ] **Step 2: PrayerWall에 limit + 더보기 추가**

`src/components/PrayerWall.jsx` — 시그니처를 `PrayerWall({ limit })`로 바꾸고, `sorted` 아래에 표시 분기 추가:

```jsx
export default function PrayerWall({ limit }) {
  const { can } = useEditMode()
  const editable = can('team')
  const { items, loading } = useCollection(PATH)
  const [text, setText] = useState('')
  const [nm, setNm] = useState('')
  const [anon, setAnon] = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')
  const [amened, setAmened] = useState(loadAmen)
  const [expanded, setExpanded] = useState(false)

  const sorted = useMemo(() => [...items].sort((a, b) => tsOf(b) - tsOf(a)), [items])
  const visible = (limit == null || expanded) ? sorted : sorted.slice(0, limit)
  const hidden = sorted.length - visible.length
```

목록 렌더에서 `sorted.map((p) => {` → `visible.map((p) => {`. 그리고 `</ul>` 닫힌 직후(목록 블록의 `)}` 다음, `<p className={styles.foot}>` 위)에 더보기 추가:

```jsx
      {limit != null && hidden > 0 && (
        <button type="button" className={`${styles.more} pressable`} onClick={() => setExpanded(true)}>
          기도 더보기 ({hidden})
        </button>
      )}

      <p className={styles.foot}>부적절한 글은 팀에서 정리할 수 있어요.</p>
```

`src/components/PrayerWall.module.css` 끝에 추가:

```css
.more {
  margin: 4px 0 10px; width: 100%;
  border: 1px solid var(--line-ink); background: var(--ink-2);
  border-radius: var(--radius-sm); padding: 9px 12px;
  font: inherit; font-size: 13px; color: var(--on-ink); cursor: pointer;
}
```

- [ ] **Step 3: Prayers가 wallLimit 포워드**

`src/sections/Prayers.jsx`:

```jsx
export default function Prayers({ wallLimit }) {
  return (
    <Section id="prayers" eyebrow="Prayer & Word" title="이 마음으로 기도합니다" tone="ink">
      <blockquote className={`${styles.verse} reveal`}>
        <p>“{verse.text}”</p>
        <cite>— {verse.ref}</cite>
      </blockquote>
      <ul className={`${styles.list} stagger`}>
        {prayers.map((p) => (
          <li key={p.id} className={styles.item}>
            <span className={styles.bullet} aria-hidden="true">🙏</span>
            <span>{p.text}</span>
          </li>
        ))}
      </ul>
      <PrayerWall limit={wallLimit} />
    </Section>
  )
}
```

- [ ] **Step 4: 빌드 + 기존 동작 보존 확인**

Run: `npm run build`
Expected: exit 0. 현재 `App.jsx`는 `<Notices/>`·`<Prayers/>`를 prop 없이 쓰므로 `limit`/`wallLimit`가 undefined → **기존 전체표시 동작 그대로**.

- [ ] **Step 5: 커밋**

```bash
git add src/sections/Notices.jsx src/sections/Notices.module.css \
        src/components/PrayerWall.jsx src/components/PrayerWall.module.css \
        src/sections/Prayers.jsx
git commit -m "feat: 공지·한줄기도 컴팩트(limit+더보기), 기존 전체표시 보존"
```

---

### Task 5: 페이지 컴포넌트 6종

**Files:**
- Create: `src/pages/Home.jsx`, `src/pages/Home.module.css`
- Create: `src/pages/MinistryPage.jsx`, `src/pages/PeoplePage.jsx`, `src/pages/SchedulePage.jsx`, `src/pages/FinancePage.jsx`, `src/pages/TodoPage.jsx`

**Interfaces:**
- Consumes: `PageHeader`(T2), `CategoryGrid`(T3), `Notices limit`/`Prayers wallLimit`(T4), 기존 섹션들·`Hero`·`PhotoBand`.
- Produces: `<Home/>`, `<MinistryPage/>`, `<PeoplePage/>`, `<SchedulePage/>`, `<FinancePage/>`, `<TodoPage/>`

- [ ] **Step 1: Home 작성**

`src/pages/Home.jsx`:

```jsx
import Hero from '../components/Hero.jsx'
import Notices from '../sections/Notices.jsx'
import Prayers from '../sections/Prayers.jsx'
import CategoryGrid from '../components/CategoryGrid.jsx'
import styles from './Home.module.css'

export default function Home() {
  return (
    <>
      <Hero />
      <Notices limit={2} />
      <Prayers wallLimit={3} />
      <section className={`container ${styles.menu}`}>
        <p className="eyebrow">Menu</p>
        <h2 className={styles.menuTitle}>둘러보기</h2>
        <CategoryGrid />
      </section>
    </>
  )
}
```

`src/pages/Home.module.css`:

```css
.menu { padding: 12px 0 40px; }
.menuTitle { font-family: var(--font-display); font-weight: 800; font-size: 22px; margin: 2px 0 12px; }
```

- [ ] **Step 2: 5개 서브페이지 작성**

`src/pages/MinistryPage.jsx`:

```jsx
import PageHeader from '../components/PageHeader.jsx'
import PhotoBand from '../components/PhotoBand.jsx'
import Ministry from '../sections/Ministry.jsx'
import Bazaar from '../sections/Bazaar.jsx'

export default function MinistryPage() {
  return (
    <>
      <PageHeader title="사역·나눔" />
      <PhotoBand
        img="img/market.jpg"
        alt="오병이어 나눔 장터 — 천막과 좌판"
        tag="작년 오병이어"
        caption="천막을 펴고, 마을을 초대합니다"
      />
      <Ministry />
      <Bazaar />
    </>
  )
}
```

`src/pages/PeoplePage.jsx`:

```jsx
import PageHeader from '../components/PageHeader.jsx'
import Cells from '../sections/Cells.jsx'
import Teams from '../sections/Teams.jsx'

export default function PeoplePage() {
  return (
    <>
      <PageHeader title="참가자·팀" />
      <Cells />
      <Teams />
    </>
  )
}
```

`src/pages/SchedulePage.jsx`:

```jsx
import PageHeader from '../components/PageHeader.jsx'
import Schedule from '../sections/Schedule.jsx'
import Venue from '../sections/Venue.jsx'

export default function SchedulePage() {
  return (
    <>
      <PageHeader title="일정·장소" />
      <Schedule />
      <Venue />
    </>
  )
}
```

`src/pages/FinancePage.jsx`:

```jsx
import PageHeader from '../components/PageHeader.jsx'
import Sponsorship from '../sections/Sponsorship.jsx'
import Budget from '../sections/Budget.jsx'

export default function FinancePage() {
  return (
    <>
      <PageHeader title="재정" />
      <Sponsorship />
      <Budget />
    </>
  )
}
```

`src/pages/TodoPage.jsx`:

```jsx
import PageHeader from '../components/PageHeader.jsx'
import Todos from '../sections/Todos.jsx'

export default function TodoPage() {
  return (
    <>
      <PageHeader title="준비 To-Do" />
      <Todos />
    </>
  )
}
```

- [ ] **Step 3: 빌드 검증**

Run: `npm run build`
Expected: exit 0. (페이지들은 아직 라우팅 안 됨 — 다음 태스크에서 셸 연결.)

- [ ] **Step 4: 커밋**

```bash
git add src/pages
git commit -m "feat: 홈 + 5개 카테고리 페이지 컴포넌트"
```

---

### Task 6: App 셸 컷오버(라우터 연결)

이 태스크에서 사이트가 허브-스포크로 전환된다 — 브라우저 검증 필수.

**Files:**
- Modify: `src/App.jsx` (전면 교체)
- Modify: `src/styles/global.css` (라우트 전환 애니메이션 추가)

**Interfaces:**
- Consumes: `useRoute`/`ROUTES`/`saveScroll`/`getScroll`(T1), 페이지들(T5).

- [ ] **Step 1: App.jsx 교체**

`src/App.jsx` 전체를 아래로 교체:

```jsx
import { useEffect, useRef } from 'react'
import { EditModeProvider } from './context/EditModeContext.jsx'
import EditMode from './components/EditMode.jsx'
import Footer from './components/Footer.jsx'
import { useRoute, ROUTES, saveScroll, getScroll } from './lib/router.jsx'

import Home from './pages/Home.jsx'
import MinistryPage from './pages/MinistryPage.jsx'
import PeoplePage from './pages/PeoplePage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import FinancePage from './pages/FinancePage.jsx'
import TodoPage from './pages/TodoPage.jsx'

const PAGES = {
  '': Home,
  ministry: MinistryPage,
  people: PeoplePage,
  schedule: SchedulePage,
  finance: FinancePage,
  todo: TodoPage,
}

export default function App() {
  const route = useRoute()
  const prev = useRef(route)

  useEffect(() => {
    saveScroll(prev.current)                          // 떠나는 페이지 스크롤 저장
    const y = route === '' ? (getScroll('') ?? 0) : 0 // 서브=상단, 홈=복원
    window.scrollTo(0, y)
    document.title = route === ''
      ? '21MG 국내선교'
      : `${ROUTES[route].title} · 21MG 국내선교`
    prev.current = route
  }, [route])

  const Page = PAGES[route] || Home

  return (
    <EditModeProvider>
      <div className="routeView" key={route}>
        <Page />
      </div>
      <Footer />
      <EditMode />
    </EditModeProvider>
  )
}
```

- [ ] **Step 2: 라우트 전환 애니메이션**

`src/styles/global.css` — 기존 `@media (prefers-reduced-motion: no-preference) { ... }` 블록 안(예: `.is-in .stagger` 규칙들 뒤)에 추가:

```css
  .routeView { animation: routeIn .32s var(--ease) both; }
  @keyframes routeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
```

(reduced-motion 사용자는 이 블록이 적용 안 되므로 즉시 전환 — 안전.)

- [ ] **Step 3: 빌드 검증**

Run: `npm run build`
Expected: exit 0, 콘솔 에러 0. `AnchorNav` 미임포트 경고 없음(App에서 제거됨).

- [ ] **Step 4: 브라우저 검증(dev, 실브라우저/프리뷰)**

Run: `npm run dev` → http://localhost:5173

확인:
1. 홈에 Hero → 공지(고정+최신2, 더보기) → 기도(기도제목 + 한 줄 기도 최신3 + 더보기) → 5색 메뉴 그리드가 보인다.
2. 각 메뉴 카드 탭 → 해당 페이지로 이동, 상단 `← 홈` 헤더 표시, 페이지 상단부터 보임.
3. `← 홈` → 홈으로 복귀, **직전 스크롤 위치 복원**(눌렀던 카드 자리).
4. 브라우저 뒤로/앞으로 버튼이 라우트와 동기화.
5. 주소창에 `#/schedule` 직접 입력/새로고침 → 일정 페이지가 바로 로드.
6. 우하단 편집 FAB이 모든 페이지에 표시되고 동작(PIN 1212/2121 → 이름 선택).
7. 콘솔 에러 0.

- [ ] **Step 5: 커밋**

```bash
git add src/App.jsx src/styles/global.css
git commit -m "feat: App을 해시 라우터 셸로 전환(홈+5페이지, 스크롤복원·전환)"
```

---

### Task 7: 잔재 정리

**Files:**
- Delete: `src/components/AnchorNav.jsx`, `src/components/AnchorNav.module.css`
- Delete: `src/sections/EmptyDynamic.jsx`, `src/sections/EmptyDynamic.module.css`

- [ ] **Step 1: 미사용 import 없음 확인**

Run: `grep -rn "AnchorNav\|EmptyDynamic" src`
Expected: 매치 0건(App 컷오버 후 어디서도 임포트 안 함). 만약 남아 있으면 먼저 제거.

- [ ] **Step 2: 파일 삭제**

```bash
git rm src/components/AnchorNav.jsx src/components/AnchorNav.module.css \
       src/sections/EmptyDynamic.jsx src/sections/EmptyDynamic.module.css
```

- [ ] **Step 3: 빌드 + 최종 회귀**

Run: `npm run build`
Expected: exit 0, 콘솔 에러 0.

(실브라우저) 모바일 폭(375)·데스크톱 폭에서: 홈 그리드(모바일 2열/데스크톱 3열), 5개 페이지 진입·뒤로, 편집 FAB, 공지/기도 더보기, 리빌·전환 정상.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "chore: AnchorNav·EmptyDynamic 제거(허브 전환으로 미사용)"
```

---

## Self-Review

**Spec coverage** (스펙 §별 대응 태스크)
- §4 라우트/IA → T1(라우터)·T5(페이지)·T6(셸). ✅
- §5 라우터 API/스크롤복원/폴백 → T1·T6. ✅
- §6 앱 셸 → T6. PhotoBand→사역 페이지 이동 → T5. AnchorNav 제거 → T6(미사용)·T7(삭제). ✅
- §7 페이지 6종 → T5. ✅
- §8 홈(컴팩트 공지/기도/그리드) → T3·T4·T5. ✅
- §9 PageHeader(safe-area) → T2. ✅
- §10 모션/전환 → T6 `.routeView`. ✅
- §11 편집모드 전역 → T6(셸에 `<EditMode/>`). ✅
- §12 인벤토리 신규/수정/제거 → T1~T7 전부. ✅
- §13 접근성(진짜 `<a href>`, AA 페어) → T1 Link·T3 색토큰. ✅
- §15 검증 → 각 T의 build+브라우저. ✅

**Placeholder scan:** TBD/TODO/"적절히 처리" 없음 — 모든 신규 파일 전체 코드, 수정은 시그니처·분기·렌더 위치를 구체적으로 명시. ✅

**Type consistency:** `useRoute()→string`, `ROUTES[key].title`, `saveScroll/getScroll(key)`, `Link to=`, `<Notices limit>`·`<PrayerWall limit>`·`<Prayers wallLimit>`·`PAGES` key가 `ROUTES` key(`''`,ministry,people,schedule,finance,todo)와 전 태스크에서 일치. CategoryGrid `to` 값(ministry/people/schedule/finance/todo)이 `PAGES`/`ROUTES`와 일치. ✅

## 주의(실행자)
- 모든 태스크는 `feat/mobile-hub-nav` 브랜치에서. **push 하지 말 것**(완성·사용자 확인 후 별도로 main 병합·배포; push 시 `gh auth switch --user bbangfilm`).
- 헤드리스 프리뷰는 IO/CSS 전환 미발화 → 리빌·라우트 전환·카운트업은 실브라우저에서만 보임(코드 정상이어도 헤드리스 스크린샷은 멈춰 보일 수 있음).
