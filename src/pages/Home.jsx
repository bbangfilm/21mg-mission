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
