import { EditModeProvider } from './context/EditModeContext.jsx'
import EditMode from './components/EditMode.jsx'
import Hero from './components/Hero.jsx'
import AnchorNav from './components/AnchorNav.jsx'
import PhotoBand from './components/PhotoBand.jsx'
import Footer from './components/Footer.jsx'

import Notices from './sections/Notices.jsx'
import Ministry from './sections/Ministry.jsx'
import Schedule from './sections/Schedule.jsx'
import Cells from './sections/Cells.jsx'
import Teams from './sections/Teams.jsx'
import Bazaar from './sections/Bazaar.jsx'
import Todos from './sections/Todos.jsx'
import Sponsorship from './sections/Sponsorship.jsx'
import Budget from './sections/Budget.jsx'
import Venue from './sections/Venue.jsx'
import Prayers from './sections/Prayers.jsx'

export default function App() {
  return (
    <EditModeProvider>
      <Hero />
      <AnchorNav />
      <main>
        <Notices />      {/* 01 🔓 관리자 */}
        <Ministry />     {/* 02 */}
        <PhotoBand
          img="img/market.jpg"
          alt="오병이어 나눔 장터 — 천막과 좌판"
          tag="작년 오병이어"
          caption="천막을 펴고, 마을을 초대합니다"
        />
        <Schedule />     {/* 03 */}
        <Cells />        {/* 04 */}
        <Teams />        {/* 05 🔓 팀장 */}
        <Bazaar />       {/* 06 🔓 팀장 */}
        <Todos />        {/* 07 🔓 팀장 */}
        <Sponsorship />  {/* 08 🔓 관리자 */}
        <Budget />       {/* 09 */}
        <Venue />        {/* 10 */}
        <Prayers />      {/* 11 */}
      </main>
      <Footer />
      <EditMode />
    </EditModeProvider>
  )
}
