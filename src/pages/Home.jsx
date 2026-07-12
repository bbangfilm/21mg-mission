import Hero from '../components/Hero.jsx'
import Notices from '../sections/Notices.jsx'
import Prayers from '../sections/Prayers.jsx'
import CategoryGrid from '../components/CategoryGrid.jsx'
import styles from './Home.module.css'

// 실사용 시작(2026-07) — 메뉴(둘러보기)를 히어로 바로 아래 최상단으로.
// 큰 그리드가 곧 내비라 기존 빠른메뉴 칩(QuickNav)은 중복이라 제거.
export default function Home() {
  return (
    <>
      <Hero />
      <section className={`container ${styles.menu}`}>
        <p className="eyebrow">Menu</p>
        <h2 className={styles.menuTitle}>둘러보기</h2>
        <CategoryGrid />
      </section>
      <Notices limit={2} />
      <Prayers wallLimit={3} />
    </>
  )
}
