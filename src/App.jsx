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
