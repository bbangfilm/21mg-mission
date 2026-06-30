# 모바일 허브-스포크 내비게이션 개편 — 설계 (Design Spec)

- **날짜**: 2026-07-01
- **브랜치**: `feat/mobile-hub-nav`
- **상태**: 설계 확정(브레인스토밍 승인) → 구현 계획 작성 대기
- **대상**: 21MG 국내선교 대시보드 (Vite + React + Firestore + GitHub Pages)

## 1. 배경 / 문제

현재 대시보드는 **롱스크롤 단일 페이지**(Hero + AnchorNav + 11개 섹션)다. 모바일에서 "스크롤이 너무 길다"는 피드백이 다수 나왔다. 원하는 형태는 **홈(허브) + 버튼 대분류 → 해당 페이지로 이동하는 홈페이지(앱) 방식**이다.

## 2. 목표 / 비목표

**목표**
- 롱스크롤 → **허브-스포크**(홈 + 5개 카테고리 페이지)로 정보구조 전환.
- 홈 = Hero + 공지(컴팩트) + 한 줄 기도(기도제목 짧게 + 방명록) + 5색 메뉴 그리드.
- 모바일·데스크톱 **단일 내비게이션으로 통일**(코드 한 경로).
- 각 페이지는 짧게 — 한 화면에 들어오는 분량.

**비목표 (이번 작업에서 안 건드림)**
- 정적 데이터 콘텐츠 변경(명단 45명, 회비, 후원계좌, 일정 등).
- `firestore.rules` 변경 → **콘솔 재게시 불필요**.
- 디자인 토큰/색 팔레트 변경(기존 컨페티 4색 그대로 활용).
- 줌 고정, PWA, 세이프에어리어 정책 변경(계승만).

## 3. 확정된 결정 (브레인스토밍)

1. **적용 범위**: 모바일·데스크톱 모두 통일(허브-스포크).
2. **메뉴 묶음**: 5개 대분류.
3. **내비게이션**: 서브페이지 상단 헤더 `← 홈` + 페이지 제목(다른 메뉴는 홈 경유).
4. **홈 디자인**: 시안 ① **컬러블록 그리드**(밝은 페이퍼 배경 + 4색 솔리드 카드 + 준비=잉크 바).
5. **홈의 기도**: 기도제목(짧게) + 한 줄 기도 방명록 함께.
6. **라우터**: 의존성 0의 **경량 커스텀 해시 라우터**.

## 4. 정보구조 / 라우트

해시 라우팅(`#/...`). GitHub Pages 하위경로(`/21mg-mission/`)에서 서버 rewrite 없이 동작하고, 브라우저 뒤로/앞으로·딥링크 공유가 그대로 된다.

| 라우트 | 페이지 | 제목(헤더) | 담는 섹션(기존 컴포넌트) | 소유색 |
|---|---|---|---|---|
| `#/` (또는 빈 해시) | 홈 | — | Hero + 공지(컴팩트) + 기도(컴팩트) + CategoryGrid | — |
| `#/ministry` | 사역·나눔 | 사역·나눔 | `Ministry` + `Bazaar` | coral |
| `#/people` | 참가자·팀 | 참가자·팀 | `Cells` + `Teams` | violet |
| `#/schedule` | 일정·장소 | 일정·장소 | `Schedule` + `Venue` | sunny |
| `#/finance` | 재정 | 재정 | `Sponsorship` + `Budget` | mint |
| `#/todo` | 준비 To-Do | 준비 To-Do | `Todos` | ink |

- 알 수 없는 해시 → 홈으로 폴백.
- 라우트 key는 ascii 슬러그(공유·인코딩 안전). 한글 라벨은 화면 표시용.

## 5. 라우터 설계 — `src/lib/router.jsx` (신규)

경량 커스텀 해시 라우터. react-router 미사용(라우트 6개, "정적-우선·의존성 최소" 기조).

**공개 API**
- `useRoute()` → 현재 라우트 key 문자열(예 `''`=홈, `'ministry'`). 내부에서 `window.location.hash` 파싱 + `hashchange` 구독.
- `navigate(key)` → `window.location.hash`를 `#/<key>`(홈은 `#/`)로 설정. `hashchange`가 렌더 트리거.
- `<Link to="ministry" className>` → `<a href="#/ministry">` 렌더(미들클릭·딥링크·공유 지원). 기본 동작(해시 변경)에 맡기되, 필요 시 onClick에서 스크롤 처리.

**해시 파싱 규칙**
- `#/ministry` → `'ministry'`, `#/` 또는 `''` 또는 `#hero` 같은 잔재 → `''`(홈).
- ROUTES 레지스트리에 없는 key → `''`(홈 폴백).

**스크롤 복원**
- 모듈 레벨 `Map<routeKey, scrollY>`.
- 라우트가 바뀌면(이전→다음): 이전 라우트의 `window.scrollY` 저장.
- **서브페이지 진입** → 항상 `scrollTo(0,0)`.
- **홈 복귀** → 저장된 홈 scrollY 복원(눌렀던 버튼 자리로).
- 구현은 셸(`App`)의 라우트 변경 effect에서 일괄 처리.

**경계/계승**
- 기존 앵커 딥링크(`#hero`, `#notices` 등) 및 `AnchorNav`는 제거.
- `index.html`의 줌 고정(`maximum-scale` 등)·`viewport-fit=cover` 유지.

## 6. 앱 셸 재구성 — `src/App.jsx` (수정)

```
<EditModeProvider>
  <RouteView>                ← useRoute()로 분기
    route===''      → <Home/>
    route==='ministry' → <MinistryPage/>
    ... (5개)
  </RouteView>
  <Footer/>                  ← 모든 페이지 공통(하단)
  <EditMode/>                ← 전역 FAB(모든 페이지에서 편집 진입)
</EditModeProvider>
```

- 현재 `App.jsx`가 직접 임포트하던 11개 섹션은 **각 페이지 컴포넌트로 이동**.
- `AnchorNav` 제거. `PhotoBand`(market.jpg)는 사역 페이지 상단으로 이동(에디토리얼 사진 유지).
- 라우트 전환 시 전환 애니메이션 래퍼(§10).

## 7. 페이지 컴포넌트 — `src/pages/*` (신규)

각 서브페이지: `<PageHeader title=.../>` + 해당 섹션들을 세로로 스택. 섹션 컴포넌트(`Ministry`, `Bazaar` 등)는 **거의 그대로 재사용**(내부 `<Section>` 배경 톤·앵커 id 유지하되 id는 더 이상 내비 대상 아님).

- `pages/Home.jsx` — §8.
- `pages/MinistryPage.jsx` — PhotoBand(market) + Ministry + Bazaar.
- `pages/PeoplePage.jsx` — Cells + Teams.
- `pages/SchedulePage.jsx` — Schedule + Venue.
- `pages/FinancePage.jsx` — Sponsorship + Budget.
- `pages/TodoPage.jsx` — Todos.

## 8. 홈 — `pages/Home.jsx` + `components/CategoryGrid.jsx` (신규)

순서: **Hero → 공지(컴팩트) → 기도(컴팩트) → 메뉴 그리드**.

**8.1 공지(컴팩트)** — `Notices`에 `compact` 변형 추가(prop 또는 별도 home 래퍼).
- 고정(pinned) 공지 + 최신 비고정 2건까지 표시.
- 더 있으면 "더보기" 인라인 토글로 전체 펼침(별도 라우트 없음).
- 관리자 편집(등록·고정·삭제)은 홈에서 인라인 유지.

**8.2 기도(컴팩트)** — `Prayers`의 홈 변형.
- verse(말씀) 1개 + 기도제목 리스트(정적, 짧음) + `PrayerWall`.
- `PrayerWall`에 `limit`(예 3) prop 추가: 작성칸 + 최신 3개 + "기도 더보기" 인라인 펼침.
- 작성/함께기도/삭제 로직은 기존 그대로(로그인 없이 작성, 8초 쿨다운, amen, 모더레이션 삭제).

**8.3 CategoryGrid** — 5색 메뉴.
- 카드 데이터: `{ key, label, sub, color, on, icon }` (아래).
- 모바일 2열 그리드, 마지막 `todo`는 전체폭 잉크 바. 데스크톱 3열(또는 5-up 한 줄), 컨테이너 1120px.
- 각 카드 = `<Link>`(터치 타깃 ≥ 56px), 아이콘 + 라벨(Paperlogy 800) + 한 줄 설명 + 우측 chevron(잉크 바).
- 아이콘: 경량 인라인 SVG 라인 아이콘(의존성 추가 없음). 이모지 미사용.

| key | 라벨 | 설명 | color | 텍스트 |
|---|---|---|---|---|
| ministry | 사역·나눔 | 먹거리 · 오병이어 장터 | `--coral` | on-color(흰) |
| people | 참가자·팀 | 45명 · 팀 체크리스트 | `--violet` | 흰 |
| schedule | 일정·장소 | 타임테이블 · 숙소 | `--sunny` | `--on-sunny` |
| finance | 재정 | 회비 · 후원 계좌 | `--mint` | 진한 teal |
| todo | 준비 To-Do | 이번주 함께 챙길 일 | `--ink` | `--on-ink` |

## 9. 서브페이지 헤더 — `components/PageHeader.jsx` (신규)

- 고정 상단 바: 좌측 `← 홈`(`<Link to="">`), 가운데/좌측 페이지 제목(Paperlogy).
- `padding-top: env(safe-area-inset-top)` — 노치/다이내믹아일랜드 회피(기존 `AnchorNav`가 하던 것 계승).
- 본문은 헤더 높이만큼 상단 패딩(앵커 `scroll-margin` 대신).
- `.pressable`(scale .96) 등 기존 모션 토큰 사용.

## 10. 모션 / 전환

- 라우트 전환: 새 페이지 컨테이너에 가벼운 페이드/슬라이드-업(`--ease`, 짧게). `prefers-reduced-motion`이면 즉시 전환.
- 기존 `useReveal`(스크롤 리빌 toggle)·`useInView`(카운트업)·`burst`(탭 파티클)는 페이지 내에서 그대로 동작.
- ⚠️ 헤드리스 프리뷰는 IntersectionObserver/CSS 전환을 발화 안 함 → 리빌·전환·카운트업은 **실브라우저에서만** 검증.

## 11. 편집 모드

- `EditMode` FAB은 셸에 두어 **모든 페이지에서 전역 유지**. PIN·이름 게이트 변경 없음.
- 동적 편집은 라우트와 무관하게 Firestore로 동작: 공지=홈, 바자회·팀·할일=각 페이지.

## 12. 컴포넌트 인벤토리

**신규**
- `src/lib/router.jsx`
- `src/components/PageHeader.jsx` (+ `.module.css`)
- `src/components/CategoryGrid.jsx` (+ `.module.css`)
- `src/pages/Home.jsx`, `MinistryPage.jsx`, `PeoplePage.jsx`, `SchedulePage.jsx`, `FinancePage.jsx`, `TodoPage.jsx`

**수정**
- `src/App.jsx` — 셸 + 라우트 분기.
- `src/sections/Notices.jsx` — `compact` 변형(고정+2건+더보기).
- `src/components/PrayerWall.jsx` — `limit` prop(+더보기).
- `src/sections/Prayers.jsx` — 홈 컴팩트 구성에 맞게(또는 홈 전용 래퍼).
- `src/styles/global.css` — 앵커 `[id] scroll-margin-top` 정리(헤더 오프셋으로 대체), 라우트 전환 클래스 추가.

**제거**
- `src/components/AnchorNav.jsx` + `AnchorNav.module.css`.
- `src/sections/EmptyDynamic.jsx` + css(이미 미사용).

**유지(불변)**
- `src/data/*` 전부, `lib/firebase.js`·`useFirestore.js`·`mutations.js`, `context/EditModeContext.jsx`·`components/EditMode.jsx`, `CheckRow`, `useReveal`·`useInView`·`burst`, 토큰·PWA·`index.html` 줌고정, `firestore.rules`.

## 13. 접근성

- 메뉴 카드/`← 홈`은 진짜 `<a href>` — 키보드 포커스·미들클릭·스크린리더 링크 인식.
- 색 위 텍스트는 토큰의 AA 페어 사용(`--on-sunny`, `--on-ink`, 진한 teal 등). coral/violet 위는 흰색(대비 확인).
- 라우트 전환 시 새 페이지 제목으로 포커스 이동(또는 `document.title` 갱신) 검토.
- 줌 고정은 WCAG 1.4.4 위배지만 **사용자 명시 요청**으로 유지(기존 결정 계승).

## 14. 리스크 / 주의

- 해시 라우팅은 GH Pages에 적합(SPA fallback 불필요). 절대경로 자산 금지 기조 유지.
- `PhotoBand`/섹션 이동 시 사진 경로는 `asset()`(상대경로) 유지.
- 배포는 main push 시 자동(Actions). **작업은 브랜치에서, 완성·검증 후에만 main 병합/푸시**(push 계정 `bbangfilm` 필요).

## 15. 검증 계획

- `npm run build` exit 0, 콘솔 에러 0.
- 로컬 dev(실브라우저)에서: 홈→각 5페이지 진입/뒤로, 딥링크(`#/schedule` 직접 로드), 홈 스크롤 복원, 편집 FAB 전 페이지 동작, 공지/기도 더보기, 리빌·전환.
- 모바일 폭(375)과 데스크톱 폭에서 레이아웃 확인.
- (배포 후) 라이브에서 해시 라우트·딥링크·PWA standalone 진입 확인.

## 16. 미해결 / 확인 사항

- 없음(설계 확정). 구현 중 세부(아이콘 모양, 전환 길이, 데스크톱 그리드 열 수)는 계획 단계에서 구체화.
