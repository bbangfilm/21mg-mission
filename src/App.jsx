import { useEffect } from 'react'
import { EditModeProvider } from './context/EditModeContext.jsx'
import EditMode from './components/EditMode.jsx'
import Footer from './components/Footer.jsx'
import { useRoute, ROUTES, getScroll } from './lib/router.jsx'

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

// 구형 엔진(iOS Safari ≤15.3 등)은 behavior:'instant' enum을 몰라 TypeError를 던진다
// — 마운트 effect에서 터지면 앱 전체가 백지화되므로 반드시 폴백.
function scrollToInstant(y) {
  try { window.scrollTo({ top: y, behavior: 'instant' }) } catch { window.scrollTo(0, y) }
}

export default function App() {
  const route = useRoute()

  // 떠나는 페이지 스크롤 저장은 router.jsx의 hashchange 리스너가 리렌더 전에 처리.
  useEffect(() => {
    const y = route === '' ? (getScroll('') ?? 0) : 0 // 서브=상단, 홈=복원
    // instant — html의 scroll-behavior:smooth가 라우트 전환까지 애니메이션하면
    // 새 페이지가 '스크롤 중' 상태로 열리고 아래 복원 보정도 오작동한다.
    scrollToInstant(y)
    document.title = route === ''
      ? '21MG 국내선교 · 마을 나눔 잔치'
      : `${ROUTES[route].title} · 21MG 국내선교`
    if (route !== '' || y === 0) return

    // 홈 복원 보정 — 공지·기도벽(Firestore)이 로딩되기 전엔 문서가 짧아 scrollTo가
    // 클램프된다. 높이가 목표 y를 수용하면 재적용하고, 사용자가 직접 스크롤하면 중단.
    let applied = window.scrollY
    let tries = 0
    const id = setInterval(() => {
      if (Math.abs(window.scrollY - applied) > 2) return clearInterval(id) // 사용자 개입
      const maxY = document.documentElement.scrollHeight - window.innerHeight
      if (maxY >= y) { scrollToInstant(y); clearInterval(id) }
      else if (++tries >= 20) clearInterval(id)                            // 최대 ~2초
      applied = window.scrollY
    }, 100)
    return () => clearInterval(id)
  }, [route])

  const Page = PAGES[route] || Home

  return (
    <EditModeProvider>
      {/* key={route}는 의도적 — 라우트마다 페이지를 리마운트해 .routeView 진입
          애니메이션을 재생한다. 부수효과로 Firestore 구독 재시작 + 미제출 입력 초기화
          (작은 컬렉션·짧은 방문이라 수용). 이 key를 제거하면 전환 애니메이션이 깨진다. */}
      <div className="routeView" key={route}>
        <Page />
      </div>
      <Footer />
      <EditMode />
    </EditModeProvider>
  )
}
