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
